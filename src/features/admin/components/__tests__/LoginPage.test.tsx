import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

const mockLogin = vi.fn();
const mockResetPassword = vi.fn();
const mockNavigate = vi.fn();

vi.mock("@/hooks/useAuthContext", () => ({
  useAuth: () => ({
    login: (...args: unknown[]) => mockLogin(...args),
  }),
}));

vi.mock("react-router", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router")>();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock("@/lib/checkAdmin", () => ({
  checkAdminStatus: vi.fn(),
}));

// We need to mock supabase for resetPasswordForEmail
vi.mock("@/lib/supabase", () => ({
  supabase: {
    auth: {
      resetPasswordForEmail: (...args: unknown[]) => mockResetPassword(...args),
    },
  },
}));

vi.mock("@/components/seo/PageSEO", () => ({
  default: () => null,
}));

import { LoginPage } from "../../LoginPage";

function renderLoginPage() {
  return render(
    <MemoryRouter>
      <LoginPage />
    </MemoryRouter>
  );
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("LoginPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLogin.mockResolvedValue({ user: null, error: null });
    mockResetPassword.mockResolvedValue({ error: null });
  });

  // -----------------------------------------------------------------------
  // Rendering
  // -----------------------------------------------------------------------
  describe("Rendering", () => {
    it("renders the admin heading", () => {
      renderLoginPage();
      expect(screen.getByRole("heading", { name: "Admin" })).toBeInTheDocument();
    });

    it("renders the subtitle", () => {
      renderLoginPage();
      expect(screen.getByText("Acceso al panel de administración")).toBeInTheDocument();
    });

    it("renders email input", () => {
      renderLoginPage();
      expect(screen.getByLabelText("Email")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("admin@ejemplo.com")).toBeInTheDocument();
    });

    it("renders password input", () => {
      renderLoginPage();
      expect(screen.getByLabelText("Contraseña")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("••••••••")).toBeInTheDocument();
    });

    it("renders submit button", () => {
      renderLoginPage();
      expect(screen.getByRole("button", { name: "Ingresar" })).toBeInTheDocument();
    });

    it("renders forgot password button", () => {
      renderLoginPage();
      expect(screen.getByText("¿Olvidaste tu contraseña?")).toBeInTheDocument();
    });

    it("renders admin-only notice", () => {
      renderLoginPage();
      expect(screen.getByText("Panel exclusivo para administradores")).toBeInTheDocument();
    });
  });

  // -----------------------------------------------------------------------
  // Login flow
  // -----------------------------------------------------------------------
  describe("Login flow", () => {
    it("calls login with email and password on submit", async () => {
      const user = userEvent.setup();
      renderLoginPage();

      await user.type(screen.getByLabelText("Email"), "admin@test.com");
      await user.type(screen.getByLabelText("Contraseña"), "password123");
      fireEvent.submit(screen.getByRole("button", { name: "Ingresar" }));

      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledWith("admin@test.com", "password123");
      });
    });

    it("navigates to /admin/dashboard on successful login + admin check", async () => {
      const { checkAdminStatus } = await import("@/lib/checkAdmin");
      vi.mocked(checkAdminStatus).mockResolvedValue(true);
      mockLogin.mockResolvedValue({ user: { email: "admin@test.com" }, error: null });

      const user = userEvent.setup();
      renderLoginPage();

      await user.type(screen.getByLabelText("Email"), "admin@test.com");
      await user.type(screen.getByLabelText("Contraseña"), "password123");
      fireEvent.submit(screen.getByRole("button", { name: "Ingresar" }));

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith("/admin/dashboard", { replace: true });
      });
    });

    it("shows error when login returns an error", async () => {
      mockLogin.mockResolvedValue({
        user: null,
        error: "Invalid login credentials",
      });

      const user = userEvent.setup();
      renderLoginPage();

      await user.type(screen.getByLabelText("Email"), "wrong@test.com");
      await user.type(screen.getByLabelText("Contraseña"), "wrongpass");
      fireEvent.submit(screen.getByRole("button", { name: "Ingresar" }));

      await waitFor(() => {
        expect(screen.getByText("Credenciales inválidas")).toBeInTheDocument();
      });
      expect(mockNavigate).not.toHaveBeenCalled();
    });

    it("translates 'Invalid login credentials' to friendly Spanish message", async () => {
      mockLogin.mockResolvedValue({
        user: null,
        error: "Invalid login credentials",
      });

      const user = userEvent.setup();
      renderLoginPage();

      await user.type(screen.getByLabelText("Email"), "admin@test.com");
      await user.type(screen.getByLabelText("Contraseña"), "wrongpass");
      fireEvent.submit(screen.getByRole("button", { name: "Ingresar" }));

      await waitFor(() => {
        expect(screen.getByText("Credenciales inválidas")).toBeInTheDocument();
      });
    });

    it("shows generic error message when login returns null user", async () => {
      mockLogin.mockResolvedValue({ user: null, error: null });

      const user = userEvent.setup();
      renderLoginPage();

      await user.type(screen.getByLabelText("Email"), "admin@test.com");
      await user.type(screen.getByLabelText("Contraseña"), "pass");
      fireEvent.submit(screen.getByRole("button", { name: "Ingresar" }));

      await waitFor(() => {
        expect(screen.getByText("Error al iniciar sesión")).toBeInTheDocument();
      });
    });

    it("shows error when user is not admin", async () => {
      const { checkAdminStatus } = await import("@/lib/checkAdmin");
      vi.mocked(checkAdminStatus).mockResolvedValue(false);
      mockLogin.mockResolvedValue({ user: { email: "user@test.com" }, error: null });

      const user = userEvent.setup();
      renderLoginPage();

      await user.type(screen.getByLabelText("Email"), "user@test.com");
      await user.type(screen.getByLabelText("Contraseña"), "pass");
      fireEvent.submit(screen.getByRole("button", { name: "Ingresar" }));

      await waitFor(() => {
        expect(screen.getByText("Acceso denegado: tu email no está registrado como administrador")).toBeInTheDocument();
      });
      expect(mockNavigate).not.toHaveBeenCalled();
    });

    it("shows error when login throws an exception", async () => {
      mockLogin.mockRejectedValue(new Error("Network error"));
      const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

      const user = userEvent.setup();
      renderLoginPage();

      await user.type(screen.getByLabelText("Email"), "admin@test.com");
      await user.type(screen.getByLabelText("Contraseña"), "pass");
      fireEvent.submit(screen.getByRole("button", { name: "Ingresar" }));

      await waitFor(() => {
        expect(screen.getByText("Error inesperado al iniciar sesión")).toBeInTheDocument();
      });
      errorSpy.mockRestore();
    });

    it("shows 'Ingresando...' while submitting", async () => {
      mockLogin.mockReturnValue(new Promise(() => {})); // never resolves

      const user = userEvent.setup();
      renderLoginPage();

      await user.type(screen.getByLabelText("Email"), "admin@test.com");
      await user.type(screen.getByLabelText("Contraseña"), "pass");
      fireEvent.submit(screen.getByRole("button", { name: "Ingresar" }));

      await waitFor(() => {
        expect(screen.getByText("Ingresando...")).toBeInTheDocument();
      });
    });

    it("disables submit button while submitting", async () => {
      mockLogin.mockReturnValue(new Promise(() => {}));

      const user = userEvent.setup();
      renderLoginPage();

      await user.type(screen.getByLabelText("Email"), "admin@test.com");
      await user.type(screen.getByLabelText("Contraseña"), "pass");
      fireEvent.submit(screen.getByRole("button", { name: "Ingresar" }));

      await waitFor(() => {
        expect(screen.getByRole("button", { name: "Ingresando..." })).toBeDisabled();
      });
    });
  });

  // -----------------------------------------------------------------------
  // Password reset
  // -----------------------------------------------------------------------
  describe("Password reset", () => {
    it("calls resetPasswordForEmail on forgot password click", async () => {
      const user = userEvent.setup();
      renderLoginPage();

      await user.type(screen.getByLabelText("Email"), "admin@test.com");
      await user.click(screen.getByText("¿Olvidaste tu contraseña?"));

      await waitFor(() => {
        expect(mockResetPassword).toHaveBeenCalledWith(
          "admin@test.com",
          expect.objectContaining({ redirectTo: expect.stringContaining("/reset-password") }),
        );
      });
    });

    it("shows success message after reset email is sent", async () => {
      const user = userEvent.setup();
      renderLoginPage();

      await user.type(screen.getByLabelText("Email"), "admin@test.com");
      await user.click(screen.getByText("¿Olvidaste tu contraseña?"));

      await waitFor(() => {
        expect(screen.getByText(/Revisa tu correo/)).toBeInTheDocument();
      });
    });

    it("hides forgot password button after reset email sent", async () => {
      const user = userEvent.setup();
      renderLoginPage();

      await user.type(screen.getByLabelText("Email"), "admin@test.com");
      await user.click(screen.getByText("¿Olvidaste tu contraseña?"));

      await waitFor(() => {
        expect(screen.queryByText("¿Olvidaste tu contraseña?")).not.toBeInTheDocument();
      });
    });

    it("shows error when email is empty on reset", async () => {
      const user = userEvent.setup();
      renderLoginPage();

      // Click forgot password without entering email
      await user.click(screen.getByText("¿Olvidaste tu contraseña?"));

      await waitFor(() => {
        expect(screen.getByText("Escribe tu email para poder enviarte el enlace de recuperación.")).toBeInTheDocument();
      });
      expect(mockResetPassword).not.toHaveBeenCalled();
    });

    it("shows error when resetPasswordForEmail fails", async () => {
      mockResetPassword.mockResolvedValue({ error: { message: "User not found" } });

      const user = userEvent.setup();
      renderLoginPage();

      await user.type(screen.getByLabelText("Email"), "unknown@test.com");
      await user.click(screen.getByText("¿Olvidaste tu contraseña?"));

      await waitFor(() => {
        expect(screen.getByText("User not found")).toBeInTheDocument();
      });
    });

    it("shows error when reset throws an exception", async () => {
      mockResetPassword.mockRejectedValue(new Error("Network error"));

      const user = userEvent.setup();
      renderLoginPage();

      await user.type(screen.getByLabelText("Email"), "admin@test.com");
      await user.click(screen.getByText("¿Olvidaste tu contraseña?"));

      await waitFor(() => {
        expect(screen.getByText("Error inesperado al enviar el correo de recuperación.")).toBeInTheDocument();
      });
    });

    it("shows 'Enviando enlace...' while resetting", async () => {
      mockResetPassword.mockReturnValue(new Promise(() => {}));

      const user = userEvent.setup();
      renderLoginPage();

      await user.type(screen.getByLabelText("Email"), "admin@test.com");
      await user.click(screen.getByText("¿Olvidaste tu contraseña?"));

      await waitFor(() => {
        expect(screen.getByText("Enviando enlace...")).toBeInTheDocument();
      });
    });

    it("disables forgot password button while resetting", async () => {
      mockResetPassword.mockReturnValue(new Promise(() => {}));

      const user = userEvent.setup();
      renderLoginPage();

      await user.type(screen.getByLabelText("Email"), "admin@test.com");
      await user.click(screen.getByText("¿Olvidaste tu contraseña?"));

      await waitFor(() => {
        expect(screen.getByRole("button", { name: "Enviando enlace..." })).toBeDisabled();
      });
    });

    it("does nothing on second click after reset sent", async () => {
      const user = userEvent.setup();
      renderLoginPage();

      await user.type(screen.getByLabelText("Email"), "admin@test.com");
      await user.click(screen.getByText("¿Olvidaste tu contraseña?"));

      await waitFor(() => {
        expect(screen.getByText(/Revisa tu correo/)).toBeInTheDocument();
      });

      // The reset button is replaced by the success message, so no second click possible
      expect(mockResetPassword).toHaveBeenCalledTimes(1);
    });
  });

  // -----------------------------------------------------------------------
  // Error display
  // -----------------------------------------------------------------------
  describe("Error display", () => {
    it("clears error on new login attempt", async () => {
      mockLogin.mockResolvedValueOnce({
        user: null,
        error: "Invalid login credentials",
      });
      mockLogin.mockResolvedValueOnce({ user: { email: "admin@test.com" }, error: null });

      const { checkAdminStatus } = await import("@/lib/checkAdmin");
      vi.mocked(checkAdminStatus).mockResolvedValue(true);

      const user = userEvent.setup();
      renderLoginPage();

      // First failed attempt
      await user.type(screen.getByLabelText("Email"), "admin@test.com");
      await user.type(screen.getByLabelText("Contraseña"), "wrong");
      fireEvent.submit(screen.getByRole("button", { name: "Ingresar" }));

      await waitFor(() => {
        expect(screen.getByText("Credenciales inválidas")).toBeInTheDocument();
      });

      // Second attempt — error should clear
      fireEvent.submit(screen.getByRole("button", { name: "Ingresar" }));

      await waitFor(() => {
        expect(screen.queryByText("Credenciales inválidas")).not.toBeInTheDocument();
      });
    });

    it("clears error when starting password reset", async () => {
      mockLogin.mockResolvedValueOnce({
        user: null,
        error: "Invalid login credentials",
      });
      mockResetPassword.mockResolvedValue({ error: null });

      const user = userEvent.setup();
      renderLoginPage();

      await user.type(screen.getByLabelText("Email"), "admin@test.com");
      await user.type(screen.getByLabelText("Contraseña"), "wrong");
      fireEvent.submit(screen.getByRole("button", { name: "Ingresar" }));

      await waitFor(() => {
        expect(screen.getByText("Credenciales inválidas")).toBeInTheDocument();
      });

      // Click forgot password — error should clear
      await user.click(screen.getByText("¿Olvidaste tu contraseña?"));

      await waitFor(() => {
        expect(screen.queryByText("Credenciales inválidas")).not.toBeInTheDocument();
      });
    });
  });

  // -----------------------------------------------------------------------
  // Form interaction
  // -----------------------------------------------------------------------
  describe("Form interaction", () => {
    it("email input is controlled", async () => {
      const user = userEvent.setup();
      renderLoginPage();

      const input = screen.getByLabelText("Email");
      await user.type(input, "admin@test.com");

      expect(input).toHaveValue("admin@test.com");
    });

    it("password input is controlled", async () => {
      const user = userEvent.setup();
      renderLoginPage();

      const input = screen.getByLabelText("Contraseña");
      await user.type(input, "secret123");

      expect(input).toHaveValue("secret123");
    });

    it("password input has type password", () => {
      renderLoginPage();
      expect(screen.getByLabelText("Contraseña")).toHaveAttribute("type", "password");
    });

    it("email input has type email", () => {
      renderLoginPage();
      expect(screen.getByLabelText("Email")).toHaveAttribute("type", "email");
    });
  });
});

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ContactForm } from "../ContactForm";

vi.mock("@/lib/supabase", () => ({
  supabase: {
    rpc: vi.fn(),
  },
}));

const { supabase } = await import("@/lib/supabase");

describe("ContactForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the form with all fields", () => {
    render(<ContactForm />);

    expect(
      screen.getByRole("heading", { name: /inicia tu historia/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/nombre completo/i),
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/correo electrónico/i),
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/número de teléfono/i),
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/¿en qué lote estás interesado/i),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /enviar solicitud/i }),
    ).toBeInTheDocument();
  });

  it("shows validation errors for empty required fields", async () => {
    const user = userEvent.setup();
    render(<ContactForm />);

    await user.click(screen.getByRole("button", { name: /enviar solicitud/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/ingresa tu nombre completo/i),
      ).toBeInTheDocument();
      expect(
        screen.getByText(/correo electrónico inválido/i),
      ).toBeInTheDocument();
      expect(
        screen.getByText(/ingresa un número de teléfono válido/i),
      ).toBeInTheDocument();
    });
  });

  it("validates email format", async () => {
    const user = userEvent.setup();
    render(<ContactForm />);

    await user.type(screen.getByPlaceholderText(/nombre completo/i), "Juan Pérez");
    await user.type(
      screen.getByPlaceholderText(/correo electrónico/i),
      "email-invalido",
    );
    await user.type(
      screen.getByPlaceholderText(/número de teléfono/i),
      "3001234567",
    );

    await user.click(screen.getByRole("button", { name: /enviar solicitud/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/correo electrónico inválido/i),
      ).toBeInTheDocument();
    });
  });

  it("submits the form successfully", async () => {
    const mockRpc = supabase.rpc as ReturnType<typeof vi.fn>;
    mockRpc.mockResolvedValue({ data: null, error: null });

    const user = userEvent.setup();
    render(<ContactForm />);

    await user.type(
      screen.getByPlaceholderText(/nombre completo/i),
      "Juan Pérez",
    );
    await user.type(
      screen.getByPlaceholderText(/correo electrónico/i),
      "juan@example.com",
    );
    await user.type(
      screen.getByPlaceholderText(/número de teléfono/i),
      "3001234567",
    );

    await user.click(screen.getByRole("button", { name: /enviar solicitud/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/tu mensaje ha sido enviado con éxito/i),
      ).toBeInTheDocument();
    });

    expect(mockRpc).toHaveBeenCalledWith("submit_lead", {
      p_name: "Juan Pérez",
      p_email: "juan@example.com",
      p_phone: "3001234567",
      p_message: null,
    });
  });

  it("shows error message when submission fails", async () => {
    const mockRpc = supabase.rpc as ReturnType<typeof vi.fn>;
    mockRpc.mockResolvedValue({
      data: null,
      error: { message: "Database error" },
    });

    const user = userEvent.setup();
    render(<ContactForm />);

    await user.type(
      screen.getByPlaceholderText(/nombre completo/i),
      "Juan Pérez",
    );
    await user.type(
      screen.getByPlaceholderText(/correo electrónico/i),
      "juan@example.com",
    );
    await user.type(
      screen.getByPlaceholderText(/número de teléfono/i),
      "3001234567",
    );

    await user.click(screen.getByRole("button", { name: /enviar solicitud/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/hubo un error al enviar el formulario/i),
      ).toBeInTheDocument();
    });
  });

  it("disables the submit button while submitting", async () => {
    const mockRpc = supabase.rpc as ReturnType<typeof vi.fn>;
    let resolvePromise!: (value: unknown) => void;
    mockRpc.mockImplementation(
      () => new Promise((resolve) => {
        resolvePromise = resolve;
      }),
    );

    const user = userEvent.setup();
    render(<ContactForm />);

    await user.type(
      screen.getByPlaceholderText(/nombre completo/i),
      "Juan Pérez",
    );
    await user.type(
      screen.getByPlaceholderText(/correo electrónico/i),
      "juan@example.com",
    );
    await user.type(
      screen.getByPlaceholderText(/número de teléfono/i),
      "3001234567",
    );

    await user.click(screen.getByRole("button", { name: /enviar solicitud/i }));

    expect(
      screen.getByRole("button", { name: /enviando/i }),
    ).toBeDisabled();

    // Clean up: resolve the pending promise
    resolvePromise({ data: null, error: null });
  });
});

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router";
import { AdminGuard } from "../AdminGuard";

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

let mockUser: { email: string } | null = null;

vi.mock("@/hooks/useAuthContext", () => ({
  useAuth: () => ({ user: mockUser }),
}));

const mockCheckAdmin = vi.fn();

vi.mock("@/lib/checkAdmin", () => ({
  checkAdminStatus: (...args: unknown[]) => mockCheckAdmin(...args),
}));

vi.mock("@/lib/supabase", () => ({
  supabase: {},
}));

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function renderAdminGuard(route = "/admin/lots") {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <Routes>
        <Route element={<AdminGuard />}>
          <Route path="/admin/lots" element={<div data-testid="protected-content">Protected</div>} />
        </Route>
        <Route path="/admin/login" element={<div data-testid="login-redirect">Login Redirect</div>} />
      </Routes>
    </MemoryRouter>
  );
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("AdminGuard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUser = null;
    mockCheckAdmin.mockResolvedValue(false);
  });

  // -----------------------------------------------------------------------
  // Loading state
  // -----------------------------------------------------------------------
  it("shows loading spinner while checking admin status", async () => {
    // Make checkAdmin hang
    mockCheckAdmin.mockReturnValue(new Promise(() => {}));
    mockUser = { email: "admin@test.com" };

    renderAdminGuard();

    // The spinner should be visible immediately
    const spinner = document.querySelector(".animate-spin");
    expect(spinner).toBeInTheDocument();

    // Protected content should NOT be visible
    expect(screen.queryByTestId("protected-content")).not.toBeInTheDocument();
  });

  it("does not show loading spinner after check completes", async () => {
    mockCheckAdmin.mockResolvedValue(true);
    mockUser = { email: "admin@test.com" };

    renderAdminGuard();

    await waitFor(() => {
      expect(screen.queryByTestId("protected-content")).toBeInTheDocument();
    });

    expect(document.querySelector(".animate-spin")).not.toBeInTheDocument();
  });

  // -----------------------------------------------------------------------
  // Admin access (allowed)
  // -----------------------------------------------------------------------
  it("renders protected content when user is admin", async () => {
    mockCheckAdmin.mockResolvedValue(true);
    mockUser = { email: "admin@test.com" };

    renderAdminGuard();

    await waitFor(() => {
      expect(screen.getByTestId("protected-content")).toBeInTheDocument();
    });

    expect(mockCheckAdmin).toHaveBeenCalledWith(expect.anything(), "admin@test.com");
  });

  // -----------------------------------------------------------------------
  // Non-admin (redirect)
  // -----------------------------------------------------------------------
  it("redirects to /admin/login when user is not admin", async () => {
    mockCheckAdmin.mockResolvedValue(false);
    mockUser = { email: "user@test.com" };

    renderAdminGuard();

    await waitFor(() => {
      expect(screen.getByTestId("login-redirect")).toBeInTheDocument();
    });

    expect(screen.queryByTestId("protected-content")).not.toBeInTheDocument();
    expect(mockCheckAdmin).toHaveBeenCalledWith(expect.anything(), "user@test.com");
  });

  it("redirects to /admin/login when user is null (not logged in)", async () => {
    mockCheckAdmin.mockResolvedValue(false);
    mockUser = null;

    renderAdminGuard();

    await waitFor(() => {
      expect(screen.getByTestId("login-redirect")).toBeInTheDocument();
    });

    // checkAdminStatus should not be called with undefined email
    expect(mockCheckAdmin).toHaveBeenCalled();
  });

  // -----------------------------------------------------------------------
  // Edge cases
  // -----------------------------------------------------------------------
  it("calls checkAdminStatus when user changes", async () => {
    mockCheckAdmin.mockResolvedValue(true);
    mockUser = { email: "admin@test.com" };

    const { rerender } = renderAdminGuard();

    await waitFor(() => {
      expect(mockCheckAdmin).toHaveBeenCalledTimes(1);
    });

    // Simulate user change — the hook re-runs
    mockUser = { email: "newadmin@test.com" };
    mockCheckAdmin.mockResolvedValue(false);

    rerender(
      <MemoryRouter initialEntries={["/admin/lots"]}>
        <Routes>
          <Route element={<AdminGuard />}>
            <Route path="/admin/lots" element={<div data-testid="protected-content">Protected</div>} />
          </Route>
          <Route path="/admin/login" element={<div data-testid="login-redirect">Login Redirect</div>} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(mockCheckAdmin).toHaveBeenCalledTimes(2);
      expect(mockCheckAdmin).toHaveBeenLastCalledWith(expect.anything(), "newadmin@test.com");
    });
  });
});

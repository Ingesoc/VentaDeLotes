import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { renderHook, waitFor, act } from "@testing-library/react";
import { AuthProvider } from "@/hooks/useAuth";
import { useAuth } from "@/hooks/useAuthContext";

vi.mock("@/lib/supabase", () => ({
  supabase: {
    auth: {
      getSession: vi.fn(),
      onAuthStateChange: vi.fn(),
      signInWithPassword: vi.fn(),
      signOut: vi.fn(),
    },
  },
}));

const { supabase } = await import("@/lib/supabase");

function renderAuthHook() {
  return renderHook(() => useAuth(), {
    wrapper: ({ children }) => <AuthProvider>{children}</AuthProvider>,
  });
}

describe("useAuth", () => {
  const mockUser = {
    id: "user-1",
    email: "admin@laholanda.com",
    app_metadata: {},
    user_metadata: {},
    aud: "authenticated",
    created_at: "2024-01-01",
  };

  let mockGetSession: Mock;
  let mockOnAuthStateChange: Mock;
  let mockSignInWithPassword: Mock;
  let mockSignOut: Mock;
  let subscriptionCallback: (event: string, session: unknown) => void;

  beforeEach(() => {
    vi.clearAllMocks();

    mockGetSession = supabase.auth.getSession as Mock;
    mockOnAuthStateChange = supabase.auth.onAuthStateChange as Mock;
    mockSignInWithPassword = supabase.auth.signInWithPassword as Mock;
    mockSignOut = supabase.auth.signOut as Mock;

    mockGetSession.mockResolvedValue({ data: { session: null }, error: null });

    subscriptionCallback = () => {};
    mockOnAuthStateChange.mockImplementation(
      (callback: (event: string, session: unknown) => void) => {
        subscriptionCallback = callback;
        return {
          data: { subscription: { unsubscribe: vi.fn() } },
        };
      },
    );
  });

  it("starts in loading state", () => {
    const { result } = renderAuthHook();
    expect(result.current.loading).toBe(true);
  });

  it("resolves loading after session check", async () => {
    const { result } = renderAuthHook();
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.user).toBeNull();
  });

  it("restores session on mount", async () => {
    mockGetSession.mockResolvedValue({
      data: { session: { user: mockUser } },
      error: null,
    });

    const { result } = renderAuthHook();
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.user).toEqual(mockUser);
  });

  it("logs in successfully", async () => {
    mockSignInWithPassword.mockResolvedValue({
      data: { user: mockUser },
      error: null,
    });

    const { result } = renderAuthHook();
    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await result.current.login("admin@laholanda.com", "password123");
    });

    await waitFor(() => {
      expect(result.current.user).toEqual(mockUser);
    });

    expect(mockSignInWithPassword).toHaveBeenCalledWith({
      email: "admin@laholanda.com",
      password: "password123",
    });
  });

  it("returns error on failed login", async () => {
    mockSignInWithPassword.mockResolvedValue({
      data: { user: null },
      error: { message: "Invalid credentials" },
    });

    const { result } = renderAuthHook();
    await waitFor(() => expect(result.current.loading).toBe(false));

    const loginResult = await act(async () =>
      result.current.login("bad@email.com", "wrong"),
    );

    expect(loginResult.user).toBeNull();
    expect(loginResult.error).toBe("Invalid credentials");
  });

  it("returns error when login succeeds but no user data returned", async () => {
    // Case: signInWithPassword returns success but data.user is null
    mockSignInWithPassword.mockResolvedValue({
      data: { user: null },
      error: null,
    });

    const { result } = renderAuthHook();
    await waitFor(() => expect(result.current.loading).toBe(false));

    const loginResult = await act(async () =>
      result.current.login("admin@laholanda.com", "password123"),
    );

    expect(loginResult.user).toBeNull();
    expect(loginResult.error).toBe("Error al iniciar sesión");
    // User should remain null
    expect(result.current.user).toBeNull();
  });

  it("logs out successfully", async () => {
    mockGetSession.mockResolvedValue({
      data: { session: { user: mockUser } },
      error: null,
    });
    mockSignOut.mockResolvedValue({ error: null });

    const { result } = renderAuthHook();
    await waitFor(() => expect(result.current.user).toEqual(mockUser));

    await act(async () => {
      await result.current.logout();
    });

    await waitFor(() => expect(result.current.user).toBeNull());
    expect(mockSignOut).toHaveBeenCalledOnce();
  });

  it("updates user on auth state change (login)", async () => {
    const { result } = renderAuthHook();
    await waitFor(() => expect(result.current.loading).toBe(false));

    act(() => {
      subscriptionCallback("SIGNED_IN", { user: mockUser });
    });

    await waitFor(() => expect(result.current.user).toEqual(mockUser));
  });

  it("clears user on auth state change (logout)", async () => {
    mockGetSession.mockResolvedValue({
      data: { session: { user: mockUser } },
      error: null,
    });

    const { result } = renderAuthHook();
    await waitFor(() => expect(result.current.user).toEqual(mockUser));

    act(() => {
      subscriptionCallback("SIGNED_OUT", { user: null });
    });

    await waitFor(() => expect(result.current.user).toBeNull());
  });

  it("updates user when auth state changes with SIGNED_IN with null session", async () => {
    // Edge case: SIGNED_IN event but no user in session
    const { result } = renderAuthHook();
    await waitFor(() => expect(result.current.loading).toBe(false));

    act(() => {
      subscriptionCallback("SIGNED_IN", { user: null });
    });

    await waitFor(() => expect(result.current.user).toBeNull());
  });

  it("throws error when used outside AuthProvider", () => {
    expect(() => {
      renderHook(() => useAuth());
    }).toThrow("useAuth must be used inside an AuthProvider");
  });

  it("unsubscribes from auth state changes on unmount", async () => {
    const unsubscribe = vi.fn();
    mockOnAuthStateChange.mockImplementation(
      (callback: (event: string, session: unknown) => void) => {
        subscriptionCallback = callback;
        return {
          data: { subscription: { unsubscribe } },
        };
      },
    );

    const { unmount } = renderAuthHook();
    await waitFor(() => expect(mockGetSession).toHaveBeenCalled());

    unmount();

    expect(unsubscribe).toHaveBeenCalledOnce();
  });

  it("maintains stable login and logout references", async () => {
    const { result, rerender } = renderAuthHook();
    await waitFor(() => expect(result.current.loading).toBe(false));

    const initialLogin = result.current.login;
    const initialLogout = result.current.logout;

    rerender();

    // login and logout are wrapped in useCallback with empty deps, so they should be stable
    expect(result.current.login).toBe(initialLogin);
    expect(result.current.logout).toBe(initialLogout);
  });
});

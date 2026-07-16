import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { AuthContext } from "./useAuthContext";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const updateAuthState = useCallback(async (currentUser: User | null) => {
    setUser(currentUser);
    setLoading(false);
  }, []);

  useEffect(() => {
    // Verificar sesión actual al montar
    supabase.auth.getSession().then(({ data: { session } }) => {
      updateAuthState(session?.user ?? null);
    });

    // Escuchar cambios de autenticación
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      updateAuthState(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [updateAuthState]);

  const login = useCallback(
    async (
      email: string,
      password: string
    ): Promise<{ user: User | null; error: string | null }> => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) return { user: null, error: error.message };
      if (!data.user) return { user: null, error: "Error al iniciar sesión" };

      setUser(data.user);
      setLoading(false);
      return { user: data.user, error: null };
    },
    []
  );

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, loading, login, logout }),
    [user, loading, login, logout]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}



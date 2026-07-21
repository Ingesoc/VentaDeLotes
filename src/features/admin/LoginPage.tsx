import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageSEO from "@/components/seo/PageSEO";
import { useAuth } from "@/hooks/useAuthContext";
import { supabase } from "@/lib/supabase";
import { checkAdminStatus } from "@/lib/checkAdmin";

export function Component() {
  return <LoginPage />;
}

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const { user, error: loginError } = await login(email, password);
      if (loginError || !user) {
        setError(loginError || "Error al iniciar sesión");
        return;
      }

      // Verificar si es administrador
      const isAdmin = await checkAdminStatus(supabase, user.email);
      if (!isAdmin) {
        setError("Acceso denegado: tu email no está registrado como administrador");
        return;
      }

      navigate("/admin/dashboard", { replace: true });
    } catch (err) {
      setError("Error inesperado al iniciar sesión");
      console.error("Login error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <PageSEO
        title="Admin Login | La Holanda"
        description="Panel de administración de La Holanda"
        noindex
      />
      <div className="min-h-dvh bg-deep-forest flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-surface-container-lowest rounded-2xl p-8 md:p-12 shadow-2xl">
          <div className="text-center mb-10">
            <h1 className="text-headline-lg font-headline-lg text-primary mb-2">
              Admin
            </h1>
            <p className="text-body-md font-body-md text-on-surface-variant">
              Acceso al panel de administración
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg text-center text-sm font-medium">
              {error === "Invalid login credentials"
                ? "Credenciales inválidas"
                : error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            <div>
              <label
                htmlFor="email"
                className="block text-label-bold font-label-bold text-primary mb-2"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@ejemplo.com"
                required
                className="w-full bg-transparent border border-outline-variant rounded-lg px-4 py-3 text-body-md font-body-md text-on-background focus:ring-2 focus:ring-heritage-gold focus:border-transparent transition-colors placeholder:text-on-surface-variant/50"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-label-bold font-label-bold text-primary mb-2"
              >
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-transparent border border-outline-variant rounded-lg px-4 py-3 text-body-md font-body-md text-on-background focus:ring-2 focus:ring-heritage-gold focus:border-transparent transition-colors placeholder:text-on-surface-variant/50"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-heritage-gold text-primary font-label-bold py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-60 text-lg"
            >
              {submitting ? "Ingresando..." : "Ingresar"}
            </button>
          </form>

          <p className="mt-6 text-center text-caption font-caption text-on-surface-variant">
            Panel exclusivo para administradores
          </p>
        </div>
      </div>
    </>
  );
}

import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import PageSEO from "@/components/seo/PageSEO";
import { supabase } from "@/lib/supabase";

type ResetStatus = "checking" | "ready" | "done" | "error";

export default function ResetPasswordPage() {
  // El enlace de recuperación de Supabase llega con los tokens en el hash:
  //   /reset-password#access_token=...&type=recovery
  const hasRecoveryToken = window.location.hash.includes("type=recovery");

  const [status, setStatus] = useState<ResetStatus>(() =>
    hasRecoveryToken ? "checking" : "error",
  );
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!hasRecoveryToken) return;
    let cancelled = false;
    let retryTimer: number | undefined;

    // Esperar a que supabase-js procese el hash y la sesión quede activa.
    const check = async () => {
      const { data } = await supabase.auth.getSession();
      if (cancelled) return;
      if (data.session) {
        setStatus("ready");
        return;
      }
      // Un reintento tras un pequeño margen para navegaciones lentas.
      retryTimer = window.setTimeout(async () => {
        const retry = await supabase.auth.getSession();
        if (cancelled) return;
        if (retry.data.session) {
          setStatus("ready");
        } else {
          setError(
            "El enlace de recuperación no es válido o ya expiró. Solicita uno nuevo.",
          );
          setStatus("error");
        }
      }, 1500);
    };

    check();
    return () => {
      cancelled = true;
      if (retryTimer !== undefined) window.clearTimeout(retryTimer);
    };
  }, [hasRecoveryToken]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }
    if (password !== confirm) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setSubmitting(true);
    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password,
      });
      if (updateError) throw updateError;

      setStatus("done");
      setTimeout(() => navigate("/admin/login", { replace: true }), 2500);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "No se pudo restablecer la contraseña. Intenta de nuevo.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <PageSEO
        title="Restablecer contraseña | La Holanda"
        description="Restablece la contraseña de tu cuenta de administración de La Holanda."
        noindex
      />
      <div className="min-h-dvh bg-deep-forest flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-surface-container-lowest rounded-2xl p-8 md:p-12 shadow-2xl">
          <div className="text-center mb-10">
            <h1 className="text-headline-lg font-headline-lg text-primary mb-2">
              Restablecer contraseña
            </h1>
            <p className="text-body-md font-body-md text-on-surface-variant">
              Crea una nueva contraseña para tu cuenta de administración
            </p>
          </div>

          {status === "checking" && (
            <div className="flex flex-col items-center gap-4 py-8">
              <div className="w-8 h-8 border-4 border-heritage-gold border-t-transparent rounded-full animate-spin" />
              <p className="text-on-surface-variant text-body-md">
                Verificando el enlace...
              </p>
            </div>
          )}

          {status === "error" && (
            <div className="text-center space-y-6">
              <p className="p-4 bg-red-50 text-red-700 rounded-lg text-sm font-medium">
                {error ?? "El enlace de recuperación no es válido."}
              </p>
              <Link
                to="/admin/login"
                className="inline-block bg-heritage-gold text-primary font-label-bold py-3 px-8 rounded-lg hover:opacity-90 transition-opacity"
              >
                Volver al login
              </Link>
            </div>
          )}

          {status === "ready" && (
            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
              {error && (
                <div className="p-4 bg-red-50 text-red-700 rounded-lg text-center text-sm font-medium">
                  {error}
                </div>
              )}

              <div>
                <label
                  htmlFor="new-password"
                  className="block text-label-bold font-label-bold text-primary mb-2"
                >
                  Nueva contraseña
                </label>
                <input
                  id="new-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  required
                  autoFocus
                  className="w-full bg-transparent border border-outline-variant rounded-lg px-4 py-3 text-body-md font-body-md text-on-background focus:ring-2 focus:ring-heritage-gold focus:border-transparent transition-colors placeholder:text-on-surface-variant/50"
                />
              </div>

              <div>
                <label
                  htmlFor="confirm-password"
                  className="block text-label-bold font-label-bold text-primary mb-2"
                >
                  Confirmar contraseña
                </label>
                <input
                  id="confirm-password"
                  type="password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="Repite la contraseña"
                  required
                  className="w-full bg-transparent border border-outline-variant rounded-lg px-4 py-3 text-body-md font-body-md text-on-background focus:ring-2 focus:ring-heritage-gold focus:border-transparent transition-colors placeholder:text-on-surface-variant/50"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-heritage-gold text-primary font-label-bold py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-60 text-lg"
              >
                {submitting ? "Guardando..." : "Guardar nueva contraseña"}
              </button>
            </form>
          )}

          {status === "done" && (
            <div className="text-center space-y-6">
              <p className="p-4 bg-green-50 text-green-800 rounded-lg text-sm font-medium">
                Contraseña actualizada correctamente. Serás redirigido al
                login...
              </p>
              <Link
                to="/admin/login"
                className="inline-block bg-heritage-gold text-primary font-label-bold py-3 px-8 rounded-lg hover:opacity-90 transition-opacity"
              >
                Ir al login
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

import { createClient } from "@supabase/supabase-js";

// En entornos sin credenciales (p. ej. CI/e2e sin secrets configurados) la app
// NO debe romperse al arrancar: se usa una URL placeholder para que el cliente
// se construya y cualquier llamada real falle de forma controlada (todos los
// consumidores manejan errores de red). En producción el .env trae los valores
// reales.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // Solo en desarrollo; en builds de producción (CI/preview) no se ensucia la
  // consola por cada visita.
  if (import.meta.env.DEV) {
    console.warn(
      "[supabase] VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY no están configuradas. " +
        "Las llamadas a Supabase fallarán, pero la app continúa funcionando.",
    );
  }
}

export const supabase = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseAnonKey || "placeholder-anon-key",
);

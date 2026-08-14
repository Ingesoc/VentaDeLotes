/**
 * Configuración de react-doctor.
 *
 * Se ignoran los archivos que no forman parte del bundle de React:
 * - `lighthouse.config.mjs` se usa solo desde la CLI de npm.
 * - `supabase/functions/**` son Edge Functions de Deno desplegadas por
 *   separado, no se importan desde la app.
 */
export default {
  ignore: {
    // Archivos que no forman parte del bundle de React ni se importan desde
    // la app: config de la CLI de lighthouse, Edge Functions de Deno
    // desplegadas por separado, y este mismo archivo de configuración.
    files: [
      "lighthouse.config.mjs",
      "supabase/functions/**",
      "doctor.config.mjs",
    ],
  },
  rules: {
    // Falso positivo: el SDK de Supabase incluye strings internos (nombres de
    // tablas/columnas) que disparan esta regla en el bundle. La propia app ya
    // expone esos nombres en sus queries (supabase.from("lots")...), así que la
    // regla no aporta protección real. Se desactiva para poder bundlear el SDK
    // localmente en vez de cargarlo desde esm.sh (ver ADR-004), que encadenaba
    // ~15 requests en el camino crítico de Lighthouse.
    "react-doctor/artifact-baas-authority-surface": "off",
  },
};

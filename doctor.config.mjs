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
};

import { supabase } from "@/lib/supabase";
import { cldUrl, CLD_WIDTHS } from "@/lib/cloudinary";
import { lots as staticLots, type Lot, type LotStatus } from "@/constants/lots";

// El modo "datos vivos" se activa de forma explícita con VITE_LIVE_LOTS=true.
// Así, el cambio a datos de Supabase se despliega con seguridad: primero se
// aplica la migración supabase/migration-live-lots.sql y luego se enciende la
// variable en el entorno de producción.
const LIVE_LOTS_ENABLED = import.meta.env.VITE_LIVE_LOTS === "true";

/** Imagen por defecto del proyecto para lotes sin foto subida todavía. */
const DEFAULT_LOT_IMAGE = cldUrl(
  "https://res.cloudinary.com/j5a9xyaq/image/upload/v1784946345/laholanda/lots/loteo-general-drone.jpg",
  CLD_WIDTHS.LARGE,
);

/** Fila de la tabla `lots` en Supabase. */
interface LotRow {
  id: string;
  area_m2: number | null;
  price: number | null;
  status: LotStatus;
  aerial_image: string | null;
  perspective_image: string | null;
  topography: string | null;
  view_text: string | null;
  access: string | null;
  shared_aerial_with: string | null;
  coordinates: { lat: number; lng: number } | null;
}

function isCloudinaryUrl(value: string | null): value is string {
  return typeof value === "string" && value.includes("res.cloudinary.com");
}

/**
 * Convierte una fila de la BD al modelo de la app.
 *
 * Los campos que la BD aún no tenga (null) se completan con el valor estático
 * de `src/constants/lots.ts`, de modo que el sitio público funciona incluso si
 * la tabla no está sincronizada (p. ej. lotes creados desde el admin o un seed
 * antiguo con rutas relativas de imagen).
 */
function toLot(row: LotRow): Lot {
  const base = staticLots.find((lot) => lot.id === row.id);

  const resolveImage = (
    dbValue: string | null,
    fallback: string | undefined,
    width: number,
  ) => (isCloudinaryUrl(dbValue) ? cldUrl(dbValue, width) : (fallback ?? DEFAULT_LOT_IMAGE));

  return {
    id: row.id,
    areaM2: row.area_m2 ?? base?.areaM2 ?? 0,
    price: row.price ?? base?.price,
    priceSchedule: base?.priceSchedule,
    status: row.status,
    aerialImage: resolveImage(row.aerial_image, base?.aerialImage, CLD_WIDTHS.LARGE),
    perspectiveImage: resolveImage(
      row.perspective_image,
      base?.perspectiveImage,
      CLD_WIDTHS.LARGE,
    ),
    topography: row.topography ?? base?.topography,
    view: row.view_text ?? base?.view,
    access: row.access ?? base?.access,
    sharedAerialWith: row.shared_aerial_with ?? base?.sharedAerialWith,
    coordinates: row.coordinates ?? base?.coordinates,
  };
}

/**
 * Trae todos los lotes desde Supabase (fuente de verdad para estado, precio e
 * imágenes gestionadas por el admin). Si la consulta falla o la tabla está
 * vacía, devuelve los datos estáticos de `src/constants/lots.ts` para que el
 * sitio nunca se quede sin contenido.
 */
export async function fetchPublicLots(): Promise<Lot[]> {
  if (!LIVE_LOTS_ENABLED) return staticLots;

  try {
    const { data, error } = await supabase.from("lots").select("*").order("id");
    if (error) throw error;
    if (!data || data.length === 0) return staticLots;
    return (data as LotRow[]).map(toLot);
  } catch {
    return staticLots;
  }
}



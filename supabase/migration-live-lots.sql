-- ============================================================
-- MIGRACIÓN: Datos vivos del sitio público (modo live)
-- ============================================================
-- Habilita que el sitio público (Home, Proyectos, Detalle de lote) lea los
-- lotes directamente desde Supabase en lugar de las constantes estáticas.
--
-- Qué hace:
--   1. Agrega la columna `coordinates` (jsonb) para que cada lote pueda
--      llevar sus coordenadas geográficas en la BD.
--   2. Sincroniza el seed de `lots` con los datos reales actuales (precios,
--      áreas, estados, URLs de Cloudinary y coordenadas).
--   3. Amplía la RLS: el público ahora puede leer TODOS los lotes (incluidos
--      'reservado', 'vendido' y 'no_disponible'), porque el sitio muestra esos
--      estados. Antes solo se leían los 'disponible'.
--
-- Es idempotente: se puede re-ejecutar sin errores.
-- Ejecutar en: Supabase Dashboard → SQL Editor → New query → Run
-- ============================================================

-- ── 1. COLUMNA NUEVA ─────────────────────────────────────────
ALTER TABLE lots ADD COLUMN IF NOT EXISTS coordinates jsonb;

-- ── 2. SEED: LOTES (coincide con src/constants/lots.ts) ──────
INSERT INTO lots (id, area_m2, price, status, aerial_image, perspective_image, shared_aerial_with, topography, view_text, access, coordinates)
VALUES
  ('01', 8910.37, 189242850, 'no_disponible',
   'https://res.cloudinary.com/j5a9xyaq/image/upload/v1784946345/laholanda/lots/loteo-general-drone.jpg',
   'https://res.cloudinary.com/j5a9xyaq/image/upload/v1784946353/laholanda/lots/perspectiva-lotes-1-10-11-12-drone.jpg',
   NULL, NULL, NULL, NULL, '{"lat": 4.61923, "lng": -75.76700}'),
  ('02', 2008,    189242850, 'disponible',
   'https://res.cloudinary.com/j5a9xyaq/image/upload/v1784946305/laholanda/lots/lote-02-03-drone.jpg',
   'https://res.cloudinary.com/j5a9xyaq/image/upload/v1784946349/laholanda/lots/perspectiva-general-drone.jpg',
   '03', NULL, NULL, NULL, '{"lat": 4.61866, "lng": -75.76802}'),
  ('03', 2013,    185619550, 'disponible',
   'https://res.cloudinary.com/j5a9xyaq/image/upload/v1784946305/laholanda/lots/lote-02-03-drone.jpg',
   'https://res.cloudinary.com/j5a9xyaq/image/upload/v1784946349/laholanda/lots/perspectiva-general-drone.jpg',
   '02', NULL, NULL, NULL, '{"lat": 4.61832, "lng": -75.76834}'),
  ('04', 2004,    165570750, 'disponible',
   'https://res.cloudinary.com/j5a9xyaq/image/upload/v1784946309/laholanda/lots/lote-04-05-drone.jpg',
   'https://res.cloudinary.com/j5a9xyaq/image/upload/v1784946349/laholanda/lots/perspectiva-general-drone.jpg',
   '05', NULL, NULL, NULL, '{"lat": 4.61799, "lng": -75.76865}'),
  ('05', 2005,    169412550, 'disponible',
   'https://res.cloudinary.com/j5a9xyaq/image/upload/v1784946309/laholanda/lots/lote-04-05-drone.jpg',
   'https://res.cloudinary.com/j5a9xyaq/image/upload/v1784946349/laholanda/lots/perspectiva-general-drone.jpg',
   '04', NULL, NULL, NULL, '{"lat": 4.61752, "lng": -75.76901}'),
  ('06', 2005,    158822900, 'disponible',
   'https://res.cloudinary.com/j5a9xyaq/image/upload/v1784946328/laholanda/lots/lote-06-drone.jpg',
   'https://res.cloudinary.com/j5a9xyaq/image/upload/v1784946349/laholanda/lots/perspectiva-general-drone.jpg',
   NULL, NULL, NULL, NULL, '{"lat": 4.61891, "lng": -75.77010}'),
  ('07', 2010,    159082250, 'disponible',
   'https://res.cloudinary.com/j5a9xyaq/image/upload/v1784946331/laholanda/lots/lote-07-08-drone.jpg',
   'https://res.cloudinary.com/j5a9xyaq/image/upload/v1784946349/laholanda/lots/perspectiva-general-drone.jpg',
   '08', NULL, NULL, NULL, '{"lat": 4.61934, "lng": -75.76963}'),
  ('08', 2005,    184469100, 'disponible',
   'https://res.cloudinary.com/j5a9xyaq/image/upload/v1784946331/laholanda/lots/lote-07-08-drone.jpg',
   'https://res.cloudinary.com/j5a9xyaq/image/upload/v1784946349/laholanda/lots/perspectiva-general-drone.jpg',
   '07', 'Ondulada suave', 'Panorámica al valle', 'Directo principal', '{"lat": 4.61973, "lng": -75.76933}'),
  ('09', 2011,    189883150, 'disponible',
   'https://res.cloudinary.com/j5a9xyaq/image/upload/v1784946336/laholanda/lots/lote-09-drone.jpg',
   'https://res.cloudinary.com/j5a9xyaq/image/upload/v1784946349/laholanda/lots/perspectiva-general-drone.jpg',
   NULL, NULL, NULL, NULL, '{"lat": 4.62017, "lng": -75.76905}'),
  ('10', 2966,    NULL,      'disponible',
   'https://res.cloudinary.com/j5a9xyaq/image/upload/v1784946345/laholanda/lots/loteo-general-drone.jpg',
   'https://res.cloudinary.com/j5a9xyaq/image/upload/v1784946353/laholanda/lots/perspectiva-lotes-1-10-11-12-drone.jpg',
   NULL, NULL, NULL, NULL, '{"lat": 4.62028, "lng": -75.76756}'),
  ('11', 2502,    237690000, 'disponible',
   'https://res.cloudinary.com/j5a9xyaq/image/upload/v1784946345/laholanda/lots/loteo-general-drone.jpg',
   'https://res.cloudinary.com/j5a9xyaq/image/upload/v1784946353/laholanda/lots/perspectiva-lotes-1-10-11-12-drone.jpg',
   NULL, NULL, NULL, NULL, '{"lat": 4.62062, "lng": -75.76813}'),
  ('12', 2456,    233320000, 'disponible',
   'https://res.cloudinary.com/j5a9xyaq/image/upload/v1784946345/laholanda/lots/loteo-general-drone.jpg',
   'https://res.cloudinary.com/j5a9xyaq/image/upload/v1784946353/laholanda/lots/perspectiva-lotes-1-10-11-12-drone.jpg',
   NULL, NULL, NULL, NULL, '{"lat": 4.62085, "lng": -75.76879}'),
  ('13', 3216,    305520000, 'disponible',
   'https://res.cloudinary.com/j5a9xyaq/image/upload/v1784946340/laholanda/lots/lote-13-14-drone.jpg',
   'https://res.cloudinary.com/j5a9xyaq/image/upload/v1784946357/laholanda/lots/perspectiva-lotes-13-14-drone.jpg',
   NULL, NULL, NULL, NULL, '{"lat": 4.62074, "lng": -75.77030}'),
  ('14', 2518,    239210000, 'disponible',
   'https://res.cloudinary.com/j5a9xyaq/image/upload/v1784946340/laholanda/lots/lote-13-14-drone.jpg',
   'https://res.cloudinary.com/j5a9xyaq/image/upload/v1784946357/laholanda/lots/perspectiva-lotes-13-14-drone.jpg',
   NULL, NULL, NULL, NULL, '{"lat": 4.62012, "lng": -75.77081}'),
  ('15', 2908,    NULL,      'disponible',
   'https://res.cloudinary.com/j5a9xyaq/image/upload/v1784946345/laholanda/lots/loteo-general-drone.jpg',
   'https://res.cloudinary.com/j5a9xyaq/image/upload/v1784946349/laholanda/lots/perspectiva-general-drone.jpg',
   NULL, NULL, NULL, NULL, '{"lat": 4.61937, "lng": -75.77152}'),
  ('16', 6689,    NULL,      'disponible',
   'https://res.cloudinary.com/j5a9xyaq/image/upload/v1784946345/laholanda/lots/loteo-general-drone.jpg',
   'https://res.cloudinary.com/j5a9xyaq/image/upload/v1784946349/laholanda/lots/perspectiva-general-drone.jpg',
   NULL, NULL, NULL, NULL, '{"lat": 4.61846, "lng": -75.77122}')
ON CONFLICT (id) DO UPDATE SET
  area_m2            = EXCLUDED.area_m2,
  price              = EXCLUDED.price,
  status             = EXCLUDED.status,
  aerial_image       = EXCLUDED.aerial_image,
  perspective_image  = EXCLUDED.perspective_image,
  shared_aerial_with = EXCLUDED.shared_aerial_with,
  topography         = EXCLUDED.topography,
  view_text          = EXCLUDED.view_text,
  access             = EXCLUDED.access,
  coordinates        = EXCLUDED.coordinates;

-- ── 3. RLS: lectura pública de TODOS los lotes ────────────────
-- El sitio muestra los estados (disponible/reservado/vendido/no_disponible)
-- con su badge, así que el público debe poder leer todos los lotes.
-- Los precios ya se publican en la web, no hay información sensible.

DROP POLICY IF EXISTS "Public read available lots" ON lots;

CREATE POLICY "Public read all lots"
  ON lots FOR SELECT
  TO anon
  USING (true);

-- ── 4. VERIFICACIÓN (opcional) ───────────────────────────────
-- SELECT id, status, price, coordinates FROM lots ORDER BY id;

-- ============================================================
-- MIGRACIÓN: Campos de multimedia para la galería y referencia de escala
-- ============================================================
-- Agrega soporte para:
--   1. `images` (jsonb) — array de URLs de fotos adicionales del lote
--      (fotos propias de tierra, frentes, etc. además de aérea/perspectiva).
--   2. `scale_reference_media` (jsonb) — foto/video con persona como
--      referencia de escala real (opcional por lote).
--
-- Naming convention de assets en Cloudinary:
--   - Fotos adicionales: lots/{lote_id}/{n}.jpg
--   - Referencia de escala (foto): lots/{lote_id}/scale-reference.jpg
--   - Referencia de escala (video): lots/{lote_id}/scale-reference.mp4
--
-- Ejecutar en: Supabase Dashboard → SQL Editor → New query → Run
-- Es idempotente: se puede re-ejecutar sin errores.
-- ============================================================

-- ── 1. COLUMNA: images (array de URLs de fotos) ─────────────
ALTER TABLE lots ADD COLUMN IF NOT EXISTS images jsonb DEFAULT '[]'::jsonb;

-- ── 2. COLUMNA: scale_reference_media ───────────────────────
-- Formato: { "type": "image"|"video", "url": "...", "alt": "..." }
-- NULL = el lote no tiene referencia de escala (sección no se renderiza)
ALTER TABLE lots ADD COLUMN IF NOT EXISTS scale_reference_media jsonb;

-- ── 3. COMENTARIOS EN COLUMNA (documentación en BD) ─────────
COMMENT ON COLUMN lots.images IS 'Array de URLs de fotos adicionales del lote (Cloudinary). Naming: lots/{lote_id}/{n}.jpg';
COMMENT ON COLUMN lots.scale_reference_media IS 'Foto/video con persona como referencia de escala. { type: "image"|"video", url: string, alt: string }. NULL = sin referencia.';

-- ── 4. VERIFICACIÓN (opcional) ──────────────────────────────
-- SELECT id, images, scale_reference_media FROM lots ORDER BY id;

-- migration-lots-constraints.sql
-- Agrega CHECK constraints de integridad a la tabla `lots`.
-- Idempotente: cada CHECK usa un bloque DO para verificar existencia previa.

-- Precio no puede ser negativo (NULL = sin precio definido es válido)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'lots_price_nonnegative'
      AND conrelid = 'lots'::regclass
  ) THEN
    ALTER TABLE lots
      ADD CONSTRAINT lots_price_nonnegative
      CHECK (price IS NULL OR price >= 0);
  END IF;
END $$;

-- Área debe ser positiva (NULL = área no definida aún es válido)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'lots_area_positive'
      AND conrelid = 'lots'::regclass
  ) THEN
    ALTER TABLE lots
      ADD CONSTRAINT lots_area_positive
      CHECK (area_m2 IS NULL OR area_m2 > 0);
  END IF;
END $$;

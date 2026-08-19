-- migration: Cron job para refrescar lotes_metricas cada 5 minutos
-- Requiere la extensión pg_cron (ya viene habilitada en Supabase hosted)

-- 1. Habilitar extensión pg_cron (idempotente)
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- 2. Eliminar job anterior si existe (idempotente)
DO $$
BEGIN
  -- Verificar si el job ya existe antes de intentar eliminarlo
  IF EXISTS (
    SELECT 1 FROM cron.job WHERE jobname = 'refresh-lotes-metricas'
  ) THEN
    PERFORM cron.unschedule('refresh-lotes-metricas');
  END IF;
END $$;

-- 3. Crear el cron job: cada 5 minutos
SELECT cron.schedule(
  'refresh-lotes-metricas',   -- nombre del job
  '*/5 * * * *',             -- cada 5 minutos
  $$
    REFRESH MATERIALIZED VIEW CONCURRENTLY lotes_metricas;
  $$
);

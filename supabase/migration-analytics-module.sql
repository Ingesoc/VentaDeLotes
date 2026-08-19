-- ============================================================
-- MIGRACIÓN: Módulo de Analítica y Captura de Leads
-- La Holanda — VentaDeLotes
-- ============================================================
-- Fecha: 2026-08-19
-- Autor: Buffy (Codebuff)
--
-- Esta migración es IDEMPOTENTE: puede ejecutarse múltiples veces
-- sin errores. Usa IF NOT EXISTS / IF EXISTS en cada operación.
--
-- Ejecutar en: Supabase Dashboard → SQL Editor → New query → Run
--
-- Cambios:
--   1. Extiende la tabla `leads` con 12 columnas nuevas
--   2. Crea la tabla `interacciones` (log de contactos)
--   3. Renombra `page_views` → `eventos_producto` y la extiende
--   4. Crea la vista materializada `lotes_metricas`
--   5. Actualiza la RPC `submit_lead` para aceptar nuevos parámetros
--   6. Crea la RPC `track_event` para eventos de producto
--   7. Aplica RLS para todas las tablas
-- ============================================================


-- ════════════════════════════════════════════════════════════════
-- 1. EXTENDER TABLA `leads`
-- ════════════════════════════════════════════════════════════════

-- Canal de adquisición (orgánico, pauta, referido, WhatsApp, feria, etc.)
ALTER TABLE leads ADD COLUMN IF NOT EXISTS
  source_channel text NOT NULL DEFAULT 'organico'
    CHECK (source_channel IN (
      'organico', 'pauta_meta', 'pauta_google', 'referido',
      'whatsapp', 'feria', 'otro'
    ));

-- Etapa del embudo de conversión
ALTER TABLE leads ADD COLUMN IF NOT EXISTS
  funnel_stage text NOT NULL DEFAULT 'nuevo'
    CHECK (funnel_stage IN (
      'nuevo', 'contactado', 'visita_agendada',
      'negociando', 'cerrado_ganado', 'cerrado_perdido'
    ));

-- Lote de interés (relación con la tabla lots)
ALTER TABLE leads ADD COLUMN IF NOT EXISTS lot_id text REFERENCES lots(id) ON DELETE SET NULL;

-- Rango de presupuesto estimado (COP)
ALTER TABLE leads ADD COLUMN IF NOT EXISTS budget_min bigint;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS budget_max bigint;

-- Ubicación de interés (barrio, ciudad, o referencia libre)
ALTER TABLE leads ADD COLUMN IF NOT EXISTS interest_location text;

-- Parámetros UTM para atribución de campañas
ALTER TABLE leads ADD COLUMN IF NOT EXISTS utm_source text;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS utm_medium text;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS utm_campaign text;

-- Último contacto registrado (se actualiza con cada interacción)
ALTER TABLE leads ADD COLUMN IF NOT EXISTS last_contact_at timestamptz;

-- Score de calidad del lead (0-100, calculado por modelo predictivo futuro)
ALTER TABLE leads ADD COLUMN IF NOT EXISTS score smallint DEFAULT 0
  CHECK (score >= 0 AND score <= 100);

-- Notas internas del equipo de ventas
ALTER TABLE leads ADD COLUMN IF NOT EXISTS notes text;


-- ════════════════════════════════════════════════════════════════
-- 2. CREAR TABLA `interacciones`
-- ════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS interacciones (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  lead_id bigint NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  tipo text NOT NULL
    CHECK (tipo IN (
      'llamada', 'mensaje_whatsapp', 'mensaje_email',
      'visita_lote', 'visita_web', 'formulario_enviado'
    )),
  canal text
    CHECK (canal IN ('telefono', 'whatsapp', 'email', 'presencial', 'web')),
  notas text,
  created_at timestamptz DEFAULT now()
);

-- Índices para queries frecuentes del dashboard
CREATE INDEX IF NOT EXISTS idx_interacciones_lead_id ON interacciones(lead_id);
CREATE INDEX IF NOT EXISTS idx_interacciones_created_at ON interacciones(created_at);
CREATE INDEX IF NOT EXISTS idx_interacciones_tipo ON interacciones(tipo);


-- ════════════════════════════════════════════════════════════════
-- 3. RENOMBRAR `page_views` → `eventos_producto` Y EXTENDER
-- ════════════════════════════════════════════════════════════════

-- Renombrar la tabla (idempotente: solo renombra si el nombre antiguo existe)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'page_views') THEN
    ALTER TABLE page_views RENAME TO eventos_producto;
  END IF;
END $$;

-- Tipo de evento de producto
ALTER TABLE eventos_producto ADD COLUMN IF NOT EXISTS
  event_type text NOT NULL DEFAULT 'page_view'
    CHECK (event_type IN (
      'page_view', 'lote_visto', 'lote_favorito',
      'contacto_iniciado', 'visita_agendada',
      'formulario_enviado', 'formulario_abandonado',
      'filtro_aplicado', 'busqueda_realizada'
    ));

-- ID de sesión para agrupar eventos por usuario anónimo
ALTER TABLE eventos_producto ADD COLUMN IF NOT EXISTS session_id text;

-- User agent para segmentación por dispositivo
ALTER TABLE eventos_producto ADD COLUMN IF NOT EXISTS user_agent text;

-- Referrer para atribución de tráfico
ALTER TABLE eventos_producto ADD COLUMN IF NOT EXISTS referrer text;

-- Tiempo en página (milisegundos)
ALTER TABLE eventos_producto ADD COLUMN IF NOT EXISTS time_on_page_ms integer;

-- Datos flexibles (filtros, favoritos, metadata variada)
ALTER TABLE eventos_producto ADD COLUMN IF NOT EXISTS metadata jsonb;

-- Índices para analytics
-- Nota: la columna timestamp original se llama `viewed_at` (de page_views)
CREATE INDEX IF NOT EXISTS idx_eventos_event_type ON eventos_producto(event_type);
CREATE INDEX IF NOT EXISTS idx_eventos_lot_id ON eventos_producto(lot_id);
CREATE INDEX IF NOT EXISTS idx_eventos_session_id ON eventos_producto(session_id);
CREATE INDEX IF NOT EXISTS idx_eventos_created_at ON eventos_producto(viewed_at);
CREATE INDEX IF NOT EXISTS idx_eventos_metadata ON eventos_producto USING gin (metadata);


-- ════════════════════════════════════════════════════════════════
-- 4. VISTA MATERIALIZADA `lotes_metricas`
-- ════════════════════════════════════════════════════════════════

-- Eliminar vista existente si hay cambios en la definición
DROP MATERIALIZED VIEW IF EXISTS lotes_metricas;

CREATE MATERIALIZED VIEW lotes_metricas AS
SELECT
  l.id AS lot_id,
  l.status,
  l.area_m2,
  l.price,

  -- Métricas de interés
  COUNT(DISTINCT ev.id) FILTER (WHERE ev.event_type IN ('page_view', 'lote_visto'))
    AS total_vistas,
  COUNT(DISTINCT ev.id) FILTER (WHERE ev.event_type = 'lote_favorito')
    AS total_favoritos,
  COUNT(DISTINCT ev.id) FILTER (WHERE ev.event_type = 'contacto_iniciado')
    AS contactos_iniciados,
  COUNT(DISTINCT le.id) AS total_leads,
  COUNT(DISTINCT le.id) FILTER (WHERE le.funnel_stage = 'cerrado_ganado')
    AS ventas,

  -- Tasa de conversión: leads / vistas
  CASE WHEN COUNT(DISTINCT ev.id) FILTER (WHERE ev.event_type IN ('page_view', 'lote_visto')) > 0
    THEN ROUND(
      COUNT(DISTINCT le.id)::numeric /
      NULLIF(COUNT(DISTINCT ev.id) FILTER (WHERE ev.event_type IN ('page_view', 'lote_visto')), 0) * 100,
      1
    )
    ELSE 0
  END AS tasa_conversion_pct,

  -- Tasa de conversión a venta: ventas / leads
  CASE WHEN COUNT(DISTINCT le.id) > 0
    THEN ROUND(
      COUNT(DISTINCT le.id) FILTER (WHERE le.funnel_stage = 'cerrado_ganado')::numeric /
      COUNT(DISTINCT le.id) * 100,
      1
    )
    ELSE 0
  END AS tasa_cierre_pct,

  -- Tiempo promedio en página (segundos)
  ROUND(AVG(ev.time_on_page_ms) / 1000.0, 1) AS avg_time_on_page_s,

  -- Primera y última vista
  MIN(ev.viewed_at) FILTER (WHERE ev.event_type IN ('page_view', 'lote_visto'))
    AS primera_vista_at,
  MAX(ev.viewed_at) FILTER (WHERE ev.event_type IN ('page_view', 'lote_visto'))
    AS ultima_vista_at,

  -- Días en mercado (desde primera vista hasta hoy)
  EXTRACT(DAY FROM now() - MIN(ev.viewed_at)) AS dias_en_mercado

FROM lots l
LEFT JOIN eventos_producto ev ON ev.lot_id = l.id
LEFT JOIN leads le ON le.lot_id = l.id
GROUP BY l.id, l.status, l.area_m2, l.price
WITH DATA;

-- Índice único para REFRESH CONCURRENTLY
CREATE UNIQUE INDEX IF NOT EXISTS idx_lotes_metricas_lot_id ON lotes_metricas(lot_id);


-- ════════════════════════════════════════════════════════════════
-- 5. ACTUALIZAR RPCs
-- ════════════════════════════════════════════════════════════════

-- 5a. submit_lead: extender para aceptar source_channel, lot_id, UTM
--     Nota: los parámetros nuevos son OPCIONALES para mantener
--     compatibilidad con el formulario existente que no los envía.
CREATE OR REPLACE FUNCTION submit_lead(
  p_name text,
  p_email text,
  p_phone text,
  p_message text DEFAULT NULL,
  p_source_channel text DEFAULT 'organico',
  p_lot_id text DEFAULT NULL,
  p_utm_source text DEFAULT NULL,
  p_utm_medium text DEFAULT NULL,
  p_utm_campaign text DEFAULT NULL
)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = 'public'
AS $$
  INSERT INTO leads (
    name, email, phone, message,
    source_channel, lot_id,
    utm_source, utm_medium, utm_campaign
  ) VALUES (
    p_name, p_email, p_phone, p_message,
    p_source_channel, p_lot_id,
    p_utm_source, p_utm_medium, p_utm_campaign
  );
$$;


-- 5b. track_event: RPC generalizada para eventos de producto
--     Reemplaza/augmenta a track_page_view
CREATE OR REPLACE FUNCTION track_event(
  p_event_type text,
  p_lot_id text DEFAULT NULL,
  p_page_path text DEFAULT NULL,
  p_session_id text DEFAULT NULL,
  p_user_agent text DEFAULT NULL,
  p_referrer text DEFAULT NULL,
  p_time_on_page_ms integer DEFAULT NULL,
  p_metadata jsonb DEFAULT NULL
)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = 'public'
AS $$
  INSERT INTO eventos_producto (
    event_type, lot_id, page_path,
    session_id, user_agent, referrer,
    time_on_page_ms, metadata
  ) VALUES (
    p_event_type, p_lot_id, p_page_path,
    p_session_id, p_user_agent, p_referrer,
    p_time_on_page_ms, p_metadata
  );
$$;


-- 5c. track_page_view: mantener compatibilidad con código existente
--     Internamente usa track_event
CREATE OR REPLACE FUNCTION track_page_view(p_lot_id text, p_page_path text)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = 'public'
AS $$
  INSERT INTO eventos_producto (lot_id, page_path, event_type)
  VALUES (p_lot_id, p_page_path, 'page_view');
$$;


-- 5d. update_lead_stage: cambiar etapa del embudo + registrar interacción
CREATE OR REPLACE FUNCTION update_lead_stage(
  p_lead_id bigint,
  p_new_stage text,
  p_notas text DEFAULT NULL
)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = 'public'
AS $$
  -- Actualizar la etapa del lead
  UPDATE leads
  SET funnel_stage = p_new_stage,
      last_contact_at = now()
  WHERE id = p_lead_id;

  -- Registrar la interacción
  INSERT INTO interacciones (lead_id, tipo, canal, notas)
  VALUES (
    p_lead_id,
    CASE p_new_stage
      WHEN 'contactado' THEN 'llamada'
      WHEN 'visita_agendada' THEN 'visita_lote'
      WHEN 'negociando' THEN 'mensaje_whatsapp'
      ELSE 'mensaje_email'
    END,
    CASE p_new_stage
      WHEN 'contactado' THEN 'telefono'
      WHEN 'visita_agendada' THEN 'presencial'
      WHEN 'negociando' THEN 'whatsapp'
      ELSE 'email'
    END,
    p_notas
  );
$$;


-- 5e. refresh_lotes_metricas: refrescar la vista materializada
--     Ejecutar periódicamente (cron cada 5 min o bajo demanda)
CREATE OR REPLACE FUNCTION refresh_lotes_metricas()
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = 'public'
AS $$
  REFRESH MATERIALIZED VIEW CONCURRENTLY lotes_metricas;
$$;


-- ════════════════════════════════════════════════════════════════
-- 6. ROW LEVEL SECURITY
-- ════════════════════════════════════════════════════════════════

-- Habilitar RLS en nuevas tablas
ALTER TABLE interacciones ENABLE ROW LEVEL SECURITY;

-- Las inserciones públicas van por RPC (submit_lead, track_event),
-- que usan SECURITY DEFINER y bypassan RLS.

-- ── Políticas interacciones ───────────────────────────────────

-- Admin: acceso total a interacciones
DROP POLICY IF EXISTS "Admin all interacciones" ON interacciones;
CREATE POLICY "Admin all interacciones"
  ON interacciones FOR ALL
  TO authenticated
  USING (is_admin(auth.jwt()->>'email'))
  WITH CHECK (is_admin(auth.jwt()->>'email'));

-- ── Políticas leads (actualizadas) ───────────────────────────

-- Admin: escritura total en leads (para cambiar stage, score, notes)
DROP POLICY IF EXISTS "Admin all leads" ON leads;
CREATE POLICY "Admin all leads"
  ON leads FOR ALL
  TO authenticated
  USING (is_admin(auth.jwt()->>'email'))
  WITH CHECK (is_admin(auth.jwt()->>'email'));

-- ── Políticas eventos_producto (actualizadas) ────────────────

-- Admin: acceso total a eventos para analytics
DROP POLICY IF EXISTS "Admin all eventos_producto" ON eventos_producto;
CREATE POLICY "Admin all eventos_producto"
  ON eventos_producto FOR ALL
  TO authenticated
  USING (is_admin(auth.jwt()->>'email'))
  WITH CHECK (is_admin(auth.jwt()->>'email'));

-- ── Verificar que las políticas de lectura existentes siguen ──
-- funcionando (leads, page_views/eventos_producto, lots)

-- Nota: Las políticas "Admin read leads" y "Admin read page_views"
-- de la migración anterior siguen vigentes. Las nuevas políticas
-- "Admin all ..." las complementan con acceso de escritura.


-- ════════════════════════════════════════════════════════════════
-- 7. REVOCAR ACCESO A RPCs INTERNAS
-- ════════════════════════════════════════════════════════════════

-- update_lead_stage es solo para uso interno del admin
REVOKE EXECUTE ON FUNCTION update_lead_stage(bigint, text, text)
  FROM public, anon, authenticated;

-- refresh_lotes_metricas es solo para uso interno (cron/admin)
REVOKE EXECUTE ON FUNCTION refresh_lotes_metricas()
  FROM public, anon, authenticated;


-- ════════════════════════════════════════════════════════════════
-- 8. VERIFICACIÓN (opcional — descomentar para validar)
-- ════════════════════════════════════════════════════════════════

-- SELECT 'leads' AS tabla, count(*) AS total,
--   count(*) FILTER (WHERE source_channel != 'organico') AS con_canal
-- FROM leads
-- UNION ALL
-- SELECT 'interacciones', count(*), 0 FROM interacciones
-- UNION ALL
-- SELECT 'eventos_producto', count(*),
--   count(*) FILTER (WHERE event_type != 'page_view') FROM eventos_producto;

-- ============================================================
-- DEPLOY ALL — La Holanda Analytics Module
-- ============================================================
-- Paste this ENTIRE file into Supabase SQL Editor and run.
-- Safe to run multiple times (idempotent).
-- ============================================================


-- ============================================================
-- CLEANUP: Drop partial artifacts from failed migration
-- ============================================================

DROP MATERIALIZED VIEW IF EXISTS lotes_metricas CASCADE;
DROP VIEW IF EXISTS vista_export_leads CASCADE;
DROP VIEW IF EXISTS vista_export_events CASCADE;
DROP VIEW IF EXISTS vista_export_funnel CASCADE;
DROP FUNCTION IF EXISTS track_event(text,text,text,text,text,text,integer,jsonb);
DROP FUNCTION IF EXISTS update_lead_stage(bigint,text,text);
DROP FUNCTION IF EXISTS refresh_lotes_metricas();


-- ============================================================
-- 1. BASE TABLES (skip if exist)
-- ============================================================

CREATE TABLE IF NOT EXISTS admins (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email text UNIQUE NOT NULL,
  role_name text NOT NULL DEFAULT 'admin',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS lots (
  id text PRIMARY KEY,
  area_m2 numeric,
  price bigint,
  status text NOT NULL DEFAULT 'disponible'
    CHECK (status IN ('disponible','reservado','vendido','no_disponible')),
  aerial_image text,
  perspective_image text,
  topography text,
  view_text text,
  access text,
  shared_aerial_with text,
  updated_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS page_views (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  lot_id text REFERENCES lots(id) ON DELETE CASCADE,
  page_path text NOT NULL,
  viewed_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS leads (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  message text,
  created_at timestamptz DEFAULT now()
);


-- ============================================================
-- 2. RENAME page_views -> eventos_producto (if needed)
-- ============================================================
-- page_views has columns: id, lot_id, page_path, viewed_at
-- Note: the timestamp column is viewed_at (NOT created_at)

DO $function$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables WHERE table_name = 'page_views'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.tables WHERE table_name = 'eventos_producto'
  ) THEN
    ALTER TABLE page_views RENAME TO eventos_producto;
  END IF;
END $function$;


-- ============================================================
-- 3. EXTEND leads TABLE
-- ============================================================

ALTER TABLE leads ADD COLUMN IF NOT EXISTS source_channel text NOT NULL DEFAULT 'organico';
ALTER TABLE leads ADD COLUMN IF NOT EXISTS funnel_stage text NOT NULL DEFAULT 'nuevo';
ALTER TABLE leads ADD COLUMN IF NOT EXISTS lot_id text REFERENCES lots(id) ON DELETE SET NULL;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS budget_min bigint;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS budget_max bigint;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS interest_location text;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS utm_source text;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS utm_medium text;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS utm_campaign text;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS last_contact_at timestamptz;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS score smallint DEFAULT 0;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS notes text;


-- ============================================================
-- 4. EXTEND eventos_producto TABLE
-- ============================================================
-- Original columns: id, lot_id, page_path, viewed_at
-- Adding: event_type, session_id, user_agent, referrer, time_on_page_ms, metadata

ALTER TABLE eventos_producto ADD COLUMN IF NOT EXISTS event_type text NOT NULL DEFAULT 'page_view';
ALTER TABLE eventos_producto ADD COLUMN IF EXISTS session_id text;
ALTER TABLE eventos_producto ADD COLUMN IF EXISTS user_agent text;
ALTER TABLE eventos_producto ADD COLUMN IF EXISTS referrer text;
ALTER TABLE eventos_producto ADD COLUMN IF EXISTS time_on_page_ms integer;
ALTER TABLE eventos_producto ADD COLUMN IF EXISTS metadata jsonb;

CREATE INDEX IF NOT EXISTS idx_eventos_event_type ON eventos_producto(event_type);
CREATE INDEX IF NOT EXISTS idx_eventos_lot_id ON eventos_producto(lot_id);
CREATE INDEX IF NOT EXISTS idx_eventos_session_id ON eventos_producto(session_id);
CREATE INDEX IF NOT EXISTS idx_eventos_created_at ON eventos_producto(viewed_at);
CREATE INDEX IF NOT EXISTS idx_eventos_metadata ON eventos_producto USING gin (metadata);


-- ============================================================
-- 5. CREATE interacciones TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS interacciones (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  lead_id bigint NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  tipo text NOT NULL,
  canal text,
  notas text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_interacciones_lead_id ON interacciones(lead_id);
CREATE INDEX IF NOT EXISTS idx_interacciones_created_at ON interacciones(created_at);


-- ============================================================
-- 6. FUNCTIONS (using $$ blocks, no curly-quote issues)
-- ============================================================

-- 6a. is_admin helper
CREATE OR REPLACE FUNCTION is_admin(email text)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM admins WHERE admins.email = is_admin.email);
$$;

-- 6b. has_backstage_access (public-facing admin check)
CREATE OR REPLACE FUNCTION has_backstage_access(user_email text)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM admins WHERE email = user_email);
$$;

-- 6c. track_page_view (backward-compatible)
CREATE OR REPLACE FUNCTION track_page_view(p_lot_id text, p_page_path text)
RETURNS void
LANGUAGE sql SECURITY DEFINER
SET search_path = public
AS $$
  INSERT INTO eventos_producto (lot_id, page_path, event_type)
  VALUES (p_lot_id, p_page_path, 'page_view');
$$;

-- 6d. submit_lead (extended with optional UTM/channel/lot_id)
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
LANGUAGE sql SECURITY DEFINER
SET search_path = public
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

-- 6e. track_event (general event tracking)
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
LANGUAGE sql SECURITY DEFINER
SET search_path = public
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

-- 6f. update_lead_stage
CREATE OR REPLACE FUNCTION update_lead_stage(
  p_lead_id bigint,
  p_new_stage text,
  p_notas text DEFAULT NULL
)
RETURNS void
LANGUAGE sql SECURITY DEFINER
SET search_path = public
AS $$
  UPDATE leads
  SET funnel_stage = p_new_stage,
      last_contact_at = now()
  WHERE id = p_lead_id;

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

-- 6g. refresh_lotes_metricas
CREATE OR REPLACE FUNCTION refresh_lotes_metricas()
RETURNS void
LANGUAGE sql SECURITY DEFINER
SET search_path = public
AS $$
  REFRESH MATERIALIZED VIEW CONCURRENTLY lotes_metricas;
$$;


-- ============================================================
-- 7. MATERIALIZED VIEW: lotes_metricas
-- ============================================================
-- IMPORTANT: eventos_producto uses viewed_at (NOT created_at)

CREATE MATERIALIZED VIEW IF NOT EXISTS lotes_metricas AS
SELECT
  l.id AS lot_id,
  l.status,
  l.area_m2,
  l.price,
  COUNT(DISTINCT ev.id) FILTER (WHERE ev.event_type IN ('page_view','lote_visto')) AS total_vistas,
  COUNT(DISTINCT ev.id) FILTER (WHERE ev.event_type = 'lote_favorito') AS total_favoritos,
  COUNT(DISTINCT ev.id) FILTER (WHERE ev.event_type = 'contacto_iniciado') AS contactos_iniciados,
  COUNT(DISTINCT le.id) AS total_leads,
  COUNT(DISTINCT le.id) FILTER (WHERE le.funnel_stage = 'cerrado_ganado') AS ventas,
  CASE WHEN COUNT(DISTINCT ev.id) FILTER (WHERE ev.event_type IN ('page_view','lote_visto')) > 0
    THEN ROUND(
      COUNT(DISTINCT le.id)::numeric /
      NULLIF(COUNT(DISTINCT ev.id) FILTER (WHERE ev.event_type IN ('page_view','lote_visto')), 0) * 100,
      1
    )
    ELSE 0
  END AS tasa_conversion_pct,
  CASE WHEN COUNT(DISTINCT le.id) > 0
    THEN ROUND(
      COUNT(DISTINCT le.id) FILTER (WHERE le.funnel_stage = 'cerrado_ganado')::numeric /
      COUNT(DISTINCT le.id) * 100,
      1
    )
    ELSE 0
  END AS tasa_cierre_pct,
  ROUND(AVG(ev.time_on_page_ms) / 1000.0, 1) AS avg_time_on_page_s,
  MIN(ev.viewed_at) FILTER (WHERE ev.event_type IN ('page_view','lote_visto')) AS primera_vista_at,
  MAX(ev.viewed_at) FILTER (WHERE ev.event_type IN ('page_view','lote_visto')) AS ultima_vista_at,
  EXTRACT(DAY FROM now() - MIN(ev.viewed_at)) AS dias_en_mercado
FROM lots l
LEFT JOIN eventos_producto ev ON ev.lot_id = l.id
LEFT JOIN leads le ON le.lot_id = l.id
GROUP BY l.id, l.status, l.area_m2, l.price
WITH DATA;

CREATE UNIQUE INDEX IF NOT EXISTS idx_lotes_metricas_lot_id ON lotes_metricas(lot_id);


-- ============================================================
-- 8. EXPORT VIEWS
-- ============================================================

-- 8a. vista_export_leads
CREATE OR REPLACE VIEW vista_export_leads AS
SELECT
  l.id AS lead_id,
  l.name AS nombre,
  l.email AS correo,
  l.phone AS telefono,
  l.message AS mensaje,
  l.source_channel AS canal_adquisicion,
  l.funnel_stage AS etapa_embudo,
  l.score AS score_calidad,
  l.notes AS notas_internas,
  l.lot_id AS lote_interes,
  lo.area_m2 AS lote_area_m2,
  lo.price AS lote_precio,
  lo.status AS lote_estado,
  l.budget_min AS presupuesto_min,
  l.budget_max AS presupuesto_max,
  l.interest_location AS ubicacion_interes,
  l.utm_source AS utm_fuente,
  l.utm_medium AS utm_medio,
  l.utm_campaign AS utm_campana,
  l.created_at AS fecha_creacion,
  l.last_contact_at AS ultimo_contacto,
  EXTRACT(DAY FROM now() - l.created_at) AS dias_desde_creacion,
  (SELECT count(*) FROM interacciones i WHERE i.lead_id = l.id) AS total_interacciones,
  (SELECT i.tipo FROM interacciones i WHERE i.lead_id = l.id ORDER BY i.created_at DESC LIMIT 1) AS ultima_interaccion_tipo,
  (SELECT i.created_at FROM interacciones i WHERE i.lead_id = l.id ORDER BY i.created_at DESC LIMIT 1) AS ultima_interaccion_fecha
FROM leads l
LEFT JOIN lots lo ON lo.id = l.lot_id
ORDER BY l.created_at DESC;

-- 8b. vista_export_events
CREATE OR REPLACE VIEW vista_export_events AS
SELECT
  e.id AS evento_id,
  e.event_type AS tipo_evento,
  e.lot_id AS lote,
  e.page_path AS ruta_pagina,
  e.session_id AS sesion,
  e.time_on_page_ms AS tiempo_pagina_ms,
  ROUND((e.time_on_page_ms / 1000.0)::numeric, 1) AS tiempo_pagina_s,
  e.user_agent AS agente_usuario,
  e.referrer AS referente,
  e.viewed_at AS fecha_evento,
  EXTRACT(DAY FROM now() - e.viewed_at) AS dias_desde_evento,
  (e.metadata ->> 'utm_source') AS utm_fuente,
  (e.metadata ->> 'utm_medium') AS utm_medio,
  (e.metadata ->> 'utm_campaign') AS utm_campana,
  (e.metadata ->> 'channel') AS canal_contacto,
  e.metadata::text AS metadata_texto
FROM eventos_producto e
ORDER BY e.viewed_at DESC;

-- 8c. vista_export_funnel
CREATE OR REPLACE VIEW vista_export_funnel AS
SELECT
  l.id AS lead_id,
  l.name AS nombre,
  l.email AS correo,
  l.source_channel AS canal,
  l.funnel_stage AS etapa,
  l.score AS score,
  l.lot_id AS lote,
  l.created_at AS fecha_lead,
  l.utm_source AS utm_fuente,
  l.utm_medium AS utm_medio,
  l.utm_campaign AS utm_campana,
  lo.area_m2 AS lote_area,
  lo.price AS lote_precio,
  EXTRACT(DAY FROM now() - l.created_at) AS dias_en_embudo
FROM leads l
LEFT JOIN lots lo ON lo.id = l.lot_id
ORDER BY l.created_at DESC;


-- ============================================================
-- 9. ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE lots ENABLE ROW LEVEL SECURITY;
ALTER TABLE eventos_producto ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE interacciones ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read available lots" ON lots;
DROP POLICY IF EXISTS "Admin all lots" ON lots;
DROP POLICY IF EXISTS "Admin read page_views" ON eventos_producto;
DROP POLICY IF EXISTS "Admin read leads" ON leads;
DROP POLICY IF EXISTS "Admin all leads" ON leads;
DROP POLICY IF EXISTS "Admin read admins" ON admins;
DROP POLICY IF EXISTS "Admin all interacciones" ON interacciones;
DROP POLICY IF EXISTS "Admin all eventos_producto" ON eventos_producto;

CREATE POLICY "Public read available lots"
  ON lots FOR SELECT TO anon
  USING (status = 'disponible');

CREATE POLICY "Admin all lots"
  ON lots FOR ALL TO authenticated
  USING (is_admin(auth.jwt()->>'email'))
  WITH CHECK (is_admin(auth.jwt()->>'email'));

CREATE POLICY "Admin read eventos"
  ON eventos_producto FOR SELECT TO authenticated
  USING (is_admin(auth.jwt()->>'email'));

CREATE POLICY "Admin all leads"
  ON leads FOR ALL TO authenticated
  USING (is_admin(auth.jwt()->>'email'))
  WITH CHECK (is_admin(auth.jwt()->>'email'));

CREATE POLICY "Admin read admins"
  ON admins FOR SELECT TO authenticated
  USING (is_admin(auth.jwt()->>'email'));

CREATE POLICY "Admin all interacciones"
  ON interacciones FOR ALL TO authenticated
  USING (is_admin(auth.jwt()->>'email'))
  WITH CHECK (is_admin(auth.jwt()->>'email'));

REVOKE EXECUTE ON FUNCTION is_admin(text) FROM public, anon, authenticated;
REVOKE EXECUTE ON FUNCTION update_lead_stage(bigint,text,text) FROM public, anon, authenticated;
REVOKE EXECUTE ON FUNCTION refresh_lotes_metricas() FROM public, anon, authenticated;


-- ============================================================
-- 10. SEED DATA
-- ============================================================

INSERT INTO admins (email, role_name)
VALUES ('ingesoctic@gmail.com', 'admin')
ON CONFLICT (email) DO NOTHING;


-- ============================================================
-- DONE! Run verification queries:
--
-- SELECT table_name FROM information_schema.tables
--   WHERE table_name IN ('admins','lots','leads','eventos_producto','interacciones');
--
-- SELECT column_name FROM information_schema.columns
--   WHERE table_name = 'leads' ORDER BY ordinal_position;
--
-- SELECT * FROM lotes_metricas LIMIT 5;
--
-- SELECT table_name FROM information_schema.views
--   WHERE table_name LIKE 'vista_export_%';
-- ============================================================

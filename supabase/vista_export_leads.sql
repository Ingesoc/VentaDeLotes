-- ============================================================
-- VISTA DE EXPORTACIÓN: Leads completos
-- La Holanda — VentaDeLotes
-- ============================================================
-- Esta vista produce una tabla plana (flat) lista para exportar
-- como CSV o Parquet. Incluye:
--   - Datos del lead (nombre, email, teléfono, canal, etapa)
--   - Datos del lote de interés (área, precio, estado)
--   - Métricas de engagement (interacciones, último contacto)
--   - Datos UTM para atribución
--
-- Uso desde Supabase SQL Editor:
--   SELECT * FROM vista_export_leads;
--
-- Uso desde Python (supabase-py):
--   data = supabase.table("vista_export_leads").select("*").execute()
--
-- Uso desde R/Julia (DBI):
--   dbGetQuery(con, "SELECT * FROM vista_export_leads")
-- ============================================================

DROP VIEW IF EXISTS vista_export_leads;

CREATE OR REPLACE VIEW vista_export_leads AS
SELECT
  -- ── Datos del lead ──────────────────────────────────────
  l.id AS lead_id,
  l.name AS nombre,
  l.email AS correo,
  l.phone AS telefono,
  l.message AS mensaje,

  -- ── Canal y embudo ─────────────────────────────────────
  l.source_channel AS canal_adquisicion,
  l.funnel_stage AS etapa_embudo,
  l.score AS score_calidad,
  l.notes AS notas_internas,

  -- ── Lote de interés ────────────────────────────────────
  l.lot_id AS lote_interes,
  lo.area_m2 AS lote_area_m2,
  lo.price AS lote_precio,
  lo.status AS lote_estado,

  -- ── Presupuesto ────────────────────────────────────────
  l.budget_min AS presupuesto_min,
  l.budget_max AS presupuesto_max,
  l.interest_location AS ubicacion_interes,

  -- ── UTM / Atribución ──────────────────────────────────
  l.utm_source AS utm_fuente,
  l.utm_medium AS utm_medio,
  l.utm_campaign AS utm_campana,

  -- ── Timestamps ─────────────────────────────────────────
  l.created_at AS fecha_creacion,
  l.last_contact_at AS ultimo_contacto,
  EXTRACT(DAY FROM now() - l.created_at) AS dias_desde_creacion,

  -- ── Conteo de interacciones ────────────────────────────
  (SELECT count(*) FROM interacciones i WHERE i.lead_id = l.id)
    AS total_interacciones,
  (SELECT count(*) FROM interacciones i
   WHERE i.lead_id = l.id AND i.tipo = 'llamada')
    AS total_llamadas,
  (SELECT count(*) FROM interacciones i
   WHERE i.lead_id = l.id AND i.tipo = 'mensaje_whatsapp')
    AS total_whatsapp,
  (SELECT count(*) FROM interacciones i
   WHERE i.lead_id = l.id AND i.tipo = 'visita_lote')
    AS total_visitas_lote,

  -- ── Última interacción ─────────────────────────────────
  (SELECT i.tipo FROM interacciones i
   WHERE i.lead_id = l.id
   ORDER BY i.created_at DESC LIMIT 1)
    AS ultima_interaccion_tipo,
  (SELECT i.created_at FROM interacciones i
   WHERE i.lead_id = l.id
   ORDER BY i.created_at DESC LIMIT 1)
    AS ultima_interaccion_fecha

FROM leads l
LEFT JOIN lots lo ON lo.id = l.lot_id
ORDER BY l.created_at DESC;


-- ============================================================
-- VISTA DE EXPORTACIÓN: Eventos de producto (plana)
-- ============================================================
-- Exporta cada evento con los campos UTM extraídos del metadata.
-- Ideal para análisis de comportamiento y atribución.

DROP VIEW IF EXISTS vista_export_events;

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

  -- Extraer UTM del metadata JSONB
  (e.metadata ->> 'utm_source') AS utm_fuente,
  (e.metadata ->> 'utm_medium') AS utm_medio,
  (e.metadata ->> 'utm_campaign') AS utm_campana,

  -- Extraer channel del metadata (si existe)
  (e.metadata ->> 'channel') AS canal_contacto,

  -- Metadata completo como texto (para inspección)
  e.metadata::text AS metadata_texto

FROM eventos_producto e
ORDER BY e.viewed_at DESC;


-- ============================================================
-- VISTA DE EXPORTACIÓN: Funnel completo (leads + eventos)
-- ============================================================
-- Vista wide que cruza leads con sus eventos para análisis
-- de atribución multicanal y cohortes.

DROP VIEW IF EXISTS vista_export_funnel;

CREATE OR REPLACE VIEW vista_export_funnel AS
SELECT
  -- Lead
  l.id AS lead_id,
  l.name AS nombre,
  l.email AS correo,
  l.source_channel AS canal,
  l.funnel_stage AS etapa,
  l.score AS score,
  l.lot_id AS lote,
  l.created_at AS fecha_lead,

  -- Primer evento del lead (por session_id)
  (SELECT e.event_type FROM eventos_producto e
   WHERE e.session_id IS NOT NULL
     AND e.viewed_at <= l.created_at + interval '1 hour'
   ORDER BY e.viewed_at DESC LIMIT 1)
    AS primer_evento,
  (SELECT e.page_path FROM eventos_producto e
   WHERE e.session_id IS NOT NULL
     AND e.viewed_at <= l.created_at + interval '1 hour'
   ORDER BY e.viewed_at DESC LIMIT 1)
    AS primera_ruta,
  (e_ref.metadata ->> 'utm_source') AS utm_fuente,
  (e_ref.metadata ->> 'utm_medium') AS utm_medio,
  (e_ref.metadata ->> 'utm_campaign') AS utm_campana,

  -- Métricas de lote
  lo.area_m2 AS lote_area,
  lo.price AS lote_precio,

  -- Tiempo en embudo
  EXTRACT(DAY FROM now() - l.created_at) AS dias_en_embudo

FROM leads l
LEFT JOIN lots lo ON lo.id = l.lot_id
LEFT JOIN eventos_producto e_ref ON e_ref.session_id IS NOT NULL
  AND e_ref.viewed_at <= l.created_at + interval '1 hour'
  AND e_ref.id = (
    SELECT e2.id FROM eventos_producto e2
    WHERE e2.session_id IS NOT NULL
      AND e2.viewed_at <= l.created_at + interval '1 hour'
    ORDER BY e2.viewed_at DESC LIMIT 1
  )
ORDER BY l.created_at DESC;

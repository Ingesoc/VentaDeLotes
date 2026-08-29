-- ============================================================
-- MIGRACIÓN: RPC get_admin_stats para el Dashboard
-- La Holanda — VentaDeLotes
-- ============================================================
-- Fecha: 2026-08-29
-- Autor: Buffy (Codebuff)
--
-- Crea la función RPC get_admin_stats() que devuelve todas las
-- estadísticas del dashboard admin en una sola llamada:
--   - KPIs: total lots, total leads, total views, lots with views
--   - Series de 14 días: views by day, leads by day (con días en 0)
--   - Distribución de inventario por estado
--   - Top N lotes más visitados
--   - Últimos N leads
--
-- Seguridad: SECURITY DEFINER — solo accesible para usuarios
-- que pasen has_backstage_access(). Devuelve NULL si no tiene acceso.
--
-- Ejecutar en: Supabase Dashboard → SQL Editor → New query → Run
-- ============================================================

CREATE OR REPLACE FUNCTION public.get_admin_stats(
  p_days integer DEFAULT 14,
  p_top_lots integer DEFAULT 5,
  p_recent_leads integer DEFAULT 5
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_result jsonb;
  v_auth_email text;
  v_start_date timestamptz;
  v_has_access boolean;
BEGIN
  -- Obtener el email del usuario autenticado
  v_auth_email := auth.jwt()->>'email';

  -- Verificar acceso
  SELECT has_backstage_access(v_auth_email) INTO v_has_access;

  IF NOT v_has_access THEN
    RETURN NULL;
  END IF;

  -- Fecha de inicio para las series de tiempo
  v_start_date := date_trunc('day', now()) - (p_days || ' days')::interval;

  -- Agregar todo en un solo objeto JSONB
  WITH
  -- 1. KPIs
  kpis AS (
    SELECT
      (SELECT count(*) FROM lots) AS total_lots,
      (SELECT count(*) FROM leads) AS total_leads,
      (SELECT count(*) FROM eventos_producto) AS total_views,
      (SELECT count(DISTINCT lot_id) FROM eventos_producto WHERE lot_id IS NOT NULL) AS lots_with_views
  ),

  -- 2. Vista de series de tiempo completa (todos los días, incluyendo los vacíos)
  -- Generamos los días usando generate_series y left join con los datos reales
  views_series AS (
    SELECT
      to_char(d.day, 'DD Mon') AS label,
      COALESCE(count(e.id), 0)::int AS count
    FROM generate_series(
      date_trunc('day', now()) - (p_days - 1 || ' days')::interval,
      date_trunc('day', now()),
      '1 day'::interval
    ) d(day)
    LEFT JOIN eventos_producto e
      ON date_trunc('day', e.viewed_at) = d.day
    GROUP BY d.day
    ORDER BY d.day
  ),

  -- 3. Leads por día (con días vacíos en 0)
  leads_series AS (
    SELECT
      to_char(d.day, 'DD Mon') AS label,
      COALESCE(count(l.id), 0)::int AS count
    FROM generate_series(
      date_trunc('day', now()) - (p_days - 1 || ' days')::interval,
      date_trunc('day', now()),
      '1 day'::interval
    ) d(day)
    LEFT JOIN leads l
      ON date_trunc('day', l.created_at) = d.day
    GROUP BY d.day
    ORDER BY d.day
  ),

  -- 4. Distribución por estado
  lots_by_status AS (
    SELECT
      jsonb_agg(
        jsonb_build_object('label', s.label, 'count', s.count)
      ) AS data
    FROM (
      SELECT
        CASE status
          WHEN 'disponible' THEN 'Disponible'
          WHEN 'reservado' THEN 'Reservado'
          WHEN 'vendido' THEN 'Vendido'
          WHEN 'no_disponible' THEN 'No disponible'
          ELSE status
        END AS label,
        count(*)::int AS count
      FROM lots
      GROUP BY status
      ORDER BY count DESC
    ) s
  ),

  -- 5. Top N lotes más visitados
  top_lots AS (
    SELECT
      jsonb_agg(
        jsonb_build_object('lot_id', t.lot_id, 'views', t.views)
      ) AS data
    FROM (
      SELECT lot_id, count(*)::int AS views
      FROM eventos_producto
      WHERE lot_id IS NOT NULL
      GROUP BY lot_id
      ORDER BY views DESC
      LIMIT p_top_lots
    ) t
  ),

  -- 6. Últimos N leads
  recent_leads AS (
    SELECT
      jsonb_agg(
        jsonb_build_object(
          'name', r.name,
          'email', r.email,
          'created_at', r.created_at::text
        )
      ) AS data
    FROM (
      SELECT name, email, created_at
      FROM leads
      ORDER BY created_at DESC
      LIMIT p_recent_leads
    ) r
  )

  SELECT jsonb_build_object(
    'total_lots', (SELECT total_lots FROM kpis),
    'total_leads', (SELECT total_leads FROM kpis),
    'total_views', (SELECT total_views FROM kpis),
    'lots_with_views', (SELECT lots_with_views FROM kpis),
    'views_by_day', (SELECT jsonb_agg(jsonb_build_object('label', v.label, 'count', v.count)) FROM views_series v),
    'leads_by_day', (SELECT jsonb_agg(jsonb_build_object('label', l.label, 'count', l.count)) FROM leads_series l),
    'lots_by_status', COALESCE((SELECT data FROM lots_by_status), '[]'::jsonb),
    'top_lots', COALESCE((SELECT data FROM top_lots), '[]'::jsonb),
    'recent_leads', COALESCE((SELECT data FROM recent_leads), '[]'::jsonb)
  ) INTO v_result;

  RETURN v_result;
END;
$$;

-- ============================================================
-- REVOCAR acceso directo — solo a través de Supabase client
-- con autenticación válida
-- ============================================================
REVOKE EXECUTE ON FUNCTION public.get_admin_stats(integer, integer, integer) FROM public, anon;
GRANT EXECUTE ON FUNCTION public.get_admin_stats(integer, integer, integer) TO authenticated;

-- ============================================================
-- VERIFICACIÓN (opcional — descomentar para validar)
-- ============================================================
-- SELECT public.get_admin_stats(14, 5, 5);

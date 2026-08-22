-- ============================================================
-- RECREAR ESQUEMA COMPLETO — La Holanda (panel de administración)
-- ============================================================
-- Ejecutar TODO este script una sola vez en:
--   Supabase Dashboard → SQL Editor → New query → Run
--
-- Recrea las tablas, funciones RPC, RLS y datos base del proyecto.
-- Es idempotente: puedes re-ejecutarlo sin errores.
--
-- Después de ejecutarlo:
--   1. Verifica que el usuario ingesoctic@gmail.com exista en
--      Authentication → Users (si no, créalo con "Add user").
--   2. Inicia sesión en /admin/login con ese email.
-- ============================================================

-- ── 1. TABLAS ──────────────────────────────────────────────

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
    CHECK (status IN ('disponible', 'reservado', 'vendido', 'no_disponible')),
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

-- ── 2. FUNCIONES RPC (SECURITY DEFINER con search_path fijo) ─

CREATE OR REPLACE FUNCTION is_admin(email text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT EXISTS (SELECT 1 FROM admins WHERE admins.email = is_admin.email);
$$;

CREATE OR REPLACE FUNCTION has_backstage_access(user_email text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT EXISTS (SELECT 1 FROM admins WHERE email = user_email);
$$;

CREATE OR REPLACE FUNCTION track_page_view(p_lot_id text, p_page_path text)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = 'public'
AS $$
  INSERT INTO page_views (lot_id, page_path) VALUES (p_lot_id, p_page_path);
$$;

CREATE OR REPLACE FUNCTION submit_lead(p_name text, p_email text, p_phone text, p_message text DEFAULT NULL)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = 'public'
AS $$
  INSERT INTO leads (name, email, phone, message) VALUES (p_name, p_email, p_phone, p_message);
$$;

-- ── 3. ROW LEVEL SECURITY ─────────────────────────────────

ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE lots ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- (Se dropean antes de crear para que el script sea re-ejecutable)
DROP POLICY IF EXISTS "Public read available lots" ON lots;
DROP POLICY IF EXISTS "Admin all lots" ON lots;
DROP POLICY IF EXISTS "Admin read page_views" ON page_views;
DROP POLICY IF EXISTS "Admin read leads" ON leads;
DROP POLICY IF EXISTS "Admin read admins" ON admins;
DROP POLICY IF EXISTS "Public insert page_views" ON page_views;
DROP POLICY IF EXISTS "Public insert leads" ON leads;
DROP POLICY IF EXISTS "Allow anonymous inserts" ON leads;

-- Público: solo puede leer lotes disponibles.
-- Nota: los lotes con status 'no_disponible' (p. ej. el lote 01) NO aparecen
-- en el sitio público por esta política — es el comportamiento deseado.
CREATE POLICY "Public read available lots"
  ON lots FOR SELECT
  TO anon
  USING (status = 'disponible');

-- Las escrituras públicas van por RPC (submit_lead, track_page_view),
-- que usan SECURITY DEFINER y no exponen nombres de tablas.

-- Admin: acceso total a lots
CREATE POLICY "Admin all lots"
  ON lots FOR ALL
  TO authenticated
  USING (is_admin(auth.jwt()->>'email'))
  WITH CHECK (is_admin(auth.jwt()->>'email'));

-- Admin: lectura de page_views y leads
CREATE POLICY "Admin read page_views"
  ON page_views FOR SELECT
  TO authenticated
  USING (is_admin(auth.jwt()->>'email'));

CREATE POLICY "Admin read leads"
  ON leads FOR SELECT
  TO authenticated
  USING (is_admin(auth.jwt()->>'email'));

-- Admin: lectura de admins (con la función SECURITY DEFINER se evita recursión)
CREATE POLICY "Admin read admins"
  ON admins FOR SELECT
  TO authenticated
  USING (is_admin(auth.jwt()->>'email'));

-- ── 4. SEGURIDAD ──────────────────────────────────────────
-- is_admin() es solo de uso interno en políticas; el cliente usa
-- has_backstage_access(). Se revoca EXECUTE para no exponerla.

REVOKE EXECUTE ON FUNCTION is_admin(text) FROM public, anon, authenticated;

-- ── 5. SEED: ADMIN ────────────────────────────────────────
-- El email debe existir también en Authentication → Users.

INSERT INTO admins (email, role_name)
VALUES ('ingesoctic@gmail.com', 'admin')
ON CONFLICT (email) DO NOTHING;

-- ── 6. SEED: LOTES (datos actuales con URLs de Cloudinary) ─

INSERT INTO lots (id, area_m2, price, status, aerial_image, perspective_image, shared_aerial_with, topography, view_text, access)
VALUES
  ('01', 8910.37, NULL,      'no_disponible', 'https://res.cloudinary.com/j5a9xyaq/image/upload/v1784946345/laholanda/lots/loteo-general-drone.jpg',        'https://res.cloudinary.com/j5a9xyaq/image/upload/v1784946353/laholanda/lots/perspectiva-lotes-1-10-11-12-drone.jpg', NULL, NULL, NULL, NULL),
  ('02', 2008,    189242850, 'disponible',    'https://res.cloudinary.com/j5a9xyaq/image/upload/v1784946305/laholanda/lots/lote-02-03-drone.jpg',    'https://res.cloudinary.com/j5a9xyaq/image/upload/v1784946349/laholanda/lots/perspectiva-general-drone.jpg', '03', NULL, NULL, NULL),
  ('03', 2013,    185619550, 'disponible',    'https://res.cloudinary.com/j5a9xyaq/image/upload/v1784946305/laholanda/lots/lote-02-03-drone.jpg',    'https://res.cloudinary.com/j5a9xyaq/image/upload/v1784946349/laholanda/lots/perspectiva-general-drone.jpg', '02', NULL, NULL, NULL),
  ('04', 2004,    165570750, 'disponible',    'https://res.cloudinary.com/j5a9xyaq/image/upload/v1784946309/laholanda/lots/lote-04-05-drone.jpg',    'https://res.cloudinary.com/j5a9xyaq/image/upload/v1784946349/laholanda/lots/perspectiva-general-drone.jpg', '05', NULL, NULL, NULL),
  ('05', 2005,    169412550, 'disponible',    'https://res.cloudinary.com/j5a9xyaq/image/upload/v1784946309/laholanda/lots/lote-04-05-drone.jpg',    'https://res.cloudinary.com/j5a9xyaq/image/upload/v1784946349/laholanda/lots/perspectiva-general-drone.jpg', '04', NULL, NULL, NULL),
  ('06', 2005,    158822900, 'disponible',    'https://res.cloudinary.com/j5a9xyaq/image/upload/v1784946328/laholanda/lots/lote-06-drone.jpg',     'https://res.cloudinary.com/j5a9xyaq/image/upload/v1784946349/laholanda/lots/perspectiva-general-drone.jpg', NULL, NULL, NULL, NULL),
  ('07', 2010,    159082250, 'disponible',    'https://res.cloudinary.com/j5a9xyaq/image/upload/v1784946331/laholanda/lots/lote-07-08-drone.jpg',    'https://res.cloudinary.com/j5a9xyaq/image/upload/v1784946349/laholanda/lots/perspectiva-general-drone.jpg', '08', NULL, NULL, NULL),
  ('08', 2005,    184469100, 'disponible',    'https://res.cloudinary.com/j5a9xyaq/image/upload/v1784946331/laholanda/lots/lote-07-08-drone.jpg',    'https://res.cloudinary.com/j5a9xyaq/image/upload/v1784946349/laholanda/lots/perspectiva-general-drone.jpg', '07', 'Ondulada suave', 'Panorámica al valle', 'Directo principal'),
  ('09', 2011,    189883150, 'disponible',    'https://res.cloudinary.com/j5a9xyaq/image/upload/v1784946336/laholanda/lots/lote-09-drone.jpg',     'https://res.cloudinary.com/j5a9xyaq/image/upload/v1784946349/laholanda/lots/perspectiva-general-drone.jpg', NULL, NULL, NULL, NULL),
  ('10', 2966,    NULL,      'disponible',    'https://res.cloudinary.com/j5a9xyaq/image/upload/v1784946345/laholanda/lots/loteo-general-drone.jpg',        'https://res.cloudinary.com/j5a9xyaq/image/upload/v1784946353/laholanda/lots/perspectiva-lotes-1-10-11-12-drone.jpg', NULL, NULL, NULL, NULL),
  ('11', 2502,    237690000, 'disponible',    'https://res.cloudinary.com/j5a9xyaq/image/upload/v1784946345/laholanda/lots/loteo-general-drone.jpg',        'https://res.cloudinary.com/j5a9xyaq/image/upload/v1784946353/laholanda/lots/perspectiva-lotes-1-10-11-12-drone.jpg', NULL, NULL, NULL, NULL),
  ('12', 2456,    233320000, 'disponible',    'https://res.cloudinary.com/j5a9xyaq/image/upload/v1784946345/laholanda/lots/loteo-general-drone.jpg',        'https://res.cloudinary.com/j5a9xyaq/image/upload/v1784946353/laholanda/lots/perspectiva-lotes-1-10-11-12-drone.jpg', NULL, NULL, NULL, NULL),
  ('13', 3216,    305520000, 'disponible',    'https://res.cloudinary.com/j5a9xyaq/image/upload/v1784946340/laholanda/lots/lote-13-14-drone.jpg',    'https://res.cloudinary.com/j5a9xyaq/image/upload/v1784946357/laholanda/lots/perspectiva-lotes-13-14-drone.jpg', NULL, NULL, NULL, NULL),
  ('14', 2518,    239210000, 'disponible',    'https://res.cloudinary.com/j5a9xyaq/image/upload/v1784946340/laholanda/lots/lote-13-14-drone.jpg',    'https://res.cloudinary.com/j5a9xyaq/image/upload/v1784946357/laholanda/lots/perspectiva-lotes-13-14-drone.jpg', NULL, NULL, NULL, NULL),
  ('15', 2908,    NULL,      'disponible',    'https://res.cloudinary.com/j5a9xyaq/image/upload/v1784946345/laholanda/lots/loteo-general-drone.jpg',        'https://res.cloudinary.com/j5a9xyaq/image/upload/v1784946349/laholanda/lots/perspectiva-general-drone.jpg', NULL, NULL, NULL, NULL),
  ('16', 6689,    NULL,      'disponible',    'https://res.cloudinary.com/j5a9xyaq/image/upload/v1784946345/laholanda/lots/loteo-general-drone.jpg',        'https://res.cloudinary.com/j5a9xyaq/image/upload/v1784946349/laholanda/lots/perspectiva-general-drone.jpg', NULL, NULL, NULL, NULL)
ON CONFLICT (id) DO UPDATE SET
  area_m2            = EXCLUDED.area_m2,
  price              = EXCLUDED.price,
  status             = EXCLUDED.status,
  aerial_image       = EXCLUDED.aerial_image,
  perspective_image  = EXCLUDED.perspective_image,
  shared_aerial_with = EXCLUDED.shared_aerial_with,
  topography         = EXCLUDED.topography,
  view_text          = EXCLUDED.view_text,
  access             = EXCLUDED.access;

-- ── 7. VERIFICACIÓN (opcional) ────────────────────────────
-- SELECT 'admins'    AS tabla, count(*) FROM admins
-- UNION ALL SELECT 'lots',       count(*) FROM lots
-- UNION ALL SELECT 'page_views', count(*) FROM page_views
-- UNION ALL SELECT 'leads',      count(*) FROM leads;

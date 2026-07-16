-- ============================================================
-- Migration: Admin system for Verdant Horizon
-- ============================================================

-- 1. Admin users table
CREATE TABLE IF NOT EXISTS admins (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email text UNIQUE NOT NULL,
  role_name text NOT NULL DEFAULT 'admin',
  created_at timestamptz DEFAULT now()
);

-- 2. Lots table (mirrors the static TypeScript data)
CREATE TABLE IF NOT EXISTS lots (
  id text PRIMARY KEY,
  area_m2 numeric,
  price bigint,
  status text NOT NULL DEFAULT 'disponible' CHECK (status IN ('disponible', 'reservado', 'vendido')),
  aerial_image text,
  perspective_image text,
  topography text,
  view_text text,
  access text,
  shared_aerial_with text,
  updated_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- 3. Page views for tracking lot visits
CREATE TABLE IF NOT EXISTS page_views (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  lot_id text REFERENCES lots(id) ON DELETE CASCADE,
  page_path text NOT NULL,
  viewed_at timestamptz DEFAULT now()
);

-- 4. Leads table policies (must be created after the leads table exists)
-- If the leads table doesn't exist yet, create it:
-- CREATE TABLE IF NOT EXISTS leads (
--   id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
--   name text NOT NULL,
--   email text NOT NULL,
--   phone text NOT NULL,
--   message text,
--   created_at timestamptz DEFAULT now()
-- );

-- 5. Función helper que bypasea RLS para evitar recursión infinita
CREATE OR REPLACE FUNCTION is_admin(email text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (SELECT 1 FROM admins WHERE admins.email = is_admin.email);
$$;

-- RPC pública para que el cliente verifique acceso sin exponer nombres de tablas
CREATE OR REPLACE FUNCTION has_backstage_access(user_email text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (SELECT 1 FROM admins WHERE email = user_email);
$$;

-- RPC pública para registrar vistas de página sin exponer nombres de tablas
CREATE OR REPLACE FUNCTION track_page_view(p_lot_id text, p_page_path text)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
AS $$
  INSERT INTO page_views (lot_id, page_path) VALUES (p_lot_id, p_page_path);
$$;

-- RPC pública para enviar leads sin exponer nombres de tablas
CREATE OR REPLACE FUNCTION submit_lead(p_name text, p_email text, p_phone text, p_message text DEFAULT NULL)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
AS $$
  INSERT INTO leads (name, email, phone, message) VALUES (p_name, p_email, p_phone, p_message);
$$;

-- 6. Row Level Security
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE lots ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Public: read available lots (anyone can see available lots)
CREATE POLICY "Public read available lots"
  ON lots FOR SELECT
  TO anon
  USING (status = 'disponible');

-- Las inserciones públicas ahora se manejan mediante RPC functions (submit_lead, track_page_view)
-- que bypassan RLS con SECURITY DEFINER para no exponer nombres de tablas en el bundle.
-- Las políticas directas se eliminan para que el único camino de escritura sea via RPC.
DROP POLICY IF EXISTS "Public insert page_views" ON page_views;
DROP POLICY IF EXISTS "Public insert leads" ON leads;

-- Admin: full access on lots
CREATE POLICY "Admin all lots"
  ON lots FOR ALL
  TO authenticated
  USING (is_admin(auth.jwt()->>'email'))
  WITH CHECK (is_admin(auth.jwt()->>'email'));

-- Admin: read page_views
CREATE POLICY "Admin read page_views"
  ON page_views FOR SELECT
  TO authenticated
  USING (is_admin(auth.jwt()->>'email'));

-- Admin: read leads
CREATE POLICY "Admin read leads"
  ON leads FOR SELECT
  TO authenticated
  USING (is_admin(auth.jwt()->>'email'));

-- Admin: read admins (usa la función SECURITY DEFINER para evitar recursión)
CREATE POLICY "Admin read admins"
  ON admins FOR SELECT
  TO authenticated
  USING (is_admin(auth.jwt()->>'email'));

-- 7. Seed the initial admin user
-- Run AFTER creating the user in Supabase Auth (Authentication > Users > Add User)
-- Replace 'admin@verdanthorizon.com' with the actual admin email
-- INSERT INTO admins (email, role_name) VALUES ('admin@verdanthorizon.com', 'admin');

-- 8. Seed lot data from the static TypeScript file
INSERT INTO lots (id, area_m2, status, aerial_image, perspective_image, shared_aerial_with, topography, view_text, access)
VALUES
  ('01', NULL,    'disponible', '/lots/masterplan-render.jpg',  '/lots/perspectiva-general.jpg', NULL,  NULL,               NULL,                    NULL),
  ('02', 2008,    'disponible', '/lots/lote-02-03-aerial.jpg',  '/lots/perspectiva-general.jpg', '03',  NULL,               NULL,                    NULL),
  ('03', 2013,    'disponible', '/lots/lote-02-03-aerial.jpg',  '/lots/perspectiva-general.jpg', '02',  NULL,               NULL,                    NULL),
  ('04', 2004,    'disponible', '/lots/lote-04-05-aerial.jpg',  '/lots/perspectiva-general.jpg', '05',  NULL,               NULL,                    NULL),
  ('05', 2005,    'disponible', '/lots/lote-04-05-aerial.jpg',  '/lots/perspectiva-general.jpg', '04',  NULL,               NULL,                    NULL),
  ('06', 2005,    'disponible', '/lots/lote-06-aerial.jpg',     '/lots/perspectiva-general.jpg', NULL,  NULL,               NULL,                    NULL),
  ('07', 2010,    'disponible', '/lots/lote-07-08-aerial.jpg',  '/lots/perspectiva-general.jpg', '08',  NULL,               NULL,                    NULL),
  ('08', 2005,    'disponible', '/lots/lote-07-08-aerial.jpg',  '/lots/perspectiva-general.jpg', '07',  'Ondulada suave',  'Panorámica al valle',   'Directo principal'),
  ('09', 2011,    'disponible', '/lots/lote-09-aerial.jpg',     '/lots/perspectiva-general.jpg', NULL,  NULL,               NULL,                    NULL),
  ('10', NULL,    'disponible', '/lots/masterplan-render.jpg',  '/lots/perspectiva-general.jpg', NULL,  NULL,               NULL,                    NULL),
  ('11', NULL,    'disponible', '/lots/masterplan-render.jpg',  '/lots/perspectiva-general.jpg', NULL,  NULL,               NULL,                    NULL),
  ('12', NULL,    'disponible', '/lots/masterplan-render.jpg',  '/lots/perspectiva-general.jpg', NULL,  NULL,               NULL,                    NULL),
  ('13', NULL,    'disponible', '/lots/masterplan-render.jpg',  '/lots/perspectiva-general.jpg', NULL,  NULL,               NULL,                    NULL),
  ('14', NULL,    'disponible', '/lots/masterplan-render.jpg',  '/lots/perspectiva-general.jpg', NULL,  NULL,               NULL,                    NULL),
  ('15', NULL,    'disponible', '/lots/masterplan-render.jpg',  '/lots/perspectiva-general.jpg', NULL,  NULL,               NULL,                    NULL),
  ('16', NULL,    'disponible', '/lots/masterplan-render.jpg',  '/lots/perspectiva-general.jpg', NULL,  NULL,               NULL,                    NULL)
ON CONFLICT (id) DO UPDATE SET
  area_m2            = EXCLUDED.area_m2,
  status             = EXCLUDED.status,
  aerial_image       = EXCLUDED.aerial_image,
  perspective_image  = EXCLUDED.perspective_image,
  shared_aerial_with = EXCLUDED.shared_aerial_with,
  topography         = EXCLUDED.topography,
  view_text          = EXCLUDED.view_text,
  access             = EXCLUDED.access;

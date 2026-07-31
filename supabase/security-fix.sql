-- ============================================================
-- Security Fix: Addresses 7 Supabase Database Linter warnings
-- ============================================================
-- Run this in Supabase SQL Editor after the main migration.
-- 
-- Fixes:
--   1. function_search_path_mutable  — is_admin() sin search_path fijo
--   2-4. rls_policy_always_true (×3) — leads/page_views con INSERT sin control
--   5-6. anon/authenticated_security_definer (×2) — is_admin() expuesta al público
--   7. auth_leaked_password_protection — nota para habilitar en dashboard
-- ============================================================

-- ============================================================
-- FIX 1: Fix search_path on all SECURITY DEFINER functions
-- ============================================================
-- Sin search_path fijo, un atacante podría crear objetos en schemas
-- públicos que sobreescriban objetos del sistema (search_path injection).

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

-- ============================================================
-- FIX 2-4: Remove permissive INSERT RLS policies
-- ============================================================
-- Las inserciones ahora se manejan exclusivamente via RPC functions
-- (submit_lead, track_page_view) que bypassan RLS con SECURITY DEFINER.
-- Estas políticas directas son innecesarias y el linter las marca.

DROP POLICY IF EXISTS "Allow anonymous inserts" ON leads;
DROP POLICY IF EXISTS "Public insert leads" ON leads;
DROP POLICY IF EXISTS "Public insert page_views" ON page_views;

-- ============================================================
-- FIX 5-6: Revoke EXECUTE on internal SECURITY DEFINER functions
-- ============================================================
-- is_admin() es solo para uso interno en RLS policies.
-- Los clientes deben usar has_backstage_access() o submit_lead().
-- Revocar EXECUTE evita que anon/authenticated la llamen directamente.

REVOKE EXECUTE ON FUNCTION is_admin(text) FROM public, anon, authenticated;

-- ============================================================
-- FIX 7: Leaked password protection (Supabase Auth dashboard)
-- ============================================================
-- Para habilitar la protección contra contraseñas filtradas:
-- 1. Ir a Supabase Dashboard → Authentication → Settings
-- 2. Activar "Leaked password protection"
-- 3. Esto verifica cada contraseña contra HaveIBeenPwned.org
--    antes de permitir el registro/inicio de sesión.

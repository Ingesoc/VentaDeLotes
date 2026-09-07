-- ============================================================
-- ROLLBACK: Deshacer la migración get_admin_stats
-- ============================================================
-- Ejecutar en: Supabase Dashboard → SQL Editor → New query → Run
-- en la base de datos equivocada donde se ejecutó por error.
-- ============================================================

DROP FUNCTION IF EXISTS public.get_admin_stats(integer, integer, integer);

-- ============================================================
-- FIX: Reemplazar RLS recursivo con función SECURITY DEFINER
-- ============================================================

-- 1. Crear función que evita la recursión infinita
CREATE OR REPLACE FUNCTION is_admin(email text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (SELECT 1 FROM admins WHERE admins.email = is_admin.email);
$$;

-- 2. Eliminar la política recursiva
DROP POLICY IF EXISTS "Admin read admins" ON admins;

-- 3. Crear nueva política usando la función
CREATE POLICY "Admin read admins"
  ON admins FOR SELECT
  TO authenticated
  USING (is_admin(auth.jwt()->>'email'));

-- 4. La función SECURITY DEFINER se ejecuta con permisos del owner
--    (bypasea RLS), eliminando la recursión infinita.

-- 5. Verificar: ejecutar después de crear usuario en Authentication > Users
-- INSERT INTO admins (email, role_name) VALUES ('tu-email@ejemplo.com', 'admin');

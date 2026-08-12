---
tags:
  - auth
  - supabase
  - security
created: 2026-07-21
updated: 2026-08-12
---

# Sistema de autenticación

## Diagrama

Ver el [diagrama del sistema de autenticación](../diagrams/authentication.html) (HTML, se abre en el navegador). Muestra el contexto de AuthProvider, los servicios de Supabase Auth, la verificación del rol con `has_backstage_access` y el flujo de recuperación de contraseña.

## Arquitectura

```
AuthProvider (React Context)
  - user: User | null
  - loading: boolean
  - login(email, password)
  - logout()

Supabase Auth
  - signInWithPassword()
  - signOut()
  - getSession()
  - onAuthStateChange()

Supabase RPC
  - has_backstage_access(email)
```

## Flujo de autenticación

### 1. Inicio de sesión

1. El usuario ingresa email y contraseña en `LoginPage`.
2. `LoginPage` llama a `login()` del `AuthProvider`.
3. `AuthProvider` usa `supabase.auth.signInWithPassword()`.
4. Si el login es correcto, se verifica el rol con `checkAdminStatus()`.
5. Si es admin, navega a `/admin/dashboard`; si no, muestra un error.

### 2. Persistencia de sesión

- `supabase.auth.getSession()` verifica si hay sesión activa al cargar la app.
- `supabase.auth.onAuthStateChange()` escucha los cambios de estado (login, logout, refresh de token).
- Supabase maneja el refresh de tokens automáticamente.

### 3. Recuperación de contraseña

1. En `LoginPage`, el enlace "¿Olvidaste tu contraseña?" llama a `supabase.auth.resetPasswordForEmail(email, { redirectTo: "<origen>/reset-password" })`.
2. Supabase envía un correo con un enlace que llega con los tokens en el hash de la URL.
3. La página pública `/reset-password` (`src/pages/ResetPasswordPage.tsx`) detecta el token (`type=recovery`), espera a que supabase-js active la sesión de recuperación y muestra un formulario para la nueva contraseña (`supabase.auth.updateUser`).
4. Al guardar, redirige al login.

### 4. Admin guard

`AdminGuard` protege las rutas administrativas:

```typescript
function AdminGuard() {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    checkAdminStatus(supabase, user?.email).then(setIsAdmin);
  }, [user?.email]);

  if (isAdmin === null) return <Spinner />;          // Cargando
  if (!isAdmin) return <Navigate to="/admin/login" />; // No autorizado
  return <Outlet />;                                  // Renderiza la ruta hija
}
```

## Verificación de rol admin

La función `has_backstage_access` es una RPC de PostgreSQL (definida en `supabase/migration.sql`):

```sql
CREATE OR REPLACE FUNCTION has_backstage_access(user_email text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (SELECT 1 FROM admins WHERE email = user_email);
$$;
```

El cliente llama a esta RPC a través de `checkAdmin.ts`, que recibe el cliente de Supabase como parámetro (fácil de testear con mocks).

## Componentes

| Componente | Archivo | Propósito |
| --- | --- | --- |
| `AuthProvider` | `src/hooks/useAuth.tsx` | Context provider con la lógica de auth |
| `useAuthContext.ts` | `src/hooks/useAuthContext.ts` | Hook `useAuth()` con validación |
| `checkAdmin.ts` | `src/lib/checkAdmin.ts` | Verificación del rol admin |
| `AdminGuard.tsx` | `src/features/admin/components/AdminGuard.tsx` | Guard de rutas admin |

## Cliente de Supabase

`src/lib/supabase.ts` crea el cliente con las variables `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`. Si faltan, no bloquea el arranque de la app: usa valores provisionales y las llamadas fallan de forma controlada.

## Notificación de leads (Edge Function)

Al enviar el formulario de contacto, además de guardar el lead con la RPC `submit_lead`, el cliente invoca la Edge Function `notify-lead` (fire-and-forget) que avisa al equipo de ventas por correo vía Resend. Si la función no está desplegada, el formulario funciona igual. Más detalles en `supabase/functions/notify-lead/README.md`.

## Seguridad

1. RLS en Supabase: las tablas tienen políticas de Row Level Security.
2. Variables de entorno: los valores `VITE_*` nunca se hardcodean.
3. Verificación server-side: el rol se valida en PostgreSQL, no en el cliente.
4. Import Map: el SDK de Supabase se carga desde CDN (ver [ADR-004](../decisions/adr-004-import-map-supabase.md)).

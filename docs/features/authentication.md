---
tags:
  - auth
  - supabase
  - security
created: 2026-07-21
---

# 🔐 Sistema de Autenticación

## Arquitectura

```
┌─────────────────────────────┐
│      AuthProvider           │
│  (React Context)            │
│                             │
│  • user: User | null        │
│  • loading: boolean         │
│  • login(email, pass)       │
│  • logout()                 │
└──────────┬──────────────────┘
           │
           ▼
┌─────────────────────────────┐
│      Supabase Auth          │
│                             │
│  • signInWithPassword()     │
│  • signOut()                │
│  • getSession()             │
│  • onAuthStateChange()      │
└─────────────────────────────┘
           │
           ▼
┌─────────────────────────────┐
│    Supabase RPC             │
│                             │
│  • has_backstage_access()   │
└─────────────────────────────┘
```

## Flujo de Autenticación

### 1. Inicio de sesión
```
Usuario → LoginPage → AuthProvider.login() → Supabase Auth → Sesión creada
                                                                    │
                                               AdminGuard ← checkAdminStatus() ← user.email
                                                    │
                                               ┌────┴────┐
                                               ▼         ▼
                                          Dashboard   /admin/login
```

### 2. Persistencia de sesión
- `supabase.auth.getSession()` verifica si hay sesión activa al cargar la app
- `supabase.auth.onAuthStateChange()` escucha cambios (login, logout, token refresh)
- Supabase maneja automáticamente el refresh de tokens

### 3. Admin Guard
`AdminGuard.tsx` protege las rutas administrativas:

```typescript
function AdminGuard() {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    checkAdminStatus(supabase, user?.email).then(setIsAdmin);
  }, [user?.email]);

  if (isAdmin === null) return <Spinner />;    // Cargando
  if (!isAdmin) return <Navigate to="/login" />; // No autorizado
  return <Outlet />;                            // Renderiza ruta hija
}
```

## Verificación de Rol Admin

La función `has_backstage_access` es un **RPC de PostgreSQL** en Supabase:

```sql
-- Concepto (implementación exacta en migration.sql)
CREATE OR REPLACE FUNCTION has_backstage_access(user_email TEXT)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM admin_users WHERE email = user_email
  );
$$ LANGUAGE sql SECURITY DEFINER;
```

## Componentes

| Componente | Archivo | Propósito |
|-----------|---------|-----------|
| `AuthProvider` | `src/hooks/useAuth.tsx` | Context provider con lógica de auth |
| `useAuthContext.ts` | `src/hooks/useAuthContext.ts` | Hook `useAuth()` con validación |
| `checkAdmin.ts` | `src/lib/checkAdmin.ts` | Función para verificar rol admin |
| `AdminGuard.tsx` | `src/features/admin/components/AdminGuard.tsx` | Route guard para rutas admin |

## Estado de Auth (Context)

```typescript
interface AuthState {
  user: User | null;                    // Usuario actual o null
  loading: boolean;                      // Cargando estado inicial
  login: (email: string, password: string) => Promise<Result>;
  logout: () => Promise<void>;
}
```

## Consideraciones de Seguridad
1. **RLS en Supabase:** Las tablas tienen políticas de Row Level Security que restringen acceso
2. **Variables de entorno:** `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` nunca se hardcodean
3. **Admin verification server-side:** La función RPC se ejecuta en PostgreSQL, no en el cliente
4. **Import Map:** El SDK de Supabase se carga vía CDN (ver [ADR-004](../decisions/adr-004-import-map-supabase.md))

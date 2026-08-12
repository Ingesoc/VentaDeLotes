---
tags:
  - adr
  - authentication
  - supabase
created: 2026-07-21
status: approved
---

# ADR-003: Autenticación con Supabase

## Contexto

El proyecto requiere:

- Autenticación para el panel de administración.
- Verificación de roles (admin frente a usuario normal).
- Sesiones persistentes sin servidor propio.
- Seguridad a nivel de base de datos (RLS).
- Sin costo adicional.

## Decisión

Usar Supabase Auth como único proveedor de autenticación:

```typescript
// src/hooks/useAuth.tsx
supabase.auth.getSession().then(({ data: { session } }) => {
  updateAuthState(session?.user ?? null);
});

supabase.auth.onAuthStateChange((_event, session) => {
  updateAuthState(session?.user ?? null);
});
```

### Arquitectura

1. **AuthProvider** (`src/hooks/useAuth.tsx`): contexto de React que maneja la sesión, expone `login()`, `logout()` y el estado `user`/`loading`. Se monta en `main.tsx` y envuelve toda la app.

2. **useAuthContext.ts**: hook `useAuth()` con validación de contexto.

3. **checkAdmin.ts**: verifica el rol con la RPC `has_backstage_access(user_email)`.

4. **AdminGuard.tsx**: protege las rutas de `/admin` y redirige a `/admin/login` si el usuario no es admin.

5. **Cliente tolerante** (`src/lib/supabase.ts`): si faltan las variables de entorno, la app no se bloquea; usa valores provisionales y las llamadas fallan de forma controlada.

## Consecuencias

Ventajas:

- Sin servidor de auth propio (mantenimiento cero).
- El refresh de tokens y la persistencia los maneja Supabase.
- RLS se integra con el mismo sistema de auth.
- Tipado completo con `@supabase/supabase-js`.

Desventajas:

- Dependencia de un servicio externo.
- La verificación de admin requiere una llamada RPC adicional.
- La lógica de roles vive en la base de datos, no en el frontend.

## Alternativas consideradas

1. **Clerk:** buen DX pero costo más alto y excesivo para un admin simple.
2. **Auth0:** demasiado complejo para los requisitos.
3. **JWT manual + cookies:** requeriría un backend propio, fuera del alcance.
4. **Firebase Auth:** introduce otro proveedor; Supabase ya cubre base de datos y auth.

---
tags:
  - adr
  - authentication
  - supabase
created: 2026-07-21
status: approved
---

# ADR-003: Autenticación con Supabase Auth

## Contexto
El proyecto requiere:
- Autenticación para el panel de administración
- Verificación de roles (admin vs. no admin)
- Sesiones persistentes sin configuración de servidor propia
- Seguridad a nivel de base de datos (RLS)
- Sin costo adicional — el proyecto está en etapa temprana

## Decisión
Utilizar **Supabase Auth** como único proveedor de autenticación:

```typescript
// src/hooks/useAuth.tsx — AuthProvider
supabase.auth.getSession().then(({ data: { session } }) => {
  updateAuthState(session?.user ?? null);
});

supabase.auth.onAuthStateChange((_event, session) => {
  updateAuthState(session?.user ?? null);
});
```

### Arquitectura de Auth
1. **AuthProvider** (Context Provider en `useAuth.tsx`):
   - Maneja sesión actual y escucha cambios en tiempo real
   - Provee `login()`, `logout()` y estado `user`/`loading`
   - Se monta en `main.tsx` envuelve toda la app

2. **useAuthContext.ts**:
   - Hook `useAuth()` con validación de contexto
   - TypeScript strict: tipado completo del estado

3. **checkAdmin.ts** (verificación de rol):
   - Llama a `supabase.rpc("has_backstage_access", { user_email })`
   - RPC function en PostgreSQL que consulta una tabla de admins
   - Se ejecuta en el Admin Guard antes de renderizar rutas protegidas

4. **AdminGuard.tsx**:
   - Protege todas las rutas bajo `/admin`
   - Verifica auth + rol admin
   - Redirige a `/admin/login` si no es admin

## Consecuencias
✅ **Positivas:**
- Sin servidor propio de auth — mantenimiento cero
- Manejo de sesiones (refresh tokens, persistencia) manejado por Supabase
- RLS se integra naturalmente con el mismo sistema de auth
- Plan gratuito generoso (50,000 usuarios mensuales)
- Tipado completo con `@supabase/supabase-js`

⚠️ **Trade-offs:**
- Dependencia de un servicio externo para auth
- La verificación de admin requiere una llamada RPC separada (round-trip adicional)
- Si Supabase está caído, el admin no puede acceder
- La lógica de roles vive en la base de datos, no en el frontend

## Alternativas Consideradas
1. **Clerk:** Excelente DX pero costo más alto y overkill para un admin simple
2. **Auth0:** Demasiado complejo para los requisitos del proyecto
3. **JWT manual + cookies:** Requeriría un backend propio, fuera del alcance
4. **Firebase Auth:** Familiar pero introduce otro proveedor de cloud; Supabase ya cubre DB y auth

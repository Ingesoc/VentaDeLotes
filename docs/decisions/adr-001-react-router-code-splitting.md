---
tags:
  - adr
  - routing
  - performance
created: 2026-07-21
status: approved
---

# ADR-001: Code Splitting con React Router y Lazy Loading

## Contexto
El proyecto incluye un panel de administración con tres páginas (Login, Dashboard, Lots) que no son necesarias para la mayoría de los usuarios. Incluir todo el código administrativo en el bundle inicial:
- Aumenta el tiempo de carga inicial (~40% más de JS)
- Expone nombres de tablas y componentes administrativos en el bundle público
- Impacta negativamente el rendimiento en dispositivos móviles, crítico para el mercado objetivo

## Decisión
Implementar **code splitting estratégico** usando `React.lazy()` + `Suspense` exclusivamente para las rutas administrativas:

```typescript
const AdminLayout = lazy(() => 
  import("@/features/admin/components/AdminLayout")
    .then(m => ({ default: m.AdminLayout }))
);
const AdminGuard = lazy(() => 
  import("@/features/admin/components/AdminGuard")
    .then(m => ({ default: m.AdminGuard }))
);
```

Las rutas públicas (Home, Investment, Projects, Descubre Quindío) se importan **estáticamente** para mantener la carga instantánea.

### Detalles de Implementación
- Un solo `<Suspense>` envuelve las rutas `/admin` completas
- Fallback visual: `min-h-screen bg-deep-forest` (fondo verde oscuro sólido)
- Las rutas hijas de `/admin` comparten el mismo Suspense padre
- Las páginas admin se importan con `.then(m => ({ default: m[Component] }))` para manejar exports nombrados

## Consecuencias
✅ **Positivas:**
- Reducción del bundle inicial (~40% menos JS)
- Las rutas admin se cargan solo cuando el usuario navega a `/admin/*`
- Los nombres de componentes administrativos no aparecen en el bundle público
- Carga instantánea de páginas públicas en dispositivos móviles

⚠️ **Trade-offs:**
- Pequeña latencia al navegar a `/admin/login` por primera vez
- Complejidad adicional en la configuración del router
- El Suspense compartido significa que cualquier ruta admin activa el mismo fallback

## Alternativas Consideradas
1. **Code splitting por ruta pública:** Descartado porque el overhead de lazy loading en rutas críticas (Home) empeora la experiencia
2. **React Router `lazy` (futuro):** React Router v7 no tiene soporte estable; se reconsiderará cuando esté disponible
3. **Un solo bundle:** Rechazado por el impacto en rendimiento móvil y exposición de código administrativo

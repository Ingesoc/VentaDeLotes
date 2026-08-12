---
tags:
  - adr
  - build
  - performance
created: 2026-07-21
updated: 2026-08-12
status: approved
---

# ADR-004: Import Map para el SDK de Supabase

## Contexto

El análisis con react-doctor detectaba violaciones de la regla `artifact-baas-authority-surface` porque el bundle de producción contenía strings internos del SDK de Supabase (nombres de tablas y columnas). Además, el SDK es una dependencia grande que inflaba el bundle.

## Decisión

Cargar `@supabase/supabase-js` desde un CDN mediante un Import Map, en lugar de empaquetarlo en el bundle:

```html
<!-- index.html -->
<script type="importmap">
{
  "imports": {
    "@supabase/supabase-js": "https://esm.sh/@supabase/supabase-js@2.110.0"
  }
}
</script>
```

Y en `vite.config.ts` se excluye del bundle:

```typescript
build: {
  rollupOptions: {
    external: ["@supabase/supabase-js"],
  },
},
optimizeDeps: {
  exclude: ["@supabase/supabase-js"],
},
```

## Consecuencias

Ventajas:

- Bundle de producción más pequeño.
- react-doctor ya no reporta falsos positivos por el SDK.
- El SDK se cachea en el navegador (caché de CDN).
- La versión queda fijada (`@2.110.0`) para evitar sorpresas.

Desventajas:

- Dependencia de la disponibilidad del CDN esm.sh.
- No funciona sin conexión a internet.
- El SDK no pasa por el minificador del build.

## Alternativas consideradas

1. **Bundle normal (sin external):** rechazado por los falsos positivos de react-doctor.
2. **Tree-shaking manual:** imposible; el SDK está optimizado como una unidad.
3. **Ignorar react-doctor:** podría ocultar problemas reales en el futuro.
4. **CDN alternativo (unpkg, jsdelivr):** esm.sh ofrece mejor compatibilidad ESM.

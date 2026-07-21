---
tags:
  - adr
  - build
  - performance
created: 2026-07-21
status: approved
---

# ADR-004: Import Map para Supabase SDK vía CDN

## Contexto
El análisis con `react-doctor` detectaba violaciones de la regla `artifact-baas-authority-surface` porque el bundle de producción contenía strings internos del SDK de Supabase (como nombres de tablas y columnas). Adicionalmente, el SDK de Supabase (`@supabase/supabase-js`) es una dependencia grande que inflaba el bundle.

## Decisión
Cargar `@supabase/supabase-js` desde un **CDN vía Import Map** en lugar de empaquetarlo en el bundle:

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

Y en `vite.config.ts` se excluye del bundling:
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
✅ **Positivas:**
- Bundle de producción más pequeño (el SDK no se incluye)
- Las reglas de `react-doctor` ya no detectan falsos positivos
- El SDK se cachea en el navegador (CDN caching)
- Versión específica fijada (`@2.110.0`) — sin sorpresas

⚠️ **Trade-offs:**
- Dependencia de disponibilidad de `esm.sh` CDN
- No funciona offline (requiere conexión a internet)
- El SDK no pasa por el pipeline de build (no se minifica con el resto)
- `esm.sh` es un CDN de terceros — punto adicional de falla

## Alternativas Consideradas
1. **Bundle normal (sin external):** Rechazado por los falsos positivos de react-doctor
2. **Tree-shaking manual:** Imposible; el SDK está optimizado como una unidad
3. **Ignorar react-doctor:** Podría ocultar problemas reales en el futuro
4. **CDN alternativo (unpkg, jsdelivr):** esm.sh ofrece mejor compatibilidad ESM

---
tags:
  - adr
  - build
  - performance
created: 2026-07-21
updated: 2026-08-13
status: superseded
---

# ADR-004: Import Map para el SDK de Supabase

> **Estado: SUPERSEDED (2026-08-13).** La auditoría Lighthouse reveló que el
> Import Map encadenaba ~15 requests desde esm.sh en el camino crítico
> (~2.2s de latencia, ~260ms de preconnect). Se revirtió a bundle local con
> Vite y se desactivó la regla de react-doctor que motivó el cambio. Ver
> "Reversión" al final.

## Contexto

El análisis con react-doctor detectaba violaciones de la regla `artifact-baas-authority-surface` porque el bundle de producción contenía strings internos del SDK de Supabase (nombres de tablas y columnas). Además, el SDK es una dependencia grande que inflaba el bundle.

## Decisión (original)

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

## Consecuencias (original)

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

---

## Reversión (2026-08-13)

### Por qué

Lighthouse (13.4.0, desktop) mostró que el Import Map de esm.sh era el mayor
problema de rendimiento de la página:

- **~15 requests encadenados** (storage-js, realtime-js, phoenix, iceberg-js,
  auth-js, buffer, events, process, async_hooks, tty, ...) en el camino crítico,
  con **~2.2s de latencia máxima** — la red de dependencias entera.
- **~260ms** de latencia adicional por falta de preconnect a esm.sh.
- **~25.7 KiB de JS sin usar** (auth-js cargaba completo).
- **TTLs de caché cortos** en los módulos de esm.sh (1d o menos).

Esto afectaba directamente el Speed Index (4.1s), FCP (1.1s) y el LCP (1.9s).

### Decisión nueva

1. **Bundle local**: se eliminó el Import Map y `external`/`optimizeDeps.exclude`;
   el SDK se empaqueta con Vite en el chunk `vendor-supabase` (ya existía el
   `manualChunks` para `node_modules/@supabase`). Un solo request, minificado,
   sin dependencia de CDN.
2. **react-doctor**: la regla `react-doctor/artifact-baas-authority-surface`
   se desactivó en `doctor.config.mjs`. Justificación: es un falso positivo —
   la propia app ya expone los nombres de tablas/columnas en sus queries
   (`supabase.from("lots")`...), por lo que la regla no aportaba protección
   real. Al bundlear localmente, el SDK vuelve a aparecer en el artifact del
   build y la regla dispararía; se desactiva de forma puntual y documentada.

### Resultado esperado

- Un solo request para el SDK (~40-60 KiB minificado) en lugar de ~15 requests
  encadenados de esm.sh.
- Desaparece la dependencia de disponibilidad de esm.sh y los TTL cortos.
- El SDK pasa por el minificador y el tree-shaking del build.

---
tags:
  - adr
  - routing
  - performance
created: 2026-07-21
updated: 2026-08-12
status: approved
---

# ADR-001: Code splitting con React Router

## Contexto

El proyecto incluye páginas secundarias (inversión, contacto, Descubre Quindío) y un panel de administración con varias páginas que no son necesarias para la mayoría de los visitantes. Incluir todo ese código en el bundle inicial:

- Aumenta el tiempo de carga inicial.
- Expone nombres de tablas y componentes administrativos en el bundle público.
- Perjudica el rendimiento en dispositivos móviles, que son el mercado objetivo.

## Decisión

Aplicar **code splitting estratégico por ruta**. Las páginas principales (Home, Projects) se importan de forma directa para un primer render rápido; las páginas secundarias y todo el panel admin se cargan bajo demanda con la propiedad `lazy` de React Router v8:

```typescript
{
  path: "investment",
  lazy: () => import("@/features/investment/InvestmentPage")
    .then((m) => ({ Component: m.InvestmentPage })),
}
```

La propiedad `lazy` de nivel de ruta reemplaza al patrón anterior de `React.lazy()` + `Suspense`. Vite genera un chunk separado por cada ruta lazy.

## Consecuencias

Ventajas:

- Menor tamaño del bundle inicial.
- El panel admin solo se descarga cuando el usuario navega a `/admin/*`.
- Los nombres de tablas y componentes administrativos no aparecen en el bundle público.
- Carga rápida de las páginas principales en móviles.

Desventajas:

- Pequeña latencia al navegar por primera vez a una ruta secundaria.
- Requiere respetar la convención de exportar `Component` desde los módulos lazy.

## Alternativas consideradas

1. **Code splitting de todas las rutas:** se descartó porque la latencia extra en Home y Projects empeora la experiencia.
2. **Un solo bundle:** se rechazó por el impacto en el rendimiento móvil y la exposición de código administrativo.
3. **`React.lazy()` + `Suspense` (patrón anterior):** funcionaba, pero la propiedad `lazy` de ruta es la forma nativa de React Router v8 y evita envolver con Suspense manual.

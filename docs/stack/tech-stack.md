---
tags:
  - stack
  - dependencies
  - tools
created: 2026-07-21
updated: 2026-08-12
---

# Stack tecnológico

## Dependencias de producción

| Paquete | Versión | Propósito |
| --- | --- | --- |
| `react` / `react-dom` | ^19.2.7 | Biblioteca de UI y renderizado |
| `react-router` | ^8.3.0 | Routing SPA (v8, reemplaza a react-router-dom) |
| `@supabase/supabase-js` | ^2.110.0 | Cliente de Supabase (cargado desde CDN) |
| `tailwindcss` | ^4.3.2 | Framework de estilos |
| `@tailwindcss/vite` | ^4.3.2 | Plugin de Vite para Tailwind v4 |
| `react-hook-form` | ^7.80.0 | Manejo de formularios |
| `zod` | ^4.4.3 | Validación de esquemas |
| `@hookform/resolvers` | ^5.4.0 | Integración de Zod con React Hook Form |
| `react-helmet-async` | ^3.0.0 | Manejo del `<head>` y SEO |
| `lucide-react` | ^1.22.0 | Iconos SVG |
| `embla-carousel-react` | ^8.6.0 | Carrusel táctil |
| `embla-carousel-autoplay` | ^8.6.0 | Autoplay del carrusel |
| `vite-plugin-sitemap` | ^0.8.2 | Generación de `sitemap.xml` |
| `recharts` | ^3.10.1 | Gráficos del dashboard admin y la calculadora de inversión |

## Dependencias de desarrollo

| Paquete | Versión | Propósito |
| --- | --- | --- |
| `typescript` | ~6.0.2 | Lenguaje y compilador |
| `vite` | ^8.1.1 | Build tool |
| `@vitejs/plugin-react` | ^6.0.3 | Plugin de React para Vite |
| `vite-plugin-pwa` | ^1.3.0 | Service worker y manifest (PWA) |
| `eslint` | ^10.6.0 | Linter |
| `typescript-eslint` | ^8.62.0 | Reglas de ESLint para TypeScript |
| `eslint-plugin-react-hooks` | ^7.1.1 | Reglas de React Hooks |
| `eslint-plugin-react-refresh` | ^0.5.3 | Reglas de HMR para React |
| `eslint-config-prettier` | ^10.1.8 | Evita conflictos entre ESLint y Prettier |
| `prettier` | ^3.9.4 | Formateador de código |
| `husky` | ^9.1.7 | Git hooks |
| `lint-staged` | ^17.0.8 | Linter sobre archivos en stage (instalado, no activo) |
| `vitest` | ^4.1.10 | Test runner de unidades |
| `@vitest/coverage-v8` | ^4.1.10 | Reporte de cobertura |
| `@testing-library/react` | ^16.3.2 | Testing de componentes React |
| `@testing-library/jest-dom` | ^7.0.0 | Matchers de DOM para testing |
| `@testing-library/user-event` | ^14.6.1 | Simulación de interacciones de usuario |
| `jsdom` / `happy-dom` | ^29 / ^20 | Entornos DOM para tests |
| `@playwright/test` | ^1.62.0 | Tests end-to-end |
| `@stryker-mutator/core` | ^9.6.1 | Mutation testing |
| `lighthouse` | ^13.4.1 | Auditoría de rendimiento |
| `globals` | ^17.7.0 | Variables globales para ESLint |

## Scripts disponibles

| Comando | Descripción |
| --- | --- |
| `bun run dev` | Servidor de desarrollo de Vite |
| `bun run build` | TypeScript check (`tsc -b`) + build de Vite |
| `bun run lint` | ESLint sobre todo el proyecto |
| `bun run lint:doctor` | Análisis estático con react-doctor |
| `bun run test` | Tests unitarios en modo watch |
| `bun run test:run` | Tests unitarios en una sola ejecución |
| `bun run test:coverage` | Tests con reporte de cobertura |
| `bun run test:mutation` | Mutation testing con Stryker |
| `bun run test:e2e` | Tests end-to-end con Playwright |
| `bun run test:e2e:mobile` | Solo el proyecto mobile de Playwright |
| `bun run preview` | Sirve el build de producción en el puerto 4173 |
| `bun run upload:lots` | Sube las imágenes de lotes a Cloudinary |
| `bun run lighthouse:*` | Auditorías de rendimiento con Lighthouse |

## Gestor de paquetes

**Bun** es el gestor oficial. Ventajas:

- Instalación mucho más rápida que npm.
- Lockfile nativo (`bun.lock`).
- Compatible con el ecosistema Node.js.
- En CI se usa `bun install --frozen-lockfile` para garantizar consistencia.

## Configuración de TypeScript

El proyecto usa project references:

- `tsconfig.app.json` → código fuente (`src/`).
- `tsconfig.node.json` → configuración de Vite.

Opciones clave de `tsconfig.app.json`:

```json
{
  "target": "es2023",
  "module": "esnext",
  "moduleResolution": "bundler",
  "jsx": "react-jsx",
  "strict": true,
  "noUnusedLocals": true,
  "noUnusedParameters": true,
  "verbatimModuleSyntax": true,
  "erasableSyntaxOnly": true,
  "paths": { "@/*": ["./src/*"] }
}
```

- `verbatimModuleSyntax`: obliga a usar `import type` para imports de solo tipos.
- `erasableSyntaxOnly`: prohíbe `enum` y `namespace` (no se pueden eliminar del código).

## Configuración de Vite

```typescript
// vite.config.ts (resumen)
plugins: [
  react(),
  tailwindcss(),
  VitePWA({ registerType: "autoUpdate", manifest: {...} }),
  sitemap({
    hostname: "https://www.laholanda.com",
    dynamicRoutes: ["/", "/investment", "/projects", "/projects/01", ..., "/contact"],
    exclude: ["/admin", "/admin/*"],
  }),
]
resolve: { alias: { "@": "/src" } }
build: {
  rollupOptions: {
    external: ["@supabase/supabase-js"],   // se carga desde CDN
    output: { manualChunks }               // separa react, ui, forms, zod, supabase
  }
}
optimizeDeps: { exclude: ["@supabase/supabase-js"] }
```

Puntos destacados:

- El sitemap incluye la home, las páginas principales y las 16 rutas de lotes (`/projects/01` a `/projects/16`).
- El build separa el código en chunks: `vendor-react`, `vendor-ui`, `vendor-forms`, `vendor-zod`, `vendor-supabase`.
- El service worker precarga el app shell y usa runtime caching para imágenes de Cloudinary, Google Fonts y la API de Supabase.

## ESLint y Prettier

ESLint usa flat config (`eslint.config.js`):

- Reglas base: `@eslint/js` recommended.
- TypeScript: `typescript-eslint` recommended.
- React Hooks: `eslint-plugin-react-hooks` (incluye las reglas del compilador de React, como `react-hooks/refs`).
- React Refresh: `eslint-plugin-react-refresh`.
- Ignora `dist/` y `reports/`.

Prettier se integra mediante `eslint-config-prettier` para evitar conflictos.

## Husky y lint-staged

Husky instala el hook `pre-commit` con el script `prepare`. Actualmente el hook solo imprime un mensaje de confirmación; `lint-staged` está instalado pero aún no está configurado en el hook. Ver [quality.md](../features/quality.md).

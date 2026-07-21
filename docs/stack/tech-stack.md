---
tags:
  - stack
  - dependencies
  - tools
created: 2026-07-21
---

# ⚙️ Stack Tecnológico

## Dependencias de Producción

| Paquete | Versión | Propósito |
|---------|---------|-----------|
| `react` | ^19.2.7 | UI Library |
| `react-dom` | ^19.2.7 | Renderizado DOM |
| `react-router-dom` | ^7.18.1 | Routing SPA |
| `@supabase/supabase-js` | ^2.110.0 | Cliente Supabase (cargado vía CDN) |
| `@tanstack/react-query` | ^5.101.2 | Data fetching y caché |
| `tailwindcss` | ^4.3.2 | CSS Utility Framework |
| `@tailwindcss/vite` | ^4.3.2 | Plugin Vite para Tailwind v4 |
| `react-hook-form` | ^7.80.0 | Manejo de formularios |
| `zod` | ^4.4.3 | Validación de esquemas |
| `@hookform/resolvers` | ^5.4.0 | Integración Zod + React Hook Form |
| `react-helmet-async` | ^3.0.0 | Manejo de `<head>` y SEO |
| `lucide-react` | ^1.22.0 | Iconos SVG |
| `embla-carousel-react` | ^8.6.0 | Carrusel táctil |
| `embla-carousel-autoplay` | ^8.6.0 | Autoplay para Embla |
| `vite-plugin-sitemap` | ^0.8.2 | Generación de sitemap.xml |

## Dependencias de Desarrollo

| Paquete | Versión | Propósito |
|---------|---------|-----------|
| `typescript` | ~6.0.2 | Lenguaje y compilador |
| `vite` | ^8.1.1 | Build tool |
| `@vitejs/plugin-react` | ^6.0.3 | Plugin React para Vite |
| `eslint` | ^10.6.0 | Linter |
| `@eslint/js` | ^10.0.1 | Reglas ESLint recomendadas |
| `typescript-eslint` | ^8.62.0 | ESLint para TypeScript |
| `eslint-plugin-react-hooks` | ^7.1.1 | Reglas de React Hooks |
| `eslint-plugin-react-refresh` | ^0.5.3 | Reglas de HMR para React |
| `eslint-config-prettier` | ^10.1.8 | Evita conflictos ESLint/Prettier |
| `prettier` | ^3.9.4 | Formateador de código |
| `husky` | ^9.1.7 | Git hooks |
| `lint-staged` | ^17.0.8 | Linter en staged files |
| `globals` | ^17.7.0 | Globals para ESLint |

## Scripts Disponibles

| Comando | Descripción |
|---------|-------------|
| `bun run dev` | Inicia servidor de desarrollo Vite |
| `bun run build` | TypeScript check + Vite build |
| `bun run lint` | ESLint sobre todo el proyecto |
| `bun run lint:doctor` | Ejecuta react-doctor para análisis |
| `bun run preview` | Vista previa del build de producción |

## Package Manager

**Bun** es el gestor de paquetes oficial. Razones:
- Instalación 10-20x más rápida que npm
- Lockfile nativo (`bun.lock`)
- Compatible con paquetes Node.js
- Husky configurado como pre-commit hook

## TypeScript Configuration

### `tsconfig.json` (root)
Proyecto con **project references**:
- `tsconfig.app.json` → código fuente (`src/`)
- `tsconfig.node.json` → Vite config

### `tsconfig.app.json` — Opciones clave
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
- `verbatimModuleSyntax`: obliga a `import type` para imports solo de tipos
- `erasableSyntaxOnly`: prohíbe `enum`s y `namespace`s (no son erasables por el compilador)
- `allowArbitraryExtensions`: permite importar CSS y otros assets

## Vite Configuration

```typescript
// vite.config.ts
plugins: [
  react(),                    // React Fast Refresh
  tailwindcss(),              // Tailwind v4 CSS processing
  sitemap({                    // Sitemap automático
    hostname: "https://www.laholanda.com",
    dynamicRoutes: ["/", "/investment", "/projects", "/descubre-quindio"],
    exclude: ["/admin", "/admin/*"],
  }),
]
resolve: { alias: { "@": "/src" } }
build: { rollupOptions: { external: ["@supabase/supabase-js"] } }
optimizeDeps: { exclude: ["@supabase/supabase-js"] }
```

## ESLint + Prettier

ESLint usa **flat config** (`eslint.config.js`):
- Reglas base: `@eslint/js` recommended
- TypeScript: `typescript-eslint` recommended
- React: `eslint-plugin-react-hooks` recommended
- React Refresh: `eslint-plugin-react-refresh` vite config
- Ignora `dist/`

Prettier integrado vía `eslint-config-prettier` para evitar conflictos.

## Husky + lint-staged

Pre-commit hook ejecuta lint-staged sobre los archivos staged. Esto asegura que solo código lint-free llegue al repositorio.

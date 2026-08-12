---
tags:
  - testing
  - quality
  - linting
  - ci
created: 2026-07-23
updated: 2026-08-12
---

# Testing y calidad de código

## Resumen de herramientas

| Herramienta | Propósito | Configuración |
| --- | --- | --- |
| TypeScript (`tsc`) | Type-checking estático | `tsconfig.app.json` (strict) |
| ESLint | Linting | `eslint.config.js` (flat config) |
| Prettier | Formateo | Integrado vía `eslint-config-prettier` |
| React Doctor | Análisis de componentes React | `npx react-doctor@latest --verbose` |
| Husky | Git hooks (pre-commit) | `.husky/pre-commit` |
| lint-staged | Lint en archivos en stage | Instalado, aún no activo en el hook |
| Vitest | Test runner de unidades | `vite.config.ts` |
| Testing Library | Testing de componentes | `src/test/setup.ts` |
| Playwright | Tests e2e | `playwright.config.ts` |
| Stryker | Mutation testing | `stryker.config.mjs` |
| GitHub Actions | CI automatizado | `.github/workflows/ci.yml` |

---

## Linting (ESLint)

### Configuración

Flat config en `eslint.config.js`:

- Reglas base: `@eslint/js` recommended.
- TypeScript: `typescript-eslint` recommended.
- React Hooks: `eslint-plugin-react-hooks` (incluye las reglas del compilador de React, por ejemplo `react-hooks/refs`, que prohíbe acceder a refs durante el render).
- React Refresh: `eslint-plugin-react-refresh`.

### Ejecución

```bash
bun run lint
```

---

## TypeScript strict

Opciones clave (`tsconfig.app.json`):

```json
{
  "compilerOptions": {
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "verbatimModuleSyntax": true,
    "erasableSyntaxOnly": true
  }
}
```

El type-checking forma parte del build: `bun run build` ejecuta `tsc -b && vite build`. Si hay errores de tipos, el build falla.

---

## React Doctor

Análisis estático de componentes React. Detecta problemas de rendimiento, violaciones de reglas de hooks, exposición de información sensible y malas prácticas.

```bash
bun run lint:doctor
```

El proyecto mantiene un puntaje de 100/100. Se ejecuta automáticamente en el job `quality` del CI.

---

## Husky y lint-staged

Husky instala el hook `pre-commit` mediante el script `prepare` de `package.json`. El hook actual solo imprime un mensaje de confirmación; `lint-staged` está instalado pero todavía no está configurado en el hook.

Para activarlo en el futuro:

1. Configurar `lint-staged` en `package.json`:

   ```json
   {
     "lint-staged": {
       "*.{ts,tsx}": ["eslint --fix", "prettier --write"]
     }
   }
   ```

2. Reemplazar el contenido de `.husky/pre-commit` por:

   ```bash
   npx lint-staged
   ```

---

## Tests unitarios (Vitest)

### Configuración

Vitest se configura en `vite.config.ts`:

```typescript
test: {
  globals: true,
  environment: "jsdom",
  setupFiles: "./src/test/setup.ts",
  css: true,
  include: ["src/**/*.{test,spec}.{ts,tsx}"],
  coverage: {
    provider: "v8",
    reporter: ["text", "html", "json-summary", "clover"],
    reportsDirectory: "./coverage",
    thresholds: {
      statements: 80,
      branches: 70,
      functions: 75,
      lines: 80,
    },
  },
}
```

### Comandos

```bash
bun run test            # Modo watch
bun run test:run        # Una sola ejecución
bun run test:coverage   # Con reporte de cobertura
```

### Tests actuales

Actualmente hay **257 tests en 18 archivos**:

| Archivo | Cobertura |
| --- | --- |
| `src/components/home/__tests__/HomeCarousel.test.tsx` | Carrusel: slides, autoplay, carga perezosa, sonido |
| `src/components/layout/__tests__/BottomNavBar.test.tsx` | Navegación inferior móvil |
| `src/components/layout/__tests__/Footer.test.tsx` | Pie de página |
| `src/components/layout/__tests__/TopNavBar.test.tsx` | Barra de navegación superior |
| `src/components/quindio/__tests__/DescubreQuindio.test.tsx` | Página Descubre Quindío |
| `src/components/seo/__tests__/PageSEO.test.tsx` | Meta tags y SEO |
| `src/components/ui/__tests__/LazyImage.test.tsx` | Carga diferida de imágenes |
| `src/components/ui/__tests__/YouTubeVideo.test.tsx` | Reproductor: lazy load, autoplay, sonido |
| `src/constants/__tests__/navLinks.test.ts` | Ítems de navegación |
| `src/features/home/components/__tests__/ContactForm.test.tsx` | Formulario: validación, envío, estados |
| `src/features/home/components/__tests__/HomeComponents.test.tsx` | Hero, proceso, beneficios, plano |
| `src/features/investment/components/__tests__/InvestmentComponents.test.tsx` | Página de inversión |
| `src/features/projects/components/__tests__/LotCard.test.tsx` | Tarjeta de lote y precios |
| `src/hooks/__tests__/useAuth.test.tsx` | Hook de autenticación |
| `src/lib/__tests__/checkAdmin.test.ts` | Verificación de rol admin |
| `src/lib/__tests__/cloudinary.test.ts` | Utilidad cldUrl |
| `src/lib/__tests__/uploadImage.test.ts` | Widget de subida |
| `src/features/admin/lib/__tests__/analytics.test.ts` | Agrupación por día de las métricas del dashboard |

### Buenas prácticas

- Colocar los tests en `__tests__/` junto al componente.
- Preferir `screen.getByRole()` sobre `screen.getByText()`.
- Inyectar dependencias cuando sea posible (por ejemplo, `ContactForm` recibe la función `submitLead` como prop en vez de depender de Supabase).
- Mockear servicios externos con `vi.mock` cuando el componente los usa directamente.

---

## Tests e2e (Playwright)

### Proyectos

| Proyecto | Viewport |
| --- | --- |
| `chromium-mobile` | 375x812 |
| `chromium-tablet` | 768x1024 |
| `chromium-desktop` | 1280x800 |

### Comandos

```bash
bun run build
bun run test:e2e              # Todos los proyectos
bun run test:e2e:mobile       # Solo mobile
bun run test:e2e:debug        # Modo debug
```

### Suite actual

146 tests en 5 archivos: `contact-form`, `navigation`, `home`, `projects` y `responsive`. Cubren navegación, formulario, carrusel, 404, responsive (sin overflow horizontal), tap targets y páginas admin con sesión mockeada.

---

## Mutation testing (Stryker)

```bash
bun run test:mutation
```

Configuración (`stryker.config.mjs`):

- Test runner: Vitest.
- Umbrales: high 85, low 70, break 60 (por debajo de 60 el comando falla).
- Reporte HTML en `reports/stryker/index.html`.

---

## Pipeline de CI

El workflow `.github/workflows/ci.yml` tiene tres jobs:

### Job quality

- `bun install --frozen-lockfile`.
- `bun run build` (type-check + build).
- `bun run test:run` (257 tests).
- `npx react-doctor@latest --verbose`.
- `npm audit --audit-level=critical`.

### Job e2e

- Instala Chromium de Playwright.
- Compila el proyecto.
- Levanta el preview en el puerto 4173.
- Ejecuta Playwright en `chromium-mobile` y `chromium-desktop`.
- Sube el reporte como artefacto.

El CI tolera la ausencia de secrets de Supabase: si faltan, la app usa valores provisionales y los tests e2e que tocan Supabase usan mocks de red.

### Job mutation

- Se ejecuta solo de forma manual (`workflow_dispatch`) porque un análisis completo de Stryker puede tardar más de 20 minutos.
- Corre `bun run test:mutation` y publica el reporte HTML.

---

---

## Matriz de calidad

| Aspecto | Herramienta | En CI |
| --- | --- | --- |
| Type checking | TypeScript (`tsc -b`) | Sí (en build) |
| Linting | ESLint | No |
| Análisis React | React Doctor | Sí |
| Tests unitarios | Vitest | Sí |
| Tests e2e | Playwright | Sí |
| Auditoría de dependencias | npm audit | Sí |
| Mutation testing | Stryker | Manual (`workflow_dispatch`) |
| Cobertura | Vitest coverage | No (local) |

---

## Enlaces relacionados

- [Stack tecnológico](../stack/tech-stack.md)
- [Pipeline CI/CD](../deployment/ci-cd.md)
- [Procedimientos de QA](../qa/procedures.md)
- [Guía de onboarding](../guides/onboarding.md)

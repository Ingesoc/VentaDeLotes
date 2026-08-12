---
tags:
  - deployment
  - ci-cd
  - github-actions
created: 2026-07-21
updated: 2026-08-12
---

# Pipeline de CI/CD

## Tecnología: GitHub Actions

El proyecto usa GitHub Actions para integración continua. El pipeline se ejecuta en cada push y pull request a la rama `main`, con dos jobs independientes: `quality` y `e2e`. Además existe un job `mutation` que se ejecuta solo manualmente (`workflow_dispatch`).

La versión de Bun está fijada en `BUN_VERSION: 1.3.14` (variable de entorno del workflow) para que coincida con el lockfile local.

## Workflow: CI

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

env:
  BUN_VERSION: 1.3.14

jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v2
        with:
          bun-version: ${{ env.BUN_VERSION }}
      - name: Cache dependencies
        uses: actions/cache@v4
        with:
          path: node_modules
          key: ${{ runner.os }}-bun-${{ hashFiles('bun.lock') }}
      - name: Install dependencies
        run: bun install --frozen-lockfile
      - name: Build
        run: bun run build
        env:
          VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL || '' }}
          VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY || '' }}
      - name: Unit Tests
        run: bun run test:run
      - name: React Doctor
        run: npx react-doctor@latest --verbose
      - name: Security Audit
        run: npm audit --audit-level=critical

  e2e:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v2
        with:
          bun-version: ${{ env.BUN_VERSION }}
      - name: Install dependencies
        run: bun install --frozen-lockfile
      - name: Install Playwright Chromium
        run: npx playwright install chromium
      - name: Build
        run: bun run build
        env:
          VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL || '' }}
          VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY || '' }}
      - name: E2E Tests (Chromium)
        run: |
          bun run preview &
          # Espera a que el servidor responda (máximo 60s)
          # Luego ejecuta los tests
          npx playwright test --project=chromium-mobile --project=chromium-desktop
      - name: Upload E2E Report
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: e2e-report
          path: reports/e2e-report/
          retention-days: 7
```

## Job quality

Valida la calidad del código:

| Etapa | Qué valida |
| --- | --- |
| `bun install --frozen-lockfile` | Que el lockfile esté actualizado y consistente |
| `bun run build` | TypeScript (`tsc -b`) + build de Vite |
| `bun run test:run` | Los 257 tests unitarios con Vitest |
| `react-doctor` | Análisis estático de los componentes React |
| `npm audit --audit-level=critical` | Que no haya vulnerabilidades críticas en las dependencias |

Nota: las variables de Supabase se pasan como `${{ secrets.X || '' }}`. Si no hay secrets configurados, el build funciona igual porque el cliente de Supabase es tolerante a valores vacíos (usa una URL provisional y las llamadas fallan de forma controlada).

## Job e2e

Valida el comportamiento real de la app en el navegador:

1. Instala Chromium de Playwright.
2. Compila el proyecto con Vite.
3. Levanta el servidor de preview en el puerto 4173.
4. Ejecuta los tests de Playwright en los proyectos `chromium-mobile` (375x812) y `chromium-desktop` (1280x800).
5. Sube el reporte HTML como artefacto si hay fallos.

Actualmente la suite e2e tiene 146 tests distribuidos en 5 archivos: `contact-form`, `navigation`, `home`, `projects` y `responsive`.

## Secrets requeridos (opcionales)

| Secret | Propósito |
| --- | --- |
| `VITE_SUPABASE_URL` | URL del proyecto Supabase |
| `VITE_SUPABASE_ANON_KEY` | Anon key pública de Supabase |

Si los secrets no están configurados, la app igualmente renderiza (el cliente usa valores provisionales). Los tests e2e que tocan Supabase usan mocks a nivel de red.

## Consideraciones

- El build falla ante cualquier error de TypeScript o de react-doctor.
- La caché de `node_modules` se invalida cuando cambia `bun.lock`.
- Los secrets nunca se exponen en los logs ni se hardcodean.
- El job `quality` corre en paralelo con el job `e2e`; el job `mutation` se lanza a demanda (Stryker puede tardar más de 20 minutos).

## Próximos pasos (futuro)

- Deploy automático a Vercel/Netlify al hacer push a `main`.
- Preview deploys por pull request para revisión visual.
- Lighthouse CI para monitoreo continuo de rendimiento.

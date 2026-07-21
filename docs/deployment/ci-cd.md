---
tags:
  - deployment
  - ci-cd
  - github-actions
created: 2026-07-21
---

# 🚀 CI/CD Pipeline

## Tecnología: GitHub Actions

El proyecto usa GitHub Actions para integración continua. El pipeline se ejecuta en pushes y pull requests a la rama `main`.

## Workflow: CI

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  react-doctor:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v2
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
          VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
          VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}
      - name: React Doctor
        run: npx react-doctor@latest --verbose
```

## Etapas del Pipeline

### 1. Checkout
Obtiene el código del repositorio.

### 2. Setup Bun
Instala Bun usando `oven-sh/setup-bun@v2` con la versión más reciente.

### 3. Cache de Dependencias
Cachea `node_modules` basado en el hash de `bun.lock`:
- **Key:** `${{ runner.os }}-bun-${{ hashFiles('bun.lock') }}`
- Acelera builds subsecuentes cuando no hay cambios en dependencias

### 4. Instalación
```bash
bun install --frozen-lockfile
```
- `--frozen-lockfile`: falla si `bun.lock` necesita actualizarse
- Asegura consistencia entre entornos

### 5. Build
```bash
bun run build
```
Que ejecuta: `tsc -b && vite build`
- TypeScript type-check estricto
- Build de producción con Vite
- Variables de entorno inyectadas desde GitHub Secrets

### 6. React Doctor
```bash
npx react-doctor@latest --verbose
```
- Análisis de calidad del código React
- Detecta problemas de rendimiento, seguridad y buenas prácticas
- Configuración: verbose output para mejor debugging

## Secrets Requeridos

| Secret | Propósito |
|--------|-----------|
| `VITE_SUPABASE_URL` | URL del proyecto Supabase |
| `VITE_SUPABASE_ANON_KEY` | Anon key de Supabase (pública, necesaria para build) |

## Consideraciones

### Build
- El build falla si hay errores de TypeScript
- El build falla si react-doctor encuentra problemas críticos
- Las variables de entorno se pasan explícitamente (no hardcodeadas)

### Cache
- La cache de `node_modules` se invalida cuando `bun.lock` cambia
- Cache hit → instalación en segundos
- Cache miss → instalación completa (~30s con Bun)

### Seguridad
- Los secrets están protegidos por GitHub Actions
- No se exponen en logs
- Solo se inyectan en tiempo de build

## Próximos Pasos (Futuro)

- [ ] **Deploy automático** a Vercel/Netlify en push a main
- [ ] **Preview deploys** en PRs para revisión visual
- [ ] **E2E tests** con Playwright o Cypress
- [ ] **Lighthouse CI** para monitoreo de performance

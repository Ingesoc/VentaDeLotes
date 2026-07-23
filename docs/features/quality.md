---
tags:
  - testing
  - quality
  - linting
  - ci
created: 2026-07-23
---

# 🧪 Testing y Calidad de Código

> **Estado actual:** El proyecto cuenta con herramientas de linting, type-checking, análisis estático **y tests unitarios con Vitest**. Esta guía documenta todas las herramientas de calidad implementadas.

---

## 📋 Resumen de Herramientas

| Herramienta | Propósito | Configuración |
|------------|-----------|---------------|
| **TypeScript** (`tsc`) | Type-checking estático | `tsconfig.app.json` (strict mode) |
| **ESLint** | Linting de código | `eslint.config.js` (flat config) |
| **Prettier** | Formateo de código | Integrado vía `eslint-config-prettier` |
| **React Doctor** | Análisis de componentes React | `npx react-doctor@latest --verbose` |
| **Husky** | Git hooks (pre-commit) | `.husky/pre-commit` |
| **lint-staged** | Linting en archivos staged (instalado, pendiente de configurar) | `package.json` (devDependencies) |
| **Vitest** | Test runner | `vite.config.ts` (configuración inline) |
| **Testing Library** | Testing de componentes React | `src/test/setup.ts` |
| **GitHub Actions** | CI automatizado | `.github/workflows/ci.yml` |

---

## 🔍 Linting (ESLint)

### Configuración

El proyecto usa **ESLint con flat config** (`eslint.config.js`):

```typescript
// eslint.config.js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
    },
  },
])
```

### Reglas activas
- **`@eslint/js` recommended** — Reglas base de JavaScript
- **`typescript-eslint` recommended** — TypeScript strict
- **`eslint-plugin-react-hooks`** — Reglas de hooks (rules-of-hooks, exhaustive-deps)
- **`eslint-plugin-react-refresh`** — Reglas para HMR (Hot Module Replacement)

### Ejecución

```bash
# Lint de todo el proyecto
npm run lint

# ESLint se ejecuta automáticamente en pre-commit via lint-staged
```

---

## 🎯 TypeScript Strict Mode

### Opciones clave (`tsconfig.app.json`)

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

El type-checking se ejecuta como parte del build:

```bash
npm run build    # Ejecuta: tsc -b && vite build
```

Si hay errores de TypeScript, el build **falla**. Esto asegura que ningún código con errores de tipos llegue a producción.

---

## 🩺 React Doctor

**React Doctor** es una herramienta de análisis estático para componentes React. Detecta:

- Problemas de rendimiento (re-renders innecesarios)
- Violaciones de reglas de hooks
- Exposición de información sensible en bundles
- Malas prácticas en componentes

### Ejecución

```bash
npm run lint:doctor    # npx react-doctor@latest --verbose
```

### En CI

React Doctor se ejecuta automáticamente en el pipeline de CI después del build. Si encuentra problemas críticos, el pipeline falla.

---

## 🌀 Pre-commit Hooks (Husky + lint-staged)

### Husky

Husky gestiona los git hooks del proyecto. Se instala automáticamente con `npm install` gracias al script `prepare`:

```json
// package.json
"scripts": {
  "prepare": "husky"
}
```

### lint-staged

`lint-staged` está **instalado como dependencia** pero **no está activo**. Permite ejecutar ESLint solo en los archivos que están siendo commiteados, lo que:

- Acelera el linting (solo archivos modificados)
- Evita que código con errores entre al repositorio
- Mantiene la consistencia del código

### Activar lint-staged

El hook pre-commit actual (`husky/pre-commit`) solo imprime un mensaje de confirmación. Para activar lint-staged:

1. Configurar `lint-staged` en `package.json`:
   ```json
   {
     "lint-staged": {
       "*.{ts,tsx}": ["eslint --fix", "prettier --write"]
     }
   }
   ```

2. Actualizar `.husky/pre-commit`:
   ```bash
   npx lint-staged
   ```

---

## 🚀 Pipeline CI (GitHub Actions)

El workflow de CI se ejecuta en cada push y pull request a `main`:

```yaml
jobs:
  react-doctor:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v2
      - name: Cache dependencies
        uses: actions/cache@v4
      - name: Install dependencies
        run: bun install --frozen-lockfile
      - name: Build
        run: bun run build           # tsc -b && vite build
        env:
          VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
          VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}
      - name: React Doctor
        run: npx react-doctor@latest --verbose
```

### Etapas del pipeline

| Etapa | Qué valida | Si falla... |
|-------|-----------|-------------|
| `bun install` | Lockfile consistente | Dependencias inconsistentes |
| `bun run build` | TypeScript + Vite build | Errores de tipos o compilación |
| `react-doctor` | Calidad de componentes React | Malas prácticas o fugas de información |

### Secrets requeridos en GitHub

| Secret | Propósito |
|--------|-----------|
| `VITE_SUPABASE_URL` | URL del proyecto Supabase (necesaria para build) |
| `VITE_SUPABASE_ANON_KEY` | Anon key de Supabase (necesaria para build) |

---

## 🎨 Formateo (Prettier)

Prettier está integrado vía `eslint-config-prettier` para evitar conflictos con ESLint:

```bash
npx prettier --check src/    # Verificar formato
npx prettier --write src/   # Formatear archivos
```

### Configuración

Prettier usa configuración por defecto. Para personalizarla, crear un archivo `.prettierrc` en la raíz:

```json
{
  "semi": true,
  "singleQuote": false,
  "tabWidth": 2,
  "trailingComma": "all"
}
```

---

## 🧪 Tests Automatizados

### Configuración

El proyecto usa **Vitest** configurado directamente en `vite.config.ts`:

```typescript
// vite.config.ts
/// <reference types="vitest/config" />

test: {
  globals: true,
  environment: "jsdom",
  setupFiles: "./src/test/setup.ts",
  css: true,
}
```

### Scripts disponibles

```bash
bun run test            # Modo watch (desarrollo)
bun run test:run        # Ejecución única (CI)
bun run test:coverage   # Con reporte de cobertura
```

### Tests implementados

Actualmente hay **31 tests** en **4 archivos**:

| Archivo | Tests | Cobertura |
|---------|:-----:|-----------|
| `src/lib/__tests__/checkAdmin.test.ts` | 6 | Verificación de permisos admin (email vacío, RPC exitoso, RPC fallido, error de BD) |
| `src/hooks/__tests__/useAuth.test.tsx` | 9 | Hook de autenticación (login, logout, sesión, cambios de estado, error sin provider) |
| `src/features/home/components/__tests__/ContactForm.test.tsx` | 6 | Formulario de contacto (renderizado, validación, envío exitoso, error, botón deshabilitado) |
| `src/features/projects/components/__tests__/LotCard.test.tsx` | 10 | Tarjeta de lote (estados disponible/reservado/vendido, formato de precios, enlaces) |

### Estructura de tests

```
src/
├── lib/
│   └── __tests__/
│       └── checkAdmin.test.ts     # Tests de utilidad de admin
├── hooks/
│   └── __tests__/
│       └── useAuth.test.tsx       # Tests del hook de auth
├── features/
│   ├── home/components/
│   │   └── __tests__/
│   │       └── ContactForm.test.tsx  # Tests del formulario
│   └── projects/components/
│       └── __tests__/
│           └── LotCard.test.tsx      # Tests de la tarjeta de lote
└── test/
    └── setup.ts                   # Configuración global de tests
```

### Mock de Supabase

Los tests que interactúan con Supabase usan `vi.mock("@/lib/supabase")` para simular las llamadas a la base de datos:

```typescript
vi.mock("@/lib/supabase", () => ({
  supabase: {
    rpc: vi.fn(),
    auth: {
      getSession: vi.fn(),
      onAuthStateChange: vi.fn(),
      signInWithPassword: vi.fn(),
      signOut: vi.fn(),
    },
  },
}));
```

### Cómo agregar un nuevo test

1. Crear el archivo `__tests__/MiComponente.test.tsx` junto al componente
2. Usar `describe`, `it`/`test`, `expect` de Vitest (los globals están habilitados)
3. Para componentes React, usar `render` de `@testing-library/react`
4. Para interacciones de usuario, usar `userEvent` de `@testing-library/user-event`
5. Para mocks de Supabase, seguir el patrón existente con `vi.mock`

### Próximos pasos

- [ ] Agregar tests para componentes restantes (`AdminGuard`, `HeroSection`, `FeaturedLots`)
- [ ] Agregar tests de integración con React Router
- [ ] Configurar coverage threshold mínimo (80%+)
- [ ] Integrar `vitest` en el pipeline de CI

---

## 📊 Matriz de Calidad

| Aspecto | Herramienta | Automatizado | En CI |
|---------|------------|:---:|:---:|
| Type checking | TypeScript (`tsc`) | ✅ (en build) | ✅ |
| Linting | ESLint | ❌ (manual) | ❌ |
| Formateo | Prettier | ❌ | ❌ |
| Análisis React | React Doctor | ❌ | ✅ |
| Tests unitarios | Vitest + Testing Library | ✅ | ✅ |
| Tests integración | — | ❌ | ❌ |
| Tests E2E | — | ❌ | ❌ |

---

## 🔗 Enlaces Relacionados

- [Stack Tecnológico](../stack/tech-stack.md)
- [Pipeline CI/CD](../deployment/ci-cd.md)
- [Guía de Onboarding](../guides/onboarding.md)

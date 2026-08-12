---
tags:
  - guide
  - onboarding
  - setup
  - getting-started
created: 2026-07-21
updated: 2026-08-12
---

# Guía de onboarding

Bienvenido al proyecto La Holanda. Esta guía te ayuda a configurar tu entorno de desarrollo, entender la arquitectura y empezar a contribuir.

---

## Prerrequisitos

| Herramienta | Versión mínima | Instalación |
| --- | --- | --- |
| [Bun](https://bun.sh) | 1.2 (el CI usa 1.3.14) | `curl -fsSL https://bun.sh/install | bash` |
| [Git](https://git-scm.com) | 2.40 | `winget install Git.Git` (Windows) |
| Editor | VS Code (recomendado) | [Descargar](https://code.visualstudio.com/) |

### Verificar la instalación

```bash
bun --version   # 1.2.x o superior
git --version   # 2.40.x o superior
```

---

## Configuración inicial

### 1. Clonar el repositorio

```bash
git clone https://github.com/Ingesoc/VentaDeLotes.git
cd VentaDeLotes
```

### 2. Instalar dependencias

```bash
bun install
```

Instala todas las dependencias de `package.json` y ejecuta el hook `prepare` de Husky.

### 3. Configurar las variables de entorno

Copia el archivo de ejemplo y completa los valores:

```bash
cp .env.example .env
```

El archivo `.env` debe tener:

```bash
# Supabase (obligatorio para auth y base de datos)
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key

# Cloudinary (obligatorio para subir imágenes desde el admin)
VITE_CLOUDINARY_CLOUD_NAME=tu-cloud-name
VITE_CLOUDINARY_UPLOAD_PRESET=tu-upload-preset
```

Nunca subas el archivo `.env` al repositorio. Está en `.gitignore`.

#### ¿Dónde obtener los valores?

| Variable | Dónde obtenerla |
| --- | --- |
| `VITE_SUPABASE_URL` | Supabase Dashboard → Settings → API → Project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase Dashboard → Settings → API → anon public |
| `VITE_CLOUDINARY_CLOUD_NAME` | Cloudinary Dashboard → Account Details |
| `VITE_CLOUDINARY_UPLOAD_PRESET` | Cloudinary Dashboard → Settings → Upload → Upload Presets |

Si no tienes acceso a estos servicios, pide las credenciales a un miembro del equipo. La app funciona sin ellas, pero las funciones que usan Supabase (formulario de contacto, panel admin) fallarán.

---

## Ejecutar el proyecto

### Desarrollo

```bash
bun run dev
```

Inicia el servidor de desarrollo de Vite en `http://localhost:5173`, con hot reload y TypeScript en segundo plano.

### Build de producción

```bash
bun run build
```

Ejecuta `tsc -b && vite build`: verifica tipos y genera el bundle optimizado en `dist/`.

### Vista previa del build

```bash
bun run preview
```

Sirve `dist/` en `http://localhost:4173`.

### Linting y análisis

```bash
bun run lint           # ESLint
bun run lint:doctor    # React Doctor
```

---

## Estructura del proyecto (lo esencial)

```
src/
├── components/               Componentes globales reutilizables
│   ├── layout/               TopNavBar, Footer, BottomNavBar, RootLayout
│   ├── ui/                   LazyImage, WhatsAppButton, YouTubeVideo, ErrorPage
│   ├── seo/                  PageSEO
│   └── home/                 HomeCarousel
├── constants/                Datos estáticos (lotes, stats, navLinks, project)
├── features/                 Módulos por funcionalidad
│   ├── home/                 Página principal (hero, carrusel, formulario)
│   ├── investment/           Página de inversión
│   ├── projects/             Catálogo de lotes
│   └── admin/                Panel de administración
├── hooks/                    Custom hooks globales (useAuth, useScrollReveal)
├── lib/                      Clientes e integraciones (supabase, cloudinary, leads)
├── pages/                    Páginas independientes (Contacto, DescubreQuindio)
├── router/                   Configuración de React Router
├── main.tsx                  Punto de entrada
└── index.css                 Tema Tailwind v4 + estilos globales
e2e/                          Tests end-to-end (Playwright)
supabase/                     Migraciones SQL
docs/                         Documentación del proyecto
```

---

## Acceso al panel admin

1. Navega a `http://localhost:5173/admin/login`.
2. Inicia sesión con un usuario de Supabase Auth.
3. El sistema verifica si el email tiene permisos de admin vía RPC (`has_backstage_access`).
4. Si es admin, accede al dashboard.

### Crear un admin

1. Abre el SQL Editor de Supabase.
2. Ejecuta:

   ```sql
   INSERT INTO admins (email) VALUES ('email@ejemplo.com');
   ```

3. El usuario ya puede iniciar sesión en `/admin/login`.

---

## Cómo crear una página nueva

### Paso 1: Crear el feature module

```bash
mkdir -p src/features/mi-feature/components
```

### Paso 2: Crear el componente de página

```typescript
// src/features/mi-feature/MiFeaturePage.tsx
import PageSEO from "@/components/seo/PageSEO";

export function MiFeaturePage() {
  return (
    <>
      <PageSEO title="Mi Feature" description="Descripción para SEO" />
      <div className="page-enter">{/* Contenido */}</div>
    </>
  );
}
```

### Paso 3: Registrar la ruta

En `src/router/index.tsx`, agrega la ruta dentro de `RootLayout`. Usa `lazy` si la página no es crítica:

```typescript
{
  path: "mi-feature",
  lazy: () => import("@/features/mi-feature/MiFeaturePage")
    .then((m) => ({ Component: m.MiFeaturePage })),
}
```

Las páginas principales (Home, Projects) se importan de forma directa para un primer render rápido.

### Paso 4: Agregar al sitemap

En `vite.config.ts`, agrega la ruta a `DYNAMIC_ROUTES`.

### Paso 5: Agregar tests

Crea `src/features/mi-feature/components/__tests__/MiFeaturePage.test.tsx` con Vitest y Testing Library, siguiendo los patrones existentes.

---

## Convenciones de estilo

### Colores

Usa siempre los tokens semánticos del tema:

| Clase | Uso |
| --- | --- |
| `bg-primary` | Fondos principales |
| `text-on-primary` | Texto sobre fondo primary |
| `bg-surface` | Fondos de tarjetas |
| `text-soft-gold` | Acentos dorados |
| `bg-deep-forest` | Fondos oscuros |

### Tipografía

- Títulos: `font-display-lg` (Playfair Display).
- Cuerpo: `font-body-md` (Inter).
- Etiquetas: `font-label-bold` (Inter, mayúsculas).

### Accesibilidad

- Los inputs del formulario usan la clase `safe-input` (16px para evitar el zoom automático en iOS).
- Los botones táctiles usan `tap-target` (mínimo 48px).
- Los elementos interactivos llevan `aria-label` descriptivo.

---

## Flujo de trabajo con Git

### Ramas

- `main` es la rama de producción.
- Crea ramas de feature desde `main`.

### Commits

Usa mensajes descriptivos en español:

```bash
git checkout -b feat/mi-nueva-funcionalidad
git add .
git commit -m "feat: descripción clara del cambio"
git push origin feat/mi-nueva-funcionalidad
```

### Pre-commit

Husky ejecuta el hook `pre-commit` antes de cada commit.

### Pull requests

1. Crea un PR desde tu rama hacia `main`.
2. GitHub Actions ejecuta el CI automáticamente.
3. Espera a que pasen los jobs `quality` y `e2e`.
4. Solicita revisión de código.

---

## Troubleshooting común

### El panel admin no carga o no deja entrar

1. Verifica que el email esté registrado en la tabla `admins` de Supabase.
2. Confirma que las variables de entorno de Supabase sean correctas.
3. Revisa la consola del navegador por errores de red o CORS.

### Las variables de Supabase no están configuradas

La app ya no se bloquea al arrancar: usa valores provisionales y las llamadas reales fallan de forma controlada. Configura el `.env` para que el formulario de contacto y el panel admin funcionen.

### `bun: command not found`

Instala Bun:

```bash
curl -fsSL https://bun.sh/install | bash
```

### El build falla con errores de TypeScript

Corrige los errores señalados. El proyecto usa `strict: true` con `noUnusedLocals` y `noUnusedParameters`.

### El CI falla en `bun install --frozen-lockfile`

El lockfile `bun.lock` está desactualizado. Ejecuta `bun install` y sube el lockfile actualizado.

---

## Documentación relacionada

- [Índice de documentación](../index.md)
- [Arquitectura del proyecto](../architecture/overview.md)
- [Stack tecnológico](../stack/tech-stack.md)
- [Decisiones técnicas (ADR)](../decisions/README.md)
- [Diagramas de arquitectura](../diagrams/architecture.md)

---

## Checklist de incorporación

- [ ] Leí esta guía.
- [ ] Instalé Bun y verifiqué la versión.
- [ ] Cloné el repositorio.
- [ ] Ejecuté `bun install` sin errores.
- [ ] Configuré el archivo `.env`.
- [ ] Ejecuté `bun run dev` y vi el proyecto en el navegador.
- [ ] Ejecuté `bun run build` con éxito.
- [ ] Revisé la estructura del proyecto.
- [ ] Exploré el panel admin en `/admin/login`.
- [ ] Revisé los ADR en [docs/decisions/README](../decisions/README.md).

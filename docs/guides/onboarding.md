---
tags:
  - guide
  - onboarding
  - setup
  - getting-started
created: 2026-07-21
---

# 🚀 Guía de Onboarding

> Bienvenido al proyecto **La Holanda**. Esta guía te ayudará a configurar tu entorno de desarrollo, entender la arquitectura del proyecto y empezar a contribuir rápidamente.

---

## 📋 Prerrequisitos

| Herramienta | Versión Mínima | Instalación |
|-------------|---------------|-------------|
| [Bun](https://bun.sh) | 1.2+ | `curl -fsSL https://bun.sh/install \| bash` |
| [Git](https://git-scm.com) | 2.40+ | `winget install Git.Git` (Windows) |
| Editor | VS Code (recomendado) | [Descargar](https://code.visualstudio.com/) |

### Verificar instalación

```bash
bun --version   # → 1.2.x o superior
git --version   # → 2.40.x o superior
node --version  # → No requerido, Bun incluye Node.js compatibility
```

---

## 🛠️ Configuración Inicial

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/lotes-quindio.git
cd lotes-quindio
```

### 2. Instalar dependencias

```bash
bun install
```

Esto instalará todas las dependencias listadas en `package.json` y ejecutará el hook `prepare` de Husky.

### 3. Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto:

```bash
# .env — Copia este contenido y reemplaza con valores reales

# Supabase (requerido para auth y base de datos)
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key-aqui

# Cloudinary (requerido para subida de imágenes en admin)
VITE_CLOUDINARY_CLOUD_NAME=tu-cloud-name
VITE_CLOUDINARY_UPLOAD_PRESET=tu-upload-preset
```

> ⚠️ **Nunca commitees el archivo `.env`**. Está en `.gitignore`.

#### ¿Dónde obtener estos valores?

| Variable | Dónde obtenerla |
|----------|----------------|
| `VITE_SUPABASE_URL` | Supabase Dashboard → Settings → API → Project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase Dashboard → Settings → API → anon public |
| `VITE_CLOUDINARY_CLOUD_NAME` | Cloudinary Dashboard → Account Details |
| `VITE_CLOUDINARY_UPLOAD_PRESET` | Cloudinary Dashboard → Settings → Upload → Upload Presets (crear uno nuevo) |

> Si no tienes acceso a estos servicios, pide las credenciales a un miembro del equipo.

---

## 🏃‍♂️ Ejecutar el Proyecto

### Desarrollo

```bash
bun run dev
```

Esto inicia el servidor de desarrollo de Vite en `http://localhost:5173` (por defecto).

- Hot Module Replacement (HMR) activo
- TypeScript type-checking en segundo plano
- Tailwind CSS compilado on-the-fly

### Build de Producción

```bash
bun run build
```

Esto ejecuta: `tsc -b && vite build`

1. **TypeScript Check**: `tsc -b` verifica tipos en todo el proyecto
2. **Build**: Vite genera el bundle optimizado en `dist/`

### Vista Previa del Build

```bash
bun run preview
```

Sirve el contenido de `dist/` en `http://localhost:4173`.

### Linting

```bash
bun run lint           # ESLint sobre todo el proyecto
bun run lint:doctor    # Análisis react-doctor (recomendado antes de commits)
```

---

## 📁 Estructura del Proyecto (Lo Esencial)

```
lotes-quindio/
├── src/                          # Código fuente
│   ├── components/               # Componentes globales reutilizables
│   │   ├── layout/               #   Nav, Footer, Layout wrappers
│   │   ├── ui/                   #   LazyImage, WhatsAppButton
│   │   └── seo/                  #   PageSEO (react-helmet-async)
│   ├── constants/                # Datos estáticos (lotes, stats, nav)
│   ├── features/                 # Módulos por funcionalidad
│   │   ├── home/                 #   Landing page principal
│   │   ├── investment/           #   Página de inversión
│   │   ├── projects/             #   Catálogo de lotes
│   │   └── admin/                #   Panel de administración
│   ├── hooks/                    # Custom hooks globales
│   ├── lib/                      # Clientes (Supabase, Cloudinary)
│   ├── pages/                    # Páginas independientes
│   ├── router/                   # Configuración de React Router
│   ├── main.tsx                  # Entry point de la aplicación
│   └── index.css                 # Tema Tailwind v4 + estilos globales
├── supabase/                     # Migraciones y seeds de BD
├── public/                       # Assets estáticos (favicon, robots.txt)
├── scripts/                      # Scripts de utilidad (Cloudinary upload)
└── docs/                         # Documentación del proyecto
```

---

## 🔐 Acceso al Panel Admin

1. Navega a `http://localhost:5173/admin/login`
2. Inicia sesión con credenciales de Supabase Auth
3. El sistema verifica si el email tiene permisos de admin via RPC
4. Si eres admin, accedes al Dashboard

### Crear un Admin

Para agregar un nuevo administrador:

1. Ve al SQL Editor de Supabase Dashboard
2. Ejecuta:
   ```sql
   INSERT INTO admin_users (email) VALUES ('email@ejemplo.com');
   ```
3. El usuario ya puede iniciar sesión en `/admin/login`

---

## 🧩 Cómo Crear una Página Nueva

### Paso 1: Crear el feature module

```bash
mkdir src/features/mi-feature/components/
```

### Paso 2: Crear el componente de página

```typescript
// src/features/mi-feature/MiFeaturePage.tsx
import PageSEO from "@/components/seo/PageSEO";

export function MiFeaturePage() {
  return (
    <>
      <PageSEO
        title="Mi Feature"
        description="Descripción para SEO"
      />
      <div className="page-enter">
        {/* Contenido aquí */}
      </div>
    </>
  );
}
```

### Paso 3: Registrar la ruta

En `src/router/index.tsx`, agrega la ruta dentro del `RootLayout`:

```typescript
{
  path: "mi-feature",
  element: <MiFeaturePage />,
}
```

### Paso 4: Agregar al sitemap

En `vite.config.ts`, agrega la ruta a `dynamicRoutes`:

```typescript
dynamicRoutes: ["/", "/investment", "/projects", "/descubre-quindio", "/mi-feature"],
```

---

## 🎨 Convenciones de Estilo

### Colores
Usa siempre los tokens semánticos definidos en el tema:

| Token | Uso | Ejemplo |
|-------|-----|---------|
| `bg-primary` | Fondos principales | `bg-primary` |
| `text-on-primary` | Texto sobre primary | `text-on-primary` |
| `bg-surface` | Fondos de tarjetas | `bg-surface` |
| `text-soft-gold` | Acentos dorados | `text-soft-gold` |
| `bg-deep-forest` | Fondos oscuros | `bg-deep-forest` |

### Tipografía
- **Títulos**: `font-display-lg` (Playfair Display)
- **Cuerpo**: `font-body-md` (Inter)
- **Etiquetas**: `font-label-bold` (Inter, uppercase)

### Animaciones Disponibles
| Clase | Efecto |
|-------|--------|
| `page-enter` | Animación de entrada al cargar página |
| `hover-lift` | Elevación suave al hover |
| `img-zoom` | Zoom al hacer hover en contenedor `.group` |
| `reveal` | Scroll reveal (usar con `useScrollReveal` hook) |
| `card-border-glow` | Brillo en borde al hover |
| `pulse-glow` | Pulso animado intermitente |
| `glass-card` | Efecto vidrio (glassmorphism) |

---

## 🔄 Git Workflow

### Ramas
- `main` — Rama principal, producción
- Crear ramas de feature desde `main`

### Commits
Usamos commits descriptivos en español:

```bash
git checkout -b feat/mi-nueva-funcionalidad
git add .
git commit -m "feat: descripción clara del cambio"
git push origin feat/mi-nueva-funcionalidad
```

### Pre-commit Hooks
Husky ejecuta `lint-staged` automáticamente antes de cada commit:
- Linting de archivos staged
- Si hay errores de ESLint, el commit se rechaza

### Pull Requests
1. Crea un PR desde tu rama hacia `main`
2. GitHub Actions ejecuta CI automáticamente
3. Espera a que el CI pase (build + react-doctor)
4. Solicita revisión de código

---

## 🐛 Troubleshooting Común

### Error: Missing Supabase environment variables
```bash
Error: Missing Supabase environment variables: 
VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY must be set in .env
```
**Solución:** Crea el archivo `.env` con las variables requeridas (ver [[#3. Configurar variables de entorno]]).

### Error: Bun command not found
```bash
bun: command not found
```
**Solución:** Instala Bun globalmente:
```bash
curl -fsSL https://bun.sh/install | bash
```

### Error en CI: react-doctor fails
```bash
artifact-baas-authority-surface found issues
```
**Solución:** Asegúrate de que el Import Map para `@supabase/supabase-js` esté configurado en `index.html`. Revisa [[docs/decisions/adr-004-import-map-supabase|ADR-004]].

### El build falla con errores de TypeScript
**Solución:** Corrige los errores señalados. El proyecto usa `strict: true` con `noUnusedLocals` y `noUnusedParameters` activados.

### Hot reload no funciona
**Solución:** Asegúrate de que Vite esté corriendo (puerto 5173). Si el problema persiste, reinicia el servidor.

### No puedo acceder al admin
1. Verifica que el email esté registrado en la tabla `admin_users` de Supabase
2. Confirma que las variables de entorno de Supabase sean correctas
3. Revisa la consola del navegador por errores de CORS o autenticación

---

## 📚 Documentación Relacionada

- [[docs/index|Índice de Documentación]]
- [[docs/architecture/overview|Arquitectura del Proyecto]]
- [[docs/stack/tech-stack|Stack Tecnológico]]
- [[docs/decisions/README|Decisiones Técnicas (ADR)]]
- [[docs/diagrams/architecture|Diagramas de Arquitectura]]

---

## 🎯 Checklist de Incorporación

- [ ] Leí esta guía de onboarding
- [ ] Instalé Bun y verifiqué la versión
- [ ] Cloné el repositorio
- [ ] Ejecuté `bun install` sin errores
- [ ] Configuré el archivo `.env`
- [ ] Ejecuté `bun run dev` y vi el proyecto en el navegador
- [ ] Ejecuté `bun run build` exitosamente
- [ ] Revisé la estructura del proyecto
- [ ] Exploré el panel admin en `/admin/login`
- [ ] Revisé los ADRs en [[docs/decisions/README]]

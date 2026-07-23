# 📋 La Holanda — Documentación Técnica

> **Proyecto:** La Holanda — Parcelación Campestre
> **Desarrollador:** INGESOCC SAS
> **Ubicación:** Quimbaya, Quindío, Colombia
> **URL:** [laholanda.com](https://www.laholanda.com/)

Bienvenido a la documentación técnica del proyecto. Este repositorio contiene las decisiones arquitectónicas, configuración del stack, features implementadas y guías de despliegue.

---

## 👋 ¿Nuevo en el Proyecto?

➡️ [🚀 Guía de Onboarding](./guides/onboarding.md) — Configura tu entorno, instala dependencias y empieza a contribuir.

---

## 📁 Estructura de la Documentación

| Sección | Descripción |
|---------|-------------|
| [🚀 Guía de Onboarding](./guides/onboarding.md) | Configuración inicial y guía para nuevos desarrolladores |
| [📊 Diagramas](./diagrams/architecture.md) | Diagramas Mermaid de arquitectura, componentes y flujos |
| [🏗️ Arquitectura](./architecture/overview.md) | Visión general de la arquitectura del proyecto |
| [⚙️ Stack Tecnológico](./stack/tech-stack.md) | Stack, dependencias y herramientas |
| [📐 Decisiones Técnicas (ADR)](./decisions/README.md) | Architecture Decision Records |
| [🗺️ Routing](./features/routing.md) | Sistema de enrutamiento y navegación |
| [🔐 Autenticación](./features/authentication.md) | Sistema de autenticación con Supabase |
| [🛠️ Panel Admin](./features/admin-panel.md) | Panel de administración de lotes |
| [🔍 SEO y Meta Tags](./features/seo.md) | Estrategia SEO y etiquetas Open Graph |
| [🖼️ Manejo de Medios](./features/media.md) | Cloudinary y manejo de imágenes |
| [🗄️ Base de Datos](./features/database.md) | Esquema Supabase y migraciones |
| [🚀 CI/CD](./deployment/ci-cd.md) | Pipeline de integración y despliegue continuo |
| [🧪 Testing y Calidad](./features/quality.md) | Testing, linting, type-checking y herramientas de calidad |

---

## 🎯 Stack Principal

| Capa | Tecnología |
|------|-----------|
| **Frontend** | React 19 + TypeScript 6 + Vite 8 |
| **Estilos** | Tailwind CSS 4 (CSS-first configuration) |
| **Backend** | Supabase (Auth + PostgreSQL + RLS) |
| **Medios** | Cloudinary (Upload Widget + CDN) |
| **Routing** | React Router v7 |
| **Estado** | TanStack React Query v5 |
| **Formularios** | React Hook Form + Zod v4 |
| **Carousel** | Embla Carousel + Autoplay |
| **SEO** | react-helmet-async + vite-plugin-sitemap |
| **Package Manager** | Bun |

---

## 🧭 Convenciones del Proyecto

| Convención | Estándar |
|-----------|----------|
| TypeScript | Strict mode, `verbatimModuleSyntax`, `erasableSyntaxOnly` |
| Alias de imports | `@/` → `./src/*` |
| Estilos | Tailwind CSS v4 con `@theme` (no `tailwind.config.js`) |
| Componentes | Feature-based organization en `src/features/` |
| Componentes globales | `src/components/` (layout, ui, shared) |
| Constantes | `src/constants/` (objetos `as const`) |
| Hooks | `src/hooks/` |
| Linting | ESLint flat config + Prettier + Husky |
| Commit hooks | lint-staged (pre-commit) |

---

## 🔗 Enlaces Rápidos

### Para Nuevos Desarrolladores
- [⚙️ Configurar entorno](./guides/onboarding.md#configuración-inicial)
- [🏃‍♂️ Correr el proyecto](./guides/onboarding.md#ejecutar-el-proyecto)
- [📝 Crear una página nueva](./guides/onboarding.md#cómo-crear-una-página-nueva)
- [🐛 Troubleshooting](./guides/onboarding.md#troubleshooting-común)

### Decisiones Técnicas
- [ADR-001: Code Splitting con React Router](./decisions/adr-001-react-router-code-splitting.md)
- [ADR-002: Tema CSS-first con Tailwind v4](./decisions/adr-002-tailwind-css-v4-theme.md)
- [ADR-003: Autenticación con Supabase](./decisions/adr-003-supabase-auth.md)
- [ADR-004: Import Map para Supabase SDK](./decisions/adr-004-import-map-supabase.md)

### Diagramas
- [📊 Diagrama de Contexto](./diagrams/architecture.md#1-diagrama-de-contexto-del-sistema-c4-nivel-1)
- [📊 Diagrama de Componentes](./diagrams/architecture.md#2-diagrama-de-componentes-react)
- [📊 Flujo de Autenticación](./diagrams/architecture.md#3-flujo-de-autenticación-secuencia)
- [📊 Esquema de BD](./diagrams/architecture.md#4-esquema-de-base-de-datos-erd)

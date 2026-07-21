---
tags:
  - index
  - home
created: 2026-07-21
updated: 2026-07-21
---

# 📋 La Holanda — Documentación Técnica

> **Proyecto:** La Holanda — Parcelación Campestre  
> **Desarrollador:** INGESOCC SAS  
> **Ubicación:** Quimbaya, Quindío, Colombia  
> **URL:** [laholanda.com](https://www.laholanda.com/)

Bienvenido a la documentación técnica del proyecto. Este repositorio contiene las decisiones arquitectónicas, configuración del stack, features implementadas y guías de despliegue.

---

## 👋 ¿Nuevo en el Proyecto?

Si eres nuevo, empieza aquí:

➡️ [[docs/guides/onboarding|🚀 Guía de Onboarding]] — Configura tu entorno, instala dependencias y empieza a contribuir.

---

## 📁 Estructura de la Documentación

| Sección | Descripción |
|---------|-------------|
| [[docs/guides/onboarding|🚀 Guía de Onboarding]] | Configuración inicial y guía para nuevos desarrolladores |
| [[docs/diagrams/architecture|📊 Diagramas]] | Diagramas Mermaid de arquitectura, componentes y flujos |
| [[docs/architecture/overview|🏗️ Arquitectura]] | Visión general de la arquitectura del proyecto |
| [[docs/stack/tech-stack|⚙️ Stack Tecnológico]] | Stack, dependencias y herramientas |
| [[docs/decisions/README|📐 Decisiones Técnicas (ADR)]] | Architecture Decision Records |
| [[docs/features/routing|🗺️ Routing]] | Sistema de enrutamiento y navegación |
| [[docs/features/authentication|🔐 Autenticación]] | Sistema de autenticación con Supabase |
| [[docs/features/admin-panel|🛠️ Panel Admin]] | Panel de administración de lotes |
| [[docs/features/seo|🔍 SEO y Meta Tags]] | Estrategia SEO y etiquetas Open Graph |
| [[docs/features/media|🖼️ Manejo de Medios]] | Cloudinary y manejo de imágenes |
| [[docs/features/database|🗄️ Base de Datos]] | Esquema Supabase y migraciones |
| [[docs/deployment/ci-cd|🚀 CI/CD]] | Pipeline de integración y despliegue continuo |

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
- [[docs/guides/onboarding#Configuración Inicial|⚙️ Configurar entorno]]
- [[docs/guides/onboarding#Ejecutar el Proyecto|🏃‍♂️ Correr el proyecto]]
- [[docs/guides/onboarding#Cómo Crear una Página Nueva|📝 Crear una página nueva]]
- [[docs/guides/onboarding#Troubleshooting Común|🐛 Troubleshooting]]

### Decisiones Técnicas
- [[docs/decisions/adr-001-react-router-code-splitting|ADR-001: Code Splitting con React Router]]
- [[docs/decisions/adr-002-tailwind-css-v4-theme|ADR-002: Tema CSS-first con Tailwind v4]]
- [[docs/decisions/adr-003-supabase-auth|ADR-003: Autenticación con Supabase]]
- [[docs/decisions/adr-004-import-map-supabase|ADR-004: Import Map para Supabase SDK]]

### Diagramas
- [[docs/diagrams/architecture|📊 Diagrama de Contexto]]
- [[docs/diagrams/architecture#2. Diagrama de Componentes React|📊 Diagrama de Componentes]]
- [[docs/diagrams/architecture#3. Flujo de Autenticación Secuencia|📊 Flujo de Autenticación]]
- [[docs/diagrams/architecture#4. Esquema de Base de Datos ERD|📊 Esquema de BD]]

---
tags:
  - index
  - home
created: 2026-07-21
updated: 2026-08-12
---

# La Holanda — Documentación Técnica

> **Proyecto:** La Holanda — Parcelación Campestre
> **Desarrollador:** INGESOCC SAS
> **Ubicación:** Quimbaya, Quindío, Colombia
> **URL:** [laholanda.com](https://www.laholanda.com/)

Bienvenido a la documentación técnica del proyecto. Este repositorio contiene las decisiones de arquitectura, la configuración del stack, las funciones implementadas y las guías de despliegue.

---

## ¿Nuevo en el proyecto?

Empieza por la [guía de onboarding](./guides/onboarding.md): configura tu entorno, instala las dependencias y aprende a contribuir.

---

## Estructura de la documentación

| Sección | Descripción |
| --- | --- |
| [Guía de onboarding](./guides/onboarding.md) | Configuración inicial para nuevos desarrolladores |
| [Diagramas](./diagrams/architecture.md) | Diagramas HTML de arquitectura y flujos |
| [Arquitectura](./architecture/overview.md) | Visión general de la arquitectura |
| [Stack tecnológico](./stack/tech-stack.md) | Dependencias, scripts y configuración |
| [Decisiones técnicas (ADR)](./decisions/README.md) | Registro de decisiones de arquitectura |
| [Routing](./features/routing.md) | Sistema de rutas y navegación |
| [Autenticación](./features/authentication.md) | Autenticación con Supabase |
| [Panel admin](./features/admin-panel.md) | Administración de lotes |
| [SEO](./features/seo.md) | Estrategia SEO y meta tags |
| [Manejo de medios](./features/media.md) | Cloudinary e imágenes |
| [Base de datos](./features/database.md) | Esquema de Supabase y migraciones |
| [CI/CD](./deployment/ci-cd.md) | Pipeline de integración continua |
| [Testing y calidad](./features/quality.md) | Tests, linting y herramientas de calidad |
| [Procedimientos de QA](./qa/procedures.md) | Guía práctica de aseguramiento de calidad |

---

## Stack principal

| Capa | Tecnología |
| --- | --- |
| Frontend | React 19 + TypeScript + Vite 8 |
| Estilos | Tailwind CSS v4 (CSS-first con `@theme`) |
| Backend | Supabase (Auth + PostgreSQL + RLS) |
| Medios | Cloudinary (CDN + widget de subida) |
| Routing | React Router v8 |
| Formularios | React Hook Form + Zod v4 |
| Carrusel | Embla Carousel |
| SEO | react-helmet-async + vite-plugin-sitemap |
| PWA | vite-plugin-pwa |
| Gestor de paquetes | Bun |

---

## Convenciones del proyecto

| Convención | Estándar |
| --- | --- |
| TypeScript | Strict mode, `verbatimModuleSyntax`, `erasableSyntaxOnly` |
| Alias de imports | `@/` apunta a `./src/*` |
| Estilos | Tailwind v4 con `@theme` (no hay `tailwind.config.js`) |
| Organización | Feature-based en `src/features/` |
| Componentes globales | `src/components/` (layout, ui, seo, shared) |
| Constantes | `src/constants/` (objetos `as const`) |
| Hooks | `src/hooks/` y `src/features/*/hooks/` |
| Linting | ESLint flat config + Prettier + Husky |
| Idiomas | Código y commits en español, documentación en español |

---

## Enlaces rápidos

### Para nuevos desarrolladores
- [Configurar el entorno](./guides/onboarding.md#configuración-inicial)
- [Ejecutar el proyecto](./guides/onboarding.md#ejecutar-el-proyecto)
- [Crear una página nueva](./guides/onboarding.md#cómo-crear-una-página-nueva)
- [Troubleshooting](./guides/onboarding.md#troubleshooting-común)

### Decisiones técnicas
- [ADR-001: Code splitting con React Router](./decisions/adr-001-react-router-code-splitting.md)
- [ADR-002: Tema CSS-first con Tailwind v4](./decisions/adr-002-tailwind-css-v4-theme.md)
- [ADR-003: Autenticación con Supabase](./decisions/adr-003-supabase-auth.md)
- [ADR-004: Import Map para Supabase SDK](./decisions/adr-004-import-map-supabase.md)

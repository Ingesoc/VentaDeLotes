# La Holanda — Parcelación Campestre

[![CI](https://github.com/Ingesoc/VentaDeLotes/actions/workflows/ci.yml/badge.svg)](https://github.com/Ingesoc/VentaDeLotes/actions/workflows/ci.yml)
[![Version](https://img.shields.io/github/package-json/v/Ingesoc/VentaDeLotes?label=versi%C3%B3n&color=%232D6A4F)](https://github.com/Ingesoc/VentaDeLotes)
[![License](https://img.shields.io/badge/license-All%20Rights%20Reserved-%231B4332)](#licencia)

Portal digital de inversión y vitrina inmobiliaria para la parcelación campestre **La Holanda**, ubicada en Quimbaya, Quindío. Desarrollado por **INGESOCC SAS**.

Es una aplicación web construida con React que permite a los usuarios explorar los lotes disponibles, conocer el proyecto, comparar opciones de inversión y contactar al equipo comercial.

> Documentación completa disponible en [docs/README.md](./docs/README.md): arquitectura, stack, funciones, decisiones técnicas y guías.

---

## Tecnologías

| Capa | Tecnología |
| --- | --- |
| Framework | React 19 + TypeScript |
| Build | Vite 8 |
| Estilos | Tailwind CSS v4 (tema CSS-first con `@theme`) |
| Ruteo | React Router v8 (data router + lazy por ruta) |
| Formularios | React Hook Form + Zod |
| Backend | Supabase (Auth + PostgreSQL + RLS + RPC) |
| Imágenes | Cloudinary (CDN + widget de subida) |
| PWA | vite-plugin-pwa (service worker + caché) |
| Iconos | Lucide React |
| Carrusel | Embla Carousel |

---

## Sistema de diseño

La identidad visual se apoya en los siguientes tokens definidos en `src/index.css`:

| Token | Hex | Uso |
| --- | --- | --- |
| Forest Green | `#1B4332` | Color corporativo principal |
| Coffee Green | `#2D6A4F` | Acentos secundarios |
| Soft Gold | `#D4A373` | Etiquetas y acentos premium |
| Warm White | `#FAFAF8` | Superficies y fondos claros |
| Deep Forest | `#081C15` | Texto de alto contraste |

Tipografía: Playfair Display para títulos e Inter para el cuerpo de texto.

---

## Desarrollo local

```bash
# Instalar dependencias
bun install

# Iniciar el servidor de desarrollo
bun run dev

# Build de producción (tsc -b && vite build)
bun run build

# Vista previa del build
bun run preview
```

Para configurar las variables de entorno, copia `.env.example` a `.env` y completa los valores. Consulta la [guía de onboarding](./docs/guides/onboarding.md).

---

## Estructura del proyecto

```
src/
├── components/          Componentes compartidos
│   ├── home/            Carrusel de la home
│   ├── layout/          TopNavBar, Footer, BottomNavBar, RootLayout
│   ├── quindio/         Secciones de "Descubre Quindío"
│   ├── seo/             PageSEO
│   └── ui/              LazyImage, WhatsAppButton, YouTubeVideo, ErrorPage
├── constants/           Datos estáticos (lotes, stats, navLinks, project)
├── features/
│   ├── admin/           Panel admin (login, dashboard, CRUD de lotes)
│   ├── home/            Página principal (hero, carrusel, formulario)
│   ├── hooks/           Hook useContactForm (lógica del formulario)
│   ├── investment/      Página de inversión
│   └── projects/        Listado y detalle de lotes
├── hooks/               Custom hooks (useAuth, useScrollReveal, tracking)
├── lib/                 supabase, cloudinary, checkAdmin, leads, format
├── pages/               Páginas independientes (Contacto, DescubreQuindio)
└── router/              Configuración de rutas
e2e/                     Tests end-to-end (Playwright)
supabase/                Migraciones SQL del esquema
docs/                    Documentación del proyecto
```

---

## Administración

El panel admin está en `/admin/login`. Permite gestionar:

- Dashboard: estadísticas de visitas y leads.
- Lotes: CRUD completo con subida de imágenes a Cloudinary.

El acceso está protegido con autenticación de Supabase y verificación de rol admin vía RPC (`has_backstage_access`).

---

## Calidad y CI

El pipeline de CI (GitHub Actions) ejecuta automáticamente en cada push o PR a `main`:

- Job `quality`: build, tests unitarios (Vitest), react-doctor y auditoría de seguridad (`npm audit`).
- Job `e2e`: tests de Playwright en chromium-mobile y chromium-desktop contra el build de producción.

Estado actual del proyecto: 257 tests unitarios, 146 tests e2e, react-doctor 100/100 y auditoría de dependencias sin vulnerabilidades.

Comandos útiles:

```bash
bun run lint            # ESLint
bun run lint:doctor     # React Doctor
bun run test:run        # Tests unitarios
bun run test:e2e        # Tests end-to-end
```

---

## Licencia

Desarrollado por **INGESOCC SAS**. Todos los derechos reservados.

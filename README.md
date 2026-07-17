# La Holanda — Parcelación Campestre

**Portal digital de inversión y vitrina inmobiliaria** para la parcelación campestre **La Holanda**, ubicada en Quimbaya, Quindío. Desarrollado por **INGESOCC SAS**.

Este proyecto es una aplicación web moderna construida con React que permite a los usuarios explorar lotes disponibles, conocer el proyecto, calcular valorización potencial y contactar al equipo comercial.

---

## 🏗️ Tech Stack

| Capa          | Tecnología                                                   |
| ------------- | ------------------------------------------------------------ |
| **Framework** | React 19                                                     |
| **Build**     | Vite 8                                                       |
| **Estilos**   | Tailwind CSS v4                                              |
| **Ruteo**     | React Router DOM v7                                          |
| **Estado**    | TanStack React Query v5                                      |
| **Formularios** | React Hook Form + Zod                                      |
| **Iconos**    | Lucide React                                                 |
| **Backend**   | Supabase (Auth + RLS + RPC functions)                        |
| **Imágenes**  | Cloudinary (upload widget + optimización)                    |

---

## 🎨 Sistema de Diseño

La identidad visual se apoya en los siguientes tokens:

| Token            | Hex       | Uso                                      |
| ---------------- | --------- | ---------------------------------------- |
| Forest Green     | `#1B4332` | Color corporativo principal, CTAs        |
| Coffee Green     | `#2D6A4F` | Hovers, indicadores de financiación      |
| Soft Gold        | `#D4A373` | Etiquetas de apreciación, acentos premium |
| Warm White       | `#FAFAF8` | Superficies, fondo clean                 |
| Deep Forest      | `#081C15` | Tipografía de alto contraste             |

**Tipografía**: Playfair Display para títulos e Inter para cuerpo de texto.

---

## 🚀 Desarrollo local

```bash
# Instalar dependencias
bun install
# o
npm install

# Iniciar servidor de desarrollo
bun run dev
# o
npm run dev
```

### Build de producción

```bash
bun run build
npm run build   # o con npm
```

### Preview del build

```bash
bun run preview
```

---

## 📁 Estructura del proyecto

```
src/
├── components/          # Componentes compartidos (layout, UI)
│   ├── home/            # Secciones del landing (carousel, hero estático)
│   ├── layout/          # TopNavBar, Footer, BottomNavBar, RootLayout
│   ├── quindio/         # Secciones de la página "Descubre Quindío"
│   └── ui/              # Componentes atómicos (LazyImage, WhatsAppButton)
├── constants/           # Datos estáticos (lotes, stats, navLinks, project)
├── features/
│   ├── admin/           # Panel administrativo (login, dashboard, CRUD lotes)
│   ├── home/            # Página principal (hero, formulario, lotes destacados)
│   ├── investment/      # Página de inversión (ROI, análisis de mercado)
│   └── projects/        # Listado y detalle de lotes
├── hooks/               # Custom hooks (useAuth, useScrollReveal, etc.)
├── lib/                 # Utilidades (supabase client, cloudinary, checkAdmin)
├── pages/               # Páginas independientes (DescubreQuindio)
└── router/              # Configuración de rutas (React Router)
```

---

## 🔐 Administración

El panel admin está disponible en `/admin/login`. Permite gestionar:

- **Dashboard** — estadísticas de visitas y leads
- **Lotes** — CRUD completo con subida de imágenes a Cloudinary

El acceso está protegido por autenticación de Supabase y RLS a nivel de base de datos.

---

## 🧹 Linting y CI

```bash
# ESLint
npm run lint

# React Doctor — análisis estático de componentes
npm run lint:doctor
```

El proyecto incluye un pipeline de CI (GitHub Actions) que ejecuta lint y build en cada push a `main`.

---

## 📄 Licencia

Desarrollado por **INGESOCC SAS** — Todos los derechos reservados.

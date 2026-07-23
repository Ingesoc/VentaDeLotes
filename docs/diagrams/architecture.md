---
tags:
  - diagrams
  - mermaid
  - drawio
  - architecture
created: 2026-07-21
updated: 2026-07-21
---

# 📊 Diagramas del Proyecto

Este directorio contiene todos los diagramas de arquitectura del proyecto en dos formatos:

---

## 🎨 Diagramas Draw.io (Editables)

> Recomendados para edición visual. Abrir con [draw.io](https://app.diagrams.net) o extensión VS Code.

| Archivo | Contenido | Vista Previa |
|---------|-----------|--------------|
| [arquitectura.drawio](./arquitectura.drawio) | 🏗️ Arquitectura general del sistema: 3 capas (navegador → lógica → servicios cloud) con todos los componentes React, rutas admin protegidas, y conexiones a Supabase/Cloudinary | Diagrama completo del sistema |
| [auth-flow.drawio](./auth-flow.drawio) | 🔐 Flujo de autenticación paso a paso: Usuario → LoginPage → AuthProvider → Supabase Auth → AdminGuard → RPC → Dashboard o Redirect | Secuencia de auth con 9 pasos numerados |
| [database-routing.drawio](./database-routing.drawio) | 🗄️ Esquema de base de datos (tablas `lots`, `admin_users`, funciones RPC, RLS) + 🌳 Árbol completo de rutas de React Router | Dos diagramas en uno: BD + Routing |

### Cómo abrir los archivos .drawio

1. **Opción 1 — draw.io online:** Arrastra el archivo a [app.diagrams.net](https://app.diagrams.net/)
2. **Opción 2 — VS Code:** Instala la extensión "Draw.io Integration" y haz clic en el archivo
3. **Opción 3 — Obsidian:** Usa el plugin "Obsidian Draw.io" (recomendado)

---

## 📝 Diagramas Mermaid (Integrados en Markdown)

> Renderizables nativamente en Obsidian. No requieren plugins.

### 1. Diagrama de Contexto del Sistema (C4 Nivel 1)

```mermaid
graph TB
    subgraph "👤 Usuarios"
        U[Visitante Web]
        A[Administrador]
    end

    subgraph "🌐 Navegador (SPA)"
        direction TB
        REACT[React 19 App]
        ROUTER[React Router v7]
        QUERY[TanStack Query]
        CSS[Tailwind CSS v4]
    end

    subgraph "☁️ Servicios Cloud"
        SUPABASE[("Supabase
                    Auth + PostgreSQL + RLS")]
        CLOUDINARY[("Cloudinary
                    CDN + Upload Widget")]
        FONTS[("Google Fonts
                    Inter + Playfair Display")]
    end

    U -->|Navega| REACT
    A -->|Gestiona lotes| REACT
    REACT --> ROUTER
    REACT --> QUERY
    QUERY -->|Fetch/Cache| SUPABASE
    REACT -->|Auth Session| SUPABASE
    REACT -->|Sube imágenes| CLOUDINARY
    REACT -->|Carga fuentes| FONTS
    REACT -->|Sirve imágenes| CLOUDINARY
    SUPABASE -->|RPC: has_backstage_access| REACT
```

### 2. Diagrama de Componentes React

```mermaid
graph TB
    subgraph "main.tsx (Entry)"
        MAIN[createRoot]
    end

    subgraph "Providers"
        QUERY_PROV[QueryClientProvider]
        AUTH_PROV[AuthProvider<br/>useAuth.tsx]
    end

    subgraph "Router<br/>router/index.tsx"
        ROUTER_MAIN[createBrowserRouter]
        PUBLIC[Public Routes]
        ADMIN[Admin Routes<br/>lazy()]
    end

    subgraph "Layouts"
        ROOT[RootLayout]
        ADMIN_LAYOUT[AdminLayout]
    end

    subgraph "Public Pages"
        HOME[HomePage]
        INVEST[InvestmentPage]
        PROJ[ProjectsPage]
        PROJ_DETAIL[ProjectDetailPage<br/>projects/:id]
        QUINDIO[DescubreQuindio]
    end

    subgraph "Admin Pages (Code Split)"
        LOGIN[LoginPage]
        DASH[DashboardPage]
        LOTS[LotsPage]
        GUARD[AdminGuard]
    end

    MAIN --> QUERY_PROV
    QUERY_PROV --> AUTH_PROV
    AUTH_PROV --> ROUTER_MAIN
    ROUTER_MAIN --> PUBLIC
    ROUTER_MAIN --> ADMIN
    PUBLIC --> ROOT
    ROOT --> HOME
    ROOT --> INVEST
    ROOT --> PROJ
    ROOT --> PROJ_DETAIL
    ROOT --> QUINDIO
    ADMIN --> GUARD
    GUARD --> ADMIN_LAYOUT
    ADMIN_LAYOUT --> DASH
    ADMIN_LAYOUT --> LOTS
    ADMIN --> LOGIN
```

### 3. Flujo de Autenticación (Secuencia)

```mermaid
sequenceDiagram
    participant U as Usuario
    participant LP as LoginPage
    participant AP as AuthProvider
    participant SA as Supabase Auth
    participant AG as AdminGuard
    participant DB as Supabase DB

    U->>LP: Ingresa email + password
    LP->>AP: login(email, password)
    AP->>SA: signInWithPassword()
    SA-->>AP: { user, session }
    AP-->>LP: { user, error }

    alt Error
        LP-->>U: Mostrar error
    else Success
        LP->>AG: Navega a /admin/dashboard
        AG->>AP: get user.email
        AG->>DB: RPC has_backstage_access(user_email)
        DB-->>AG: true/false
        alt isAdmin
            AG-->>AG: Renderiza <Outlet />
            AG-->>U: Dashboard
        else No Admin
            AG-->>U: Redirect a /admin/login
        end
    end
```

### 4. Esquema de Base de Datos (ERD)

```mermaid
erDiagram
    lots {
        text id PK
        numeric area_m2
        numeric price
        text status
        text aerial_image
        timestamp created_at
        timestamp updated_at
    }

    admin_users {
        uuid id PK
        text email
        timestamp created_at
    }

    page_views {
        uuid id PK
        text lot_id FK
        text page_path
        timestamp viewed_at
    }

    lots ||--o{ page_views : "tiene"
```

### 5. Pipeline CI/CD

```mermaid
graph LR
    GIT[Git Push / PR] --> CHECKOUT[Checkout]
    CHECKOUT --> SETUP_BUN[Setup Bun]
    SETUP_BUN --> CACHE[Cache node_modules]
    CACHE --> INSTALL[bun install --frozen-lockfile]
    INSTALL --> BUILD[bun run build<br/>tsc -b && vite build]
    BUILD --> DOCTOR[npx react-doctor]
    DOCTOR --> RESULT{¿Éxito?}

    RESULT -->|Sí| PASS[✅ Pipeline pasa]
    RESULT -->|No| FAIL[❌ Pipeline falla]
```

### 6. Estructura de Archivos (Código)

```mermaid
graph TB
    subgraph "src/"
        SRC_COMPONENTS[components/]
        SRC_CONSTANTS[constants/]
        SRC_FEATURES[features/]
        SRC_HOOKS[hooks/]
        SRC_LIB[lib/]
        SRC_PAGES[pages/]
        SRC_ROUTER[router/]
        SRC_MAIN[main.tsx]
        SRC_CSS[index.css]
    end

    subgraph "components/"
        LAYOUT[layout/<br/>RootLayout, TopNav<br/>BottomNav, Footer]
        UI[ui/<br/>LazyImage, WhatsAppButton]
        SEO[seo/<br/>PageSEO]
        QUI[quindio/<br/>CulturalHeritage, WellnessSection]
        HOME_C[home/<br/>HomeCarousel]
    end

    subgraph "features/"
        ADMIN[admin/<br/>Dashboard, Login, Lots]
        HOME_F[home/<br/>Hero, FeaturedLots, ContactForm]
        INVEST[investment/<br/>InvestmentHero, RoiAnalysis]
        PROJECTS[projects/<br/>LotCard, LotFilters, LotGallery]
    end

    subgraph "hooks/"
        AUTH[useAuth.tsx]
        AUTH_CTX[useAuthContext.ts]
        SCROLL[useScrollReveal.ts]
        TRACK[useTrackPageView.ts]
    end

    subgraph "lib/"
        SUPABASE_LIB[supabase.ts]
        CLOUD_LIB[cloudinary.ts]
        ADMIN_LIB[checkAdmin.ts]
    end

    SRC_MAIN --> SRC_ROUTER
    SRC_MAIN --> SRC_CSS
    SRC_ROUTER --> SRC_FEATURES
    SRC_FEATURES --> ADMIN
    SRC_FEATURES --> HOME_F
    SRC_FEATURES --> INVEST
    SRC_FEATURES --> PROJECTS
    SRC_ROUTER --> SRC_COMPONENTS
    SRC_COMPONENTS --> LAYOUT
    SRC_COMPONENTS --> UI
    SRC_COMPONENTS --> SEO
    SRC_COMPONENTS --> QUI
    SRC_COMPONENTS --> HOME_C
    SRC_FEATURES --> SRC_CONSTANTS
    SRC_FEATURES --> SRC_HOOKS
    SRC_HOOKS --> AUTH
    SRC_HOOKS --> AUTH_CTX
    SRC_HOOKS --> SCROLL
    SRC_HOOKS --> TRACK
    SRC_FEATURES --> SRC_LIB
    SRC_LIB --> SUPABASE_LIB
    SRC_LIB --> CLOUD_LIB
    SRC_LIB --> ADMIN_LIB
```

### 7. Flujo de Subida de Imágenes

```mermaid
sequenceDiagram
    participant A as Admin
    participant LP as LotsPage
    participant CW as Cloudinary Widget
    participant SUP as Supabase

    A->>LP: Clic "Subir imagen"
    LP->>LP: setUploading(lotId)
    LP->>CW: uploadImage()
    CW-->>A: Abre selector de archivos
    A->>CW: Selecciona imagen
    CW->>CW: Sube a Cloudinary
    CW-->>LP: secure_url

    alt URL recibida
        LP->>SUP: UPDATE lots SET aerial_image = url
        SUP-->>LP: OK
        LP->>LP: Actualiza UI local
        LP->>LP: setUploading(null)
    else Usuario canceló
        LP->>LP: setUploading(null)
    end
```

---

## 🔗 Enlaces Relacionados

- [📋 Índice de Documentación](../index.md)
- [🏗️ Arquitectura del Proyecto](../architecture/overview.md)
- [🚀 Guía de Onboarding](../guides/onboarding.md)
- [🔐 Sistema de Autenticación](../features/authentication.md)
- [🗄️ Base de Datos](../features/database.md)
- [🗺️ Sistema de Enrutamiento](../features/routing.md)

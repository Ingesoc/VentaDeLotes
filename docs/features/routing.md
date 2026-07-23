---
tags:
  - routing
  - react-router
  - navigation
created: 2026-07-21
---

# 🗺️ Sistema de Enrutamiento

## Tecnología: React Router v7

El proyecto usa `createBrowserRouter` (modo data router) para el enrutamiento SPA.

## Estructura de Rutas

```
/
├── /                       → HomePage (Landing principal)
├── /investment             → InvestmentPage
├── /projects               → ProjectsPage
├── /projects/:id           → ProjectDetailPage
├── /descubre-quindio       → DescubreQuindio
│
├── /admin/login            → LoginPage (público, lazy)
│
└── /admin                  → AdminGuard (protegido, lazy)
    ├── /admin              → Redirect a /admin/dashboard
    ├── /admin/dashboard    → DashboardPage
    └── /admin/lots         → LotsPage
```

## Layouts

### RootLayout (público)
```
<HelmetProvider>
  <ScrollToTop />
  <TopNavBar />
  <main><Outlet /></main>     ← Página actual
  <Footer />
  <BottomNavBar />            ← Navegación móvil
  <WhatsAppButton />          ← Botón flotante
</HelmetProvider>
```

### AdminLayout (administración)
```
<aside>Logo + Nav + Logout</aside>
<main>
  <header>Panel de Administración</header>
  <Outlet />                  ← Dashboard o Lots
</main>
```

## Code Splitting

Las rutas administrativas se cargan bajo demanda con `React.lazy()`:

```typescript
const AdminGuard = lazy(() => 
  import("@/features/admin/components/AdminGuard")
    .then(m => ({ default: m.AdminGuard }))
);
```

Ver [ADR-001](../decisions/adr-001-react-router-code-splitting.md) para más detalles.

## Componentes de Navegación

### TopNavBar
- Navegación principal desktop
- Links: Inicio, Invertir, Proyectos, Quindío
- Logo/marca del proyecto

### BottomNavBar
- Navegación inferior para móviles
- Iconos Lucide: Explorar, Invertir, Guardados, Chat
- Se muestra solo en viewports < 768px

### ScrollToTop
- Escucha cambios de ruta y hace scroll al top
- Previene que el scroll persista entre páginas

## Consideraciones
- Todas las rutas públicas están debajo del layout `RootLayout` que provee header/footer
- Las rutas admin tienen su propio layout con sidebar de navegación
- `AdminGuard` verifica autenticación + rol admin antes de renderizar rutas hijas

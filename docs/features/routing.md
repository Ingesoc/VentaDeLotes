---
tags:
  - routing
  - react-router
  - navigation
created: 2026-07-21
updated: 2026-08-12
---

# Sistema de routing

## Tecnología: React Router v8

El proyecto usa `createBrowserRouter` (modo data router) de React Router v8.

## Estructura de rutas

```
/
├── /                       HomePage (página principal)
├── /investment             InvestmentPage (lazy)
├── /projects               ProjectsPage
├── /projects/:id           ProjectDetailPage (lazy)
├── /descubre-quindio       DescubreQuindio (lazy)
├── /contact                ContactPage (lazy)
├── /saved                  Redirige a /projects
│
├── /admin/login            LoginPage (lazy, público)
└── /admin                  AdminGuard (lazy, protegido)
    ├── /admin              Redirige a /admin/dashboard
    ├── /admin/dashboard    DashboardPage (lazy)
    └── /admin/lots         LotsPage (lazy)
```

## Layouts

### RootLayout (público)

```
<HelmetProvider>
  <ScrollToTop />
  <TopNavBar />
  <main><Outlet /></main>      Página actual
  <Footer />
  <BottomNavBar />             Navegación móvil
  <WhatsAppButton />           Botón flotante
</HelmetProvider>
```

### AdminLayout (administración)

```
<aside>Logo + navegación + logout</aside>
<main>
  <header>Panel de administración</header>
  <Outlet />                   Dashboard o Lotes
</main>
```

## Code splitting

Las rutas secundarias y todo el panel admin se cargan bajo demanda con la propiedad `lazy` de ruta:

```typescript
{
  path: "investment",
  lazy: () => import("@/features/investment/InvestmentPage")
    .then((m) => ({ Component: m.InvestmentPage })),
}
```

Home y Projects se importan de forma directa para un primer render rápido. Ver [ADR-001](../decisions/adr-001-react-router-code-splitting.md).

## Componentes de navegación

### TopNavBar

- Barra fija superior con logo y menú de escritorio.
- Enlaces: Proceso, Quindío, Lotes, Contacto y un botón "Reservar".
- En móvil muestra un botón de menú que abre un panel a pantalla completa.

### BottomNavBar

- Navegación inferior para móviles (visible bajo 768px).
- Ítems: Explorar, Invertir, Guardados y Contacto.
- Usa iconos de Lucide.

### ScrollToTop

- Escucha los cambios de ruta y lleva el scroll al inicio de la página.

## Consideraciones

- Todas las rutas públicas están bajo `RootLayout`, que provee el header y el footer.
- Las rutas admin usan su propio layout con sidebar.
- `AdminGuard` verifica autenticación y rol admin antes de renderizar las rutas hijas.
- Las rutas inexistentes muestran la página 404 (`ErrorPage`) con el código de estado.

import { createBrowserRouter, Navigate } from "react-router";
import { RootLayout } from "@/components/layout/RootLayout";
import ErrorPage from "@/components/ui/ErrorPage";

// Páginas principales — se cargan eager para First Paint rápido
import { HomePage } from "@/features/home/HomePage";
import { ProjectsPage } from "@/features/projects/ProjectsPage";

// Páginas secundarias — lazy loading via route-level lazy (React Router v8)
// para cargar el módulo completo en paralelo, evitando React.lazy()
// que rompe la regla react-refresh/only-export-components.

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "investment",
        lazy: () => import("@/features/investment/InvestmentPage").then(m => ({ Component: m.InvestmentPage })),
      },
      {
        path: "projects",
        element: <ProjectsPage />,
      },
      {
        path: "projects/:id",
        lazy: () => import("@/features/projects/ProjectDetailPage").then(m => ({ Component: m.ProjectDetailPage })),
      },
      {
        path: "descubre-quindio",
        lazy: () => import("../pages/DescubreQuindio").then(m => ({ Component: m.default })),
      },
      {
        path: "contact",
        lazy: () => import("../pages/ContactPage").then(m => ({ Component: m.default })),
      },
      {
        // Blog: guía pilar SEO #1
        path: "blog/guia-compra-lote-rural-quindio",
        lazy: () => import("../pages/blog/CompraLoteRuralQuindio").then(m => ({ Component: m.default })),
      },
      {
        // Blog: guía pilar SEO #2
        path: "blog/escrituracion-lotes-colombia",
        lazy: () => import("../pages/blog/EscrituracionLotesColombia").then(m => ({ Component: m.default })),
      },
      {
        // Blog: guía pilar SEO #3 — inversión
        path: "blog/inversion-eje-cafetero-finca-raiz",
        lazy: () => import("../pages/blog/InversionEjeCafetero").then(m => ({ Component: m.default })),
      },
      {
        // Blog: guía pilar SEO #4 — comparativa zonas
        path: "blog/quimbaya-vs-filandia-vs-salento",
        lazy: () => import("../pages/blog/QuimbayaVsFilandiaVsSalento").then(m => ({ Component: m.default })),
      },
      {
        // Blog: guía pilar SEO #5 — financiación
        path: "blog/financiacion-compra-lotes-rurales",
        lazy: () => import("../pages/blog/FinanciacionLotesRurales").then(m => ({ Component: m.default })),
      },
      {
        // Blog: guía pilar SEO #6 — vivir en Quimbaya
        path: "blog/vivir-en-quimbaya",
        lazy: () => import("../pages/blog/VivirEnQuimbaya").then(m => ({ Component: m.default })),
      },
      {
        // Blog: índice
        path: "blog",
        lazy: () => import("../pages/BlogIndex").then(m => ({ Component: m.default })),
      },
      {
        // Blog: guía pilar SEO #7 — escritura pública
        path: "blog/lotes-con-escritura-publica-verificar",
        lazy: () => import("../pages/blog/LotesEscrituraPublica").then(m => ({ Component: m.default })),
      },
      {
        // Llegada del enlace de recuperación de contraseña (Supabase)
        path: "reset-password",
        lazy: () => import("../pages/ResetPasswordPage").then(m => ({ Component: m.default })),
      },
      {
        path: "saved",
        lazy: () => import("../pages/SavedPage").then(m => ({ Component: m.default })),
      },
    ],
  },
  // Login admin (público)
  {
    path: "/admin/login",
    errorElement: <ErrorPage />,
    lazy: () => import("@/features/admin/LoginPage").then(m => ({ Component: m.Component })),
  },
  // Rutas admin (protegidas) — route-level lazy property en vez de React.lazy
  {
    path: "/admin",
    errorElement: <ErrorPage />,
    lazy: () => import("@/features/admin/components/AdminGuard").then(m => ({ Component: m.Component })),
    children: [
      {
        lazy: () => import("@/features/admin/components/AdminLayout").then(m => ({ Component: m.Component })),
        children: [
          {
            index: true,
            element: <Navigate to="/admin/dashboard" replace />,
          },
          {
            path: "dashboard",
            lazy: () => import("@/features/admin/DashboardPage").then(m => ({ Component: m.Component })),
          },
          {
            path: "analytics",
            lazy: () => import("@/features/admin/AnalyticsPage").then(m => ({ Component: m.Component })),
          },
          {
            path: "leads",
            lazy: () => import("@/features/admin/LeadsPage").then(m => ({ Component: m.Component })),
          },
          {
            path: "lots",
            lazy: () => import("@/features/admin/LotsPage").then(m => ({ Component: m.Component })),
          },
        ],
      },
    ],
  },
]);

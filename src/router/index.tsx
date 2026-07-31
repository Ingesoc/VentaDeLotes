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
        path: "saved",
        element: <Navigate to="/projects" replace />,
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
            path: "lots",
            lazy: () => import("@/features/admin/LotsPage").then(m => ({ Component: m.Component })),
          },
        ],
      },
    ],
  },
]);

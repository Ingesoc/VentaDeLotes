import { lazy, Suspense } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import { RootLayout } from "@/components/layout/RootLayout";
import ErrorPage from "@/components/ui/ErrorPage";

// Páginas principales — se cargan eager para First Paint rápido
import { HomePage } from "@/features/home/HomePage";
import { ProjectsPage } from "@/features/projects/ProjectsPage";

// Páginas secundarias — lazy loading para reducir bundle inicial
const InvestmentPage = lazy(() => import("@/features/investment/InvestmentPage").then(m => ({ default: m.InvestmentPage })));
const ProjectDetailPage = lazy(() => import("@/features/projects/ProjectDetailPage").then(m => ({ default: m.ProjectDetailPage })));
const DescubreQuindio = lazy(() => import("../pages/DescubreQuindio"));

// Admin pages se cargan via route lazy property (React Router v7)
// para cargar el modulo completo en paralelo, no solo el componente.

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
        element: (
          <Suspense fallback={<div className="min-h-[60dvh] flex items-center justify-center"><div className="w-8 h-8 border-4 border-heritage-gold border-t-transparent rounded-full animate-spin" /></div>}>
            <InvestmentPage />
          </Suspense>
        ),
      },
      {
        path: "projects",
        element: <ProjectsPage />,
      },
      {
        path: "projects/:id",
        element: (
          <Suspense fallback={<div className="min-h-[60dvh] flex items-center justify-center"><div className="w-8 h-8 border-4 border-heritage-gold border-t-transparent rounded-full animate-spin" /></div>}>
            <ProjectDetailPage />
          </Suspense>
        ),
      },
      {
        path: "descubre-quindio",
        element: (
          <Suspense fallback={<div className="min-h-[60dvh] flex items-center justify-center"><div className="w-8 h-8 border-4 border-heritage-gold border-t-transparent rounded-full animate-spin" /></div>}>
            <DescubreQuindio />
          </Suspense>
        ),
      },
    ],
  },
  // Login admin (público)
  {
    path: "/admin/login",
    errorElement: <ErrorPage />,
    lazy: () => import("@/features/admin/LoginPage"),
  },
  // Rutas admin (protegidas) — route-level lazy property en vez de React.lazy
  {
    path: "/admin",
    errorElement: <ErrorPage />,
    lazy: () => import("@/features/admin/components/AdminGuard"),
    children: [
      {
        lazy: () => import("@/features/admin/components/AdminLayout"),
        children: [
          {
            index: true,
            element: <Navigate to="/admin/dashboard" replace />,
          },
          {
            path: "dashboard",
            lazy: () => import("@/features/admin/DashboardPage"),
          },
          {
            path: "lots",
            lazy: () => import("@/features/admin/LotsPage"),
          },
        ],
      },
    ],
  },
]);

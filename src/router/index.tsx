import { lazy, Suspense } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import { RootLayout } from "@/components/layout/RootLayout";

// Páginas principales — se cargan eager para First Paint rápido
import { HomePage } from "@/features/home/HomePage";
import { ProjectsPage } from "@/features/projects/ProjectsPage";

// Páginas secundarias — lazy loading para reducir bundle inicial
const InvestmentPage = lazy(() => import("@/features/investment/InvestmentPage").then(m => ({ default: m.InvestmentPage })));
const ProjectDetailPage = lazy(() => import("@/features/projects/ProjectDetailPage").then(m => ({ default: m.ProjectDetailPage })));
const DescubreQuindio = lazy(() => import("../pages/DescubreQuindio"));

// Admin pages cargadas bajo demanda (code-split) para no exponer
// nombres de tablas administrativas en el bundle público
const AdminLayout = lazy(() => import("@/features/admin/components/AdminLayout").then(m => ({ default: m.AdminLayout })));
const AdminGuard = lazy(() => import("@/features/admin/components/AdminGuard").then(m => ({ default: m.AdminGuard })));
const LoginPage = lazy(() => import("@/features/admin/LoginPage").then(m => ({ default: m.LoginPage })));
const DashboardPage = lazy(() => import("@/features/admin/DashboardPage").then(m => ({ default: m.DashboardPage })));
const LotsPage = lazy(() => import("@/features/admin/LotsPage").then(m => ({ default: m.LotsPage })));

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "investment",
        element: (
          <Suspense fallback={<div className="min-h-[60vh] flex items-center justify-center"><div className="w-8 h-8 border-4 border-heritage-gold border-t-transparent rounded-full animate-spin" /></div>}>
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
          <Suspense fallback={<div className="min-h-[60vh] flex items-center justify-center"><div className="w-8 h-8 border-4 border-heritage-gold border-t-transparent rounded-full animate-spin" /></div>}>
            <ProjectDetailPage />
          </Suspense>
        ),
      },
      {
        path: "descubre-quindio",
        element: (
          <Suspense fallback={<div className="min-h-[60vh] flex items-center justify-center"><div className="w-8 h-8 border-4 border-heritage-gold border-t-transparent rounded-full animate-spin" /></div>}>
            <DescubreQuindio />
          </Suspense>
        ),
      },
    ],
  },
  // Login admin (público)
  {
    path: "/admin/login",
    element: <Suspense fallback={<div className="min-h-screen bg-deep-forest" />}><LoginPage /></Suspense>,
  },
  // Rutas admin (protegidas) — un solo Suspense cubre todos los componentes lazy
  {
    path: "/admin",
    element: (
      <Suspense fallback={<div className="min-h-screen bg-deep-forest" />}>
        <AdminGuard />
      </Suspense>
    ),
    children: [
      {
        element: <AdminLayout />,
        children: [
          {
            index: true,
            element: <Navigate to="/admin/dashboard" replace />,
          },
          {
            path: "dashboard",
            element: <DashboardPage />,
          },
          {
            path: "lots",
            element: <LotsPage />,
          },
        ],
      },
    ],
  },
]);

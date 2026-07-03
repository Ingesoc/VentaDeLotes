import { createBrowserRouter } from "react-router-dom";
import { RootLayout } from "@/components/layout/RootLayout";
import { HomePage } from "@/features/home/HomePage";
import { InvestmentPage } from "@/features/investment/InvestmentPage";

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
        element: <InvestmentPage />,
      },
      // Rutas futuras:
      // { path: "/projects", element: <ProjectsPage /> },
      // { path: "/projects/:id", element: <ProjectDetailPage /> },
      // { path: "/calculator", element: <CalculatorPage /> },
      // { path: "/how-to-buy", element: <HowToBuyPage /> },
      // { path: "/contact", element: <ContactPage /> },
      // { path: "/blog", element: <BlogPage /> },
      // { path: "/dashboard", element: <DashboardPage /> },
    ],
  },
]);

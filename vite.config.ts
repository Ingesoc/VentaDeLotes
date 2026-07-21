import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "vite-plugin-sitemap";

const DYNAMIC_ROUTES = ["/", "/investment", "/projects", "/descubre-quindio"];

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    sitemap({
      hostname: "https://www.laholanda.com",
      dynamicRoutes: DYNAMIC_ROUTES,
      priority: {
        "/": 1.0,
        "/investment": 0.9,
        "/projects": 0.9,
        "/descubre-quindio": 0.8,
      },
      changefreq: "weekly",
      exclude: ["/admin", "/admin/*"],
      generateRobotsTxt: false,
      readable: true,
    }),
  ],
  resolve: {
    alias: {
      "@": "/src",
    },
  },
  build: {
    rollupOptions: {
      external: ["@supabase/supabase-js"],
      output: {
        manualChunks(id: string) {
          // React y router — estables, se cachean entre builds
          if (id.includes("node_modules/react/") ||
              id.includes("node_modules/react-dom/") ||
              id.includes("node_modules/react-router") ||
              id.includes("node_modules/react-helmet")) {
            return "vendor-react";
          }
          // UI libraries (iconos, carrusel)
          if (id.includes("node_modules/lucide-react") ||
              id.includes("node_modules/embla-carousel")) {
            return "vendor-ui";
          }
          // Formularios
          if (id.includes("node_modules/react-hook-form") ||
              id.includes("node_modules/zod") ||
              id.includes("node_modules/@hookform")) {
            return "vendor-forms";
          }
        },
      },
    },
  },
  optimizeDeps: {
    exclude: ["@supabase/supabase-js"],
  },
});
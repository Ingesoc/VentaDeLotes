/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "vite-plugin-sitemap";
import { VitePWA } from "vite-plugin-pwa";
// IDs de los 16 lotes del plan maestro — se mantienen sincronizados con src/constants/lots.ts
const LOT_IDS = ["01","02","03","04","05","06","07","08","09","10","11","12","13","14","15","16"];
const LOT_ROUTES = LOT_IDS.map((id) => `/projects/${id}`);
const DYNAMIC_ROUTES = ["/", "/investment", "/projects", "/descubre-quindio", "/contact", ...LOT_ROUTES];

const LOT_PRIORITIES = Object.fromEntries(
  LOT_IDS.map((id) => [`/projects/${id}`, 0.7]),
);

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      // Inline el registro del SW en el HTML: evita el request render-blocking
      // a /registerSW.js que Lighthouse señala en el camino crítico.
      injectRegister: "inline",
      includeAssets: ["favicon/**/*", "robots.txt"],
      manifest: {
        name: "La Holanda — Parcelación Campestre",
        short_name: "La Holanda",
        description:
          "Lotes campestres en Quimbaya, Quindío. Inversión y vida en el Eje Cafetero de Colombia.",
        theme_color: "#1B4332",
        background_color: "#FAFAF8",
        display: "standalone",
        start_url: "/",
        icons: [
          {
            src: "/favicon/android-icon-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/favicon/android-icon-144x144.png",
            sizes: "144x144",
            type: "image/png",
          },
        ],
      },
      workbox: {
        // Solo precargamos JS, CSS, HTML, fuentes e iconos pequeños.
        // Las imágenes grandes (jpg, webp, png de contenido) se manejan
        // con runtime caching (StaleWhileRevalidate).
        globPatterns: ["**/*.{js,css,html,ico}", "favicon/**/*.png", "fonts/**/*.woff2"],
        // Estrategia: precarga todo el app shell, luego actualiza en background
        runtimeCaching: [
          {
            // Cloudinary images: stale-while-revalidate
            // Muestra rápido desde caché, actualiza en segundo plano
            urlPattern: /^https:\/\/res\.cloudinary\.com\/.*/,
            handler: "StaleWhileRevalidate",
            options: {
              cacheName: "cloudinary-images",
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 días
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            // Google Fonts: cache-first (rara vez cambian)
            urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/,
            handler: "CacheFirst",
            options: {
              cacheName: "google-fonts",
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 año
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            // Supabase API: network first, fallback a caché
            urlPattern: /^https:\/\/[a-z0-9-]+\.supabase\.co\/.*/,
            handler: "NetworkFirst",
            options: {
              cacheName: "supabase-api",
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60, // 1 hora
              },
              networkTimeoutSeconds: 10,
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
      },
    }),
    sitemap({
      hostname: "https://www.laholanda.com",
      dynamicRoutes: DYNAMIC_ROUTES,
      priority: {
        "/": 1.0,
        "/investment": 0.9,
        "/projects": 0.9,
        "/descubre-quindio": 0.8,
        "/contact": 0.8,
        ...LOT_PRIORITIES,
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
          // Formularios y zod: SIN regla de chunk propio. Al estar solo en
          // ContactForm (carga lazy), forzar un chunk nombrado hace que
          // rolldown lo promueva al bundle inicial de la home (~28 KiB extra
          // en el camino crítico). Se dejan en el chunk lazy del formulario.
          // Supabase — carga bajo demanda
          if (id.includes("node_modules/@supabase")) {
            return "vendor-supabase";
          }
        },
      },
    },
  },
  /* ─── Vitest Configuration ────────────────────────── */
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/test/setup.ts",
    css: true,
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "json-summary", "clover"],
      reportsDirectory: "./coverage",
      thresholds: {
        statements: 80,
        branches: 70,
        functions: 75,
        lines: 80,
      },
    },
  },
});
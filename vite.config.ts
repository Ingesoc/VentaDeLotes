import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@": "/src",
    },
  },
  build: {
    rollupOptions: {
      external: ["@supabase/supabase-js"],
    },
  },
  optimizeDeps: {
    exclude: ["@supabase/supabase-js"],
  },
});
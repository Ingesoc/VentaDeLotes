#!/usr/bin/env node
/**
 * Prerender estático de las rutas críticas del sitio.
 *
 * Problema que resuelve:
 *   React + Vite genera un SPA con <div id="root"></div> vacío en el HTML.
 *   Googlebot PUEDE ejecutar JS, pero hay un delay de "segunda ola" de
 *   indexación (días/semanas). Con prerender, el HTML estático ya contiene
 *   todo el contenido renderizado, meta tags dinámicos, y structured data —
 *   Google indexa inmediatamente sin esperar la ejecución de JS.
 *
 * Uso (tras `vite build`):
 *   node scripts/prerender.mjs
 *
 * Requiere: Playwright con Chromium (ya está en devDeps).
 */
import { spawn, execSync } from "node:child_process";
import http from "node:http";
import { writeFileSync, mkdirSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const DIST = resolve(ROOT, "dist");
const PORT = 4174;
const BASE_URL = `http://localhost:${PORT}`;

// ── Rutas a prerenderear ───────────────────────────────────────
// Solo rutas públicas con valor SEO. Admin, login, reset-password
// y saved se excluyen (noindex).
const ROUTES = [
  "/",
  "/projects",
  "/investment",
  "/descubre-quindio",
  "/contact",
  // Las 16 páginas de lotes individuales
  ...Array.from({ length: 16 }, (_, i) => `/projects/${String(i + 1).padStart(2, "0")}`),
];

// ── Helper: esperar servidor ────────────────────────────────────
function waitForServer(url, timeout = 30000) {
  return new Promise((res, rej) => {
    const start = Date.now();
    const check = () => {
      http
        .get(url, () => res(true))
        .on("error", () => {
          if (Date.now() - start > timeout) rej(new Error(`Timeout ${timeout}ms`));
          else setTimeout(check, 500);
        });
    };
    check();
  });
}

// ── Cleanup (sigue patrón de lighthouse-ci.mjs) ─────────────────
let serverProcess = null;
const cleanup = () => {
  if (!serverProcess?.pid) return;
  const pid = serverProcess.pid;
  serverProcess = null;
  try {
    if (process.platform === "win32") {
      execSync(`taskkill /pid ${pid} /T /F`, { stdio: "ignore", shell: true });
    } else {
      try { process.kill(-pid, "SIGKILL"); } catch { process.kill(pid, "SIGKILL"); }
    }
  } catch { /* ignore */ }
};
process.on("exit", cleanup);
process.on("SIGINT", () => { cleanup(); process.exit(1); });
process.on("SIGTERM", () => { cleanup(); process.exit(1); });

async function main() {
  // Verificar que dist/ existe
  if (!existsSync(DIST)) {
    console.error("  ❌ dist/ no existe. Ejecuta `vite build` primero.");
    process.exit(1);
  }

  console.log("\n🔧 Prerender — generando HTML estático para rutas críticas\n");

  // 1. Preview server
  console.log("  ▶ Iniciando preview server…");
  serverProcess = spawn(`npx vite preview --port ${PORT} --host`, {
    cwd: ROOT,
    stdio: ["ignore", "ignore", "inherit"],
    shell: true,
  });
  try {
    await waitForServer(BASE_URL);
    console.log(`  ✔ Servidor listo en ${BASE_URL}\n`);
  } catch (err) {
    console.error(`  ❌ ${err.message}`);
    cleanup();
    process.exit(1);
  }

  // 2. Lanzar Playwright (import dinámico para no romper si no está instalado)
  let chromium;
  try {
    const pw = await import("playwright");
    chromium = pw.chromium;
  } catch {
    console.error("  ❌ Playwright no instalado. Ejecuta: npx playwright install chromium");
    cleanup();
    process.exit(1);
  }

  const browser = await chromium.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-gpu"],
  });

  let ok = 0;
  let fail = 0;

  for (const route of ROUTES) {
    const url = `${BASE_URL}${route}`;
    const slug = route === "/" ? "index" : route.replace(/^\//, "").replace(/\//g, "-");
    const outPath = resolve(DIST, slug === "index" ? "index.html" : `${slug}/index.html`);

    try {
      const ctx = await browser.newContext({
        userAgent:
          "Mozilla/5.0 (Linux; Android 11; Pixel 5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36",
      });
      const page = await ctx.newPage();

      // Bloquear assets pesados innecesarios para el prerender
      await page.route("**/*.{png,jpg,jpeg,gif,webp,woff,woff2}", (r) => r.abort());
      // Permitir JS, CSS y HTML
      await page.route("**/*", (route) => {
        const reqUrl = route.request().url();
        if (reqUrl.includes(BASE_URL) || reqUrl.includes("cloudinary")) {
          route.continue();
        } else {
          route.abort();
        }
      });

      await page.goto(url, { waitUntil: "networkidle", timeout: 30000 });

      // Esperar a que React hidrate el contenido
      await page.waitForSelector("#root > *", { timeout: 15000 });
      // Pausa para que react-helmet-async actualice los meta tags en <head>
      await page.waitForTimeout(800);

      const html = await page.content();

      // Asegurar directorio de salida
      const dir = dirname(outPath);
      if (!existsSync(dir)) mkdirSync(dir, { recursive: true });

      writeFileSync(outPath, html, "utf-8");
      console.log(`  ✔ ${route} → ${slug}/index.html`);
      ok++;

      await ctx.close();
    } catch (err) {
      console.error(`  ❌ ${route}: ${err.message.slice(0, 150)}`);
      fail++;
    }
  }

  await browser.close();
  cleanup();

  console.log(`\n  📊 ${ok} prerendered, ${fail} errors`);
  if (fail > 0 && ok === 0) process.exit(1);
}

main().catch((err) => {
  console.error("❌ Error inesperado:", err);
  cleanup();
  process.exit(1);
});

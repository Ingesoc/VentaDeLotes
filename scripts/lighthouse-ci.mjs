#!/usr/bin/env node
/**
 * Auditoría Lighthouse para CI con presupuestos (budgets).
 *
 * Orquesta: preview server → Lighthouse (CLI, una sola pasada genera JSON+HTML)
 * → resumen → chequeo de presupuestos (exit 1 si algún score cae del mínimo).
 * Los reportes quedan en reports/ y el workflow los sube como artifact.
 *
 * Uso (desde la raíz del proyecto, tras `npm run build`):
 *   npm run lighthouse:ci              → audita la home
 *   npm run lighthouse:ci -- /contact  → audita rutas adicionales (una por arg)
 *
 * Nota Git Bash (Windows): los argumentos /ruta se convierten a rutas de Windows
 * (p. ej. /contact → C:/Program Files/Git/contact). Anteponer MSYS_NO_PATHCONV=1:
 *   MSYS_NO_PATHCONV=1 npm run lighthouse:ci -- /contact
 *
 * Presupuestos configurables por env (para ajustar sin editar el script):
 *   LHCI_PERF_MIN, LHCI_A11Y_MIN, LHCI_BP_MIN, LHCI_SEO_MIN,
 *   LHCI_LCP_MAX_MS, LHCI_CLS_MAX, LHCI_TBT_MAX_MS
 */
import { spawn, execSync } from "node:child_process";
import http from "node:http";
import { mkdirSync, readFileSync, existsSync, rmSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const PORT = 4173;
const BASE_URL = `http://localhost:${PORT}`;
const REPORTS_DIR = resolve(ROOT, "reports");
const CONFIG_PATH = resolve(ROOT, "lighthouse.config.mjs");

// ── Presupuestos por defecto ──────────────────────────────────────
// Con margen sobre los scores actuales (PERF ~80-92, A11Y/BP/SEO 100) para
// absorber el ruido entre corridas, pero disparan en regresiones reales.
const BUDGETS = {
  performance: Number(process.env.LHCI_PERF_MIN ?? 70),
  accessibility: Number(process.env.LHCI_A11Y_MIN ?? 95),
  "best-practices": Number(process.env.LHCI_BP_MIN ?? 90),
  seo: Number(process.env.LHCI_SEO_MIN ?? 90),
};

const CWV_BUDGETS = [
  { id: "largest-contentful-paint", label: "LCP", max: Number(process.env.LHCI_LCP_MAX_MS ?? 6000), unit: "ms" },
  { id: "cumulative-layout-shift", label: "CLS", max: Number(process.env.LHCI_CLS_MAX ?? 0.1), unit: "" },
  { id: "total-blocking-time", label: "TBT", max: Number(process.env.LHCI_TBT_MAX_MS ?? 600), unit: "ms" },
];

const URLS = process.argv.slice(2).length
  ? process.argv.slice(2).map((p) => (p.startsWith("http") ? p : `${BASE_URL}${p.startsWith("/") ? p : `/${p}`}`))
  : [BASE_URL];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function waitForServer(url, timeout = 60000) {
  return new Promise((resolve, reject) => {
    const start = Date.now();
    const check = () => {
      http.get(url, (res) => resolve(true)).on("error", () => {
        if (Date.now() - start > timeout) reject(new Error(`Servidor no listo tras ${timeout}ms`));
        else setTimeout(check, 500);
      });
    };
    check();
  });
}

function slugify(url) {
  const path = new URL(url).pathname.replace(/^\/+|\/+$/g, "") || "home";
  return path.replace(/\//g, "-") || "home";
}

let serverProcess = null;
const cleanup = () => {
  if (!serverProcess?.pid) return;
  const pid = serverProcess.pid;
  serverProcess = null;
  try {
    if (process.platform === "win32") {
      // taskkill /T mata el ÁRBOL completo (cmd.exe → npx.cmd → node vite).
      // child.kill() solo mataría el shell y dejaría vite huérfano con el
      // puerto abierto (causaba "colgadas" y servidores fantasma en Windows).
      execSync(`taskkill /pid ${pid} /T /F`, { stdio: "ignore", shell: true });
    } else {
      // Grupo de procesos en POSIX (los hijos comparten el pgid del shell).
      try { process.kill(-pid, "SIGKILL"); } catch { process.kill(pid, "SIGKILL"); }
    }
  } catch { /* ignore */ }
};
process.on("exit", cleanup);
process.on("SIGINT", () => { cleanup(); process.exit(1); });
process.on("SIGTERM", () => { cleanup(); process.exit(1); });

async function main() {
  mkdirSync(REPORTS_DIR, { recursive: true });
  console.log(`\n🔦 Lighthouse CI — ${URLS.length} URL(s)\n`);

  // 1. Preview server
  console.log("  ▶ Iniciando preview server…");
  // Comando como string único con shell para evitar el warning DEP0190
  // (args array + shell) y resolver npx.cmd en Windows.
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

  let anyFailure = false;

  for (const url of URLS) {
    const slug = slugify(url);
    const base = resolve(REPORTS_DIR, `lighthouse-ci-${slug}`);
    const jsonPath = `${base}.report.json`;
    const htmlPath = `${base}.report.html`;

    // Eliminar reportes de corridas anteriores (para no confundir con stale).
    for (const p of [jsonPath, htmlPath]) rmSync(p, { force: true });

    console.log(`  ── Auditar ${new URL(url).pathname || "/"} ──`);
    try {
      // Una sola pasada genera JSON + HTML (output-path actúa como base name).
      execSync(
        `npx lighthouse ${url} ` +
          `--config-path="${CONFIG_PATH}" ` +
          `--output=json,html ` +
          `--output-path="${base}" ` +
          `--chrome-flags="--headless=new --no-sandbox --disable-gpu" ` +
          `--quiet`,
        { cwd: ROOT, timeout: 180_000, shell: true, encoding: "utf-8", stdio: ["ignore", "ignore", "inherit"] }
      );
    } catch (err) {
      // En Windows, chrome-launcher a veces lanza EPERM al borrar su carpeta
      // temporal DESPUÉS de escribir los reportes (bug conocido). Si el JSON
      // existe, la pasada realmente completó → no es bloqueante.
      if (existsSync(jsonPath)) {
        console.warn(`  ⚠ Error no bloqueante tras generar reportes (posible EPERM de limpieza en Windows).`);
      } else {
        anyFailure = true;
        console.error(`  ❌ Falló Lighthouse para ${url}: ${err.message.slice(0, 200)}`);
        continue;
      }
    }

    if (!existsSync(jsonPath)) {
      anyFailure = true;
      console.error(`  ❌ No se generó el reporte JSON para ${url}`);
      continue;
    }

    const lhr = JSON.parse(readFileSync(jsonPath, "utf-8"));
    const scores = {};
    for (const [key, cat] of Object.entries(lhr.categories)) scores[key] = Math.round((cat.score || 0) * 100);

    // ── Tabla de resumen ──
    console.log("");
    for (const [key, label] of [["performance", "Performance"], ["accessibility", "Accesibilidad"], ["best-practices", "Best Practices"], ["seo", "SEO"]]) {
      const icon = scores[key] >= 90 ? "🟢" : scores[key] >= 50 ? "🟠" : "🔴";
      console.log(`    ${icon} ${label}: ${scores[key]}/100`);
    }
    for (const cwv of CWV_BUDGETS) {
      const audit = lhr.audits[cwv.id];
      if (audit?.numericValue !== undefined) {
        const v = cwv.unit === "ms" ? Math.round(audit.numericValue) : audit.numericValue.toFixed(3);
        const ok = audit.numericValue <= cwv.max;
        console.log(`    ${ok ? "✅" : "❌"} ${cwv.label}: ${v}${cwv.unit} (máx ${cwv.max}${cwv.unit})`);
      }
    }

    // ── Chequeo de presupuestos ──
    let failed = false;
    for (const [key, min] of Object.entries(BUDGETS)) {
      if (scores[key] === undefined) continue;
      if (scores[key] < min) {
        failed = true;
        console.error(`    ❌ ${key}: ${scores[key]} < ${min}`);
      }
    }
    for (const cwv of CWV_BUDGETS) {
      const audit = lhr.audits[cwv.id];
      if (audit?.numericValue !== undefined && audit.numericValue > cwv.max) {
        failed = true;
        console.error(`    ❌ ${cwv.label}: ${audit.numericValue}${cwv.unit} > ${cwv.max}${cwv.unit}`);
      }
    }
    if (failed) {
      anyFailure = true;
      console.error(`  ❌ Presupuestos NO cumplidos en ${url}`);
    } else {
      console.log(`  ✔ Presupuestos cumplidos en ${url}`);
    }
    console.log("");
  }

  cleanup();

  if (anyFailure) {
    console.error("❌ Lighthouse CI: presupuestos no cumplidos. Revisa el reporte HTML subido como artifact.");
    process.exit(1);
  }
  console.log(`✅ Lighthouse CI OK — reportes en ${REPORTS_DIR}/lighthouse-ci-*.report.{json,html}\n`);
}

main().catch((err) => {
  console.error("❌ Error inesperado:", err);
  cleanup();
  process.exit(1);
});

/**
 * Script de auditoría Lighthouse programática
 *
 * Orquesta: build → preview server → Lighthouse → resultados
 * Uso: node run-lighthouse.mjs
 */import { spawn, execSync } from "child_process";
import http from "http";
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPORTS_DIR = resolve(__dirname, "reports");
const PORT = 4173;
const BASE_URL = `http://localhost:${PORT}`;

// ── Config de Lighthouse (inline para evitar archivo suelto) ──────
const LIGHTHOUSE_CONFIG = `export default {
  extends: "lighthouse:default",
  settings: {
    formFactor: "mobile",
    screenEmulation: { mobile: true, width: 375, height: 812, deviceScaleFactor: 2, disabled: false },
    throttling: { rttMs: 150, throughputKbps: 1600, cpuSlowdownMultiplier: 4, requestLatencyMs: 150, downloadThroughputKbps: 1600, uploadThroughputKbps: 750 },
    throttlingMethod: "simulate",
    onlyCategories: ["performance", "accessibility", "best-practices", "seo"],
  },
};
`;

function ensureConfigFile() {
  const configPath = resolve(__dirname, "reports", "lighthouse.config.mjs");
  // Escribe siempre para asegurar que refleje la versión más reciente
  writeFileSync(configPath, LIGHTHOUSE_CONFIG, "utf-8");
  return configPath;
}

// ─── Helpers ─────────────────────────────────────────────────────

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function waitForServer(url, timeout = 30000) {
  return new Promise((resolve, reject) => {
    const start = Date.now();
    const check = () => {
      http
        .get(url, (res) => {
          resolve(true);
        })
        .on("error", () => {
          if (Date.now() - start > timeout) {
            reject(new Error(`Server at ${url} not ready after ${timeout}ms`));
          } else {
            setTimeout(check, 500);
          }
        });
    };
    check();
  });
}

function log(label, msg) {
  const colors = {
    INICIO: "\x1b[36m",
    SERVER: "\x1b[33m",
    LIGHTHOUSE: "\x1b[35m",
    RESULT: "\x1b[32m",
    ERROR: "\x1b[31m",
    WARN: "\x1b[33m",
    DIR: "\x1b[34m",
    FIN: "\x1b[36m",
  };
  const color = colors[label] || "\x1b[0m";
  console.log(`${color}[${label}]\x1b[0m ${msg}`);
}

// ─── Main ────────────────────────────────────────────────────────

async function main() {
  log("INICIO", "Auditoría Lighthouse Mobile — La Holanda");

  // ── Cleanup handler ──
  let serverProcess = null;
  const cleanup = () => {
    if (serverProcess) {
      try {
        serverProcess.kill("SIGKILL");
      } catch {
        // ignore
      }
    }
  };
  process.on("exit", cleanup);
  process.on("SIGINT", () => {
    cleanup();
    process.exit(1);
  });
  process.on("SIGTERM", () => {
    cleanup();
    process.exit(1);
  });

  // 1. Asegurar directorio de reportes
  if (!existsSync(REPORTS_DIR)) {
    mkdirSync(REPORTS_DIR, { recursive: true });
    log("DIR", "Directorio reports/ creado");
  }

  // 2. Iniciar preview server
  log("SERVER", "Iniciando Vite preview server...");
  serverProcess = spawn("npx", ["vite", "preview", "--port", String(PORT), "--host"], {
    cwd: __dirname,
    stdio: ["ignore", "pipe", "pipe"],
    shell: true,
  });

  serverProcess.stdout.on("data", (data) => {
    const text = data.toString();
    if (text.includes("Local:") || text.includes("http://localhost")) {
      log("SERVER", `Preview server listo ✅ (${BASE_URL})`);
    }
  });

  serverProcess.stderr.on("data", (data) => {
    const text = data.toString().toLowerCase();
    if (text.includes("error") || text.includes("fail")) {
      log("WARN", `Server stderr: ${data.toString().trim()}`);
    }
  });

  serverProcess.on("error", (err) => {
    log("ERROR", `Server process error: ${err.message}`);
  });

  // 3. Esperar a que el servidor esté listo
  try {
    await waitForServer(BASE_URL);
    log("SERVER", `Servidor corriendo en ${BASE_URL}`);
  } catch (err) {
    log("ERROR", `No se pudo conectar al servidor: ${err.message}`);
    cleanup();
    process.exit(1);
  }

  // 4. Ejecutar Lighthouse (dos pasadas separadas para evitar problemas con rutas Windows con espacios)
  log("LIGHTHOUSE", "Ejecutando auditoría móvil... (puede tomar 30-60s)");

  const configPath = ensureConfigFile();
  const htmlReportPath = "./reports/lighthouse-mobile.html";
  const jsonReportPath = "./reports/lighthouse-mobile.json";

  // Eliminar reportes de corridas anteriores: así un JSON viejo no puede
  // confundirse con uno fresco si una pasada falla con EPERM de limpieza.
  rmSync(resolve(REPORTS_DIR, "lighthouse-mobile.html"), { force: true });
  rmSync(resolve(REPORTS_DIR, "lighthouse-mobile.json"), { force: true });

  try {
    // Primero HTML
    execSync(
      `npx lighthouse ${BASE_URL} ` +
        `--config-path="${configPath}" ` +
        `--output=html ` +
        `--output-path="${htmlReportPath}" ` +
        // --headless=new (modo nuevo): el headless viejo no pinta la página
        // y produce audits NO_FCP en Chrome moderno.
        `--chrome-flags="--headless=new --no-sandbox --disable-gpu" ` +
        `--quiet`,
      {
        cwd: __dirname,
        timeout: 120_000,
        shell: true,
        encoding: "utf-8",
      }
    );
    log("LIGHTHOUSE", "Reporte HTML generado ✅");

    // Luego JSON
    execSync(
      `npx lighthouse ${BASE_URL} ` +
        `--config-path="${configPath}" ` +
        `--output=json ` +
        `--output-path="${jsonReportPath}" ` +
        `--chrome-flags="--headless=new --no-sandbox --disable-gpu" ` +
        `--quiet`,
      {
        cwd: __dirname,
        timeout: 120_000,
        shell: true,
        encoding: "utf-8",
      }
    );
    log("LIGHTHOUSE", "Reporte JSON generado ✅");
  } catch (err) {
    // En Windows, chrome-launcher a veces lanza EPERM al borrar su carpeta
    // temporal DESPUÉS de escribir los reportes (bug conocido). Como los
    // reportes viejos se eliminaron antes de correr, su existencia aquí
    // significa que esta pasada los generó (el JSON es el que se lee luego).
    const htmlExists = existsSync(resolve(REPORTS_DIR, "lighthouse-mobile.html"));
    const jsonExists = existsSync(resolve(REPORTS_DIR, "lighthouse-mobile.json"));
    if (jsonExists) {
      log("WARN", `Lighthouse reportó un error no bloqueante (posible EPERM de limpieza): ${err.message.slice(0, 120)}`);
      log("LIGHTHOUSE", "Reportes generados a pesar del error; se continúa ✅");
    } else if (htmlExists) {
      log("WARN", `Solo se generó el reporte HTML: ${err.message.slice(0, 120)}`);
    } else {
      log("ERROR", `Lighthouse falló: ${err.message}`);

    // Verificar si Chrome/Chromium está instalado
    try {
      execSync("chrome --version 2>nul || google-chrome --version 2>nul || chromium --version 2>nul", {
        shell: true,
        stdio: "ignore",
      });
    } catch {
      log("INFO", "⚠️  Chrome/Chromium no está instalado.");
      log("INFO", "   Instálalo desde https://www.google.com/chrome/");
    }

      // Verificar si los reportes se generaron igual
      if (existsSync(resolve(REPORTS_DIR, "lighthouse-mobile.html"))) {
        log("INFO", "✅ Reporte HTML encontrado (pudo generarse parcialmente)");
      }
      if (existsSync(resolve(REPORTS_DIR, "lighthouse-mobile.json"))) {
        log("INFO", "✅ Reporte JSON encontrado (pudo generarse parcialmente)");
      }

      cleanup();
      process.exit(1);
    }
  }

  // 5. Leer resultados JSON
  let results;
  try {
    const raw = readFileSync(jsonReportPath, "utf-8");
    results = JSON.parse(raw);
    log("RESULT", "Reporte JSON parseado correctamente");
  } catch (parseErr) {
    log("WARN", `No se pudo parsear JSON: ${parseErr.message}`);
    log("RESULT", `✅ Reporte HTML disponible en: ${htmlReportPath}`);
    cleanup();
    return;
  }

  // 6. Mostrar resumen de Core Web Vitals
  const categories = results.categories || {};
  const audits = results.audits || {};

  console.log("\n═══════════════════════════════════════════");
  console.log("  📊  REPORTE LIGHTHOUSE MOBILE");
  console.log("═══════════════════════════════════════════\n");

  // ── Scores generales ──
  console.log("  CATEGORÍAS:");
  for (const [key, cat] of Object.entries(categories)) {
    const score = Math.round((cat.score || 0) * 100);
    const icon = score >= 90 ? "🟢" : score >= 50 ? "🟠" : "🔴";
    console.log(`    ${icon} ${cat.title}: ${score}/100`);
  }

  // ── Core Web Vitals ──
  const cwvKeys = {
    "Largest Contentful Paint (LCP)": "largest-contentful-paint",
    "Interaction to Next Paint (INP)": "interaction-to-next-paint",
    "Cumulative Layout Shift (CLS)": "cumulative-layout-shift",
    "First Contentful Paint (FCP)": "first-contentful-paint",
    "Speed Index": "speed-index",
    "Total Blocking Time (TBT)": "total-blocking-time",
  };

  console.log("\n  ⚡ CORE WEB VITALS:");
  for (const [name, key] of Object.entries(cwvKeys)) {
    const audit = audits[key];
    if (audit) {
      const displayValue = audit.displayValue || `${audit.numericValue?.toFixed(2) || "N/A"}`;
      const score = audit.score !== null ? Math.round(audit.score * 100) : null;
      const icon = score !== null ? (score >= 90 ? "✅" : score >= 50 ? "⚠️" : "❌") : "➖";
      console.log(`    ${icon} ${name}: ${displayValue}`);
    }
  }

  // ── Oportunidades de performance ──
  const opportunityKeys = [
    "render-blocking-resources",
    "uses-responsive-images",
    "offscreen-images",
    "unused-css-rules",
    "unused-javascript",
    "uses-webp-images",
    "uses-optimized-images",
    "modern-image-formats",
    "uses-text-compression",
    "uses-rel-preconnect",
    "server-response-time",
    "redirects",
    "uses-long-cache-ttl",
    "dom-size",
    "bootup-time",
    "mainthread-work-breakdown",
    "font-display",
    "third-party-summary",
    "lcp-lazy-loaded",
    "prioritize-lcp-image",
    "total-byte-weight",
    "preload-fonts",
    "efficient-animated-content",
  ];

  const opportunities = opportunityKeys
    .reduce((acc, key) => {
      const audit = audits[key];
      if (audit && audit.score !== null && audit.score !== undefined && audit.score < 1) {
        acc.push(audit);
      }
      return acc;
    }, [])
    .sort((a, b) => (a.score || 0) - (b.score || 0))
    .slice(0, 15);

  if (opportunities.length > 0) {
    console.log("\n  📈 OPORTUNIDADES DE OPTIMIZACIÓN (top 15):");
    for (const opp of opportunities) {
      const score = Math.round((opp.score || 0) * 100);
      const displayValue = opp.displayValue || "";
      console.log(`    • ${opp.title}${displayValue ? ` (${displayValue})` : ""} [${score}/100]`);
    }
  } else {
    console.log("\n  📈 Sin oportunidades detectadas.");
  }

  // ── Accesibilidad ──
  const a11yPrefixes = [
    "aria-",
    "color-",
    "target-size",
    "tap-target",
    "link-",
    "heading-",
    "label-",
    "image-",
    "button-",
    "meta-",
    "html-has-lang",
    "html-lang-valid",
    "frame-",
    "video-",
    "audio-",
    "object-",
    "custom-",
    "accesskeys",
    "input-",
  ];

  const failedA11y = Object.entries(audits)
    .filter(
      ([key, val]) =>
        a11yPrefixes.some((p) => key.startsWith(p)) &&
        val.score !== null &&
        val.score < 1
    )
    .slice(0, 10);

  if (failedA11y.length > 0) {
    console.log("\n  ♿ ISSUES DE ACCESIBILIDAD (top 10):");
    for (const [key, audit] of failedA11y) {
      console.log(`    • ${audit.title}${audit.displayValue ? ` (${audit.displayValue})` : ""}`);
    }
  }

  // ── Diagnóstico de página ──
  console.log("\n  📋 DIAGNÓSTICO:");
  const diagnostics = [
    ["Tamaño DOM", "dom-size"],
    ["Peso total de página", "total-byte-weight"],
    ["Solicitudes totales", "network-requests"],
  ];
  for (const [label, key] of diagnostics) {
    const audit = audits[key];
    if (audit) {
      const val = audit.displayValue || `${audit.numericValue || ""}`;
      console.log(`    • ${label}: ${val}`);
    }
  }

  // Limpiar
  cleanup();
  log("FIN", `✅ Reporte HTML: ${htmlReportPath}`);
  log("FIN", `✅ Reporte JSON: ${jsonReportPath}`);
  log("FIN", "Para ver el reporte en el navegador, abre el archivo HTML");
  console.log("\n═══════════════════════════════════════════\n");
}

main().catch((err) => {
  console.error("\x1b[31m[FATAL]\x1b[0m", err);
  process.exit(1);
});

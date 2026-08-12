/**
 * Configuración de Lighthouse para los scripts `lighthouse:mobile` y
 * `lighthouse:mobile:json` de package.json (perfil móvil emulado).
 *
 * El script `node run-lighthouse.mjs` genera su propia copia de esta
 * configuración dentro de `reports/` en tiempo de ejecución.
 */
export default {
  extends: "lighthouse:default",
  settings: {
    formFactor: "mobile",
    screenEmulation: {
      mobile: true,
      width: 375,
      height: 812,
      deviceScaleFactor: 2,
      disabled: false,
    },
    throttling: {
      rttMs: 150,
      throughputKbps: 1600,
      cpuSlowdownMultiplier: 4,
      requestLatencyMs: 150,
      downloadThroughputKbps: 1600,
      uploadThroughputKbps: 750,
    },
    throttlingMethod: "simulate",
    onlyCategories: ["performance", "accessibility", "best-practices", "seo"],
  },
};

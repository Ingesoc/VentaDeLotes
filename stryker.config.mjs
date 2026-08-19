// @ts-check
// Side-effect import keeps @stryker-mutator/vitest-runner visible to the dead-code analyzer
// (Stryker loads the plugin by package name via the `plugins` option below).
import "@stryker-mutator/vitest-runner";

/** @type {Partial<import('@stryker-mutator/api/core').StrykerOptions>} */
const config = {
  packageManager: "npm",
  plugins: ["@stryker-mutator/vitest-runner"],
  testRunner: "vitest",
  vitest: {
    configFile: "vite.config.ts",
  },
  mutate: [
    // Core files we wrote tests for and fixed
    "src/lib/cloudinary.ts",
    "src/lib/lotService.ts",
    "src/lib/checkAdmin.ts",
    "src/features/admin/components/useLots.ts",
    "!src/**/*.test.{ts,tsx}",
    "!src/**/__tests__/**",
    "!src/test/**",
  ],
  reporters: ["html", "clear-text", "progress"],
  htmlReporter: {
    fileName: "reports/stryker/index.html",
  },
  thresholds: {
    high: 85,
    low: 70,
    break: 60,
  },
  concurrency: 2,
  timeoutMS: 10000,
};
export default config;

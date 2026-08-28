import { test, expect } from "@playwright/test";

test.describe("Carrusel de la Home", () => {
  // El service worker de la PWA (registerType: "autoUpdate") recarga la página
  // al activarse, lo que destruiría el contexto del test.
  test.beforeEach(async ({ page }) => {
    await page.route("**/sw.js", (route) => route.abort());
    await page.route("**/registerSW.js", (route) => route.abort());
  });

  test("el video de la primera diapositiva arranca automáticamente (autoplay silenciado)", async ({
    page,
  }) => {
    // domcontentloaded: no esperar a que carguen todas las imágenes/recursos.
    await page.goto("/", { waitUntil: "domcontentloaded" });

    // El hero ocupa toda la pantalla; se baja hasta la sección de videos
    // aéreos (después del carrusel) para que el IntersectionObserver del
    // reproductor se dispare.
    await page.evaluate(() =>
      document.getElementById("videos-aereos")?.scrollIntoView({ behavior: "instant" }),
    );
    // Dar tiempo al IntersectionObserver para que detecte el elemento
    await page.waitForTimeout(500);

    // Al entrar al viewport, el reproductor se monta SOLO (sin clic) y arranca
    // silenciado: autoplay=1&mute=1. El primer clip es hT4bLxh-8uo.
    const player = page.locator(
      "iframe[src*='youtube-nocookie.com/embed/hT4bLxh-8uo']",
    );
    await expect(player).toHaveCount(1);
    await expect(player).toHaveAttribute("src", /autoplay=1&mute=1/);

    // Autoplay silenciado: el botón de activar sonido está disponible.
    await expect(
      page.getByRole("button", { name: "Activar sonido" }),
    ).toBeVisible();

    // Regresión guard: mientras el video se reproduce, el carrusel NO debe
    // avanzar.
    const xBefore = (await player.boundingBox())?.x;
    await page.waitForTimeout(6000);
    const xAfter = (await player.boundingBox())?.x;
    expect(Math.abs((xBefore ?? 0) - (xAfter ?? 0))).toBeLessThan(5);
  });
});

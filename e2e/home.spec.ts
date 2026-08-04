import { test, expect } from "@playwright/test";

test.describe("Carrusel de la Home", () => {
  // El service worker de la PWA (registerType: "autoUpdate") recarga la página
  // al activarse, lo que destruiría el contexto del test.
  test.beforeEach(async ({ page }) => {
    await page.route("**/sw.js", (route) => route.abort());
    await page.route("**/registerSW.js", (route) => route.abort());
  });

  test("el video es la primera diapositiva con carga perezosa (click-to-load)", async ({
    page,
  }) => {
    // domcontentloaded: no esperar a que carguen todas las imágenes/recursos.
    // El carrusel se detiene en el slide del video, así que no hay carrera con
    // el autoplay.
    await page.goto("/", { waitUntil: "domcontentloaded" });

    // Primera diapositiva: miniatura del video con botón de play
    const playButton = page.getByRole("button", {
      name: /Reproducir video: La Holanda en Video/i,
    });
    await expect(playButton).toBeVisible();

    // Carga perezosa: el iframe de YouTube NO existe antes del clic
    await expect(page.locator("iframe[src*='youtube']")).toHaveCount(0);

    // Al hacer clic se monta el reproductor (solo entonces se descarga)
    await playButton.click();

    const player = page.locator(
      "iframe[src*='youtube-nocookie.com/embed/N7LYM3pt_hg']",
    );
    await expect(player).toHaveCount(1);
    await expect(player).toHaveAttribute("src", /autoplay=1/);
    // El botón de play se reemplaza por el reproductor
    await expect(playButton).toHaveCount(0);

    // Regresión guard: mientras el video se reproduce, el carrusel NO debe
    // avanzar (el clic en play no debe reiniciar el autoplay).
    const xBefore = (await player.boundingBox())?.x;
    await page.waitForTimeout(6000);
    const xAfter = (await player.boundingBox())?.x;
    expect(Math.abs((xBefore ?? 0) - (xAfter ?? 0))).toBeLessThan(5);
  });
});

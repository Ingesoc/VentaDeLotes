import { test, expect } from "@playwright/test";

// Viewports clave para prueba responsive
const VIEWPORTS = [
  { name: "320px", width: 320, height: 568 },
  { name: "375px", width: 375, height: 812 },
  { name: "430px", width: 430, height: 932 },
  { name: "768px", width: 768, height: 1024 },
  { name: "1280px", width: 1280, height: 800 },
] as const;

test.describe("Responsive design", () => {
  for (const vp of VIEWPORTS) {
    test(`Home page se ve correctamente en ${vp.name}`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto("/");

      // Hero debe ocupar al menos la mitad del viewport
      const hero = page.locator("header").first();
      const heroBox = await hero.boundingBox();
      expect(heroBox).not.toBeNull();
      expect(heroBox!.height).toBeGreaterThan(vp.height * 0.5);

      // Navbar siempre visible en top
      const navbar = page.locator("#navbar");
      await expect(navbar).toBeVisible();

      // Sin scroll horizontal (permitimos margen por sombras/bordes decorativos)
      const scrollWidth = await page.evaluate(() => document.body.scrollWidth);
      const tolerance = vp.width >= 768 ? 15 : 5;
      expect(scrollWidth).toBeLessThanOrEqual(vp.width + tolerance);
    });
  }
});

test.describe("Tap targets en mobile", () => {
  test("Bottom nav items tienen altura >= 48px en 375px", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/");

    const navLinks = page.locator("nav:last-child a");
    const count = await navLinks.count();

    for (let i = 0; i < count; i++) {
      const box = await navLinks.nth(i).boundingBox();
      expect(box).not.toBeNull();
      expect(box!.height).toBeGreaterThanOrEqual(48);
    }
  });

  test("Botón de WhatsApp tiene tamaño táctil adecuado", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/");

    const waButton = page.getByLabel("Contactar por WhatsApp");
    await expect(waButton).toBeVisible();

    const box = await waButton.boundingBox();
    expect(box).not.toBeNull();
    // El botón es circular — ambos ejes deben ser >= 48px
    expect(box!.width).toBeGreaterThanOrEqual(48);
    expect(box!.height).toBeGreaterThanOrEqual(48);
  });
});

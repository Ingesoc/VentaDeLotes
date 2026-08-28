import { test, expect } from "@playwright/test";

test.describe("Navegación principal", () => {
  test("Home page carga con título y hero", async ({ page }) => {
    await page.goto("/");

    // Título del proyecto visible
    await expect(page.locator("h1")).toContainText("La Holanda");
    // Botón CTA visible
    await expect(
      page.getByRole("link", { name: /conoce los lotes/i })
    ).toBeVisible();
    // Navbar visible
    await expect(page.locator("#navbar")).toBeVisible();
  });

  test("Navegación a /projects desde el navbar", async ({ page }) => {
    await page.goto("/");
    // En desktop el link está en el navbar, en mobile usamos el bottom nav
    const isMobile = page.viewportSize()?.width !== undefined && page.viewportSize()!.width! < 768;
    if (isMobile) {
      const bottomNav = page.locator("nav").last();
      await bottomNav.getByRole("link", { name: /explorar/i }).click();
    } else {
      await page.getByRole("link", { name: "Lotes" }).first().click();
    }
    await expect(page).toHaveURL(/\/projects/);
    // Título de la página de lotes
    await expect(page.locator("h1")).toContainText("Lotes Campestres");
  });

  test("Navegación a /investment", async ({ page }) => {
    await page.goto("/investment");
    await expect(page).toHaveURL(/\/investment/);
    // Hero de inversión
    await expect(page.locator("h1")).toContainText("Legado");
  });

  test("Navegación a /descubre-quindio", async ({ page }) => {
    await page.goto("/descubre-quindio");
    await expect(page).toHaveURL(/\/descubre-quindio/);
    // Título del Quindío
    await expect(page.locator("h1")).toContainText("Corazón del Paisaje Cafetero");
  });

  test("Bottom nav en mobile (375px) redirige correctamente", async ({ page }) => {
    // Forzar viewport mobile
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/");

    // Bottom nav debe estar visible en mobile
    const bottomNav = page.locator("nav").last();
    await expect(bottomNav).toBeVisible();

    // Click en "Invertir"
    await bottomNav.getByRole("link", { name: /invertir/i }).click();
    await expect(page).toHaveURL(/\/investment/);
  });

  test("Página 404 muestra el código de error y ofrece volver al inicio", async ({ page }) => {
    await page.goto("/ruta-inexistente", { waitUntil: "networkidle" });
    // El componente ErrorPage muestra el status HTTP (404) como título
    await expect(page.locator("h1")).toContainText("404");
    // Debe mostrar mensaje de error y botón para volver
    await expect(page.locator("p")).toContainText("Not Found");
    await expect(
      page.getByRole("link", { name: /volver al inicio/i })
    ).toBeVisible();
  });
});

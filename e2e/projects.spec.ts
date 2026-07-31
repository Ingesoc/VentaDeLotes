import { test, expect } from "@playwright/test";

test.describe("Página de proyectos", () => {
  test("Lista de lotes se renderiza", async ({ page }) => {
    await page.goto("/projects");

    // Título de la página
    await expect(page.locator("h1")).toContainText("Descubre tu santuario");

    // Debe haber al menos un lote visible
    await expect(page.getByText(/mostrando/i)).toBeVisible();
  });

  test("Filtros de estado funcionan", async ({ page }) => {
    await page.goto("/projects");

    // Seleccionar "Disponible" en el filtro
    await page.selectOption("#filter-status", "disponible");
    // El texto de conteo debe actualizarse
    await expect(page.getByText(/mostrando/i)).toBeVisible();
  });

  test("Navegación a detalle de lote", async ({ page }) => {
    await page.goto("/projects");

    // Click en "Ver detalle" del primer lote disponible
    const detailLink = page.locator("a[href^='/projects/']").first();
    await detailLink.click();

    // Debe redirigir a /projects/{id}
    await expect(page).toHaveURL(/\/projects\/\d+/);

    // La página de detalle debe tener el título "Lote X"
    await expect(page.locator("h1")).toContainText("Lote");
  });

  test("Botón de WhatsApp está presente en detalle de lote", async ({ page }) => {
    await page.goto("/projects/01");

    // WhatsApp button flotante debe estar visible
    const waButton = page.getByLabel("Contactar por WhatsApp");
    await expect(waButton).toBeVisible();
  });
});

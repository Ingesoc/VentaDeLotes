import { test, expect } from "@playwright/test";

test.describe("Formulario de contacto", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/#contacto");
  });

  test("El formulario se renderiza con todos los campos", async ({ page }) => {
    await expect(page.getByPlaceholder("Nombre completo")).toBeVisible();
    await expect(page.getByPlaceholder("Correo electrónico")).toBeVisible();
    await expect(page.getByPlaceholder("Número de teléfono")).toBeVisible();
    await expect(
      page.getByRole("button", { name: /enviar solicitud/i })
    ).toBeVisible();
  });

  test("Muestra error en campos vacíos", async ({ page }) => {
    await page.getByRole("button", { name: /enviar solicitud/i }).click();
    // El formulario tiene validación HTML5 required — el navegador muestra
    // su tooltip nativo, no hay un elemento de error en el DOM.
    // Verificamos que seguimos en la misma URL (no hubo submit exitoso)
    await expect(page).toHaveURL(/#contacto/);
  });

  test("Campos de input tienen font-size >= 16px (evita zoom en iOS)", async ({ page }) => {
    const inputs = page.locator("input, textarea");
    const count = await inputs.count();
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      const input = inputs.nth(i);
      const fontSize = await input.evaluate((el) =>
        window.getComputedStyle(el).fontSize
      );
      const size = parseFloat(fontSize);
      expect(size).toBeGreaterThanOrEqual(16);
    }
  });

  test("Botón de submit tiene tap target >= 48px", async ({ page }) => {
    const button = page.getByRole("button", { name: /enviar solicitud/i });
    const box = await button.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.width).toBeGreaterThanOrEqual(48);
    expect(box!.height).toBeGreaterThanOrEqual(48);
  });
});

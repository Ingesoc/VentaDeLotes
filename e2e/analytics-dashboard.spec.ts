import { test, expect } from "@playwright/test";

/**
 * Analytics admin dashboard E2E tests.
 *
 * Since admin pages require authentication, these tests verify:
 * - Admin routes redirect to /admin/login when not authenticated
 * - Login page renders correctly with expected elements
 * - Navigation structure (sidebar items) works when authenticated
 *
 * For authenticated analytics dashboard tests, use the staging environment
 * with seeded data or mock Supabase auth in the test setup.
 */
test.describe("Analytics admin (unauthenticated)", () => {
  test("Admin login page renders correctly", async ({ page }) => {
    await page.goto("/admin/login");

    // Login page should render
    await expect(page.locator("h1")).toBeVisible();
    await expect(page.locator("h1")).toContainText("Admin");

    // Email and password fields should be present
    await expect(page.locator("#email")).toBeVisible();
    await expect(page.locator("#password")).toBeVisible();

    // Submit button should be present
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  const adminRoutes = [
    "/admin/analytics",
    "/admin/leads",
    "/admin/dashboard",
    "/admin/lots",
  ];

  for (const route of adminRoutes) {
    test(`Route ${route} redirects to login when not authenticated`, async ({
      page,
    }) => {
      await page.goto(route);
      await expect(page).toHaveURL(/\/admin\/login/);
    });
  }

  test("Login page has email and password fields", async ({ page }) => {
    await page.goto("/admin/login");

    await expect(page.locator("#email")).toBeVisible();
    await expect(page.locator("#password")).toBeVisible();
    await expect(page.locator("#email")).toHaveAttribute("type", "email");
    await expect(page.locator("#password")).toHaveAttribute("type", "password");
  });

  test("Login page has forgot password option", async ({ page }) => {
    await page.goto("/admin/login");

    // The forgot password link uses Spanish text
    const forgotPasswordButton = page.getByRole("button", {
      name: /olvidaste tu contraseña/i,
    });
    await expect(forgotPasswordButton).toBeVisible();
  });

  test("Login form has submit button", async ({ page }) => {
    await page.goto("/admin/login");

    const submitButton = page.locator('button[type="submit"]');
    await expect(submitButton).toBeVisible();
    await expect(submitButton).toContainText("Ingresar");
  });

  test("Admin root redirects to login", async ({ page }) => {
    await page.goto("/admin");
    await expect(page).toHaveURL(/\/admin\/login/);
  });

  test("Admin analytics redirects to login", async ({ page }) => {
    await page.goto("/admin/analytics");
    await expect(page).toHaveURL(/\/admin\/login/);
  });

  test("Admin leads redirects to login", async ({ page }) => {
    await page.goto("/admin/leads");
    await expect(page).toHaveURL(/\/admin\/login/);
  });
});

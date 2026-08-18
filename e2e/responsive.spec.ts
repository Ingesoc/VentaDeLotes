import { test, expect, type Page } from "@playwright/test";

// Viewports clave para prueba responsive
const VIEWPORTS = [
  { name: "320px", width: 320, height: 568 },
  { name: "375px", width: 375, height: 812 },
  { name: "430px", width: 430, height: 932 },
  { name: "768px", width: 768, height: 1024 },
  { name: "1280px", width: 1280, height: 800 },
] as const;

// Páginas con contenido revisado (la Home ya se cubre en "Responsive design"
// en 320/375/430/768/1280). Las rutas protegidas de admin se cubren aparte en
// "No horizontal overflow — admin pages" con la sesión de Supabase mockeada.
const REVISION_PAGES = [
  "/projects",
  "/projects/01",
  "/projects/10",
  "/descubre-quindio",
  "/contact",
  "/investment",
  "/admin/login",
] as const;

// Viewports del chequeo de overflow por página (incluye 430px como la Home)
const OVERFLOW_VIEWPORTS = [
  { name: "320px", width: 320, height: 568 },
  { name: "375px", width: 375, height: 812 },
  { name: "430px", width: 430, height: 932 },
  { name: "768px", width: 768, height: 1024 },
  { name: "1280px", width: 1280, height: 800 },
] as const;

/**
 * Verifica que la página no tenga scroll horizontal.
 * Se permite un margen pequeño por sombras/bordes decorativos.
 */
async function expectNoHorizontalOverflow(page: Page, width: number) {
  const scrollWidth = await page.evaluate(() => {
    // `document.body` puede ser null durante una navegación en curso
    const el = document.body ?? document.documentElement;
    return el.scrollWidth;
  });
  const tolerance = width >= 768 ? 15 : 5;
  expect(scrollWidth).toBeLessThanOrEqual(width + tolerance);
}

/**
 * Espera a que las fuentes web del tema terminen de cargar y el layout se
 * asiente. `document.fonts.status` puede reportar "loaded" antes de que el
 * `@import` de Google Fonts inicie, así que se fuerza la carga explícita de
 * Inter y Playfair Display. Evita falsos positivos por overflow transitorio
 * (FOUT) durante la carga inicial.
 */
async function waitForSettledLayout(page: Page) {
  // Asegurar que el documento está listo antes de consultar fuentes/layout
  await page.waitForSelector("body", { timeout: 5_000 }).catch(() => {});
  await page
    .evaluate(async () => {
      await Promise.all([
        document.fonts.load('400 16px Inter'),
        document.fonts.load('600 14px Inter'),
        document.fonts.load('600 32px "Playfair Display"'),
        document.fonts.load('700 64px "Playfair Display"'),
      ]);
      await document.fonts.ready;
    })
    .catch(() => {});
  // Margen para que el layout se asiente (reveal/page-enter/embla/mapas)
  await page.waitForTimeout(500);
}

// El service worker de la PWA (registerType: "autoUpdate") recarga la página
// al activarse (`controllerchange` → `window.location.reload()` en main.tsx),
// lo que destruye el contexto de ejecución y hace flakys los tests. Se bloquea
// su registro para que los tests midan un layout estable.
test.beforeEach(async ({ page }) => {
  await page.route("**/sw.js", (route) => route.abort());
  await page.route("**/registerSW.js", (route) => route.abort());
});

test.describe("Responsive design", () => {
  for (const vp of VIEWPORTS) {
    test(`Home page se ve correctamente en ${vp.name}`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto("/", { waitUntil: "domcontentloaded" });
      await waitForSettledLayout(page);

      // Hero debe ocupar al menos la mitad del viewport
      const hero = page.locator("header").first();
      const heroBox = await hero.boundingBox();
      expect(heroBox).not.toBeNull();
      expect(heroBox!.height).toBeGreaterThan(vp.height * 0.5);

      // Navbar siempre visible en top
      const navbar = page.locator("#navbar");
      await expect(navbar).toBeVisible();

      // Sin scroll horizontal
      await expectNoHorizontalOverflow(page, vp.width);
    });
  }
});

test.describe("No horizontal overflow — all pages", () => {
  for (const vp of OVERFLOW_VIEWPORTS) {
    for (const pagePath of REVISION_PAGES) {
      test(`${pagePath} en ${vp.name}`, async ({ page }) => {
        await page.setViewportSize({ width: vp.width, height: vp.height });
        await page.goto(pagePath, { waitUntil: "domcontentloaded" });
        await waitForSettledLayout(page);

        await expectNoHorizontalOverflow(page, vp.width);
      });
    }
  }
});

test.describe("Key content per page", () => {
  test("Home muestra Plano General, Cómo funciona, precio exacto COP y formulario", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/");
    await expect(
      page.getByRole("heading", { name: /Plano General/i }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: /Cómo funciona/i }),
    ).toBeVisible();
    // Precio abreviado con valor exacto COP
    await expect(page.getByText(/COP/).first()).toBeVisible();
    // El formulario de la home carga bajo demanda al acercarse al viewport
    // (chunk lazy fuera del camino crítico). El ancla #contacto siempre
    // existe; scrollear hasta ella dispara el montaje del formulario.
    await page.locator("#contacto").scrollIntoViewIfNeeded();
    await expect(page.locator("#name")).toBeVisible();
  });

  test("Projects muestra filtros y mapa de la finca", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/projects");
    await expect(page.getByLabel(/Estado/i)).toBeVisible();
    await expect(
      page.getByRole("heading", { name: /Ubicación de la Finca/i }),
    ).toBeVisible();
  });

  test("Lote 01 muestra estado No disponible", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/projects/01");
    await expect(page.getByText("No disponible").first()).toBeVisible();
  });

  test("Lote 10 muestra Consultar precio (sin precio definido)", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/projects/10");
    await expect(page.getByText("Consultar precio").first()).toBeVisible();
  });

  test("DescubreQuindío: carrusel de parques navegable", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/descubre-quindio");
    const nextBtn = page.getByRole("button", { name: /Siguiente/i });
    const prevBtn = page.getByRole("button", { name: /Anterior/i });
    await expect(nextBtn).toBeVisible();
    await nextBtn.click();
    await expect(prevBtn).toBeVisible();
    await prevBtn.click();
    await expect(
      page.getByRole("heading", { name: /Parques y Atractivos del Quindío/i }),
    ).toBeVisible();
  });

  test("Contacto muestra mapa de oficina y formulario", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/contact");
    await expect(page.getByTitle(/Oficina INGESOCC/i)).toBeVisible();
    await expect(page.locator("#name")).toBeVisible();
  });
});

/* ─── Admin: sesión de Supabase mockeada ────────────────────────────────
 * Las páginas protegidas (/admin/dashboard, /admin/lots) exigen sesión de
 * Supabase y verificación de admin. Para que rendericen su layout real:
 *  1. Se inyecta una sesión fake en localStorage (clave sb-<ref>-auth-token
 *     que supabase-js lee al inicializar) parcheando Storage.prototype.
 *  2. Se mockean las llamadas REST (rpc has_backstage_access → true y los
 *     datos de lots/leads/page_views).
 */

const FAKE_ADMIN_SESSION = {
  access_token: "fake-access-token-e2e",
  token_type: "bearer",
  expires_in: 3600,
  expires_at: 4102444800, // año 2100 — evita el refresh automático
  refresh_token: "fake-refresh-token-e2e",
  user: {
    id: "00000000-0000-0000-0000-000000000001",
    aud: "authenticated",
    role: "authenticated",
    email: "gerencia.ingesocc@gmail.com",
    app_metadata: { provider: "email", providers: ["email"] },
    user_metadata: {},
    created_at: "2026-01-01T00:00:00Z",
  },
};

const FAKE_ADMIN_LOTS = [
  {
    id: "01",
    area_m2: 2005,
    price: 189242850,
    status: "disponible",
    aerial_image: "https://res.cloudinary.com/j5a9xyaq/image/upload/v1/e2e/lote01.jpg",
  },
  {
    id: "02",
    area_m2: 2010,
    price: 192482750,
    status: "reservado",
    aerial_image: "https://res.cloudinary.com/j5a9xyaq/image/upload/v1/e2e/lote02.jpg",
  },
  {
    id: "03",
    area_m2: null,
    price: null,
    status: "vendido",
    aerial_image: "https://example.com/e2e.jpg",
  },
];

const FAKE_ADMIN_LEADS = [
  { name: "Cliente Demo", email: "cliente@demo.com", created_at: "2026-07-31T10:00:00Z" },
];

const FAKE_ADMIN_VIEWS = [{ lot_id: "01" }, { lot_id: "02" }, { lot_id: "01" }];

async function mockAdminSession(page: Page) {
  // Sesión en localStorage: supabase-js la lee al inicializar (getSession).
  // El patch de Storage.prototype.getItem evita depender del ref exacto del
  // proyecto (clave sb-<ref>-auth-token).
  await page.addInitScript((session) => {
    const originalGetItem = Storage.prototype.getItem;
    Storage.prototype.getItem = function (this: Storage, key: string) {
      if (
        typeof key === "string" &&
        key.startsWith("sb-") &&
        key.endsWith("-auth-token")
      ) {
        return JSON.stringify(session);
      }
      return originalGetItem.call(this, key);
    };
  }, FAKE_ADMIN_SESSION);

  // checkAdminStatus → rpc has_backstage_access → true (es admin)
  await page.route("**/rest/v1/rpc/has_backstage_access*", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: "true",
    }),
  );

  // lots: conteo (head=true) y listado
  await page.route("**/rest/v1/lots*", (route) => {
    const head =
      new URL(route.request().url()).searchParams.get("head") === "true";
    return route.fulfill({
      status: 200,
      contentType: "application/json",
      headers: {
        "Content-Range": `0-${FAKE_ADMIN_LOTS.length - 1}/${FAKE_ADMIN_LOTS.length}`,
      },
      body: JSON.stringify(head ? [] : FAKE_ADMIN_LOTS),
    });
  });

  // leads: conteo y últimos leads
  await page.route("**/rest/v1/leads*", (route) => {
    const head =
      new URL(route.request().url()).searchParams.get("head") === "true";
    return route.fulfill({
      status: 200,
      contentType: "application/json",
      headers: {
        "Content-Range": `0-${FAKE_ADMIN_LEADS.length - 1}/${FAKE_ADMIN_LEADS.length}`,
      },
      body: JSON.stringify(head ? [] : FAKE_ADMIN_LEADS),
    });
  });

  // page_views: conteo y lot_id de visitas
  await page.route("**/rest/v1/page_views*", (route) => {
    const head =
      new URL(route.request().url()).searchParams.get("head") === "true";
    return route.fulfill({
      status: 200,
      contentType: "application/json",
      headers: {
        "Content-Range": `0-${FAKE_ADMIN_VIEWS.length - 1}/${FAKE_ADMIN_VIEWS.length}`,
      },
      body: JSON.stringify(head ? [] : FAKE_ADMIN_VIEWS),
    });
  });
}

test.describe("No horizontal overflow — admin pages (sesión mockeada)", () => {
  test.beforeEach(async ({ page }) => {
    await mockAdminSession(page);
  });

  const ADMIN_PAGES = ["/admin/dashboard", "/admin/lots"] as const;

  for (const vp of OVERFLOW_VIEWPORTS) {
    for (const pagePath of ADMIN_PAGES) {
      test(`${pagePath} en ${vp.name}`, async ({ page }) => {
        await page.setViewportSize({ width: vp.width, height: vp.height });
        await page.goto(pagePath, { waitUntil: "domcontentloaded" });
        await waitForSettledLayout(page);
        // Sanity: si el mock falla, AdminGuard redirige a /admin/login
        await expect(page).toHaveURL(/\/admin\/(dashboard|lots)/);
        await expect(page.getByText("Panel de Administración")).toBeVisible();
        await expectNoHorizontalOverflow(page, vp.width);
      });
    }
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

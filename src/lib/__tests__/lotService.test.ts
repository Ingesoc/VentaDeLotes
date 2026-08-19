import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// ---------------------------------------------------------------------------
// Hoisted helpers — available to vi.mock factories
// ---------------------------------------------------------------------------

const { mockCldUrl, supabaseResult } = vi.hoisted(() => ({
  mockCldUrl: vi.fn((url: string, width?: number) => { void width; return `optimized:${url}`; }),
  supabaseResult: { data: [] as unknown[] | null, error: null as unknown },
}));

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

vi.mock("@/lib/cloudinary", () => ({
  cldUrl: (url: string, width?: number) => mockCldUrl(url, width),
  CLD_WIDTHS: {
    HERO: 1600, CAROUSEL: 1200, MASTERPLAN: 1280,
    LARGE: 1000, CARD: 800, THUMB: 400, LOGO: 96,
  },
}));

vi.mock("@/lib/supabase", () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      order: vi.fn().mockImplementation(() => Promise.resolve(supabaseResult)),
    })),
  },
}));

vi.mock("@/constants/lots", () => ({
  lots: [
    {
      id: "01", areaM2: 8910, price: 189242850, status: "no_disponible",
      aerialImage: "https://res.cloudinary.com/j5a9xyaq/image/upload/static-aerial-01.jpg",
      perspectiveImage: "https://res.cloudinary.com/j5a9xyaq/image/upload/static-perspective-01.jpg",
      coordinates: { lat: 4.619, lng: -75.767 },
    },
    {
      id: "02", areaM2: 2008, price: 189242850, status: "disponible",
      aerialImage: "https://res.cloudinary.com/j5a9xyaq/image/upload/static-aerial-02.jpg",
      perspectiveImage: "https://res.cloudinary.com/j5a9xyaq/image/upload/static-perspective-02.jpg",
      topography: "Ondulada", view: "Valle", access: "Principal",
      sharedAerialWith: "03", coordinates: { lat: 4.618, lng: -75.768 },
    },
  ],
}));

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const LOT_ROW_BASE = {
  id: "01", area_m2: 8910, price: 189242850, status: "disponible",
  aerial_image: "https://res.cloudinary.com/j5a9xyaq/image/upload/db-aerial.jpg",
  perspective_image: "https://res.cloudinary.com/j5a9xyaq/image/upload/db-perspective.jpg",
  topography: null, view_text: null, access: null,
  shared_aerial_with: null, coordinates: null,
};

function makeRow(overrides: Record<string, unknown> = {}) {
  return { ...LOT_ROW_BASE, ...overrides };
}

// ---------------------------------------------------------------------------
// Tests — Live mode (comprehensive single import to avoid caching issues)
// ---------------------------------------------------------------------------

describe("lotService — Live mode", () => {
  let fetchPublicLots: typeof import("../lotService").fetchPublicLots;

  beforeEach(async () => {
    vi.clearAllMocks();
    vi.stubEnv("VITE_LIVE_LOTS", "true");
    vi.resetModules();
    supabaseResult.data = [];
    supabaseResult.error = null;

    const mod = await import("../lotService");
    fetchPublicLots = mod.fetchPublicLots;
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("fetches lots from Supabase and returns DB data", async () => {
    supabaseResult.data = [
      makeRow({ status: "disponible", area_m2: 9999, price: 500000 }),
    ];
    const lots = await fetchPublicLots();

    expect(lots).toHaveLength(1);
    expect(lots[0].id).toBe("01");
    expect(lots[0].status).toBe("disponible");
    expect(lots[0].areaM2).toBe(9999);
    expect(lots[0].price).toBe(500000);
  });

  it("applies cldUrl to Cloudinary image URLs", async () => {
    supabaseResult.data = [makeRow()];
    await fetchPublicLots();

    expect(mockCldUrl).toHaveBeenCalledWith(
      "https://res.cloudinary.com/j5a9xyaq/image/upload/db-aerial.jpg",
      expect.any(Number),
    );
    expect(mockCldUrl).toHaveBeenCalledWith(
      "https://res.cloudinary.com/j5a9xyaq/image/upload/db-perspective.jpg",
      expect.any(Number),
    );
  });

  it("returns optimized URL in aerialImage and perspectiveImage", async () => {
    supabaseResult.data = [makeRow()];
    const lots = await fetchPublicLots();

    expect(lots[0].aerialImage).toBe(
      "optimized:https://res.cloudinary.com/j5a9xyaq/image/upload/db-aerial.jpg",
    );
    expect(lots[0].perspectiveImage).toBe(
      "optimized:https://res.cloudinary.com/j5a9xyaq/image/upload/db-perspective.jpg",
    );
  });

  it("uses static fallback for non-Cloudinary aerial_image", async () => {
    supabaseResult.data = [makeRow({ aerial_image: "/images/local.jpg" })];
    const lots = await fetchPublicLots();
    expect(lots[0].aerialImage).toContain("static-aerial-01");
  });

  it("uses static fallback when aerial_image is null", async () => {
    supabaseResult.data = [makeRow({ aerial_image: null })];
    const lots = await fetchPublicLots();
    expect(lots[0].aerialImage).toContain("static-aerial-01");
  });

  it("uses static fallback for non-Cloudinary perspective_image", async () => {
    supabaseResult.data = [makeRow({ perspective_image: "http://example.com/img.jpg" })];
    const lots = await fetchPublicLots();
    expect(lots[0].perspectiveImage).toContain("static-perspective-01");
  });

  it("uses static fallback when perspective_image is null", async () => {
    supabaseResult.data = [makeRow({ perspective_image: null })];
    const lots = await fetchPublicLots();
    expect(lots[0].perspectiveImage).toContain("static-perspective-01");
  });

  it("falls back to static area_m2 when DB is null", async () => {
    supabaseResult.data = [makeRow({ area_m2: null })];
    const lots = await fetchPublicLots();
    expect(lots[0].areaM2).toBe(8910);
  });

  it("falls back to static price when DB is null", async () => {
    supabaseResult.data = [makeRow({ price: null })];
    const lots = await fetchPublicLots();
    expect(lots[0].price).toBe(189242850);
  });

  it("uses DB status as-is (never falls back)", async () => {
    supabaseResult.data = [makeRow({ status: "vendido" })];
    const lots = await fetchPublicLots();
    expect(lots[0].status).toBe("vendido");
  });

  it("uses DB topography/view/access when available", async () => {
    supabaseResult.data = [makeRow({
      id: "02", topography: "Plana", view_text: "Montaña",
      access: "Secundario", shared_aerial_with: "01",
      coordinates: { lat: 4.0, lng: -75.0 },
    })];
    const lots = await fetchPublicLots();
    expect(lots[0].topography).toBe("Plana");
    expect(lots[0].view).toBe("Montaña");
    expect(lots[0].access).toBe("Secundario");
    expect(lots[0].sharedAerialWith).toBe("01");
    expect(lots[0].coordinates).toEqual({ lat: 4.0, lng: -75.0 });
  });

  it("falls back to static topography/view/access when DB is null", async () => {
    supabaseResult.data = [makeRow({ id: "02" })];
    const lots = await fetchPublicLots();
    expect(lots[0].topography).toBe("Ondulada");
    expect(lots[0].view).toBe("Valle");
    expect(lots[0].access).toBe("Principal");
    expect(lots[0].sharedAerialWith).toBe("03");
  });

  it("returns lot with DB data for unknown ID", async () => {
    supabaseResult.data = [makeRow({ id: "99", area_m2: 5000 })];
    const lots = await fetchPublicLots();
    expect(lots[0].id).toBe("99");
    expect(lots[0].areaM2).toBe(5000);
  });

  it("defaults areaM2 to 0 for unknown lot with null area", async () => {
    supabaseResult.data = [makeRow({ id: "99", area_m2: null })];
    const lots = await fetchPublicLots();
    expect(lots[0].areaM2).toBe(0);
  });

  it("returns static lots when Supabase data is empty", async () => {
    supabaseResult.data = [];
    const lots = await fetchPublicLots();
    expect(lots).toHaveLength(2);
  });

  it("returns static lots when Supabase returns null", async () => {
    supabaseResult.data = null;
    const lots = await fetchPublicLots();
    expect(lots).toHaveLength(2);
  });

  it("returns static lots when Supabase errors", async () => {
    supabaseResult.error = { message: "Connection failed" };
    const lots = await fetchPublicLots();
    expect(lots).toHaveLength(2);
  });

  it("returns static lots when Supabase throws", async () => {
    const { supabase } = await import("@/lib/supabase");
    vi.mocked(supabase.from).mockImplementation(() => {
      throw new Error("Network error");
    });
    const lots = await fetchPublicLots();
    expect(lots).toHaveLength(2);
  });
});

// ---------------------------------------------------------------------------
// Tests — Static mode (runs AFTER live mode to avoid caching issues)
// ---------------------------------------------------------------------------

describe("lotService — Static mode", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    supabaseResult.data = [];
    supabaseResult.error = null;
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  async function importStatic() {
    vi.stubEnv("VITE_LIVE_LOTS", "false");
    vi.resetModules();
    return import("../lotService");
  }

  it("returns static lots when VITE_LIVE_LOTS is 'false'", async () => {
    const { fetchPublicLots } = await importStatic();
    const lots = await fetchPublicLots();
    expect(lots).toHaveLength(2);
    expect(lots[0].id).toBe("01");
    expect(lots[1].id).toBe("02");
  });

  it("returns static lots when VITE_LIVE_LOTS is undefined", async () => {
    vi.stubEnv("VITE_LIVE_LOTS", undefined);
    vi.resetModules();
    const { fetchPublicLots } = await import("../lotService");
    const lots = await fetchPublicLots();
    expect(lots).toHaveLength(2);
  });

  it("does not call Supabase in static mode", async () => {
    const { fetchPublicLots } = await importStatic();
    await fetchPublicLots();
    const { supabase } = await import("@/lib/supabase");
    expect(supabase.from).not.toHaveBeenCalled();
  });
});

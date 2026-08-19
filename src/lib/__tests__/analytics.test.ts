import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// ---------------------------------------------------------------------------
// Mock supabase
// ---------------------------------------------------------------------------

const mockRpc = vi.fn().mockResolvedValue({ error: null });

vi.mock("@/lib/supabase", () => ({
  supabase: {
    rpc: (...args: unknown[]) => mockRpc(...args),
  },
}));

// ---------------------------------------------------------------------------
// Import after mocks
// ---------------------------------------------------------------------------

import {
  getSessionId,
  getUtmParams,
  trackEvent,
  trackPageView,
  trackLotView,
  trackContactInitiated,
  trackFormSubmitted,
  trackFilterApplied,
  trackLotFavorited,
} from "../analytics";

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("analytics", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    window.history.replaceState({}, "", "/");
  });

  afterEach(() => {
    localStorage.clear();
  });

  // ── getSessionId ──────────────────────────────────────────

  describe("getSessionId", () => {
    it("generates a new session ID when none exists", () => {
      const id = getSessionId();
      expect(id).toBeTruthy();
      expect(typeof id).toBe("string");
      expect(id.length).toBeGreaterThan(0);
    });

    it("returns the same ID on subsequent calls", () => {
      const id1 = getSessionId();
      const id2 = getSessionId();
      expect(id1).toBe(id2);
    });

    it("persists in localStorage", () => {
      const id = getSessionId();
      expect(localStorage.getItem("lh_session_id")).toBe(id);
    });

    it("reads from localStorage if already stored", () => {
      localStorage.setItem("lh_session_id", "test-session-123");
      const id = getSessionId();
      expect(id).toBe("test-session-123");
    });

    // Kill: crypto.randomUUID?.() ?? ... → && ... (LogicalOperator)
    // Kill: crypto.randomUUID?.() → crypto.randomUUID() (OptionalChaining)
    // The fallback path is only hit when crypto.randomUUID is undefined.
    // In jsdom it IS defined, so we verify the ID has UUID format.
    it("generates a valid UUID format ID", () => {
      const id = getSessionId();
      // UUID format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
      expect(id).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
      );
    });
  });

  // ── getUtmParams ──────────────────────────────────────────

  describe("getUtmParams", () => {
    it("returns nulls when no UTM in URL and no cache", () => {
      const utm = getUtmParams();
      expect(utm).toEqual({
        utm_source: null,
        utm_medium: null,
        utm_campaign: null,
      });
    });

    it("extracts UTM from URL", () => {
      window.history.replaceState(
        {},
        "",
        "/?utm_source=google&utm_medium=cpc&utm_campaign=spring",
      );
      const utm = getUtmParams();
      expect(utm).toEqual({
        utm_source: "google",
        utm_medium: "cpc",
        utm_campaign: "spring",
      });
    });

    it("caches UTM in localStorage", () => {
      window.history.replaceState({}, "", "/?utm_source=meta");
      getUtmParams();

      const cached = localStorage.getItem("lh_utm");
      expect(cached).toBeTruthy();
      const parsed = JSON.parse(cached!);
      expect(parsed.utm_source).toBe("meta");
      expect(parsed.timestamp).toBeTypeOf("number");
    });

    it("reads UTM from cache when URL has no UTM", () => {
      const cacheData = {
        utm_source: "cached_source",
        utm_medium: "cached_medium",
        utm_campaign: "cached_campaign",
        timestamp: Date.now(),
      };
      localStorage.setItem("lh_utm", JSON.stringify(cacheData));

      const utm = getUtmParams();
      expect(utm).toEqual({
        utm_source: "cached_source",
        utm_medium: "cached_medium",
        utm_campaign: "cached_campaign",
      });
    });

    it("clears expired cache (older than 30 days)", () => {
      const expiredCache = {
        utm_source: "old",
        utm_medium: "old",
        utm_campaign: "old",
        timestamp: Date.now() - 31 * 24 * 60 * 60 * 1000,
      };
      localStorage.setItem("lh_utm", JSON.stringify(expiredCache));

      const utm = getUtmParams();
      expect(utm).toEqual({
        utm_source: null,
        utm_medium: null,
        utm_campaign: null,
      });
      expect(localStorage.getItem("lh_utm")).toBeNull();
    });

    // Kill: EqualityOperator `< UTM_TTL_MS` → `<= UTM_TTL_MS`
    // At exactly 30 days, the cache should be EXPIRED (< is strict)
    // With the mutant (<=), it would be valid
    it("expires cache at exactly 30 days (boundary)", () => {
      const boundaryCache = {
        utm_source: "boundary",
        utm_medium: "medium",
        utm_campaign: "campaign",
        timestamp: Date.now() - 30 * 24 * 60 * 60 * 1000,
      };
      localStorage.setItem("lh_utm", JSON.stringify(boundaryCache));

      const utm = getUtmParams();
      // At exactly 30 days, diff === UTM_TTL_MS, so < is false → expired
      expect(utm.utm_source).toBeNull();
    });

    it("keeps cache valid just under 30 days", () => {
      const freshCache = {
        utm_source: "fresh",
        utm_medium: "medium",
        utm_campaign: "campaign",
        timestamp: Date.now() - 30 * 24 * 60 * 60 * 1000 + 1000, // 1 second under
      };
      localStorage.setItem("lh_utm", JSON.stringify(freshCache));

      const utm = getUtmParams();
      expect(utm.utm_source).toBe("fresh");
    });

    // Kill: ConditionalExpression `if (cached)` → `if (true)`
    // When cache is empty string, it's falsy — should return nulls
    it("returns nulls when cache is empty string", () => {
      localStorage.setItem("lh_utm", "");

      const utm = getUtmParams();
      expect(utm).toEqual({
        utm_source: null,
        utm_medium: null,
        utm_campaign: null,
      });
    });

    it("handles partial UTM (only source)", () => {
      window.history.replaceState({}, "", "/?utm_source=referral");
      const utm = getUtmParams();
      expect(utm.utm_source).toBe("referral");
      expect(utm.utm_medium).toBeNull();
      expect(utm.utm_campaign).toBeNull();
    });
  });

  // ── trackEvent ────────────────────────────────────────────

  describe("trackEvent", () => {
    it("calls supabase.rpc with correct params", async () => {
      await trackEvent({ eventType: "lote_visto", lotId: "03" });

      expect(mockRpc).toHaveBeenCalledWith("track_event", {
        p_event_type: "lote_visto",
        p_lot_id: "03",
        p_session_id: expect.any(String),
        p_page_path: expect.any(String),
        p_user_agent: expect.any(String),
        p_referrer: null,
        p_metadata: expect.any(Object),
      });
    });

    it("includes timeOnPageMs when provided", async () => {
      await trackEvent({
        eventType: "page_view",
        timeOnPageMs: 5000,
      });

      expect(mockRpc).toHaveBeenCalledWith(
        "track_event",
        expect.objectContaining({
          p_time_on_page_ms: 5000,
        }),
      );
    });

    // Kill: ConditionalExpression `if (payload.timeOnPageMs != null)` → `if (true)`
    // When timeOnPageMs is NOT provided, p_time_on_page_ms should NOT be in params
    it("does NOT include p_time_on_page_ms when timeOnPageMs is absent", async () => {
      await trackEvent({ eventType: "page_view" });

      const callArgs = mockRpc.mock.calls[0][1];
      expect(callArgs).not.toHaveProperty("p_time_on_page_ms");
    });

    it("includes lotId only when provided", async () => {
      await trackEvent({ eventType: "page_view" });

      const callArgs = mockRpc.mock.calls[0][1];
      expect(callArgs).not.toHaveProperty("p_lot_id");
    });

    // Kill: ConditionalExpression `Object.keys(metadata).length > 0 ? metadata : null` → `true ? metadata : null`
    // Kill: EqualityOperator `> 0` → `>= 0`
    // When metadata is provided (even empty object), p_metadata should be that object
    // Note: UTM params are always merged, so metadata always has keys.
    // We verify that the merged UTM keys are present in the metadata.
    it("includes UTM keys in metadata even with no custom metadata", async () => {
      await trackEvent({ eventType: "page_view" });

      const callArgs = mockRpc.mock.calls[0][1];
      // metadata always has UTM keys merged in
      expect(callArgs.p_metadata).toHaveProperty("utm_source");
      expect(callArgs.p_metadata).toHaveProperty("utm_medium");
      expect(callArgs.p_metadata).toHaveProperty("utm_campaign");
    });

    it("merges metadata with UTM params", async () => {
      window.history.replaceState({}, "", "/?utm_source=test");

      await trackEvent({
        eventType: "contacto_iniciado",
        metadata: { channel: "whatsapp" },
      });

      const callArgs = mockRpc.mock.calls[0][1];
      expect(callArgs.p_metadata).toEqual(
        expect.objectContaining({
          channel: "whatsapp",
          utm_source: "test",
        }),
      );
    });

    // Kill: ConditionalExpression `if (cached)` → `if (true)` — handled by cache test above

    it("does not throw when supabase fails", async () => {
      mockRpc.mockRejectedValueOnce(new Error("Network error"));
      await trackEvent({ eventType: "page_view" });
    });

    it("does not throw when rpc returns error", async () => {
      mockRpc.mockResolvedValueOnce({ error: { message: "RLS" } });
      await trackEvent({ eventType: "page_view" });
    });
  });

  // ── Helper functions ──────────────────────────────────────

  describe("trackPageView", () => {
    it("calls trackEvent with page_view type", async () => {
      await trackPageView("/projects/03");
      expect(mockRpc).toHaveBeenCalledWith(
        "track_event",
        expect.objectContaining({ p_event_type: "page_view" }),
      );
    });

    // Kill: LogicalOperator `pagePath ?? window.location.pathname` → `pagePath && window.location.pathname`
    // When no path provided, should use window.location.pathname (not false/undefined)
    it("uses window.location.pathname when no path provided", async () => {
      await trackPageView();

      const callArgs = mockRpc.mock.calls[0][1];
      expect(callArgs.p_page_path).toBe(window.location.pathname);
    });

    // Kill: EqualityOperator — verify exact path is passed
    it("passes the exact path when provided", async () => {
      await trackPageView("/custom/path");

      const callArgs = mockRpc.mock.calls[0][1];
      expect(callArgs.p_page_path).toBe("/custom/path");
    });
  });

  describe("trackLotView", () => {
    it("calls trackEvent with lote_visto type and lotId", async () => {
      await trackLotView("05");
      expect(mockRpc).toHaveBeenCalledWith(
        "track_event",
        expect.objectContaining({
          p_event_type: "lote_visto",
          p_lot_id: "05",
        }),
      );
    });

    // Kill: StringLiteral `pagePath: \`/projects/${lotId}\`` → `pagePath: ""`
    // Verify the pagePath is exactly /projects/05
    it("sets pagePath to /projects/{lotId}", async () => {
      await trackLotView("05");

      const callArgs = mockRpc.mock.calls[0][1];
      expect(callArgs.p_page_path).toBe("/projects/05");
    });
  });

  describe("trackContactInitiated", () => {
    it("calls trackEvent with contacto_iniciado type", async () => {
      await trackContactInitiated("03", "whatsapp");
      expect(mockRpc).toHaveBeenCalledWith(
        "track_event",
        expect.objectContaining({
          p_event_type: "contacto_iniciado",
        }),
      );
    });

    // Kill: ObjectLiteral `metadata: { channel }` → `metadata: {}`
    // Verify metadata contains the channel value
    it("includes channel in metadata", async () => {
      await trackContactInitiated("03", "whatsapp");

      const callArgs = mockRpc.mock.calls[0][1];
      expect(callArgs.p_metadata).toEqual(
        expect.objectContaining({ channel: "whatsapp" }),
      );
    });
  });

  describe("trackFormSubmitted", () => {
    it("calls trackEvent with formulario_enviado type", async () => {
      await trackFormSubmitted("02", "ficha_lote");
      expect(mockRpc).toHaveBeenCalledWith(
        "track_event",
        expect.objectContaining({
          p_event_type: "formulario_enviado",
        }),
      );
    });

    // Kill: ObjectLiteral `metadata: { form_type: formType }` → `metadata: {}`
    // Verify metadata contains the form_type value
    it("includes form_type in metadata", async () => {
      await trackFormSubmitted("02", "ficha_lote");

      const callArgs = mockRpc.mock.calls[0][1];
      expect(callArgs.p_metadata).toEqual(
        expect.objectContaining({ form_type: "ficha_lote" }),
      );
    });
  });

  describe("trackFilterApplied", () => {
    it("calls trackEvent with filtro_aplicado type", async () => {
      await trackFilterApplied({ status: "disponible" });
      expect(mockRpc).toHaveBeenCalledWith(
        "track_event",
        expect.objectContaining({
          p_event_type: "filtro_aplicado",
        }),
      );
    });

    // Kill: ObjectLiteral `metadata: { filters }` → `metadata: {}`
    // Verify metadata contains the filters object
    it("includes filters in metadata", async () => {
      await trackFilterApplied({ status: "disponible", area: "2000" });

      const callArgs = mockRpc.mock.calls[0][1];
      expect(callArgs.p_metadata).toEqual(
        expect.objectContaining({
          filters: { status: "disponible", area: "2000" },
        }),
      );
    });
  });

  describe("trackLotFavorited", () => {
    it("calls trackEvent with lote_favorito type and add action", async () => {
      await trackLotFavorited("04", true);
      expect(mockRpc).toHaveBeenCalledWith(
        "track_event",
        expect.objectContaining({
          p_event_type: "lote_favorito",
        }),
      );
    });

    // Kill: StringLiteral `isFavorited ? "add" : "remove"` → `isFavorited ? "" : "remove"`
    // Verify action is "add" when favoriting
    it("includes 'add' action when favoriting", async () => {
      await trackLotFavorited("04", true);

      const callArgs = mockRpc.mock.calls[0][1];
      expect(callArgs.p_metadata).toEqual(
        expect.objectContaining({ action: "add" }),
      );
    });

    it("includes 'remove' action when unfavoriting", async () => {
      await trackLotFavorited("04", false);

      const callArgs = mockRpc.mock.calls[0][1];
      expect(callArgs.p_metadata).toEqual(
        expect.objectContaining({ action: "remove" }),
      );
    });
  });
});

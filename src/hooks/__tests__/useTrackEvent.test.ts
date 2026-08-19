import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";

// ---------------------------------------------------------------------------
// Mocks
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

import { useTrackEvent } from "../useTrackEvent";

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("useTrackEvent", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  // ── Manual tracking ─────────────────────────────────────

  describe("manual tracking (track function)", () => {
    it("returns a track function", () => {
      const { result } = renderHook(() => useTrackEvent());
      expect(typeof result.current.track).toBe("function");
    });

    it("track function calls trackEvent with defaults", async () => {
      const { result } = renderHook(() => useTrackEvent());

      await act(async () => {
        result.current.track("lote_visto");
      });

      expect(mockRpc).toHaveBeenCalledWith(
        "track_event",
        expect.objectContaining({
          p_event_type: "lote_visto",
        }),
      );
    });

    // Kill: ObjectLiteral `trackEvent({...})` → `trackEvent({})`
    // Verify the full params object is passed (not empty)
    it("track passes complete params object (not empty)", async () => {
      const { result } = renderHook(() => useTrackEvent());

      await act(async () => {
        result.current.track("contacto_iniciado", {
          lotId: "05",
          metadata: { channel: "whatsapp" },
        });
      });

      const callArgs = mockRpc.mock.calls[0][1];
      expect(callArgs.p_event_type).toBe("contacto_iniciado");
      expect(callArgs.p_lot_id).toBe("05");
    });

    it("track function uses overrides", async () => {
      const { result } = renderHook(() => useTrackEvent());

      await act(async () => {
        result.current.track("contacto_iniciado", {
          lotId: "05",
          metadata: { channel: "whatsapp" },
        });
      });

      expect(mockRpc).toHaveBeenCalledWith(
        "track_event",
        expect.objectContaining({
          p_event_type: "contacto_iniciado",
          p_lot_id: "05",
        }),
      );
    });

    // Kill: StringLiteral `eventType ?? base?.eventType ?? "page_view"` → `""`
    // Verify the event type is "page_view" when no args and no base options
    it("defaults to 'page_view' when no event type provided", async () => {
      const { result } = renderHook(() => useTrackEvent());

      await act(async () => {
        result.current.track();
      });

      const callArgs = mockRpc.mock.calls[0][1];
      expect(callArgs.p_event_type).toBe("page_view");
    });

    it("track function uses default options from hook", async () => {
      const { result } = renderHook(() =>
        useTrackEvent({
          eventType: "lote_visto",
          lotId: "03",
        }),
      );

      await act(async () => {
        result.current.track();
      });

      expect(mockRpc).toHaveBeenCalledWith(
        "track_event",
        expect.objectContaining({
          p_event_type: "lote_visto",
          p_lot_id: "03",
        }),
      );
    });

    // Kill: LogicalOperator `overrides?.pagePath ?? base?.pagePath` → `&&`
    // Kill: LogicalOperator `overrides?.metadata ?? base?.metadata` → `&&`
    // Kill: LogicalOperator `overrides?.timeOnPageMs ?? base?.timeOnPageMs` → `&&`
    // When overrides provide values, they should be used (not combined with &&)
    it("overrides take precedence over hook defaults for all fields", async () => {
      const { result } = renderHook(() =>
        useTrackEvent({
          eventType: "lote_visto",
          lotId: "03",
          pagePath: "/old/path",
          metadata: { old: true },
          timeOnPageMs: 1000,
        }),
      );

      await act(async () => {
        result.current.track("contacto_iniciado", {
          lotId: "07",
          pagePath: "/new/path",
          metadata: { new: true },
          timeOnPageMs: 5000,
        });
      });

      const callArgs = mockRpc.mock.calls[0][1];
      expect(callArgs.p_event_type).toBe("contacto_iniciado");
      expect(callArgs.p_lot_id).toBe("07");
      expect(callArgs.p_page_path).toBe("/new/path");
      expect(callArgs.p_metadata).toEqual(
        expect.objectContaining({ new: true }),
      );
      expect(callArgs.p_time_on_page_ms).toBe(5000);
    });

    // Kill: OptionalChaining `base?.eventType` → `base.eventType`
    // When base is null/undefined (no hook options), should not throw
    it("does not throw when hook has no options", async () => {
      const { result } = renderHook(() => useTrackEvent());

      await act(async () => {
        result.current.track("lote_visto", { lotId: "01" });
      });

      expect(mockRpc).toHaveBeenCalled();
    });
  });

  // ── Auto tracking ───────────────────────────────────────

  describe("auto tracking", () => {
    it("tracks event automatically when auto=true", async () => {
      renderHook(() =>
        useTrackEvent({
          eventType: "lote_visto",
          lotId: "02",
          auto: true,
        }),
      );

      await waitFor(
        () => {
          expect(mockRpc).toHaveBeenCalled();
        },
        { timeout: 500 },
      );
    });

    // Kill: ConditionalExpression `if (!options?.auto) return` → `if (false) return`
    // Already tested: "does not track when auto is not set" below
    it("does not track when auto is not set", () => {
      renderHook(() =>
        useTrackEvent({
          eventType: "lote_visto",
          lotId: "02",
        }),
      );

      expect(mockRpc).not.toHaveBeenCalled();
    });

    it("does not track when auto=false", () => {
      renderHook(() =>
        useTrackEvent({
          eventType: "lote_visto",
          lotId: "02",
          auto: false,
        }),
      );

      expect(mockRpc).not.toHaveBeenCalled();
    });

    // Kill: BlockStatement `useEffect(() => { optionsRef.current = options; })` → `{}`
    // The ref sync ensures that the track() function uses the latest options.
    // Test: render with one set of options, then re-render with different options,
    // and verify the track() function uses the UPDATED options.
    it("track function uses latest options after re-render", async () => {
      const { result, rerender } = renderHook(
        ({ lotId }) =>
          useTrackEvent({
            eventType: "lote_visto",
            lotId,
          }),
        { initialProps: { lotId: "01" } },
      );

      // Re-render with different lotId
      rerender({ lotId: "99" });

      await act(async () => {
        result.current.track();
      });

      const callArgs = mockRpc.mock.calls[0][1];
      // If ref sync works, this should be "99" (the latest value)
      // If ref sync is broken (mutant), it would still be "01"
      expect(callArgs.p_lot_id).toBe("99");
    });

    // Kill: ArrowFunction `clearTimeout(timer)` → `undefined`
    // Hard to test cleanup directly, but we can verify the timer is set
    // by checking that the event fires after the delay
    it("fires event after the 100ms delay (not immediately)", async () => {
      renderHook(() =>
        useTrackEvent({
          eventType: "lote_visto",
          lotId: "02",
          auto: true,
        }),
      );

      // Immediately after mount — should NOT have been called yet
      expect(mockRpc).not.toHaveBeenCalled();

      // After 100ms — should be called
      await waitFor(
        () => {
          expect(mockRpc).toHaveBeenCalled();
        },
        { timeout: 500 },
      );
    });

    // Kill: ArrayDeclaration `[options?.auto, ...]` → `[]`
    // If deps array is empty, changing eventType should NOT re-trigger.
    // But with correct deps, changing eventType should re-trigger.
    it("re-tracks when eventType changes (deps array correctness)", async () => {
      const { rerender } = renderHook(
        ({ eventType }) =>
          useTrackEvent({
            eventType,
            lotId: "02",
            auto: true,
          }),
        { initialProps: { eventType: "lote_visto" as "lote_visto" | "contacto_iniciado" } },
      );

      await waitFor(() => {
        expect(mockRpc).toHaveBeenCalled();
      });

      const firstCallCount = mockRpc.mock.calls.length;

      // Change eventType — should trigger again if deps are correct
      rerender({ eventType: "contacto_iniciado" });

      await waitFor(
        () => {
          expect(mockRpc.mock.calls.length).toBeGreaterThan(firstCallCount);
        },
        { timeout: 500 },
      );
    });
  });
});

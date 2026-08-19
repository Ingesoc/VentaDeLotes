import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type ReactNode } from "react";

// ---------------------------------------------------------------------------
// Mock supabase
// ---------------------------------------------------------------------------

let mockResponses: Record<string, { data: unknown; error: unknown; count?: number }> = {};

function createMockChain(tableName: string) {
  const chain = {
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    gte: vi.fn().mockReturnThis(),
    lte: vi.fn().mockReturnThis(),
    or: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    range: vi.fn().mockReturnThis(),
    single: vi.fn().mockReturnThis(),
    then: (resolve: (v: unknown) => void) => {
      const resp = mockResponses[tableName] ?? { data: [], error: null };
      return Promise.resolve(resp).then(resolve);
    },
  };
  return chain;
}

const mockFrom = vi.fn((table: string) => createMockChain(table));
const mockRpc = vi.fn().mockResolvedValue({ data: null, error: null });

vi.mock("@/lib/supabase", () => ({
  supabase: {
    get from() {
      return mockFrom;
    },
    rpc: (...args: unknown[]) => mockRpc(...args),
  },
}));

// ---------------------------------------------------------------------------
// Imports after mocks
// ---------------------------------------------------------------------------

import { useLeads, useFunnelCounts, useChannelPerformance, useLeadStats } from "../queries/leads";
import { useFunnelData, useChannelAnalytics } from "../queries/funnel";

// ---------------------------------------------------------------------------
// Test helpers
// ---------------------------------------------------------------------------

function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
    },
  });
}

function createWrapper() {
  const queryClient = createTestQueryClient();
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  return { queryClient, wrapper };
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("admin query hooks", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFrom.mockReset();
    mockFrom.mockImplementation((table: string) => createMockChain(table));
    mockRpc.mockReset();
    mockRpc.mockResolvedValue({ data: null, error: null });
    mockResponses = {};
  });

  // ── useLeads ────────────────────────────────────────────

  describe("useLeads", () => {
    it("fetches leads with default filters", async () => {
      mockResponses["leads"] = {
        data: [
          { id: 1, name: "Juan", email: "juan@test.com" },
          { id: 2, name: "María", email: "maria@test.com" },
        ],
        error: null,
        count: 2,
      };

      const { wrapper } = createWrapper();
      const { result } = renderHook(() => useLeads(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.data?.leads).toHaveLength(2);
      expect(result.current.data?.total).toBe(2);
    });

    it("passes filters to Supabase query", async () => {
      mockResponses["leads"] = { data: [], error: null, count: 0 };

      const { wrapper } = createWrapper();
      renderHook(
        () => useLeads({ stage: "nuevo", channel: "whatsapp", search: "test" }),
        { wrapper },
      );

      await waitFor(() => {
        expect(mockFrom).toHaveBeenCalledWith("leads");
      });
    });
  });

  // ── useFunnelCounts ─────────────────────────────────────

  describe("useFunnelCounts", () => {
    it("returns counts by funnel stage", async () => {
      mockResponses["leads"] = {
        data: [
          { funnel_stage: "nuevo" },
          { funnel_stage: "nuevo" },
          { funnel_stage: "contactado" },
          { funnel_stage: "cerrado_ganado" },
        ],
        error: null,
      };

      const { wrapper } = createWrapper();
      const { result } = renderHook(() => useFunnelCounts(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.data).toHaveLength(6); // all stages
      const nuevo = result.current.data?.find((s) => s.stage === "nuevo");
      expect(nuevo?.count).toBe(2);
      const ganado = result.current.data?.find(
        (s) => s.stage === "cerrado_ganado",
      );
      expect(ganado?.count).toBe(1);
    });
  });

  // ── useChannelPerformance ───────────────────────────────

  describe("useChannelPerformance", () => {
    it("groups leads by channel and calculates conversion rate", async () => {
      mockResponses["leads"] = {
        data: [
          { source_channel: "organico", funnel_stage: "nuevo" },
          { source_channel: "organico", funnel_stage: "cerrado_ganado" },
          { source_channel: "whatsapp", funnel_stage: "contactado" },
          { source_channel: "whatsapp", funnel_stage: "cerrado_perdido" },
        ],
        error: null,
      };

      const { wrapper } = createWrapper();
      const { result } = renderHook(() => useChannelPerformance(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.data).toHaveLength(2);

      const organico = result.current.data?.find(
        (c) => c.channel === "organico",
      );
      expect(organico?.total_leads).toBe(2);
      expect(organico?.closed_won).toBe(1);
      expect(organico?.conversion_rate).toBe(50);
    });
  });

  // ── useLeadStats ────────────────────────────────────────

  describe("useLeadStats", () => {
    it("returns total leads and stage distribution", async () => {
      let callCount = 0;
      mockFrom.mockImplementation((table: string) => {
        if (table === "leads") {
          callCount++;
          const responses = [
            { data: null, error: null, count: 15 },
            { data: null, error: null, count: 5 },
            {
              data: [
                { funnel_stage: "nuevo" },
                { funnel_stage: "nuevo" },
                { funnel_stage: "contactado" },
              ],
              error: null,
            },
            { data: null, error: null, count: 10 },
          ];
          return {
            select: vi.fn().mockReturnThis(),
            gte: vi.fn().mockReturnThis(),
            then: (resolve: (v: unknown) => void) => {
              return Promise.resolve(responses[callCount - 1] ?? responses[0]).then(resolve);
            },
            eq: vi.fn().mockReturnThis(),
            lte: vi.fn().mockReturnThis(),
            or: vi.fn().mockReturnThis(),
            order: vi.fn().mockReturnThis(),
            range: vi.fn().mockReturnThis(),
            single: vi.fn().mockReturnThis(),
          };
        }
        return createMockChain(table);
      });

      const { wrapper } = createWrapper();
      const { result } = renderHook(() => useLeadStats(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.data?.totalLeads).toBeDefined();
      expect(result.current.data?.stageDistribution).toBeDefined();
    });
  });

  // ── useFunnelData ───────────────────────────────────────

  describe("useFunnelData", () => {
    it("returns funnel stages and conversion rates", async () => {
      mockResponses["leads"] = {
        data: [
          { funnel_stage: "nuevo", created_at: new Date().toISOString() },
          { funnel_stage: "nuevo", created_at: new Date().toISOString() },
          { funnel_stage: "contactado", created_at: new Date().toISOString() },
        ],
        error: null,
      };

      const { wrapper } = createWrapper();
      const { result } = renderHook(() => useFunnelData(30), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.data?.stages).toHaveLength(5);
      expect(result.current.data?.totalLeads).toBe(3);
      expect(result.current.data?.leadsTrend).toBeDefined();
    });
  });

  // ── useChannelAnalytics ─────────────────────────────────

  describe("useChannelAnalytics", () => {
    it("groups leads by channel with stage breakdown", async () => {
      mockResponses["leads"] = {
        data: [
          { source_channel: "organico", funnel_stage: "nuevo", created_at: "" },
          {
            source_channel: "organico",
            funnel_stage: "cerrado_ganado",
            created_at: "",
          },
          {
            source_channel: "whatsapp",
            funnel_stage: "contactado",
            created_at: "",
          },
        ],
        error: null,
      };

      const { wrapper } = createWrapper();
      const { result } = renderHook(() => useChannelAnalytics(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.data).toHaveLength(2);
      const organico = result.current.data?.find(
        (c) => c.channel === "organico",
      );
      expect(organico?.totalLeads).toBe(2);
      expect(organico?.closedWon).toBe(1);
    });
  });
});

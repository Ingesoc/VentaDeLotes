import { describe, it, expect, vi, beforeEach } from "vitest";

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

const mockRpc = vi.fn().mockResolvedValue({ error: null });
const mockInvoke = vi.fn().mockResolvedValue({ error: null });

vi.mock("@/lib/supabase", () => ({
  supabase: {
    rpc: (...args: unknown[]) => mockRpc(...args),
    functions: {
      invoke: (...args: unknown[]) => mockInvoke(...args),
    },
  },
}));

vi.mock("@/lib/analytics", () => ({
  getUtmParams: vi.fn().mockReturnValue({
    utm_source: null,
    utm_medium: null,
    utm_campaign: null,
  }),
}));

// ---------------------------------------------------------------------------
// Import after mocks
// ---------------------------------------------------------------------------

import { submitLead } from "../leads";
import { getUtmParams } from "../analytics";

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("submitLead", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getUtmParams).mockReturnValue({
      utm_source: null,
      utm_medium: null,
      utm_campaign: null,
    });
  });

  it("calls RPC with basic lead data", async () => {
    const result = await submitLead({
      name: "Juan",
      email: "juan@test.com",
      phone: "3001234567",
    });

    expect(result).toEqual({ ok: true });
    expect(mockRpc).toHaveBeenCalledWith("submit_lead", {
      p_name: "Juan",
      p_email: "juan@test.com",
      p_phone: "3001234567",
      p_message: null,
      p_source_channel: "organico",
      p_lot_id: null,
      p_utm_source: null,
      p_utm_medium: null,
      p_utm_campaign: null,
    });
  });

  it("includes source channel when provided", async () => {
    await submitLead({
      name: "María",
      email: "maria@test.com",
      phone: "3009876543",
      sourceChannel: "pauta_meta",
    });

    expect(mockRpc).toHaveBeenCalledWith(
      "submit_lead",
      expect.objectContaining({ p_source_channel: "pauta_meta" }),
    );
  });

  it("includes lot ID when provided", async () => {
    await submitLead({
      name: "Pedro",
      email: "pedro@test.com",
      phone: "3005551234",
      lotId: "03",
    });

    expect(mockRpc).toHaveBeenCalledWith(
      "submit_lead",
      expect.objectContaining({ p_lot_id: "03" }),
    );
  });

  it("uses explicit UTM over inferred UTM", async () => {
    vi.mocked(getUtmParams).mockReturnValue({
      utm_source: "inferred",
      utm_medium: "inferred",
      utm_campaign: "inferred",
    });

    await submitLead({
      name: "Ana",
      email: "ana@test.com",
      phone: "3001112233",
      utmSource: "explicit_source",
      utmMedium: null,
      utmCampaign: "explicit_campaign",
    });

    expect(mockRpc).toHaveBeenCalledWith(
      "submit_lead",
      expect.objectContaining({
        p_utm_source: "explicit_source",
        // null ?? inferred = inferred (nullish coalescing falls back on null)
        p_utm_medium: "inferred",
        p_utm_campaign: "explicit_campaign",
      }),
    );
  });

  it("infers UTM from getUtmParams when not provided", async () => {
    vi.mocked(getUtmParams).mockReturnValue({
      utm_source: "google",
      utm_medium: "cpc",
      utm_campaign: "spring_sale",
    });

    await submitLead({
      name: "Carlos",
      email: "carlos@test.com",
      phone: "3004445566",
    });

    expect(mockRpc).toHaveBeenCalledWith(
      "submit_lead",
      expect.objectContaining({
        p_utm_source: "google",
        p_utm_medium: "cpc",
        p_utm_campaign: "spring_sale",
      }),
    );
  });

  it("returns error when RPC fails", async () => {
    mockRpc.mockResolvedValueOnce({ error: { message: "DB error" } });

    const result = await submitLead({
      name: "Test",
      email: "test@test.com",
      phone: "3000000000",
    });

    expect(result.ok).toBe(false);
  });

  it("includes message when provided", async () => {
    await submitLead({
      name: "Luis",
      email: "luis@test.com",
      phone: "3007778899",
      message: "Interested in lot 05",
    });

    expect(mockRpc).toHaveBeenCalledWith(
      "submit_lead",
      expect.objectContaining({ p_message: "Interested in lot 05" }),
    );
  });

  it("sends notification fire-and-forget after successful lead", async () => {
    await submitLead({
      name: "Test",
      email: "test@test.com",
      phone: "3000000000",
    });

    expect(mockInvoke).toHaveBeenCalledWith("notify-lead", {
      body: expect.objectContaining({ name: "Test" }),
    });
  });

  it("does not fail if notification fails", async () => {
    mockInvoke.mockRejectedValueOnce(new Error("Edge function down"));

    const result = await submitLead({
      name: "Test",
      email: "test@test.com",
      phone: "3000000000",
    });

    expect(result.ok).toBe(true);
  });
});

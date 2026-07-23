import { describe, it, expect, vi, beforeEach } from "vitest";
import type { SupabaseClient } from "@supabase/supabase-js";
import { checkAdminStatus } from "@/lib/checkAdmin";

function createMockSupabase(rpcReturn: unknown) {
  return {
    rpc: vi.fn().mockResolvedValue({ data: rpcReturn, error: null }),
  } as unknown as SupabaseClient;
}

describe("checkAdminStatus", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns false when userEmail is undefined", async () => {
    const supabase = createMockSupabase(true);
    const result = await checkAdminStatus(supabase, undefined);
    expect(result).toBe(false);
    expect(supabase.rpc).not.toHaveBeenCalled();
  });

  it("returns false when userEmail is an empty string", async () => {
    const supabase = createMockSupabase(true);
    const result = await checkAdminStatus(supabase, "");
    expect(result).toBe(false);
    expect(supabase.rpc).not.toHaveBeenCalled();
  });

  it("returns true when RPC returns true", async () => {
    const supabase = createMockSupabase(true);
    const result = await checkAdminStatus(supabase, "admin@laholanda.com");
    expect(result).toBe(true);
    expect(supabase.rpc).toHaveBeenCalledWith("has_backstage_access", {
      user_email: "admin@laholanda.com",
    });
  });

  it("returns false when RPC returns false", async () => {
    const supabase = createMockSupabase(false);
    const result = await checkAdminStatus(supabase, "user@example.com");
    expect(result).toBe(false);
  });

  it("returns false when RPC call fails", async () => {
    const supabase = {
      rpc: vi.fn().mockResolvedValue({
        data: null,
        error: { message: "Database error" },
      }),
    } as unknown as SupabaseClient;

    const result = await checkAdminStatus(supabase, "admin@laholanda.com");
    expect(result).toBe(false);
  });

  it("coerces truthy non-boolean RPC responses to true", async () => {
    const supabase = createMockSupabase(1);
    const result = await checkAdminStatus(supabase, "admin@laholanda.com");
    expect(result).toBe(true);
  });
});

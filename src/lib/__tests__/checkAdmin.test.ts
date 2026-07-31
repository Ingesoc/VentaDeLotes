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

  it("returns false when RPC call fails with error", async () => {
    const supabase = {
      rpc: vi.fn().mockResolvedValue({
        data: null,
        error: { message: "Database error" },
      }),
    } as unknown as SupabaseClient;

    const result = await checkAdminStatus(supabase, "admin@laholanda.com");
    expect(result).toBe(false);
  });

  it("returns false when RPC fails even if data is truthy", async () => {
    // Kill mutants: if(error) → false / Block emptied
    // When data=true and error present, real code enters if(error) and returns false.
    // With mutants skipping the block, !!data=true would be returned instead.
    const supabase = {
      rpc: vi.fn().mockResolvedValue({
        data: true,
        error: { message: "Permission denied" },
      }),
    } as unknown as SupabaseClient;

    const result = await checkAdminStatus(supabase, "admin@laholanda.com");
    expect(result).toBe(false);
  });

  it("logs error message to console when RPC fails", async () => {
    // Kill StringLiteral mutant: "Error checking admin status:" → ""
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const supabase = {
      rpc: vi.fn().mockResolvedValue({
        data: null,
        error: { message: "Database error" },
      }),
    } as unknown as SupabaseClient;

    await checkAdminStatus(supabase, "admin@laholanda.com");

    expect(errorSpy).toHaveBeenCalledWith(
      "Error checking admin status:",
      "Database error",
    );
    errorSpy.mockRestore();
  });

  it("coerces truthy non-boolean RPC responses to true", async () => {
    const supabase = createMockSupabase(1);
    const result = await checkAdminStatus(supabase, "admin@laholanda.com");
    expect(result).toBe(true);
  });
});

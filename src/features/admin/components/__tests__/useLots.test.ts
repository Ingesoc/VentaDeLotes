import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor, act } from "@testing-library/react";

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

const mockUploadImage = vi.fn();

vi.mock("@/lib/cloudinary", () => ({
  uploadImage: (...args: unknown[]) => mockUploadImage(...args),
}));

// Spy on the actual supabase.from so we can assert call args
const mockFrom = vi.fn();

vi.mock("@/lib/supabase", () => ({
  supabase: {
    get from() {
      return mockFrom;
    },
  },
}));

// Chainable Supabase mock — each .from() call creates a fresh thenable chain.
let supabaseResponses: Array<{ data: unknown; error: unknown }> = [];
let supabaseCallIndex = 0;

function createChain() {
  const chain = {
    select: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    // Make the chain thenable so `await` resolves it
    then: (resolve: (v: unknown) => void, reject?: (e: unknown) => void) => {
      const resp = supabaseResponses[supabaseCallIndex] ?? { data: null, error: null };
      supabaseCallIndex++;
      return Promise.resolve(resp).then(resolve, reject);
    },
  };
  return chain;
}

import { useLots } from "../useLots";

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const MOCK_LOTS = [
  {
    id: "01",
    area_m2: 8910,
    price: 189242850,
    status: "disponible",
    aerial_image: "https://res.cloudinary.com/test/image1.jpg",
  },
  {
    id: "02",
    area_m2: 2008,
    price: 189242850,
    status: "reservado",
    aerial_image: "",
  },
  {
    id: "03",
    area_m2: 2013,
    price: 185619550,
    status: "vendido",
    aerial_image: "https://res.cloudinary.com/test/image3.jpg",
  },
];

function setupResponses(responses: Array<{ data: unknown; error: unknown }>) {
  supabaseResponses = responses;
  supabaseCallIndex = 0;
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("useLots", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    supabaseCallIndex = 0;
    supabaseResponses = [];
    mockFrom.mockImplementation(() => createChain());
  });

  // -----------------------------------------------------------------------
  // Initial load
  // -----------------------------------------------------------------------
  describe("Initial load", () => {
    it("loads lots on mount", async () => {
      setupResponses([{ data: MOCK_LOTS, error: null }]);

      const { result } = renderHook(() => useLots());

      expect(result.current.loading).toBe(true);

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.lots).toHaveLength(3);
      expect(result.current.lots[0].id).toBe("01");
      // Verify it queries the correct table
      expect(mockFrom).toHaveBeenCalledWith("lots");
    });

    it("sets loading to false with data on success", async () => {
      setupResponses([{ data: MOCK_LOTS, error: null }]);

      const { result } = renderHook(() => useLots());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.lots).toEqual(MOCK_LOTS);
    });

    it("handles Supabase error during initial load", async () => {
      const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
      setupResponses([{ data: null, error: { message: "Database error" } }]);

      const { result } = renderHook(() => useLots());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.lots).toEqual([]);
      expect(errorSpy).toHaveBeenCalledWith("Error loading lots:", expect.anything());
      errorSpy.mockRestore();
    });
  });

  // -----------------------------------------------------------------------
  // saveLot
  // -----------------------------------------------------------------------
  describe("saveLot", () => {
    it("updates lot status and price in state", async () => {
      setupResponses([
        { data: MOCK_LOTS, error: null }, // initial load
        { data: null, error: null }, // update
      ]);

      const { result } = renderHook(() => useLots());
      await waitFor(() => expect(result.current.loading).toBe(false));

      let success = false;
      await act(async () => {
        success = await result.current.saveLot("01", {
          status: "vendido",
          price: 200000000,
        });
      });

      expect(success).toBe(true);
      expect(result.current.lots.find((l) => l.id === "01")?.status).toBe("vendido");
      expect(result.current.lots.find((l) => l.id === "01")?.price).toBe(200000000);
    });

    it("returns false and sets error when Supabase update fails", async () => {
      const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
      setupResponses([
        { data: MOCK_LOTS, error: null },
        { data: null, error: { message: "Update failed" } },
      ]);

      const { result } = renderHook(() => useLots());
      await waitFor(() => expect(result.current.loading).toBe(false));

      let success = true;
      await act(async () => {
        success = await result.current.saveLot("01", {
          status: "vendido",
          price: 200000000,
        });
      });

      expect(success).toBe(false);
      expect(errorSpy).toHaveBeenCalledWith("Error saving lot:", expect.anything());
      expect(result.current.error).toBe("No se pudo guardar el lote. Intenta de nuevo.");
      errorSpy.mockRestore();
    });

    it("rejects negative price in saveLot", async () => {
      setupResponses([{ data: MOCK_LOTS, error: null }]);

      const { result } = renderHook(() => useLots());
      await waitFor(() => expect(result.current.loading).toBe(false));

      let success = true;
      await act(async () => {
        success = await result.current.saveLot("01", {
          status: "disponible",
          price: -100,
        });
      });

      expect(success).toBe(false);
      // from() should NOT have been called for the update
      expect(mockFrom).toHaveBeenCalledTimes(1); // only initial load
    });

    it("sets saving to true during saveLot and back to false after", async () => {
      setupResponses([
        { data: MOCK_LOTS, error: null },
        { data: null, error: null },
      ]);

      const { result } = renderHook(() => useLots());
      await waitFor(() => expect(result.current.loading).toBe(false));

      expect(result.current.saving).toBe(false);

      await act(async () => {
        await result.current.saveLot("01", {
          status: "vendido",
          price: 200000000,
        });
      });

      expect(result.current.saving).toBe(false);
    });

    it("sets saving to false even when saveLot throws", async () => {
      const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
      setupResponses([
        { data: MOCK_LOTS, error: null },
        { data: null, error: { message: "DB error" } },
      ]);

      const { result } = renderHook(() => useLots());
      await waitFor(() => expect(result.current.loading).toBe(false));

      await act(async () => {
        await result.current.saveLot("01", {
          status: "vendido",
          price: 200000000,
        });
      });

      expect(result.current.saving).toBe(false);
      errorSpy.mockRestore();
    });
  });

  // -----------------------------------------------------------------------
  // handleUploadImage — Cloudinary upload flow
  // -----------------------------------------------------------------------
  describe("handleUploadImage — Cloudinary upload flow", () => {
    it("calls uploadImage and saves URL to Supabase on success", async () => {
      setupResponses([
        { data: MOCK_LOTS, error: null }, // initial load
        { data: null, error: null }, // update aerial_image
      ]);
      mockUploadImage.mockResolvedValue("https://res.cloudinary.com/test/uploaded.jpg");

      const { result } = renderHook(() => useLots());
      await waitFor(() => expect(result.current.loading).toBe(false));

      await act(async () => {
        await result.current.handleUploadImage("01");
      });

      expect(mockUploadImage).toHaveBeenCalledOnce();
      expect(result.current.uploading).toBeNull();
      const lot01 = result.current.lots.find((l) => l.id === "01");
      expect(lot01?.aerial_image).toBe("https://res.cloudinary.com/test/uploaded.jpg");
    });

    it("sets uploading state to lotId during upload", async () => {
      setupResponses([
        { data: MOCK_LOTS, error: null },
        { data: null, error: null },
      ]);

      let resolveUpload!: (value: string | null) => void;
      mockUploadImage.mockImplementation(
        () =>
          new Promise<string | null>((resolve) => {
            resolveUpload = resolve;
          }),
      );

      const { result } = renderHook(() => useLots());
      await waitFor(() => expect(result.current.loading).toBe(false));

      act(() => {
        result.current.handleUploadImage("02");
      });

      await waitFor(() => {
        expect(result.current.uploading).toBe("02");
      });

      await act(async () => {
        resolveUpload!("https://res.cloudinary.com/test/new.jpg");
      });

      expect(result.current.uploading).toBeNull();
    });

    it("does not update Supabase when user cancels (null result)", async () => {
      setupResponses([{ data: MOCK_LOTS, error: null }]);
      mockUploadImage.mockResolvedValue(null);

      const { result } = renderHook(() => useLots());
      await waitFor(() => expect(result.current.loading).toBe(false));

      await act(async () => {
        await result.current.handleUploadImage("01");
      });

      expect(mockUploadImage).toHaveBeenCalledOnce();
      const lot01 = result.current.lots.find((l) => l.id === "01");
      expect(lot01?.aerial_image).toBe("https://res.cloudinary.com/test/image1.jpg");
    });

    it("handles uploadImage rejection gracefully and sets error", async () => {
      setupResponses([{ data: MOCK_LOTS, error: null }]);
      const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
      mockUploadImage.mockRejectedValue(new Error("Cloudinary widget no disponible."));

      const { result } = renderHook(() => useLots());
      await waitFor(() => expect(result.current.loading).toBe(false));

      await act(async () => {
        await result.current.handleUploadImage("01");
      });

      expect(result.current.uploading).toBeNull();
      expect(errorSpy).toHaveBeenCalledWith(
        "Error uploading image:",
        expect.objectContaining({ message: "Cloudinary widget no disponible." }),
      );
      expect(result.current.error).toBe("No se pudo subir la imagen. Intenta de nuevo.");
      errorSpy.mockRestore();
    });

    it("handles Supabase error when saving the uploaded URL and sets error", async () => {
      setupResponses([
        { data: MOCK_LOTS, error: null },
        { data: null, error: { message: "RLS violation" } },
      ]);
      const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
      mockUploadImage.mockResolvedValue("https://res.cloudinary.com/test/uploaded.jpg");

      const { result } = renderHook(() => useLots());
      await waitFor(() => expect(result.current.loading).toBe(false));

      await act(async () => {
        await result.current.handleUploadImage("01");
      });

      expect(result.current.uploading).toBeNull();
      expect(errorSpy).toHaveBeenCalled();
      expect(result.current.error).toBe("No se pudo subir la imagen. Intenta de nuevo.");
      errorSpy.mockRestore();
    });

    it("resets uploading state even if save to Supabase fails", async () => {
      setupResponses([
        { data: MOCK_LOTS, error: null },
        { data: null, error: { message: "DB error" } },
      ]);
      mockUploadImage.mockResolvedValue("https://res.cloudinary.com/test/uploaded.jpg");

      const { result } = renderHook(() => useLots());
      await waitFor(() => expect(result.current.loading).toBe(false));

      await act(async () => {
        await result.current.handleUploadImage("03");
      });

      expect(result.current.uploading).toBeNull();
    });
  });

  // -----------------------------------------------------------------------
  // createLot
  // -----------------------------------------------------------------------
  describe("createLot", () => {
    it("creates a new lot and returns ok", async () => {
      const newLots = [
        ...MOCK_LOTS,
        {
          id: "17",
          area_m2: 3000,
          price: 250000000,
          status: "disponible",
          aerial_image: "",
        },
      ];
      setupResponses([
        { data: MOCK_LOTS, error: null }, // initial load
        { data: null, error: null }, // insert
        { data: newLots, error: null }, // reloadLots
      ]);

      const { result } = renderHook(() => useLots());
      await waitFor(() => expect(result.current.loading).toBe(false));

      let createResult!: { ok: boolean; error?: string };
      await act(async () => {
        createResult = await result.current.createLot({
          id: "17",
          areaM2: 3000,
          price: 250000000,
          status: "disponible",
        });
      });

      expect(createResult.ok).toBe(true);
      expect(createResult.error).toBeUndefined();
    });

    it("returns error when Supabase insert fails", async () => {
      const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
      setupResponses([
        { data: MOCK_LOTS, error: null },
        { data: null, error: { message: "duplicate key" } },
      ]);

      const { result } = renderHook(() => useLots());
      await waitFor(() => expect(result.current.loading).toBe(false));

      let createResult!: { ok: boolean; error?: string };
      await act(async () => {
        createResult = await result.current.createLot({
          id: "01",
          areaM2: 3000,
          price: 250000000,
          status: "disponible",
        });
      });

      expect(createResult.ok).toBe(false);
      expect(createResult.error).toBeTruthy();
      expect(createResult.error).toBe("No se pudo crear el lote. Verifica que el ID no exista ya.");
      expect(errorSpy).toHaveBeenCalledWith("Error creating lot:", expect.anything());
      errorSpy.mockRestore();
    });

    it("rejects negative price", async () => {
      setupResponses([{ data: MOCK_LOTS, error: null }]);

      const { result } = renderHook(() => useLots());
      await waitFor(() => expect(result.current.loading).toBe(false));

      let createResult!: { ok: boolean; error?: string };
      await act(async () => {
        createResult = await result.current.createLot({
          id: "99",
          areaM2: 1000,
          price: -500,
          status: "disponible",
        });
      });

      expect(createResult.ok).toBe(false);
      expect(createResult.error).toBe("El precio no puede ser negativo.");
    });

    it("rejects zero or negative area", async () => {
      setupResponses([{ data: MOCK_LOTS, error: null }]);

      const { result } = renderHook(() => useLots());
      await waitFor(() => expect(result.current.loading).toBe(false));

      let createResult!: { ok: boolean; error?: string };
      await act(async () => {
        createResult = await result.current.createLot({
          id: "99",
          areaM2: 0,
          price: 1000,
          status: "disponible",
        });
      });

      expect(createResult.ok).toBe(false);
      expect(createResult.error).toBe("El área debe ser mayor a 0.");
    });

    it("sets saving to false after createLot completes", async () => {
      const newLots = [...MOCK_LOTS, { id: "17", area_m2: 3000, price: 250000000, status: "disponible", aerial_image: "" }];
      setupResponses([
        { data: MOCK_LOTS, error: null },
        { data: null, error: null },
        { data: newLots, error: null },
      ]);

      const { result } = renderHook(() => useLots());
      await waitFor(() => expect(result.current.loading).toBe(false));

      await act(async () => {
        await result.current.createLot({
          id: "17",
          areaM2: 3000,
          price: 250000000,
          status: "disponible",
        });
      });

      expect(result.current.saving).toBe(false);
    });
  });

  // -----------------------------------------------------------------------
  // deleteLot
  // -----------------------------------------------------------------------
  describe("deleteLot", () => {
    it("deletes a lot and removes it from state", async () => {
      setupResponses([
        { data: MOCK_LOTS, error: null }, // initial load
        { data: null, error: null }, // delete
      ]);

      const { result } = renderHook(() => useLots());
      await waitFor(() => expect(result.current.loading).toBe(false));

      expect(result.current.lots).toHaveLength(3);

      let success = false;
      await act(async () => {
        success = await result.current.deleteLot("02");
      });

      expect(success).toBe(true);
      expect(result.current.lots).toHaveLength(2);
      expect(result.current.lots.find((l) => l.id === "02")).toBeUndefined();
    });

    it("returns false, keeps state, and sets error when delete fails", async () => {
      const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
      setupResponses([
        { data: MOCK_LOTS, error: null },
        { data: null, error: { message: "FK constraint" } },
      ]);

      const { result } = renderHook(() => useLots());
      await waitFor(() => expect(result.current.loading).toBe(false));

      let success = true;
      await act(async () => {
        success = await result.current.deleteLot("01");
      });

      expect(success).toBe(false);
      expect(result.current.lots).toHaveLength(3);
      expect(result.current.error).toBe("No se pudo eliminar el lote. Intenta de nuevo.");
      expect(errorSpy).toHaveBeenCalledWith("Error deleting lot:", expect.anything());
      errorSpy.mockRestore();
    });

    it("sets saving to false after deleteLot", async () => {
      setupResponses([
        { data: MOCK_LOTS, error: null },
        { data: null, error: null },
      ]);

      const { result } = renderHook(() => useLots());
      await waitFor(() => expect(result.current.loading).toBe(false));

      await act(async () => {
        await result.current.deleteLot("02");
      });

      expect(result.current.saving).toBe(false);
    });

    it("sets saving to false even when deleteLot throws", async () => {
      const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
      setupResponses([
        { data: MOCK_LOTS, error: null },
        { data: null, error: { message: "FK constraint" } },
      ]);

      const { result } = renderHook(() => useLots());
      await waitFor(() => expect(result.current.loading).toBe(false));

      await act(async () => {
        await result.current.deleteLot("01");
      });

      expect(result.current.saving).toBe(false);
      errorSpy.mockRestore();
    });
  });

  // -----------------------------------------------------------------------
  // clearError
  // -----------------------------------------------------------------------
  describe("clearError", () => {
    it("clears the error state", async () => {
      const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
      setupResponses([
        { data: MOCK_LOTS, error: null },
        { data: null, error: { message: "fail" } },
      ]);

      const { result } = renderHook(() => useLots());
      await waitFor(() => expect(result.current.loading).toBe(false));

      // Trigger an error
      await act(async () => {
        await result.current.saveLot("01", { status: "vendido", price: 100 });
      });

      expect(result.current.error).toBeTruthy();

      // Clear it
      act(() => {
        result.current.clearError();
      });

      expect(result.current.error).toBeNull();
      errorSpy.mockRestore();
    });
  });
});

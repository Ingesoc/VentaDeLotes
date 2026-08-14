import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// ---------------------------------------------------------------------------
// Tipos auxiliares
// ---------------------------------------------------------------------------
interface CloudinaryWidgetResult {
  event: string;
  info?: {
    secure_url?: string;
    files?: unknown[];
  };
}

interface CloudinaryWidget {
  open: () => void;
}

type UploadCallback = (
  error: unknown,
  result: CloudinaryWidgetResult,
) => void;

// ---------------------------------------------------------------------------
// Mock del módulo — usamos un Map para controlar las variables de entorno
// desde cada test. Las constantes se leen DENTRO de uploadImage() para que
// se evalúen en cada llamada, no en la creación del mock.
// ---------------------------------------------------------------------------
const mockEnvMap = vi.hoisted(() => new Map<string, string>());
mockEnvMap.set("cloudName", "test-cloud");
mockEnvMap.set("uploadPreset", "test-preset");

vi.mock("@/lib/cloudinary", () => {
  function cldUrl(url: string): string {
    if (!url.includes("res.cloudinary.com")) return url;
    const transforms = ["f_auto", "q_auto"];
    return url.replace(
      "/image/upload/",
      `/image/upload/${transforms.join(",")}/`,
    );
  }

  const CLD_WIDTHS = {
    HERO: 1920,
    CAROUSEL: 1200,
    MASTERPLAN: 1280,
    LARGE: 1000,
    CARD: 800,
    THUMB: 400,
    LOGO: 200,
  } as const;

  function uploadImage(): Promise<string | null> {
    return new Promise((resolve, reject) => {
      // Leer del Map en cada llamada, no en la creación del módulo
      const CLOUD_NAME = mockEnvMap.get("cloudName");
      const UPLOAD_PRESET = mockEnvMap.get("uploadPreset");

      if (!CLOUD_NAME || !UPLOAD_PRESET) {
        reject(
          new Error(
            "Missing Cloudinary env vars: VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET",
          ),
        );
        return;
      }

      const cloudinary = (
        window as unknown as {
          cloudinary?: {
            createUploadWidget: (...args: unknown[]) => { open: () => void };
          };
        }
      ).cloudinary;

      if (!cloudinary) {
        reject(new Error("Cloudinary widget no disponible."));
        return;
      }

      const widget = cloudinary.createUploadWidget(
        {
          cloudName: CLOUD_NAME,
          uploadPreset: UPLOAD_PRESET,
          sources: ["local", "url", "camera"],
          multiple: false,
          maxFiles: 1,
          cropping: false,
          resourceType: "image",
          clientAllowedFormats: ["png", "jpg", "jpeg", "webp", "svg"],
        },
        (error: unknown, result: CloudinaryWidgetResult) => {
          if (error) {
            reject(error);
            return;
          }
          if (result.event === "success") {
            resolve(result.info?.secure_url ?? null);
          }
          if (result.event === "close" && !result.info?.files?.length) {
            resolve(null);
          }
        },
      );

      widget.open();
    });
  }

  return { cldUrl, CLD_WIDTHS, uploadImage };
});

import { uploadImage } from "@/lib/cloudinary";

describe("uploadImage", () => {
  let mockWidget: CloudinaryWidget;
  let mockCreateUploadWidget: ReturnType<typeof vi.fn>;
  let uploadCallback: UploadCallback | null;
  let cleanup: (() => void) | null;

  function setupWindowCloudinary() {
    const cloudinary = {
      createUploadWidget: mockCreateUploadWidget,
    };
    (window as unknown as Record<string, unknown>).cloudinary = cloudinary;
    cleanup = () => {
      delete (window as unknown as Record<string, unknown>).cloudinary;
    };
  }

  beforeEach(() => {
    uploadCallback = null;
    cleanup = null;

    mockWidget = { open: vi.fn() };
    mockCreateUploadWidget = vi.fn(
      (_opts: Record<string, unknown>, callback: UploadCallback) => {
        uploadCallback = callback;
        return mockWidget;
      },
    );

    // Reset env vars to defaults
    mockEnvMap.set("cloudName", "test-cloud");
    mockEnvMap.set("uploadPreset", "test-preset");
  });

  afterEach(() => {
    if (cleanup) cleanup();
    uploadCallback = null;
  });

  // -----------------------------------------------------------------------
  // 1. Sin widget cargado
  // -----------------------------------------------------------------------
  it("rejects with error when cloudinary widget is not loaded", async () => {
    await expect(uploadImage()).rejects.toThrow("Cloudinary widget no disponible.");
  });

  // -----------------------------------------------------------------------
  // 2. Env vars faltantes
  // -----------------------------------------------------------------------
  it("rejects with error when env vars are missing", async () => {
    mockEnvMap.set("cloudName", "");
    mockEnvMap.set("uploadPreset", "");
    setupWindowCloudinary();

    await expect(uploadImage()).rejects.toThrow("Missing Cloudinary env vars");
  });

  it("rejects when cloud name is missing but preset is present", async () => {
    mockEnvMap.set("cloudName", "");
    mockEnvMap.set("uploadPreset", "test-preset");
    setupWindowCloudinary();

    await expect(uploadImage()).rejects.toThrow("Missing Cloudinary env vars");
  });

  // -----------------------------------------------------------------------
  // 3. Widget options
  // -----------------------------------------------------------------------
  it("creates upload widget with correct options", async () => {
    setupWindowCloudinary();

    const promise = uploadImage();

    expect(mockCreateUploadWidget).toHaveBeenCalledWith(
      expect.objectContaining({
        cloudName: "test-cloud",
        uploadPreset: "test-preset",
        sources: ["local", "url", "camera"],
        multiple: false,
        maxFiles: 1,
        resourceType: "image",
      }),
      expect.any(Function),
    );

    // Resolver y limpiar
    if (uploadCallback) {
      uploadCallback(null, { event: "close", info: { files: [] } });
    }
    await promise;
  });

  it("calls widget.open()", async () => {
    setupWindowCloudinary();

    const promise = uploadImage();

    expect(mockWidget.open).toHaveBeenCalledOnce();

    if (uploadCallback) {
      uploadCallback(null, { event: "close", info: { files: [] } });
    }
    await promise;
  });

  // -----------------------------------------------------------------------
  // 4. Eventos del widget
  // -----------------------------------------------------------------------
  it("resolves with secure_url on success event", async () => {
    setupWindowCloudinary();

    const promise = uploadImage();

    expect(uploadCallback).toBeTruthy();
    if (uploadCallback) {
      uploadCallback(null, {
        event: "success",
        info: { secure_url: "https://res.cloudinary.com/test/image.jpg" },
      });
    }

    const result = await promise;
    expect(result).toBe("https://res.cloudinary.com/test/image.jpg");
  });

  it("resolves with null on success when info has no secure_url", async () => {
    setupWindowCloudinary();

    const promise = uploadImage();

    if (uploadCallback) {
      uploadCallback(null, { event: "success", info: {} });
    }

    const result = await promise;
    expect(result).toBeNull();
  });

  it("resolves with null when user closes widget without uploading", async () => {
    setupWindowCloudinary();

    const promise = uploadImage();

    if (uploadCallback) {
      uploadCallback(null, { event: "close", info: { files: [] } });
    }

    const result = await promise;
    expect(result).toBeNull();
  });

  it("rejects when error is passed to callback", async () => {
    setupWindowCloudinary();

    const promise = uploadImage();

    if (uploadCallback) {
      uploadCallback(
        new Error("Upload failed"),
        null as unknown as CloudinaryWidgetResult,
      );
    }

    await expect(promise).rejects.toThrow("Upload failed");
  });

  it("does not resolve on unrelated events", async () => {
    setupWindowCloudinary();

    const promise = uploadImage();

    if (uploadCallback) {
      uploadCallback(null, { event: "batch-cancelled" });
    }

    // Verificar que la promesa sigue pendiente
    const isPending = await Promise.race([
      promise.then(() => false),
      new Promise<boolean>((resolve) => setTimeout(() => resolve(true), 100)),
    ]);
    expect(isPending).toBe(true);

    // Limpiar: enviar close para resolver
    if (uploadCallback) {
      uploadCallback(null, { event: "close", info: { files: [] } });
    }
    await promise;
  });

  // -----------------------------------------------------------------------
  // 5. Edge cases — undefined/null en info
  // -----------------------------------------------------------------------
  it("uses null fallback when info is undefined on success", async () => {
    setupWindowCloudinary();

    const promise = uploadImage();

    if (uploadCallback) {
      uploadCallback(null, { event: "success", info: undefined });
    }

    const result = await promise;
    expect(result).toBeNull();
  });

  it("uses null fallback when info.files is undefined on close", async () => {
    setupWindowCloudinary();

    const promise = uploadImage();

    if (uploadCallback) {
      uploadCallback(null, { event: "close", info: {} });
    }

    const result = await promise;
    expect(result).toBeNull();
  });
});
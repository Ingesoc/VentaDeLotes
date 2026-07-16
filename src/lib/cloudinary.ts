const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

interface CloudinaryWidgetResult {
  event: string;
  info?: {
    secure_url: string;
    files?: unknown[];
  };
}

interface CloudinaryWidget {
  open: () => void;
}

interface CloudinaryAPI {
  createUploadWidget: (
    options: Record<string, unknown>,
    callback: (error: unknown, result: CloudinaryWidgetResult) => void
  ) => CloudinaryWidget;
}

/** Abre el widget de Cloudinary y devuelve la URL de la imagen subida. */
export function uploadImage(): Promise<string | null> {
  return new Promise((resolve, reject) => {
    const cloudinary = (window as unknown as { cloudinary?: CloudinaryAPI }).cloudinary;

    if (!cloudinary) {
      reject(
        new Error(
          "Cloudinary widget not loaded. Add the script to index.html."
        )
      );
      return;
    }

    if (!CLOUD_NAME || !UPLOAD_PRESET) {
      reject(
        new Error(
          "Missing Cloudinary env vars: VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET"
        )
      );
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
          resolve(null); // Usuario cerró el widget sin subir
        }
      }
    );

    widget.open();
  });
}


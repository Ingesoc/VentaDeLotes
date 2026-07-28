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

/**
 * Anchos responsivos predefinidos para los diferentes tipos de imagen.
 * Basado en los tamaños de visualización de cada componente.
 */
export const CLD_WIDTHS = {
  /** Imágenes hero a full pantalla (1920px) */
  HERO: 1920,
  /** Imágenes de carrusel (1200px) */
  CAROUSEL: 1200,
  /** Imagen del plano general (1280px) */
  MASTERPLAN: 1280,
  /** Imágenes de galería/secciones grandes (1000px) */
  LARGE: 1000,
  /** Imágenes de tarjetas y features (800px) */
  CARD: 800,
  /** Miniaturas de galería (400px) */
  THUMB: 400,
  /** Logotipos e iconos (200px) */
  LOGO: 200,
} as const;

/**
 * Añade transformaciones de optimización a una URL de Cloudinary:
 * - f_auto: formato automático (WebP, AVIF, etc.)
 * - q_auto: calidad automática optimizada
 * - dpr_auto: densidad de píxeles según el dispositivo (Retina-ready)
 * - w_{width}: redimensiona al ancho especificado para reducir payload
 *
 * @param url - URL original de Cloudinary
 * @param width - Ancho máximo en píxeles (opcional). Sin width no aplica DPR.
 *                Pasa CLD_WIDTHS.X para valores predefinidos.
 *
 * Ejemplos:
 *   cldUrl(url)                          → f_auto,q_auto
 *   cldUrl(url, CLD_WIDTHS.HERO)         → f_auto,q_auto,dpr_auto,w_1920
 *   cldUrl(url, 600)                     → f_auto,q_auto,dpr_auto,w_600
 */
export function cldUrl(url: string, width?: number): string {
  if (!url.includes("res.cloudinary.com")) return url;

  // Construir las transformaciones base
  const transforms = [`f_auto`, `q_auto`];

  // Agregar width y DPR auto si se especifica width
  // dpr_auto permite que en pantallas Retina (2x, 3x) se sirvan imágenes
  // con la resolución adecuada sin perder nitidez.
  if (width && width > 0) {
    transforms.push(`dpr_auto`);
    transforms.push(`w_${width}`);
  }

  // Insertar después de /image/upload/
  return url.replace("/image/upload/", `/image/upload/${transforms.join(",")}/`);
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


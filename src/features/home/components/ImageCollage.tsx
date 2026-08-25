import { Images } from "lucide-react";
import type { ShowcaseImage } from "@/constants/showcase";

interface ImageCollageProps {
  images: ShowcaseImage[];
  /** Texto accesible del grupo (figcaption/aria-label). */
  label: string;
}

/**
 * Grid collage responsive de imágenes secundarias (reutilizable para el
 * item 2 del showcase —planos— o cualquier otra sección futura).
 * Con `images` vacío muestra un placeholder de mismo aspect-ratio para no
 * romper el layout mientras llega el material.
 */
export function ImageCollage({ images, label }: ImageCollageProps) {
  if (images.length === 0) {
    return (
      <div
        role="img"
        aria-label={`Próximamente: ${label}`}
        className="grid grid-cols-2 gap-2 aspect-[4/3] rounded-xl border border-dashed border-outline-variant/40 bg-surface-container-high p-2"
      >
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="rounded-lg bg-surface-container-highest/60 flex items-center justify-center"
          >
            {i === 0 && (
              <Images className="w-6 h-6 text-outline-variant" aria-hidden="true" />
            )}
          </div>
        ))}
      </div>
    );
  }

  return (
    <figure className="aspect-[4/3] rounded-xl overflow-hidden grid grid-cols-2 gap-2 shadow-ambient">
      {images.map((image, i) => (
        <img
          key={image.url}
          src={image.url}
          alt={image.alt}
          loading="lazy"
          decoding="async"
          className={`w-full h-full object-cover bg-surface-container-high ${
            i === 0 && images.length % 2 !== 0 ? "col-span-2" : ""
          }`}
        />
      ))}
      <figcaption className="sr-only">{label}</figcaption>
    </figure>
  );
}

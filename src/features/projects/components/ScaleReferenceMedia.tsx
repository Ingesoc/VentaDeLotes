import { Ruler } from "lucide-react";
import { YouTubeVideo } from "@/components/ui/YouTubeVideo";
import type { ScaleReferenceMedia as ScaleReferenceMediaType } from "@/constants/lots";

interface ScaleReferenceMediaProps {
  media: ScaleReferenceMediaType;
}

/**
 * Extrae el ID de video de una URL de YouTube (watch, youtu.be o embed).
 * Devuelve `null` si la URL no es de YouTube.
 */
export function getYouTubeId(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/(?:embed\/|watch\?v=)|youtu\.be\/)([\w-]{11})/,
  );
  return match?.[1] ?? null;
}

/**
 * Sección "Dimensiona el lote" — media con persona como referencia de
 * escala real (foto o video). Contenido opcional por lote: el componente se
 * renderiza solo si el padre pasa `media` (renderizado condicional, sin caja
 * vacía cuando el lote no tiene este material).
 */
export function ScaleReferenceMedia({ media }: ScaleReferenceMediaProps) {
  const youtubeId =
    media.type === "video" ? getYouTubeId(media.url) : null;

  return (
    <section
      aria-labelledby={`scale-reference-heading`}
      className="mb-section-gap"
    >
      <h2
        id="scale-reference-heading"
        className="text-headline-md font-headline-md text-primary mb-2 border-b border-outline-variant/20 pb-4 flex items-center gap-3"
      >
        <Ruler className="w-5 h-5 text-heritage-gold" aria-hidden="true" />
        Dimensiona el lote
      </h2>
      <p className="text-body-md font-body-md text-on-surface-variant mb-6 max-w-3xl">
        Referencia de escala real: así se ve el tamaño del terreno con una
        persona como punto de comparación.
      </p>

      <figure className="max-w-4xl">
        {youtubeId ? (
          <YouTubeVideo
            videoId={youtubeId}
            title={media.alt}
            className="aspect-video"
          />
        ) : media.type === "video" ? (
          <video
            controls
            preload="metadata"
            playsInline
            aria-label={media.alt}
            className="w-full aspect-video rounded-2xl bg-deep-forest shadow-xl"
          >
            <source src={media.url} type="video/mp4" />
          </video>
        ) : (
          <img
            src={media.url}
            alt={media.alt}
            loading="lazy"
            decoding="async"
            className="w-full aspect-[16/9] object-cover rounded-2xl bg-deep-forest shadow-xl"
          />
        )}
        <figcaption className="text-body-sm font-body-sm text-on-surface-variant mt-3">
          {media.alt} — Referencia de escala real.
        </figcaption>
      </figure>
    </section>
  );
}

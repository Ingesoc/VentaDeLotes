import { useState } from "react";

interface YouTubeVideoProps {
  /** ID del video de YouTube (la parte `hT4bLxh-8uo` de la URL del embed) */
  videoId: string;
  /** Texto accesible y `title` del iframe */
  title: string;
  className?: string;
  /** Se invoca cuando el usuario hace clic y el video comienza a reproducirse */
  onPlay?: () => void;
}

const THUMBNAIL_BASE = "https://i.ytimg.com/vi";
const THUMBNAIL_QUALITIES = ["maxresdefault", "hqdefault"] as const;

/**
 * Video de YouTube optimizado con carga perezosa (click-to-load).
 *
 * En lugar de montar el iframe del reproductor de YouTube al cargar la página
 * (que descarga cientos de KB aunque nadie lo vea), se muestra la miniatura
 * del video con un botón de play y el iframe solo se crea cuando el usuario
 * hace clic. Además:
 *  - Usa el dominio `youtube-nocookie.com` para máxima privacidad.
 *  - `autoplay=1` para que el video arranque apenas se carga el reproductor.
 *  - `rel=0` para no mostrar videos relacionados al finalizar.
 *  - `playsinline=1` para una mejor experiencia en móviles.
 */
export function YouTubeVideo({
  videoId,
  title,
  className = "",
  onPlay,
}: YouTubeVideoProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [thumbIndex, setThumbIndex] = useState(0);

  // La calidad "maxresdefault" no existe para todos los videos; si falla,
  // se hace fallback a "hqdefault".
  const thumbnailSrc = `${THUMBNAIL_BASE}/${videoId}/${THUMBNAIL_QUALITIES[thumbIndex]}.jpg`;

  const handleThumbnailError = () => {
    if (thumbIndex < THUMBNAIL_QUALITIES.length - 1) {
      setThumbIndex((i) => i + 1);
    }
  };

  return (
    <div
      className={`relative aspect-video w-full overflow-hidden rounded-2xl bg-deep-forest shadow-xl ${className}`}
    >
      {isPlaying ? (
        <iframe
          className="absolute inset-0 h-full w-full border-0"
          src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&playsinline=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
        />
      ) : (
        <button
          type="button"
          onClick={() => {
            setIsPlaying(true);
            onPlay?.();
          }}
          aria-label={`Reproducir video: ${title}`}
          className="group absolute inset-0 h-full w-full cursor-pointer"
        >
          <img
            src={thumbnailSrc}
            alt=""
            loading="lazy"
            decoding="async"
            onError={handleThumbnailError}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {/* Velo oscuro para legibilidad del botón */}
          <span className="absolute inset-0 bg-deep-forest/30 transition-colors duration-300 group-hover:bg-deep-forest/20" />
          {/* Botón de play */}
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-soft-gold text-deep-forest shadow-2xl transition-transform duration-300 group-hover:scale-110 group-active:scale-95 md:h-20 md:w-20">
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                className="ml-1 h-8 w-8 md:h-10 md:w-10"
                aria-hidden="true"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
          </span>
        </button>
      )}
    </div>
  );
}

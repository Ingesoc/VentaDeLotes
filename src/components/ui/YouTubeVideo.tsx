import { useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

interface YouTubeVideoProps {
  /** ID del video de YouTube (la parte `hT4bLxh-8uo` de la URL del embed) */
  videoId: string;
  /** Texto accesible y `title` del iframe */
  title: string;
  className?: string;
  /** Se invoca cuando el usuario hace clic y el video comienza a reproducirse */
  onPlay?: () => void;
  /**
   * Autoplay silenciado del reproductor. Cuando es `true`, la URL del embed
   * agrega `autoplay=1&mute=1` (el mute es obligatorio para que el navegador
   * permita el autoplay) y se muestra un botón para activar el sonido. El
   * iframe solo se monta con click-to-load, así que la reproducción nunca
   * inicia antes de que el usuario pida cargar el video.
   */
  autoplay?: boolean;
}

const EMBED_BASE = "https://www.youtube-nocookie.com";
const THUMBNAIL_BASE = "https://i.ytimg.com/vi";
const THUMBNAIL_QUALITIES = ["maxresdefault", "hqdefault"] as const;

/**
 * Política de permisos del iframe. `autoplay` es obligatorio para que el
 * navegador permita la reproducción automática del reproductor.
 */
const IFRAME_ALLOW =
  "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";

/**
 * Construye la URL del embed con URLSearchParams (evita bugs con `?` vs `&`
 * si en el futuro se agregan más parámetros).
 */
function buildEmbedUrl(videoId: string, autoplay: boolean): string {
  const url = new URL(`${EMBED_BASE}/embed/${videoId}`);
  url.searchParams.set("autoplay", "1");
  if (autoplay) {
    // Mute obligatorio: los navegadores bloquean el autoplay con audio.
    url.searchParams.set("mute", "1");
    // Habilita la interfaz de comandos por postMessage (necesaria para poder
    // desmutear el reproductor desde la app).
    url.searchParams.set("enablejsapi", "1");
  }
  url.searchParams.set("rel", "0");
  url.searchParams.set("playsinline", "1");
  return url.toString();
}

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
 *  - La prop `autoplay` agrega `mute=1` (autoplay compatible con navegadores)
 *    y un botón de activar/silenciar sonido vía postMessage.
 */
export function YouTubeVideo({
  videoId,
  title,
  className = "",
  onPlay,
  autoplay = false,
}: YouTubeVideoProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [thumbIndex, setThumbIndex] = useState(0);
  // El autoplay arranca silenciado; el estado se sincroniza con el botón.
  const [muted, setMuted] = useState(autoplay);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  // La calidad "maxresdefault" no existe para todos los videos; si falla,
  // se hace fallback a "hqdefault".
  const thumbnailSrc = `${THUMBNAIL_BASE}/${videoId}/${THUMBNAIL_QUALITIES[thumbIndex]}.jpg`;

  const handleThumbnailError = () => {
    if (thumbIndex < THUMBNAIL_QUALITIES.length - 1) {
      setThumbIndex((i) => i + 1);
    }
  };

  /** Alterna el sonido del reproductor usando los comandos de la API de YouTube. */
  const toggleMute = () => {
    const iframe = iframeRef.current;
    if (!iframe?.contentWindow) return;

    const nextMuted = !muted;
    iframe.contentWindow.postMessage(
      JSON.stringify({
        event: "command",
        func: nextMuted ? "mute" : "unMute",
        args: [],
      }),
      EMBED_BASE,
    );
    setMuted(nextMuted);
  };

  return (
    <div
      className={`relative aspect-video w-full overflow-hidden rounded-2xl bg-deep-forest shadow-xl ${className}`}
    >
      {isPlaying ? (
        <>
          <iframe
            ref={iframeRef}
            className="absolute inset-0 h-full w-full border-0"
            src={buildEmbedUrl(videoId, autoplay)}
            title={title}
            allow={IFRAME_ALLOW}
            allowFullScreen
            // Sandbox mínimo para el reproductor: scripts (player), presentación
            // (fullscreen) y popups (enlaces). Se omite allow-same-origin: la
            // combinación con allow-scripts permitiría escapar el sandbox.
            sandbox="allow-scripts allow-presentation allow-popups"
            referrerPolicy="strict-origin-when-cross-origin"
          />
          {/* Botón de activar/silenciar sonido (solo en autoplay silenciado) */}
          {autoplay && (
            <button
              type="button"
              onClick={toggleMute}
              aria-label={muted ? "Activar sonido" : "Silenciar"}
              aria-pressed={!muted}
              className="absolute top-3 right-3 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-colors hover:bg-black/70 tap-target"
            >
              {muted ? (
                <VolumeX className="h-5 w-5" aria-hidden="true" />
              ) : (
                <Volume2 className="h-5 w-5" aria-hidden="true" />
              )}
            </button>
          )}
        </>
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

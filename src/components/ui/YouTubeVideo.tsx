import { useEffect, useRef, useState } from "react";
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
   * Autoplay silenciado. Cuando es `true`, el iframe se monta automáticamente
   * en cuanto el video entra al viewport y arranca con `autoplay=1&mute=1`
   * (el mute es obligatorio para que el navegador permita el autoplay),
   * mostrando un botón para activar el sonido. Sin esta prop, el video se
   * mantiene click-to-load (miniatura + botón de play).
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
 * Video de YouTube con carga diferida: por defecto usa click-to-load
 * (miniatura + botón de play) y, con la prop `autoplay`, monta el reproductor
 * y arranca silenciado apenas el video entra al viewport.
 *
 * En lugar de montar el iframe del reproductor de YouTube al cargar la página
 * (que descarga cientos de KB aunque nadie lo vea), se muestra la miniatura
 * del video con un botón de play y el iframe solo se crea cuando el usuario
 * hace clic o, con `autoplay`, cuando el video entra al viewport. Además:
 *  - Usa el dominio `youtube-nocookie.com` para máxima privacidad.
 *  - `autoplay=1` para que el video arranque apenas se carga el reproductor.
 *  - `rel=0` para no mostrar videos relacionados al finalizar.
 *  - `playsinline=1` para una mejor experiencia en móviles.
 *  - La prop `autoplay` agrega `mute=1` (autoplay compatible con navegadores),
 *    monta el reproductor sin clic al entrar al viewport y muestra un botón
 *    de activar/silenciar sonido vía postMessage.
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
  const containerRef = useRef<HTMLDivElement | null>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  // Ref para que el callback del IntersectionObserver lea el valor actual de
  // isPlaying sin re-crear el observer en cada render.
  const isPlayingRef = useRef(isPlaying);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  // Autoplay real: con la prop `autoplay`, el reproductor se monta y arranca
  // (silenciado) en cuanto el video entra al viewport, sin requerir clic. Una
  // vez montado no se desmonta al salir del viewport, para no reiniciar la
  // reproducción en cada vuelta del carrusel.
  useEffect(() => {
    if (!autoplay || typeof IntersectionObserver === "undefined") return;
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (isPlayingRef.current) {
          observer.disconnect();
          return;
        }
        if (entries.some((entry) => entry.isIntersecting)) {
          setIsPlaying(true);
          observer.disconnect();
        }
      },
      // Solo cuando el video entra realmente al viewport (rootMargin 0). Un
      // margen positivo (100px) hacía que el slide del carrusel, apenas bajo
      // el hero, montara el reproductor al cargar la página y descargara
      // ~2 MB de video + player en el camino crítico (FCP/LCP 8-11s en
      // Lighthouse móvil) aunque el usuario no viera el video.
      { rootMargin: "0px" },
    );
    observer.observe(container);
    return () => observer.disconnect();
  }, [autoplay]);

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
    // Al activar el sonido (gesto del usuario) se avisa al contenedor para que
    // pause el carrusel, igual que cuando se pulsa play manualmente. Sin esto,
    // un video autocargado desmutado seguiría sonando fuera de pantalla.
    if (!nextMuted) onPlay?.();
  };

  return (
    <div
      ref={containerRef}
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
            // Sin `sandbox`: el iframe de YouTube ya está aislado por la
            // política de mismo origen del navegador (es cross-origin), y el
            // reproductor necesita cookies/storage/Cache API que un contexto
            // sandboxed sin allow-same-origin bloquea (rompía el autoplay y
            // el arranque del player con SecurityError / writeEmbed undefined).
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
            width={1280}
            height={720}
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

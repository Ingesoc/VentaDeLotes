import { useCallback, useEffect, useMemo, useRef } from "react";
import { Link } from "react-router";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { cldUrl, CLD_WIDTHS } from "@/lib/cloudinary";
import { YouTubeVideo } from "@/components/ui/YouTubeVideo";

interface CarouselSlide {
  /** Si está presente, el slide muestra un video de YouTube (carga perezosa) */
  videoId?: string;
  src?: string;
  alt?: string;
  title: string;
  description: string;
}

const slides: CarouselSlide[] = [
  {
    videoId: "N7LYM3pt_hg",
    title: "La Holanda en Video",
    description:
      "Recorre la finca y descubre el paisaje cafetero, los lotes y el estilo de vida campestre que te espera.",
  },
  {
    src: cldUrl("https://res.cloudinary.com/j5a9xyaq/image/upload/v1784304267/laholanda/events/festival%20de%20Faroles%20Quimbaya%201.jpg", CLD_WIDTHS.CAROUSEL),
    alt: "Festival de Velas y Faroles",
    title: "Festival de Velas y Faroles",
    description: "La festividad más mágica de Quimbaya, donde las calles se visten de luces y hermosos faroles artesanales.",
  },
  {
    src: cldUrl("https://res.cloudinary.com/j5a9xyaq/image/upload/v1784304215/laholanda/events/arrieros.jpg", CLD_WIDTHS.CAROUSEL),
    alt: "Legado Arriero",
    title: "Legado y Tradición Arriera",
    description: "Siente las profundas raíces de la cultura cafetera y la hospitalidad de nuestra gente.",
  },
  {
    src: cldUrl("https://res.cloudinary.com/j5a9xyaq/image/upload/v1784304240/laholanda/events/cafetales.jpg", CLD_WIDTHS.CAROUSEL),
    alt: "Paisaje Cultural Cafetero",
    title: "Paisaje Cultural Cafetero",
    description: "Explora cafetales infinitos declarados Patrimonio de la Humanidad por la UNESCO.",
  },
  {
    src: cldUrl("https://res.cloudinary.com/j5a9xyaq/image/upload/v1784304319/laholanda/events/piscinas.jpg", CLD_WIDTHS.CAROUSEL),
    alt: "Bienestar y Recreación",
    title: "Bienestar en el Paraíso",
    description: "Comodidades exclusivas y senderos ecológicos integrados en la exuberante flora nativa.",
  },
];

/** Milisegundos sin interacción en el slide del video antes de reanudar el autoplay. */
const VIDEO_SLIDE_RESUME_MS = 15000;

export default function HomeCarousel() {
  const autoplay = useMemo(
    () =>
      Autoplay({
        delay: 5000,
        // IMPORTANTE: con `stopOnInteraction: false` el plugin reinicia el
        // autoplay tras CUALQUIER clic en el carrusel (incluido el botón de
        // play del video), lo que avanzaba el carrusel mientras sonaba el
        // video. Con `true`, el único que controla stop/play es syncAutoplay.
        stopOnInteraction: true,
      }),
    [],
  );
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [autoplay]);

  // Ref (en lugar de estado) para leer desde el timeout sin re-suscribir el efecto.
  const videoPlayingRef = useRef(false);
  const resumeTimerRef = useRef<number | null>(null);

  const clearResumeTimer = useCallback(() => {
    if (resumeTimerRef.current !== null) {
      window.clearTimeout(resumeTimerRef.current);
      resumeTimerRef.current = null;
    }
  }, []);

  // Programa la reanudación del autoplay si tras 15s no hubo interacción.
  const scheduleResume = useCallback(() => {
    clearResumeTimer();
    resumeTimerRef.current = window.setTimeout(() => {
      resumeTimerRef.current = null;
      // Si el visitante está reproduciendo el video, no lo interrumpimos.
      if (videoPlayingRef.current) return;
      if (emblaApi && emblaApi.selectedScrollSnap() === 0) {
        autoplay.play();
      }
    }, VIDEO_SLIDE_RESUME_MS);
  }, [clearResumeTimer, emblaApi, autoplay]);

  const handleVideoPlay = useCallback(() => {
    // El video comenzó: no reanudar el autoplay mientras se reproduzca.
    videoPlayingRef.current = true;
    clearResumeTimer();
    autoplay.stop();
  }, [autoplay, clearResumeTimer]);

  // El carrusel se DETIENE mientras el slide del video (índice 0) esté visible,
  // para que el visitante pueda verlo o reproducirlo con calma. Si pasan 15s
  // sin interacción, se reanuda el autoplay (y vuelve a pausarse cuando el
  // carrusel regrese al video).
  useEffect(() => {
    if (!emblaApi) return;
    const syncAutoplay = () => {
      if (emblaApi.selectedScrollSnap() === 0) {
        autoplay.stop();
        // No programar la reanudación si el visitante está viendo el video.
        if (!videoPlayingRef.current) scheduleResume();
      } else {
        // Al salir del slide, el video se desmonta y se permite reanudar.
        videoPlayingRef.current = false;
        clearResumeTimer();
        autoplay.play();
      }
    };
    emblaApi.on("select", syncAutoplay);
    // Tras cualquier interacción (clic/arrastre) el plugin ya no reinicia el
    // autoplay (stopOnInteraction: true), así que lo re-sincronizamos aquí:
    // en slides de imagen se reanuda y en el slide del video se mantiene la
    // pausa. También reinicia el contador de 15s de inactividad.
    emblaApi.on("pointerUp", syncAutoplay);
    syncAutoplay(); // estado inicial: la Home abre en el slide del video
    return () => {
      emblaApi.off("select", syncAutoplay);
      emblaApi.off("pointerUp", syncAutoplay);
      clearResumeTimer();
    };
  }, [emblaApi, autoplay, scheduleResume, clearResumeTimer]);

  return (
    <div className="relative rounded-2xl overflow-hidden shadow-2xl w-full max-w-5xl mx-auto my-12 border border-outline-variant/20">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {slides.map((s) => (
            <div
              key={s.videoId ?? s.alt}
              className="flex-[0_0_100%] min-w-0 relative h-[300px] sm:h-[400px] md:h-[450px]"
            >
              {s.videoId ? (
                <YouTubeVideo
                  videoId={s.videoId}
                  title={s.title}
                  onPlay={handleVideoPlay}
                  // Autoplay silenciado: el iframe sigue siendo click-to-load
                  // (solo se monta al pulsar play) y al montarse arranca con
                  // autoplay=1&mute=1 — el mute es obligatorio para que el
                  // navegador permita la reproducción automática.
                  autoplay
                  className="h-full"
                />
              ) : (
                <img
                  src={s.src}
                  alt={s.alt}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover"
                />
              )}
              {/* Overlay degradado — pointer-events-none para no bloquear el botón de play del video */}
              <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent"></div>
              {/* Contenido del slide */}
              {/* Contenido del slide — pointer-events-none para no bloquear el botón de play; solo el CTA recibe clics */}
              <div className="pointer-events-none absolute bottom-0 left-0 right-0 p-5 sm:p-8 md:p-12 text-white flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6 z-10">
                <div className="max-w-2xl">
                  <span className="text-heritage-gold font-label-bold tracking-widest uppercase mb-2 block text-sm">
                    Descubre Quindío
                  </span>
                  <h3 className="font-headline-lg text-lg sm:text-2xl md:text-3xl text-white mb-2 leading-tight">
                    {s.title}
                  </h3>
                  <p className="text-xs sm:text-sm md:text-base text-surface-variant/90 leading-relaxed max-w-lg line-clamp-2 sm:line-clamp-none">
                    {s.description}
                  </p>
                </div>
                <div>
                  <Link
                    to="/descubre-quindio"
                    className="pointer-events-auto inline-flex items-center gap-2 bg-heritage-gold text-primary hover:bg-white px-5 sm:px-6 py-3 rounded-lg font-label-bold transition-colors duration-300 text-xs sm:text-sm whitespace-nowrap tap-target"
                  >
                    Conocer Más
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

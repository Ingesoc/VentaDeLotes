import { useState } from "react";
import { Plane } from "lucide-react";
import { YouTubeVideo } from "@/components/ui/YouTubeVideo";
import { aerialVideoClips } from "@/constants/aerialVideos";

/**
 * Sección independiente de videos aéreos de la finca.
 *
 * Sustituye el slide de video del carrusel: al vivir fuera del carrusel el
 * video es siempre visible (no depende de que el autoplay coincida con el
 * slide). El reproductor usa click-to-load (`YouTubeVideo` sin `autoplay`),
 * así no se descarga ningún iframe/miniatura extra hasta que el visitante lo
 * pide — cero impacto en LCP/CLS de la home.
 */
export function AerialVideoSection() {
  const [activeId, setActiveId] = useState(aerialVideoClips[0].videoId);
  const active =
    aerialVideoClips.find((clip) => clip.videoId === activeId) ??
    aerialVideoClips[0];

  return (
    <section
      id="videos-aereos"
      aria-labelledby="aerial-video-heading"
      className="py-section-gap bg-surface-container-low cv-auto [contain-intrinsic-size:auto_900px]"
    >
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 text-label-caps font-label-caps uppercase tracking-widest text-heritage-gold mb-3">
            <Plane className="w-4 h-4" aria-hidden="true" />
            Videos aéreos
          </span>
          <h2
            id="aerial-video-heading"
            className="text-headline-lg-mobile md:text-headline-lg font-headline-lg text-primary mb-4"
          >
            La Holanda desde el aire
          </h2>
          <p className="text-body-lg font-body-lg text-on-surface-variant max-w-2xl mx-auto">
            Recorre la finca con tomas de dron: los lotes, la naturaleza y el
            paisaje cafetero del Eje Cafetero.
          </p>
        </div>

        {/* key={videoId}: al cambiar de clip se remonta el reproductor en
            estado limpio (miniatura + botón de play), sin arrastrar estado. */}
        <div className="max-w-4xl mx-auto">
          <YouTubeVideo
            key={active.videoId}
            videoId={active.videoId}
            title={`Video aéreo: ${active.title}`}
            className="aspect-video"
            autoplay
          />
          <p className="text-center text-body-md font-body-md text-on-surface-variant mt-4">
            <span className="font-semibold text-primary">{active.title}.</span>{" "}
            {active.description}
          </p>

          {/* Selector de clips */}
          <div
            role="group"
            aria-label="Elegir video aéreo"
            className="flex flex-wrap justify-center gap-2 mt-8"
          >
            {aerialVideoClips.map((clip) => (
              <button
                key={clip.videoId}
                type="button"
                onClick={() => setActiveId(clip.videoId)}
                aria-pressed={clip.videoId === active.videoId}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors tap-target-sm ${
                  clip.videoId === active.videoId
                    ? "bg-deep-forest text-on-primary"
                    : "bg-surface-container-lowest text-on-surface-variant border border-outline-variant/30 hover:border-heritage-gold"
                }`}
              >
                {clip.title}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

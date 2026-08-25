import { useState } from "react";
import { Link } from "react-router";
import { ImageOff } from "lucide-react";
import type { Lot } from "@/constants/lots";

interface LotGalleryProps {
  lot: Lot;
}

interface GalleryView {
  key: string;
  src: string;
  label: string;
  shortLabel: string;
}

/**
 * Vistas de la galería: vistas aérea y en perspectiva base + fotos
 * adicionales del lote (`lot.images`, subidas siguiendo la naming convention
 * `lots/{lote_id}/{n}.jpg`). Si un lote no tiene ninguna imagen, se muestra
 * un placeholder con CTA de contacto (nunca una imagen rota).
 */
function buildViews(lot: Lot): GalleryView[] {
  const views: GalleryView[] = [
    lot.aerialImage && {
      key: "aerial",
      src: lot.aerialImage,
      label: "Vista Aérea",
      shortLabel: "Aérea",
    },
    lot.perspectiveImage &&
      lot.perspectiveImage !== lot.aerialImage && {
        key: "perspective",
        src: lot.perspectiveImage,
        label: "Vista en Perspectiva",
        shortLabel: "Perspectiva",
      },
    ...(lot.images ?? []).map((src, i) => ({
      key: `extra-${i}`,
      src,
      label: `Foto ${i + 1}`,
      shortLabel: `${i + 1}`,
    })),
  ].filter((v): v is GalleryView => Boolean(v));

  // Deduplicar por URL (p. ej. lotes que comparten foto aérea).
  const seen = new Set<string>();
  return views.filter((v) => {
    if (seen.has(v.src)) return false;
    seen.add(v.src);
    return true;
  });
}

export function LotGallery({ lot }: LotGalleryProps) {
  const views = buildViews(lot);
  const [activeKey, setActiveKey] = useState(views[0]?.key);
  const activeView =
    views.find((view) => view.key === activeKey) ?? views[0];

  if (!activeView) {
    return (
      <div className="w-full aspect-[16/9] md:aspect-[4/3] rounded-xl overflow-hidden bg-surface-container-high shadow-ambient flex flex-col items-center justify-center gap-4 p-6 text-center border border-dashed border-outline-variant/40">
        <div className="bg-deep-forest/5 p-6 rounded-full">
          <ImageOff className="w-10 h-10 text-deep-forest" aria-hidden="true" />
        </div>
        <div>
          <h3 className="text-headline-sm font-headline-sm text-primary mb-1">
            Fotos del Lote {lot.id} próximamente
          </h3>
          <p className="text-body-md font-body-md text-on-surface-variant max-w-md">
            Estamos preparando las fotos de este lote. Mientras tanto, agenda
            una visita o escríbenos y te compartimos el material actualizado.
          </p>
        </div>
        <Link
          to="/contact"
          className="inline-flex items-center gap-2 bg-deep-forest text-on-primary px-6 py-3 rounded-lg font-label-bold transition-opacity hover:opacity-90 tap-target"
        >
          Contactar al equipo
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="relative w-full aspect-[16/9] md:aspect-[4/3] rounded-xl overflow-hidden bg-surface-container-high shadow-ambient">
        {views.map((view, index) => (
          <img
            key={view.key}
            src={view.src}
            alt={`${view.label} del Lote ${lot.id}`}
            loading={index === 0 ? "eager" : "lazy"}
            fetchPriority={index === 0 ? "high" : undefined}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
              view.key === activeView.key ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}

        <div className="absolute bottom-6 left-6 flex gap-2 bg-surface/85 backdrop-blur-md border border-outline-variant/20 p-1.5 rounded-lg z-20 max-w-[calc(100%-3rem)] flex-wrap">
          {views.map((view) => (
            <button
              key={view.key}
              onClick={() => setActiveKey(view.key)}
              type="button"
              aria-pressed={view.key === activeView.key}
              className={`px-3 sm:px-4 py-2 rounded-md text-label-caps font-label-caps transition-colors tap-target-sm min-w-[44px] ${
                view.key === activeView.key
                  ? "bg-deep-forest text-on-primary"
                  : "text-on-surface-variant hover:bg-deep-forest/5"
              }`}
            >
              <span className="hidden sm:inline">{view.label}</span>
              <span className="sm:hidden">{view.shortLabel}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-4 flex-wrap">
        {views.map((view) => (
          <button
            key={view.key}
            onClick={() => setActiveKey(view.key)}
            type="button"
            aria-label={`Ver ${view.label.toLowerCase()}`}
            aria-pressed={view.key === activeView.key}
            className={`w-24 h-24 shrink-0 rounded-lg overflow-hidden border-2 transition-colors ${
              view.key === activeView.key
                ? "border-deep-forest"
                : "border-transparent hover:border-heritage-gold"
            }`}
          >
            <img
              src={view.src}
              alt=""
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </button>
        ))}
      </div>
    </div>
  );
}

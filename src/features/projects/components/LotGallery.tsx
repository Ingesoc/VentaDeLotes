import { useState } from "react";
import type { Lot } from "@/constants/lots";

interface LotGalleryProps {
  lot: Lot;
}

export function LotGallery({ lot }: LotGalleryProps) {
  const [activeView, setActiveView] = useState<"aerial" | "perspective">(
    "aerial",
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="relative w-full aspect-[16/9] md:aspect-[4/3] rounded-xl overflow-hidden bg-surface-container-high shadow-ambient">
        <img
          src={lot.aerialImage}
          alt={`Vista aérea del Lote ${lot.id}`}
          loading="eager"
          fetchPriority="high"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
            activeView === "aerial" ? "opacity-100" : "opacity-0"
          }`}
        />
        <img
          src={lot.perspectiveImage}
          alt={`Vista en perspectiva del Lote ${lot.id}`}
          loading="lazy"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
            activeView === "perspective" ? "opacity-100" : "opacity-0"
          }`}
        />

        <div className="absolute bottom-6 left-6 flex gap-2 bg-surface/85 backdrop-blur-md border border-outline-variant/20 p-1.5 rounded-lg z-20">
          <button
            onClick={() => setActiveView("aerial")}
            type="button"
            className={`px-4 py-2 rounded-md text-label-caps font-label-caps transition-colors ${
              activeView === "aerial"
                ? "bg-deep-forest text-on-primary"
                : "text-on-surface-variant hover:bg-deep-forest/5"
            }`}
          >
            Vista Aérea
          </button>
          <button
            onClick={() => setActiveView("perspective")}
            type="button"
            className={`px-4 py-2 rounded-md text-label-caps font-label-caps transition-colors ${
              activeView === "perspective"
                ? "bg-deep-forest text-on-primary"
                : "text-on-surface-variant hover:bg-deep-forest/5"
            }`}
          >
            Vista en Perspectiva
          </button>
        </div>
      </div>

      <div className="flex gap-4">
        <button
          onClick={() => setActiveView("aerial")}
          type="button"
          aria-label="Ver vista aérea"
          className={`w-24 h-24 shrink-0 rounded-lg overflow-hidden border-2 transition-colors ${
            activeView === "aerial"
              ? "border-deep-forest"
              : "border-transparent hover:border-heritage-gold"
          }`}
        >
          <img
            src={lot.aerialImage}
            alt=""
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </button>
        <button
          onClick={() => setActiveView("perspective")}
          type="button"
          aria-label="Ver vista en perspectiva"
          className={`w-24 h-24 shrink-0 rounded-lg overflow-hidden border-2 transition-colors ${
            activeView === "perspective"
              ? "border-deep-forest"
              : "border-transparent hover:border-heritage-gold"
          }`}
        >
          <img
            src={lot.perspectiveImage}
            alt=""
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </button>
      </div>
    </div>
  );
}

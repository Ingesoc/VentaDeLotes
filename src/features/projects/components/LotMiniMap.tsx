import { cldUrl, CLD_WIDTHS } from "@/lib/cloudinary";
import { lotMarkers } from "@/features/home/components/lotMarkers";

interface LotMiniMapProps {
  lotId: string;
}

/**
 * Plano general con el marcador del lote en su posición real.
 *
 * Las posiciones (top/left en %) están calibradas sobre la foto aérea
 * `loteo-general-drone.jpg`, la misma que usa la sección "Plano General" de la
 * Home. Si el lote no tiene marcador registrado, se centra como fallback.
 */
export function LotMiniMap({ lotId }: LotMiniMapProps) {
  const marker = lotMarkers.find((m) => m.id === parseInt(lotId, 10));

  return (
    <div className="relative w-full h-64 rounded-xl overflow-hidden bg-surface-container shadow-ambient border border-outline-variant/10">
      <div
        className="absolute inset-0 opacity-40 bg-cover bg-center grayscale"
        style={{
          backgroundImage: `url('${cldUrl(
            "https://res.cloudinary.com/j5a9xyaq/image/upload/v1784946345/laholanda/lots/loteo-general-drone.jpg",
            CLD_WIDTHS.LARGE,
          )}')`,
        }}
      />

      {/* Marcador en la posición real del lote sobre el plano */}
      <div
        className="absolute z-10 -translate-x-1/2 -translate-y-1/2"
        style={
          marker
            ? { top: marker.top, left: marker.left }
            : { top: "50%", left: "50%" }
        }
      >
        <div className="flex flex-col items-center gap-1.5">
          <span className="w-3.5 h-3.5 rounded-full bg-heritage-gold border-2 border-surface shadow-lg animate-pulse" />
          <span className="bg-surface/90 text-primary text-label-caps font-label-caps font-bold px-2 py-1 rounded-sm whitespace-nowrap">
            LOTE {lotId}
          </span>
        </div>
      </div>

      <div className="absolute bottom-4 left-4">
        <span className="text-label-caps font-label-caps text-primary bg-surface/90 px-3 py-1 rounded-sm">
          Plano General
        </span>
      </div>
    </div>
  );
}

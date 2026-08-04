import { Link } from "react-router";
import { lots, type LotStatus } from "@/constants/lots";
import { lotMarkers } from "./lotMarkers";
import { cldUrl, CLD_WIDTHS } from "@/lib/cloudinary";

const statusColors: Record<LotStatus, string> = {
  disponible: "bg-deep-forest",
  reservado: "bg-heritage-gold",
  vendido: "bg-obsidian/80",
  no_disponible: "bg-obsidian/80",
};

const statusLabel: Record<LotStatus, string> = {
  disponible: "Disponible",
  reservado: "Reservado",
  vendido: "Vendido",
  no_disponible: "No disponible",
};

export function MasterPlanSection() {
  return (
    <section className="py-section-gap px-margin-mobile md:px-margin-desktop bg-deep-forest/5 overflow-hidden">
      <div className="max-w-container-max mx-auto mb-12 text-center">
        <h2 className="text-headline-lg-mobile md:text-headline-lg font-headline-lg text-primary mb-4">
          Plano General
        </h2>
        <p className="text-body-lg font-body-lg text-on-surface-variant">
          Explora la distribución de nuestro proyecto y encuentra tu lote ideal.
        </p>
      </div>

      <div className="relative w-full max-w-6xl mx-auto rounded-2xl overflow-hidden shadow-2xl group">
        <img
          src={cldUrl("https://res.cloudinary.com/j5a9xyaq/image/upload/v1784946345/laholanda/lots/loteo-general-drone.jpg", CLD_WIDTHS.MASTERPLAN)}
          alt="Vista aérea del plano general de la parcelación La Holanda en Quimbaya, Quindío"
          loading="lazy"
          decoding="async"
          className="w-full h-auto object-cover img-zoom"
        />

        {lots.map((lot) => {
          const marker = lotMarkers.find((m) => m.id === parseInt(lot.id));
          if (!marker) return null;
          return (
            <Link
              key={lot.id}
              to={`/projects/${lot.id}`}
              style={{ top: marker.top, left: marker.left }}
              aria-label={`Lote ${lot.id}, ${statusLabel[lot.status]}`}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-10 flex items-center justify-center min-w-[44px] min-h-[44px] md:min-w-[48px] md:min-h-[48px] group/marker"
            >
              {/* Punto sutil: casi invisible por defecto, se muestra con el color de estado al hacer hover */}
              <span
                className={`w-6 h-6 rounded-full opacity-15 transition-all duration-300 group-hover/marker:opacity-100 group-hover/marker:scale-125 group-hover/marker:shadow-lg ${statusColors[lot.status]}`}
              />
              <span className="sr-only">Lote {lot.id}</span>
            </Link>
          );
        })}

        <div className="absolute bottom-4 left-4 bg-surface/90 px-4 py-2 rounded-lg text-body-md font-body-md text-primary flex items-center gap-2">
          <span className="w-3 h-3 bg-deep-forest rounded-full block" />
          Límite de lote
        </div>
      </div>
    </section>
  );
}

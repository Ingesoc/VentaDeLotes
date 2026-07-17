import { Link } from "react-router-dom";
import { lots } from "@/constants/lots";
import { lotMarkers } from "./lotMarkers";

const statusColors: Record<string, string> = {
  disponible: "bg-deep-forest text-on-primary hover:bg-heritage-gold hover:text-primary",
  reservado: "bg-heritage-gold text-primary hover:bg-deep-forest hover:text-on-primary",
  vendido: "bg-obsidian/70 text-white hover:bg-heritage-gold hover:text-primary",
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
          src="https://res.cloudinary.com/j5a9xyaq/image/upload/v1784303341/laholanda/lots/masterplan-render.jpg"
          alt="Plano general detallado de la parcelación La Holanda en Quimbaya, Quindío"
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
              className={`absolute w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-lot-number text-xs md:text-sm font-bold shadow-lg transition-all duration-300 -translate-x-1/2 -translate-y-1/2 z-10 hover:scale-110 hover:shadow-xl ${
                statusColors[lot.status]
              }`}
            >
              {lot.id}
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

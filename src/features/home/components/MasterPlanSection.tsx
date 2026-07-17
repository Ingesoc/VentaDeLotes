import { Link } from "react-router-dom";
import { lots } from "@/constants/lots";

export const lotMarkers = [
  { id: 1,  y: 2999, x: 1038, top: "46.13%", left: "74.98%" },
  { id: 2,  y: 2491, x: 1252, top: "55.64%", left: "62.28%" },
  { id: 3,  y: 2332, x: 1380, top: "61.33%", left: "58.30%" },
  { id: 4,  y: 2177, x: 1504, top: "66.84%", left: "54.43%" },
  { id: 5,  y: 1997, x: 1679, top: "74.62%", left: "49.93%" },
  { id: 6,  y: 1448, x: 1158, top: "51.47%", left: "36.20%" },
  { id: 7,  y: 1683, x: 996,  top: "44.27%", left: "42.08%" },
  { id: 8,  y: 1833, x: 852,  top: "37.87%", left: "45.83%" },
  { id: 9,  y: 1977, x: 687,  top: "30.53%", left: "49.43%" },
  { id: 10, y: 2722, x: 646,  top: "28.71%", left: "68.05%" },
  { id: 11, y: 2437, x: 516,  top: "22.93%", left: "60.93%" },
  { id: 12, y: 2106, x: 430,  top: "19.11%", left: "52.65%" },
  { id: 13, y: 1348, x: 474,  top: "21.07%", left: "33.70%" },
  { id: 14, y: 1096, x: 704,  top: "31.29%", left: "27.40%" },
  { id: 15, y: 742,  x: 987,  top: "43.87%", left: "18.55%" },
  { id: 16, y: 888,  x: 1327, top: "58.98%", left: "22.20%" },
];

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

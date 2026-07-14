import { Link } from "react-router-dom";

/**
 * Posiciones en % (top/left) sobre la imagen del plano general.
 * TODO (Juan): estas coordenadas son aproximadas — ajústalas a ojo comparando
 * contra /public/lots/masterplan-render.jpg una vez esté desplegado, o agrega
 * el resto de los 16 lotes si quieres mostrarlos todos en vez de solo estos 3.
 */
const hotspots = [
  { lotId: "01", top: "20%", left: "30%" },
  { lotId: "08", top: "45%", left: "60%" },
  { lotId: "15", top: "70%", left: "40%" },
];

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
          src="/lots/masterplan-render.jpg"
          alt="Plano general detallado de la parcelación Verdant Horizon"
          loading="lazy"
          decoding="async"
          className="w-full h-auto object-cover transition-transform duration-1000 group-hover:scale-105"
        />

        {hotspots.map((hotspot) => (
          <Link
            key={hotspot.lotId}
            to={`/projects/${hotspot.lotId}`}
            style={{ top: hotspot.top, left: hotspot.left }}
            className="absolute w-8 h-8 bg-deep-forest text-on-primary rounded-full flex items-center justify-center text-lot-number text-xs font-bold shadow-lg hover:bg-heritage-gold hover:text-primary transition-colors -translate-x-1/2 -translate-y-1/2 z-10 hover:scale-110"
          >
            {hotspot.lotId}
          </Link>
        ))}

        <div className="absolute bottom-4 left-4 bg-surface/90 px-4 py-2 rounded-lg text-body-md font-body-md text-primary flex items-center gap-2">
          <span className="w-3 h-3 bg-deep-forest rounded-full block" />
          Límite de lote
        </div>
      </div>
    </section>
  );
}

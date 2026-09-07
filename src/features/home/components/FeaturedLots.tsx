import { Link } from "react-router";
import { usePublicLots } from "@/features/projects/hooks/usePublicLots";
import { LotCard } from "@/features/projects/components/LotCard";

export function FeaturedLots() {
  // Datos vivos de Supabase con fallback a las constantes
  const { lots } = usePublicLots();

  // Solo se muestran lotes en venta (el lote 01 es "no_disponible")
  const availableLots = lots.filter((lot) => lot.status === "disponible");
  const featured = availableLots.slice(0, 3);

  // El CTA solo aparece cuando hay más lotes que los destacados aquí,
  // así queda claro que el inventario continúa en /projects.
  const hasMoreLots = availableLots.length > featured.length;

  return (
    <section
      id="lotes"
      className="py-section-gap px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto cv-auto [contain-intrinsic-size:auto_1900px]"
    >
      <div className="mb-16">
        <h2 className="text-headline-lg-mobile md:text-headline-lg font-headline-lg text-primary mb-4">
          Lotes Disponibles
        </h2>
        <p className="text-body-lg font-body-lg text-on-surface-variant">
          Selecciona el espacio donde comenzará tu nueva vida.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {featured.map((lot) => (
          <LotCard key={lot.id} lot={lot} />
        ))}
      </div>

      {hasMoreLots && (
        <div className="mt-14 md:mt-16">
          <div className="bg-surface-container-low border border-outline-variant/20 rounded-2xl px-6 py-10 md:px-12 md:py-12 text-center">
            <h3 className="text-headline-md font-headline-md text-primary mb-3">
              ¿Buscas más opciones?
            </h3>
            <p className="text-body-md font-body-md text-on-surface-variant max-w-xl mx-auto mb-8">
              Tenemos más lotes disponibles. Explora el inventario completo y
              encuentra el espacio ideal para ti.
            </p>
            <Link
              to="/projects"
              className="group inline-flex items-center justify-center gap-2 bg-primary text-on-primary px-8 py-4 rounded-lg font-label-bold hover:bg-deep-forest hover:-translate-y-0.5 hover:shadow-ambient transition-all duration-300"
            >
              Ver todos los lotes
              <span
                aria-hidden="true"
                className="text-heritage-gold transition-transform duration-300 group-hover:translate-x-1"
              >
                →
              </span>
            </Link>
          </div>
        </div>
      )}
    </section>
  );
}
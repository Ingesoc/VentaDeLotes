import { lots } from "@/constants/lots";
import { LotCard } from "@/features/projects/components/LotCard";

export function FeaturedLots() {
  const featured = lots.filter((lot) => lot.areaM2 !== null).slice(0, 3);

  return (
    <section className="py-section-gap px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
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
    </section>
  );
}

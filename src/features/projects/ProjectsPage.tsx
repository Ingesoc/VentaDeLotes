import { useMemo, useState } from "react";
import PageSEO from "@/components/seo/PageSEO";
import { lots, type LotStatus } from "@/constants/lots";
import { LotCard } from "./components/LotCard";
import { LotFilters, type AreaRange } from "./components/LotFilters";
import { EmptyState } from "./components/EmptyState";
import { useScrollReveal } from "@/hooks/useScrollReveal";

function matchesAreaRange(areaM2: number | null, range: AreaRange): boolean {
  if (range === "all") return true;
  if (areaM2 === null) return false;
  if (range === "under-2005") return areaM2 < 2005;
  if (range === "2005-2010") return areaM2 >= 2005 && areaM2 <= 2010;
  return areaM2 > 2010;
}

export function ProjectsPage() {
  const [status, setStatus] = useState<LotStatus | "all">("all");
  const [areaRange, setAreaRange] = useState<AreaRange>("all");

  const filteredLots = useMemo(() => {
    return lots.filter((lot) => {
      const matchesStatus = status === "all" || lot.status === status;
      const matchesArea = matchesAreaRange(lot.areaM2, areaRange);
      return matchesStatus && matchesArea;
    });
  }, [status, areaRange]);

  const handleClearFilters = () => {
    setStatus("all");
    setAreaRange("all");
  };

  const scrollRevealRef = useScrollReveal({
    childSelector: ".grid > *",
    variant: "fade-up",
    staggerDelay: 80,
    rootMargin: "0px 0px -60px 0px",
  });

  return (
    <>
      <PageSEO
        title="Lotes Disponibles en Quimbaya | La Holanda"
        description="Explora nuestra selección de lotes campestres en Quimbaya, Quindío. Filtra por área, estado y encuentra el lote perfecto para tu hogar o inversión."
        ogUrl="https://www.laholanda.com/projects"
        ogImage="https://res.cloudinary.com/j5a9xyaq/image/upload/v1784303341/laholanda/lots/masterplan-render.jpg"
      />
      <div ref={scrollRevealRef} className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-16 md:py-24 page-enter">
        <div className="mb-12 flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8">
          <div>
            <h1 className="text-headline-lg-mobile md:text-headline-lg font-headline-lg text-primary mb-4">
              Descubre tu santuario
            </h1>
            <p className="text-body-lg font-body-lg text-on-surface-variant max-w-2xl">
              Explora nuestros exclusivos lotes inmersos en la belleza natural del
              Quindío. Filtra según tus preferencias para encontrar el espacio
              ideal.
            </p>
          </div>

          <div className="w-full lg:w-auto">
            <LotFilters
              status={status}
              onStatusChange={setStatus}
              areaRange={areaRange}
              onAreaRangeChange={setAreaRange}
            />
            <p className="mt-4 text-label-caps font-label-caps text-on-surface-variant/70">
              Mostrando {filteredLots.length} de {lots.length} lotes
            </p>
          </div>
        </div>

        {filteredLots.length === 0 ? (
          <EmptyState onClearFilters={handleClearFilters} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredLots.map((lot) => (
              <LotCard key={lot.id} lot={lot} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

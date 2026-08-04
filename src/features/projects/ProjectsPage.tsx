import { useMemo, useState } from "react";
import PageSEO from "@/components/seo/PageSEO";
import { lots, type LotStatus } from "@/constants/lots";
import { LotCard } from "./components/LotCard";
import { LotFilters, type AreaRange } from "./components/LotFilters";
import { EmptyState } from "./components/EmptyState";
import { project } from "@/constants/project";
import { cldUrl } from "@/lib/cloudinary";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { YouTubeVideo } from "@/components/ui/YouTubeVideo";

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
        ogImage={cldUrl("https://res.cloudinary.com/j5a9xyaq/image/upload/v1784303341/laholanda/lots/masterplan-render.jpg")}
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

        {/* Video promocional con carga perezosa */}
        <section className="mb-16 md:mb-24">
          <div className="text-center mb-8">
            <h2 className="text-headline-md font-headline-md text-primary mb-3">
              Conoce La Holanda en video
            </h2>
            <p className="text-body-md font-body-md text-on-surface-variant max-w-2xl mx-auto">
              Recorre la parcelación y descubre por qué es el lugar ideal para
              tu proyecto de vida.
            </p>
          </div>
          <YouTubeVideo
            videoId="hT4bLxh-8uo"
            title="Video promocional de La Holanda — Parcelación Campestre en Quimbaya, Quindío"
            className="mx-auto max-w-4xl"
          />
        </section>

        {filteredLots.length === 0 ? (
          <EmptyState onClearFilters={handleClearFilters} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredLots.map((lot) => (
              <LotCard key={lot.id} lot={lot} />
            ))}
          </div>
        )}

        {/* Ubicación de la finca */}
        <section className="mt-16 md:mt-24">
          <div className="text-center mb-8">
            <h2 className="text-headline-md font-headline-md text-primary mb-3">
              Ubicación de la Finca
            </h2>
            <p className="text-body-md font-body-md text-on-surface-variant max-w-2xl mx-auto">
              Nuestros lotes se encuentran en {project.location.address} ·{" "}
              {project.location.distanceToTown}.
            </p>
          </div>
          <div className="rounded-2xl overflow-hidden shadow-xl border border-outline-variant/10">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d15905.886477864153!2d-75.769!3d4.619!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e1!3m2!1ses!2sco!4v1"
              width="100%"
              height="400"
              className="w-full border-0"
              sandbox="allow-scripts allow-popups"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Ubicación La Holanda — Vía Quimbaya-Alcalá, Vereda Jazmín, Quimbaya"
            />
          </div>
        </section>
      </div>
    </>
  );
}

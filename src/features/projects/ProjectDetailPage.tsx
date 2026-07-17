import { Link, Navigate, useParams } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import PageSEO from "@/components/seo/PageSEO";
import { getLotById, getRelatedLots } from "@/constants/lots";
import { LotGallery } from "./components/LotGallery";
import { LotSpecs } from "./components/LotSpecs";
import { LotMiniMap } from "./components/LotMiniMap";
import { AcquisitionSteps } from "./components/AcquisitionSteps";
import { LotCard } from "./components/LotCard";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useTrackPageView } from "@/hooks/useTrackPageView";

const statusLabel = {
  disponible: "Disponible",
  reservado: "Reservado",
  vendido: "Vendido",
} as const;

export function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const lot = id ? getLotById(id) : undefined;

  // Registrar vista para analytics
  useTrackPageView(id);

  // Los hooks deben ir antes de cualquier return condicional
  const scrollRevealRef = useScrollReveal({
    childSelector: "section, .grid > *",
    variant: "fade-up",
    staggerDelay: 80,
    rootMargin: "0px 0px -60px 0px",
  });

  if (!lot) {
    return <Navigate to="/projects" replace />;
  }

  const relatedLots = getRelatedLots(lot.id, 2);

  return (
    <>
      <PageSEO
        title={`Lote ${lot.id} - ${lot.areaM2.toLocaleString()} m² | La Holanda`}
        description={`Lote campestre de ${lot.areaM2.toLocaleString()} m² en Quimbaya, Quindío. ${lot.status === "disponible" ? "Disponible para inversión." : lot.status === "reservado" ? "Actualmente reservado." : "Vendido."}`}
        ogUrl={`https://www.laholanda.com/projects/${lot.id}`}
        ogImage={lot.aerialImage}
      />
      <div ref={scrollRevealRef} className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-12 md:py-24 page-enter">
        {/* Migas de pan */}
        <nav className="flex items-center gap-2 text-on-surface-variant text-label-caps font-label-caps mb-4 uppercase tracking-widest">
          <Link
            to="/projects"
            className="hover:text-deep-forest transition-colors"
          >
            Lotes
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-deep-forest font-semibold">Lote {lot.id}</span>
        </nav>

        {/* Encabezado */}
        <div className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <h1 className="text-headline-lg-mobile md:text-display-lg font-display-lg text-primary mb-2">
              Lote {lot.id}
            </h1>
            <p className="text-body-lg font-body-lg text-on-surface-variant">
              Santuario Natural en Quindío
            </p>
          </div>
          <div className="flex items-center gap-4">
            <span className="bg-deep-forest/10 text-deep-forest text-label-caps font-label-caps px-4 py-2 rounded-full uppercase">
              {statusLabel[lot.status]}
            </span>
            {lot.price && (
              <p className="text-lot-number font-lot-number text-primary">
                ${(lot.price / 1_000_000).toLocaleString("es-CO")}M COP
              </p>
            )}
          </div>
        </div>

        {/* Galería + specs */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter mb-section-gap">
          <div className="lg:col-span-8">
            <LotGallery lot={lot} />
          </div>
          <div className="lg:col-span-4 flex flex-col gap-gutter">
            <LotSpecs lot={lot} />
            <LotMiniMap lotId={lot.id} />
          </div>
        </div>

        <AcquisitionSteps />

        {/* Similares */}
        {relatedLots.length > 0 && (
          <div>
            <h3 className="text-headline-md font-headline-md text-primary mb-8 border-b border-outline-variant/20 pb-4">
              Lotes Similares
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedLots.map((relatedLot) => (
                <LotCard key={relatedLot.id} lot={relatedLot} />
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

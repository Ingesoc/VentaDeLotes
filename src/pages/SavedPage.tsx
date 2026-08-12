import { useMemo } from "react";
import { Link } from "react-router";
import PageSEO from "@/components/seo/PageSEO";
import { usePublicLots } from "@/features/projects/hooks/usePublicLots";
import { useSavedLots } from "@/features/projects/hooks/useSavedLots";
import { LotCard } from "@/features/projects/components/LotCard";

export default function SavedPage() {
  const { savedIds } = useSavedLots();
  const { lots } = usePublicLots();

  // Orden estable: mismo orden que el listado de proyectos
  const savedSet = useMemo(() => new Set(savedIds), [savedIds]);
  const savedLots = lots.filter((lot) => savedSet.has(lot.id));

  return (
    <>
      <PageSEO
        title="Lotes guardados | La Holanda"
        description="Tus lotes favoritos de La Holanda, guardados en este dispositivo."
        noindex
      />
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-16 md:py-24 page-enter">
        <div className="mb-12">
          <h1 className="text-headline-lg-mobile md:text-headline-lg font-headline-lg text-primary mb-4">
            Mis lotes guardados
          </h1>
          <p className="text-body-lg font-body-lg text-on-surface-variant max-w-2xl">
            Guarda los lotes que te interesan con el corazón y vuelve a
            consultarlos aquí. Se almacenan en este dispositivo.
          </p>
        </div>

        {savedLots.length === 0 ? (
          <div className="text-center py-20 bg-surface-container-lowest rounded-2xl border border-outline-variant/20">
            <p className="text-body-lg font-body-lg text-on-surface-variant mb-8">
              Aún no has guardado ningún lote.
            </p>
            <Link
              to="/projects"
              className="inline-block bg-deep-forest text-on-primary font-label-bold px-8 py-4 rounded-lg hover:opacity-90 transition-opacity tap-target"
            >
              Explorar lotes disponibles
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {savedLots.map((lot) => (
              <LotCard key={lot.id} lot={lot} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

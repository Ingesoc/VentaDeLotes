import { Link, Navigate, useParams } from "react-router";
import { Helmet } from "react-helmet-async";
import { ChevronRight } from "lucide-react";
import PageSEO from "@/components/seo/PageSEO";
import BreadcrumbSchema from "@/components/seo/BreadcrumbSchema";
import { project } from "@/constants/project";
import { usePublicLot } from "./hooks/usePublicLots";
import { LotGallery } from "./components/LotGallery";
import { LotSpecs } from "./components/LotSpecs";
import { LotMiniMap } from "./components/LotMiniMap";
import { AcquisitionSteps } from "./components/AcquisitionSteps";
import { LeadCaptureForm } from "./components/LeadCaptureForm";
import { LotCard } from "./components/LotCard";
import { ScaleReferenceMedia } from "./components/ScaleReferenceMedia";
import { formatExactPrice } from "@/lib/format";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useTrackPageView } from "@/hooks/useTrackPageView";

const statusLabel = {
  disponible: "Disponible",
  reservado: "Reservado",
  vendido: "Vendido",
  no_disponible: "No disponible",
} as const;

export function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();

  // Datos vivos de Supabase con fallback estático (render inmediato)
  const { lot, relatedLots, loading } = usePublicLot(id);

  // Registrar vista para analytics
  useTrackPageView(id);

  // Los hooks deben ir antes de cualquier return condicional
  const scrollRevealRef = useScrollReveal({
    childSelector: "section, .grid > *",
    variant: "fade-up",
    staggerDelay: 80,
    rootMargin: "0px 0px -60px 0px",
  });

  if (!lot && loading) {
    return (
      <div className="min-h-[50dvh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-heritage-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!lot) {
    return <Navigate to="/projects" replace />;
  }

  // Construir descripción enriquecida para SEO / OG
  const details = [
    `${lot.areaM2.toLocaleString()} m²`,
    lot.view,
    lot.topography,
    lot.access,
  ].filter(Boolean).join(" · ");

  const priceInfo = lot.price
    ? `$${(lot.price / 1_000_000).toLocaleString("es-CO")}M COP`
    : "Consultar precio";

  const statusDesc = {
    disponible: `Disponible desde ${priceInfo}.`,
    reservado: "Actualmente reservado — consulta disponibilidad.",
    vendido: "Vendido — conoce lotes similares disponibles.",
    no_disponible: "No disponible — conoce lotes similares disponibles.",
  }[lot.status];

  const description = `Lote campestre ${lot.id} en La Holanda, Quimbaya, Quindío. ${lot.areaM2.toLocaleString()} m² de santuario natural. ${details}. ${statusDesc} Desarrollado por INGESOCC SAS.`;

  const ogImage = lot.perspectiveImage || lot.aerialImage;

  const keywords = [
    `lote ${lot.id} la holanda`,
    `terreno ${lot.areaM2.toLocaleString()} m² quimbaya`,
    "parcelación campestre quindío",
    "lote rural eje cafetero",
    "inversión inmobiliaria quindío",
    lot.view && `lote con ${lot.view.toLowerCase()}`,
    lot.topography && `terreno ${lot.topography.toLowerCase()}`,
  ].filter(Boolean).join(", ");

  return (
    <>
      <PageSEO
        title={`Lote ${lot.id} — ${lot.areaM2.toLocaleString()} m² en Quimbaya, Quindío | La Holanda`}
        description={description}
        ogUrl={`https://laholanda.ingesocc.com/projects/${lot.id}`}
        ogImage={ogImage}
        ogType="article"
        keywords={keywords}
      />

      <BreadcrumbSchema
        items={[
          { name: "Lotes Disponibles", url: "https://laholanda.ingesocc.com/projects" },
          { name: `Lote ${lot.id}`, url: `https://laholanda.ingesocc.com/projects/${lot.id}` },
        ]}
      />

      {/* Structured Data (JSON-LD) — RealEstateListing */}
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "RealEstateListing",
            name: `Lote ${lot.id} — ${lot.areaM2.toLocaleString()} m² en Quimbaya, Quindío`,
            description,
            url: `https://laholanda.ingesocc.com/projects/${lot.id}`,
            image: [lot.aerialImage, lot.perspectiveImage].filter(Boolean),
            datePosted: "2025-01-01",
            validFrom: "2025-01-01",
            offers: {
              "@type": "Offer",
              price: lot.price ? lot.price / 1_000_000 : undefined,
              priceCurrency: "COP",
              priceValidUntil: "2028-12-31",
              availability: lot.status === "disponible"
                ? "https://schema.org/InStock"
                : lot.status === "reservado"
                  ? "https://schema.org/PreOrder"
                  : "https://schema.org/SoldOut",
              url: `https://laholanda.ingesocc.com/projects/${lot.id}`,
              itemCondition: "https://schema.org/NewCondition",
              seller: {
                "@type": "Organization",
                name: project.developer,
                url: "https://laholanda.ingesocc.com",
              },
            },
            additionalProperty: [
              {
                "@type": "PropertyValue",
                name: "Área",
                value: lot.areaM2,
                unitText: "m²",
              },
              ...(lot.topography ? [{
                "@type": "PropertyValue",
                name: "Topografía",
                value: lot.topography,
              }] : []),
              ...(lot.view ? [{
                "@type": "PropertyValue",
                name: "Vista",
                value: lot.view,
              }] : []),
              ...(lot.access ? [{
                "@type": "PropertyValue",
                name: "Acceso",
                value: lot.access,
              }] : []),
            ],
            address: {
              "@type": "PostalAddress",
              streetAddress: project.location.address,
              addressLocality: project.location.municipality,
              addressRegion: project.location.department,
              addressCountry: "CO",
            },
            ...(lot.coordinates && {
              geo: {
                "@type": "GeoCoordinates",
                latitude: lot.coordinates.lat,
                longitude: lot.coordinates.lng,
              },
            }),
            isPartOf: {
              "@type": "RealEstateSubdivision",
              name: "La Holanda",
              url: "https://laholanda.ingesocc.com/",
            },
          })}
        </script>
      </Helmet>
      <div ref={scrollRevealRef} className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop pt-24 pb-12 md:py-24 page-enter">
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
              Lote {lot.id} — {lot.areaM2.toLocaleString("es-CO")} m² en Quimbaya
            </h1>
            <p className="text-body-lg font-body-lg text-on-surface-variant">
              Terreno campestre en La Holanda, Eje Cafetero
            </p>
          </div>
          <div className="flex flex-col items-start md:items-end gap-3">
            <span className="bg-deep-forest/10 text-deep-forest text-label-caps font-label-caps px-4 py-2 rounded-full uppercase">
              {statusLabel[lot.status]}
            </span>
            {lot.price ? (
              <div className="text-right">
                <p className="text-body-lg font-body-lg text-primary">
                  ${(lot.price / 1_000_000).toLocaleString("es-CO")}M COP
                </p>
                <p className="text-body-md font-body-md text-on-surface-variant">
                  {formatExactPrice(lot.price)}
                </p>
              </div>
            ) : (
              <p className="text-body-lg font-body-lg text-primary">
                Consultar precio
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
            <LeadCaptureForm
              lotId={lot.id}
              lotArea={lot.areaM2}
              lotPrice={lot.price}
            />
            <LotMiniMap lotId={lot.id} />
          </div>
        </div>

        <AcquisitionSteps />

        {/* "Dimensiona el lote": media opcional con persona como referencia
            de escala. Si el lote no tiene este material, la sección no se
            renderiza (sin caja vacía). */}
        {lot.scaleReferenceMedia && (
          <ScaleReferenceMedia media={lot.scaleReferenceMedia} />
        )}

        {/* Contenido SEO descriptivo por lote — texto único para cada
            lote que Google puede indexar. Evita contenido duplicado. */}
        <section className="mb-16">
          <h2 className="text-headline-md font-headline-md text-primary mb-6 border-b border-outline-variant/20 pb-4">
            Sobre este lote en La Holanda, Quimbaya
          </h2>
          <div className="space-y-4 text-body-md font-body-md text-on-surface-variant leading-relaxed max-w-3xl">
            <p>
              El <strong>Lote {lot.id}</strong> es un terreno campestre de
              {" "}<strong>{lot.areaM2.toLocaleString("es-CO")} m²</strong> ubicado
              en La Holanda, parcelación campestre en la Vía Quimbaya - Alcalá,
              Vereda Jazmín, Quimbaya, Quindío.
            </p>
            {lot.topography && (
              <p>
                Su topografía es <strong>{lot.topography.toLowerCase()}</strong>{lot.view ? `, con ${lot.view.toLowerCase()}` : ""},
                ideal para construir una segunda residencia o vivienda permanente
                en el corazón del Eje Cafetero.
              </p>
            )}
            <p>
              <strong>Ubicación estratégica:</strong> a 20 minutos del parque
              principal de Quimbaya, 40 minutos de Armenia (capital del
              Quindío), 30 minutos de Filandia y 45 minutos de Salento. El
              Aeropuerto Internacional El Edén está a menos de una hora.
            </p>
            <p>
              <strong>Incluye:</strong> escritura pública individual con libertad
              de cargos, proceso de legalización completo, diseño arquitectónico
              tipo incluido y acceso por vía principal.
            </p>
            <p>
              Desarrollado por <strong>INGESOCC SAS</strong> con más de 20 años
              de experiencia en construcción y desarrollo inmobiliario en el
              Quindío. Consulta precios, opciones de financiación y agenda tu
              visita al WhatsApp 3217151831.
            </p>
          </div>
        </section>

        {/* Similares */}
        {relatedLots.length > 0 && (
          <div>
            <h2 className="text-headline-md font-headline-md text-primary mb-8 border-b border-outline-variant/20 pb-4">
              Lotes Similares
            </h2>
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

import { useCallback, useMemo, useState } from "react";
import PageSEO from "@/components/seo/PageSEO";
import BreadcrumbSchema from "@/components/seo/BreadcrumbSchema";
import { type LotStatus } from "@/constants/lots";
import { usePublicLots } from "./hooks/usePublicLots";
import { LotCard } from "./components/LotCard";
import { LotFilters, type AreaRange } from "./components/LotFilters";
import { EmptyState } from "./components/EmptyState";
import { project } from "@/constants/project";
import { cldUrl } from "@/lib/cloudinary";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { YouTubeVideo } from "@/components/ui/YouTubeVideo";
import { trackFilterApplied } from "@/lib/analytics";

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

  // Datos vivos de Supabase con fallback a los datos estáticos
  const { lots } = usePublicLots();

  const filteredLots = useMemo(() => {
    return lots.filter((lot) => {
      const matchesStatus = status === "all" || lot.status === status;
      const matchesArea = matchesAreaRange(lot.areaM2, areaRange);
      return matchesStatus && matchesArea;
    });
  }, [status, areaRange, lots]);

  const handleStatusChange = useCallback((newStatus: LotStatus | "all") => {
    setStatus(newStatus);
    trackFilterApplied({ status: newStatus });
  }, []);

  const handleAreaRangeChange = useCallback((newRange: AreaRange) => {
    setAreaRange(newRange);
    trackFilterApplied({ areaRange: newRange });
  }, []);

  const handleClearFilters = useCallback(() => {
    setStatus("all");
    setAreaRange("all");
    trackFilterApplied({ status: "all", areaRange: "all" });
  }, []);

  const scrollRevealRef = useScrollReveal({
    childSelector: ".grid > *",
    variant: "fade-up",
    staggerDelay: 80,
    rootMargin: "0px 0px -60px 0px",
  });

  return (
    <>
      <PageSEO
        title="Lotes Campestres Quimbaya Quindío — La Holanda"
        description="Lotes campestres en venta en Quimbaya, Quindío. Desde $158M COP con escritura pública, vías de acceso y diseño incluido. Filtra por área y estado. Agenda tu visita hoy."
        ogUrl="https://laholanda.ingesocc.com/projects"
        ogImage={cldUrl("https://res.cloudinary.com/j5a9xyaq/image/upload/v1784303341/laholanda/lots/masterplan-render.jpg")}
        keywords="lotes campestres quimbaya quindío, terrenos en venta quimbaya, parcelación eje cafetero, lotes disponibles quindío, comprar lote Quimbaya"
      />
      <BreadcrumbSchema
        items={[{ name: "Lotes Disponibles", url: "https://laholanda.ingesocc.com/projects" }]}
      />
      <div ref={scrollRevealRef} className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop pt-24 pb-16 md:py-24 page-enter">
        <div className="mb-12 flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8">
          <div>
            <h1 className="text-headline-lg-mobile md:text-headline-lg font-headline-lg text-primary mb-4">
              Lotes Campestres en Quimbaya, Quindío
            </h1>
            <p className="text-body-lg font-body-lg text-on-surface-variant max-w-2xl">
              Explora nuestros exclusivos lotes inmersos en la belleza natural del
              Quindío. Filtra por área y estado para encontrar el lote perfecto
              para tu hogar o inversión en el Eje Cafetero.
            </p>
          </div>

          <div className="w-full lg:w-auto">
            <LotFilters
              status={status}
              onStatusChange={handleStatusChange}
              areaRange={areaRange}
              onAreaRangeChange={handleAreaRangeChange}
            />
            <p className="mt-4 text-label-caps font-label-caps text-on-surface-variant">
              Mostrando {filteredLots.length} de {lots.length} lotes
            </p>
          </div>
        </div>

        {/* Video promocional con autoplay silenciado (carga al entrar al viewport) */}
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
            autoplay
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

        {/* Contenido SEO on-page — texto descriptivo de la zona para
            keywords long-tail: "lotes campestres quimbaya quindío precio",
            "parcelación cerca a Armenia", "lote con escritura eje cafetero" */}
        <section className="mt-16 md:mt-24 max-w-4xl mx-auto">
          <h2 className="text-headline-md font-headline-md text-primary mb-6">
            Lotes Campestres en Quimbaya, Quindío — Tu Santuario en el Eje Cafetero
          </h2>
          <div className="space-y-4 text-body-md font-body-md text-on-surface-variant leading-relaxed">
            <p>
              <strong>La Holanda</strong> es una parcelación campestre ubicada en la Vía Quimbaya - Alcalá,
              Vereda Jazmín, Quimbaya, Quindío. Nuestros lotes en venta ofrecen desde 2.000 m² hasta
              8.900 m² de terreno natural con escritura pública individual, lotes delimitados con cerca
              viva, vía interna de acceso y diseño arquitectónico tipo incluido.
            </p>
            <h3 className="text-headline-sm font-headline-sm text-primary pt-4">
              Ubicación estratégica en el corazón del Eje Cafetero
            </h3>
            <p>
              Quimbaya se encuentra en el centro del Paisaje Cultural Cafetero, Patrimonio de la Humanidad
              por la UNESCO. A solo 20 minutos del parque principal de Quimbaya, 40 minutos de Armenia
              (capital del Quindío), 30 minutos de Filandia y 45 minutos de Salento. El Aeropuerto
              Internacional El Edén está a menos de una hora, conectándote con Bogotá, Medellín y
             destinos internacionales.
            </p>
            <h3 className="text-headline-sm font-headline-sm text-primary pt-4">
              Clima, servicios y calidad de vida
            </h3>
            <p>
              Con un clima promedio de 22°C todo el año, Quimbaya ofrece las condiciones perfectas para
              vivir o invertir. La zona cuenta con disponibilidad de agua del Comité de Cafeteros, red de
              baja tensión frente al lote, y permiso individual de vertimiento de aguas residuales por la
              CRQ. El entorno natural de La Holanda preserva árboles de aguacate en producción y paisajes
              verdes que hacen única cada propiedad.
            </p>
            <h3 className="text-headline-sm font-headline-sm text-primary pt-4">
              Escritura pública y proceso de compra seguro
            </h3>
            <p>
              Cada lote incluye escritura pública individual con libertad de cargos, proceso de
              legalización completo y certificado de tradición. Desarrollado por INGESOCC SAS con
              más de 30 años de experiencia en construcción y desarrollo inmobiliario en el Quindío.
              Consulta precios, disponibilidad y opciones de financiación directa con el desarrollador.
            </p>
          </div>
        </section>

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

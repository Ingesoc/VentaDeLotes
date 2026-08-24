import { lazy, Suspense } from "react";
import PageSEO from "@/components/seo/PageSEO";
import BreadcrumbSchema from "@/components/seo/BreadcrumbSchema";
import { InvestmentHero } from "./components/InvestmentHero";
import { MarketGrowthBento } from "./components/MarketGrowthBento";
import { RoiAnalysis } from "./components/RoiAnalysis";
import { InvestmentCTA } from "./components/InvestmentCTA";
import { cldUrl } from "@/lib/cloudinary";
import { useScrollReveal } from "@/hooks/useScrollReveal";

// La calculadora usa Recharts; se carga de forma diferida para no inflar el
// bundle inicial de la página de inversión.
const RoiCalculator = lazy(() =>
  import("./components/RoiCalculator").then((m) => ({
    default: m.RoiCalculator,
  })),
);

export function InvestmentPage() {
  const scrollRevealRef = useScrollReveal({
    childSelector: "section",
    variant: "fade-up",
    staggerDelay: 120,
    rootMargin: "0px 0px -60px 0px",
  });

  return (
    <>
      <PageSEO
        title="Invertir en La Holanda — Plusvalía y Crecimiento en Quindío"
        description="Descubre por qué invertir en La Holanda es la mejor decisión. Alta valorización, plusvalía garantizada y el crecimiento turístico del Eje Cafetero. Lotes campestres desde $158M COP."
        ogUrl="https://www.laholanda.com/investment"
        ogImage={cldUrl("https://res.cloudinary.com/j5a9xyaq/image/upload/v1784303937/laholanda/landscapes/DJI_0131.webp")}
        keywords="invertir lotes quimbaya, plusvalía eje cafetero, inversión inmobiliaria quindío, retorno inversión lotes Colombia, crecimiento turístico quindío"
      />
      <BreadcrumbSchema
        items={[{ name: "Invertir", url: "https://www.laholanda.com/investment" }]}
      />
      <div ref={scrollRevealRef} className="w-full page-enter">
        <InvestmentHero />
        <MarketGrowthBento />
        <RoiAnalysis />
        <Suspense
          fallback={
            <div className="py-section-gap text-center text-on-surface-variant">
              Cargando calculadora...
            </div>
          }
        >
          <RoiCalculator />
        </Suspense>
        <InvestmentCTA />
      </div>
    </>
  );
}

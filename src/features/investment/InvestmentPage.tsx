import PageSEO from "@/components/seo/PageSEO";
import { InvestmentHero } from "./components/InvestmentHero";
import { MarketGrowthBento } from "./components/MarketGrowthBento";
import { RoiAnalysis } from "./components/RoiAnalysis";
import { InvestmentCTA } from "./components/InvestmentCTA";
import { useScrollReveal } from "@/hooks/useScrollReveal";

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
        title="Invertir en La Holanda | Quimbaya, Quindío"
        description="Descubre por qué invertir en La Holanda es la mejor decisión. Alta valorización, plusvalía garantizada y el crecimiento turístico del Eje Cafetero."
        ogUrl="https://www.laholanda.com/investment"
        ogImage="https://res.cloudinary.com/j5a9xyaq/image/upload/v1784303937/laholanda/landscapes/DJI_0131.webp"
      />
      <div ref={scrollRevealRef} className="w-full page-enter">
        <InvestmentHero />
        <MarketGrowthBento />
        <RoiAnalysis />
        <InvestmentCTA />
      </div>
    </>
  );
}

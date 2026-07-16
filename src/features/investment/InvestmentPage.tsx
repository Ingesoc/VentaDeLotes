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
    <div ref={scrollRevealRef} className="w-full page-enter">
      <InvestmentHero />
      <MarketGrowthBento />
      <RoiAnalysis />
      <InvestmentCTA />
    </div>
  );
}

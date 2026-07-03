import { HeroSection } from "./components/HeroSection";
import { TrustIndicators } from "./components/TrustIndicators";
import { BenefitsBentoGrid } from "./components/BenefitsBentoGrid";
import { InvestmentComparison } from "./components/InvestmentComparison";

export function HomePage() {
  return (
    <div className="w-full">
      <HeroSection />
      {/* Indicadores de confianza justo debajo del hero, solapando ligeramente en pantallas grandes si se desea, o simplemente en bloque */}
      <TrustIndicators />
      <BenefitsBentoGrid />
      <InvestmentComparison />
    </div>
  );
}

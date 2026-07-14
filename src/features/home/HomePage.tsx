import { HeroSection } from "./components/HeroSection";
import { TrustIndicators } from "./components/TrustIndicators";
import { ProcessSteps } from "./components/ProcessSteps";
import { MasterPlanSection } from "./components/MasterPlanSection";
import { FeaturedLots } from "./components/FeaturedLots";
import { BenefitsBentoGrid } from "./components/BenefitsBentoGrid";
import { InvestmentComparison } from "./components/InvestmentComparison";
import { ContactForm } from "./components/ContactForm";

export function HomePage() {
  return (
    <div className="w-full">
      <HeroSection />
      {/* Indicadores de confianza justo debajo del hero, solapando ligeramente en pantallas grandes si se desea, o simplemente en bloque */}
      <TrustIndicators />
      <ProcessSteps />
      <MasterPlanSection />
      <FeaturedLots />
      <BenefitsBentoGrid />
      <InvestmentComparison />
      <ContactForm />
    </div>
  );
}

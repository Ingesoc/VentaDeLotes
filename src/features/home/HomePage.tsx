import { HeroSection } from "./components/HeroSection";
import { ProcessSteps } from "./components/ProcessSteps";
import { MasterPlanSection } from "./components/MasterPlanSection";
import { FeaturedLots } from "./components/FeaturedLots";
import { InvestmentComparison } from "./components/InvestmentComparison";
import { ContactForm } from "./components/ContactForm";

export function HomePage() {
  return (
    <div className="w-full">
      <HeroSection />
      <ProcessSteps />
      <MasterPlanSection />
      <FeaturedLots />
      <InvestmentComparison />
      <ContactForm />
    </div>
  );
}

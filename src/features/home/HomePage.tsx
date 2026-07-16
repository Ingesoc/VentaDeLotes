import { HeroSection } from "./components/HeroSection";
import HomeCarousel from "@/components/home/HomeCarousel";
import { ProcessSteps } from "./components/ProcessSteps";
import { MasterPlanSection } from "./components/MasterPlanSection";
import { FeaturedLots } from "./components/FeaturedLots";
import { ProjectBenefits } from "./components/ProjectBenefits";
import { InvestmentComparison } from "./components/InvestmentComparison";
import { ContactForm } from "./components/ContactForm";
import { useScrollReveal } from "@/hooks/useScrollReveal";

export function HomePage() {
  const scrollRevealRef = useScrollReveal({
    childSelector: "section, header",
    variant: "fade-up",
    staggerDelay: 100,
    rootMargin: "0px 0px -60px 0px",
  });

  return (
    <div ref={scrollRevealRef} className="w-full page-enter">
      <HeroSection />
      <section className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
        <HomeCarousel />
      </section>
      <ProcessSteps />
      <ProjectBenefits />
      <MasterPlanSection />
      <FeaturedLots />
      <InvestmentComparison />
      <ContactForm />
    </div>
  );
}


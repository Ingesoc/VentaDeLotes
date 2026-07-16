import QuindioHero from "../components/quindio/QuindioHero";
import CulturalHeritage from "../components/quindio/CulturalHeritage";
import NaturalWonders from "../components/quindio/NaturalWonders";
import RuralLifestyle from "../components/quindio/RuralLifestyle";
import WellnessSection from "../components/quindio/WellnessSection";
import FinalCTA from "../components/quindio/FinalCTA";
import { useScrollReveal } from "../hooks/useScrollReveal";

export default function DescubreQuindio() {
  const scrollRevealRef = useScrollReveal({
    childSelector: "section",
    variant: "fade-up",
    staggerDelay: 120,
    rootMargin: "0px 0px -60px 0px",
  });

  return (
    <div ref={scrollRevealRef} className="pt-16 page-enter">
      <QuindioHero />
      <CulturalHeritage />
      <NaturalWonders />
      <RuralLifestyle />
      <WellnessSection />
      <FinalCTA />
    </div>
  );
}


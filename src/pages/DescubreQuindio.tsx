import PageSEO from "@/components/seo/PageSEO";
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
    <>
      <PageSEO
        title="Descubre Quindío | La Holanda"
        description="Explora el Paisaje Cultural Cafetero, Patrimonio de la Humanidad. Festivales, naturaleza, cultura arriera y el mejor clima de Colombia te esperan."
        ogUrl="https://www.laholanda.com/descubre-quindio"
        ogImage="https://res.cloudinary.com/j5a9xyaq/image/upload/v1784304240/laholanda/events/cafetales.jpg"
      />
      <div ref={scrollRevealRef} className="pt-16 page-enter">
        <QuindioHero />
        <CulturalHeritage />
        <NaturalWonders />
        <RuralLifestyle />
        <WellnessSection />
        <FinalCTA />
      </div>
    </>
  );
}

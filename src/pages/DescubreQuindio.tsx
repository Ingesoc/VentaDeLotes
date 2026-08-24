import PageSEO from "@/components/seo/PageSEO";
import BreadcrumbSchema from "@/components/seo/BreadcrumbSchema";
import QuindioHero from "../components/quindio/QuindioHero";
import CulturalHeritage from "../components/quindio/CulturalHeritage";
import NaturalWonders from "../components/quindio/NaturalWonders";
import RuralLifestyle from "../components/quindio/RuralLifestyle";
import QuindioParks from "../components/quindio/QuindioParks";
import FinalCTA from "../components/quindio/FinalCTA";
import { cldUrl } from "@/lib/cloudinary";
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
        title="Descubre Quindío — Eje Cafetero, Patrimonio de la Humanidad"
        description="Explora el Paisaje Cultural Cafetero de Quindío, Patrimonio de la Humanidad. Festivales, naturaleza, cultura arriera, clima perfecto y lotes campestres en venta en Quimbaya."
        ogUrl="https://www.laholanda.com/descubre-quindio"
        ogImage={cldUrl("https://res.cloudinary.com/j5a9xyaq/image/upload/v1784304240/laholanda/events/cafetales.jpg")}
        keywords="eje cafetero, Quindío, Quimbaya, paisaje cultural cafetero, vivir en quindío, clima eje cafetero, turismo quindío, lotes campestres quimbaya"
      />
      <BreadcrumbSchema
        items={[{ name: "Descubre Quindío", url: "https://www.laholanda.com/descubre-quindio" }]}
      />
      <div ref={scrollRevealRef} className="pt-16 page-enter">
        <QuindioHero />
        <CulturalHeritage />
        <NaturalWonders />
        <RuralLifestyle />
        <QuindioParks />
        <FinalCTA />
      </div>
    </>
  );
}

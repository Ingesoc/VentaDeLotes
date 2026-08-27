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
        title="Descubre Quindío — Eje Cafetero Colombia"
        description="Explora Quindío, corazón del Eje Cafetero y Patrimonio de la Humanidad. Clima perfecto, naturaleza, cultura cafetera y lotes campestres en venta en Quimbaya. Conoce la zona."
        ogUrl="https://laholanda.ingesocc.com/descubre-quindio"
        ogImage={cldUrl("https://res.cloudinary.com/j5a9xyaq/image/upload/v1787838725/cafetales_fftekm.webp")}
        keywords="eje cafetero, Quindío, Quimbaya, paisaje cultural cafetero, vivir en quindío, clima eje cafetero, turismo quindío, lotes campestres quimbaya"
      />
      <BreadcrumbSchema
        items={[{ name: "Descubre Quindío", url: "https://laholanda.ingesocc.com/descubre-quindio" }]}
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

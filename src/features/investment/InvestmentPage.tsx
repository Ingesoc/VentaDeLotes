import { lazy, Suspense } from "react";
import PageSEO from "@/components/seo/PageSEO";
import BreadcrumbSchema from "@/components/seo/BreadcrumbSchema";
import FAQSchema from "@/components/seo/FAQSchema";
import { InvestmentHero } from "./components/InvestmentHero";
import { MarketGrowthBento } from "./components/MarketGrowthBento";
import { RoiAnalysis } from "./components/RoiAnalysis";
import { InvestmentCTA } from "./components/InvestmentCTA";
import { cldUrl } from "@/lib/cloudinary";
import { useScrollReveal } from "@/hooks/useScrollReveal";

// La calculadora usa Recharts; se carga de forma diferida para no inflar el
// bundle inicial de la página de inversión.
const RoiCalculator = lazy(() =>
  import("./components/RoiCalculator").then((m) => ({
    default: m.RoiCalculator,
  })),
);

const INVESTMENT_FAQS = [
  {
    question: "¿Cuánto se ha valorizado los lotes en Quimbaya en los últimos años?",
    answer:
      "Los lotes en la zona de Quimbaya y el Eje Cafetero han mostrado una valorización promedio del 15-20% anual en los últimos 5 años, impulsada por el crecimiento turístico, la gastronomía y la demanda de segundas residencias. La ubicación estratégica de La Holanda, a 40 minutos de Armenia y en la vía Quimbaya-Alcalá, la posiciona en una zona de alto potencial de plusvalía.",
  },
  {
    question: "¿Es seguro invertir en lotes rurales en Colombia?",
    answer:
      "Sí, siempre que el lote tenga escritura pública con libertad de cargos y esté debidamente registrado. En La Holanda cada lote incluye escritura pública individual, proceso de legalización completo y certificado de tradición. Además, estamos en zona de expansión urbana con plan deordenamiento territorial favorable.",
  },
  {
    question: "¿Cuál es el retorno de inversión esperado en lotes del Eje Cafetero?",
    answer:
      "Con una valorización promedio del 15-20% anual, un lote de $180 millones COP puede alcanzar más de $300 millones en 3-4 años. Además, los lotes en La Holanda ofrecen la opción de construir una segunda residencia para alquiler turístico (Airbnb), generando ingresos pasivos mientras el terreno se valoriza.",
  },
  {
    question: "¿Puedo financiar la compra de un lote?",
    answer:
      "Sí, La Holanda ofrece opciones de pago directo con el desarrollador. Puedes reservar con un anticipo y financiar el saldo en cuotas según el plan de pago. Consulta las opciones vigentes contactándonos por WhatsApp al 3217151831.",
  },
];

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
        title="Invertir en Quindío — Plusvalía Eje Cafetero"
        description="Descubre por qué invertir en La Holanda es la mejor decisión. Plusvalía del 15-20% anual, crecimiento turístico del Eje Cafetero. Lotes desde $158M COP. Agenda tu asesoría."
        ogUrl="https://laholanda.ingesocc.com/investment"
        ogImage={cldUrl("https://res.cloudinary.com/j5a9xyaq/image/upload/v1784303937/laholanda/landscapes/DJI_0131.webp")}
        keywords="invertir lotes quimbaya, plusvalía eje cafetero, inversión inmobiliaria quindío, retorno inversión lotes Colombia, crecimiento turístico quindío"
      />
      <BreadcrumbSchema
        items={[{ name: "Invertir", url: "https://laholanda.ingesocc.com/investment" }]}
      />
      <FAQSchema items={INVESTMENT_FAQS} />
      <div ref={scrollRevealRef} className="w-full page-enter">
        <InvestmentHero />
        <MarketGrowthBento />
        <RoiAnalysis />
        <Suspense
          fallback={
            <div className="py-section-gap text-center text-on-surface-variant">
              Cargando calculadora...
            </div>
          }
        >
          <RoiCalculator />
        </Suspense>
        <InvestmentCTA />
      </div>
    </>
  );
}

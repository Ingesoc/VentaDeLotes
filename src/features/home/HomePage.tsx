import { lazy, Suspense, useEffect, useRef, useState } from "react";
import PageSEO from "@/components/seo/PageSEO";
import BreadcrumbSchema from "@/components/seo/BreadcrumbSchema";
import FAQSchema from "@/components/seo/FAQSchema";
import { HeroSection } from "./components/HeroSection";
import HomeCarousel from "@/components/home/HomeCarousel";
import { AerialVideoSection } from "./components/AerialVideoSection";
import { FeatureShowcase } from "./components/FeatureShowcase";
import { ProcessSteps } from "./components/ProcessSteps";
import { MasterPlanSection } from "./components/MasterPlanSection";
import { FeaturedLots } from "./components/FeaturedLots";
import { ProjectBenefits } from "./components/ProjectBenefits";
import { InvestmentComparison } from "./components/InvestmentComparison";
import { cldUrl } from "@/lib/cloudinary";
import { useScrollReveal } from "@/hooks/useScrollReveal";

// El formulario está fuera del viewport inicial; cargarlo bajo demanda saca
// react-hook-form y zod (chunks vendor-forms y vendor-zod, ~28 KiB gzip) del
// camino crítico de la home y reduce el trabajo del main thread.
const ContactForm = lazy(() =>
  import("./components/ContactForm").then((m) => ({ default: m.ContactForm })),
);

/**
 * Monta el formulario solo cuando el usuario se acerca a su sección
 * (rootMargin de 600px). Evita evaluar el chunk lazy (~27 KiB) y renderizar
 * el formulario en el arranque de la home, que no aporta al LCP.
 */
function ContactFormWhenNearViewport() {
  const ref = useRef<HTMLDivElement | null>(null);
  // Inicializar directamente si el hash ya es #contacto — evita un render
  // en cascada causado por setVisible(true) dentro de useEffect (eslint
  // react-hooks/set-state-in-effect).
  const [visible, setVisible] = useState(
    () => typeof window !== "undefined" && window.location.hash === "#contacto",
  );

  useEffect(() => {
    // Si ya es visible (llegada por ancla), no montar observer innecesario.
    if (visible) return;
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "600px 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [visible]);

  // El id="contacto" vive en el wrapper (siempre renderizado), no dentro del
  // formulario lazy: así los enlaces a /#contacto (nav "Reservar") scrollean
  // y el observer dispara el montaje aunque el chunk aún no haya cargado.
  return (
    <div ref={ref} id="contacto">
      {visible && (
        <Suspense fallback={null}>
          <ContactForm />
        </Suspense>
      )}
    </div>
  );
}

const HOME_FAQS = [
  {
    question: "¿Cuánto cuesta un lote campestre en Quimbaya, Quindío?",
    answer:
      "En La Holanda los lotes campestres en Quimbaya, Quindío, tienen precios desde $158.822.900 COP (aprox. $38.000 USD) para lotes de 2.005 m². El precio incluye escritura pública individual, entorno natural privilegiado y diseño arquitectónico tipo. Consulta disponibilidad actualizada en nuestra página de lotes.",
  },
  {
    question: "¿Cómo comprar un lote rural en Colombia con escritura pública?",
    answer:
      "Para comprar un lote rural con escritura pública en Colombia, verifica que el predio tenga libertad de cargos, certificado de tradición y posesión, y plano catastral. En La Holanda gestionamos todo el proceso de escrituración individual ante notaría, incluyendo trámites de legalización y registro. Puedes reservar con un anticipo y financiar el saldo restante.",
  },
  {
    question: "¿Qué incluye la compra de un lote en La Holanda?",
    answer:
      "Cada lote en La Holanda incluye: escritura pública individual con libertad de cargos, proceso de legalización completo, lote delimitado según plano catastral, entorno natural cafetero, diseño arquitectónico tipo incluido, y conservación de árboles de aguacate. También ofrecemos servicios de construcción con más de 20 años de experiencia.",
  },
  {
    question: "¿Qué tan lejos está La Holanda de Armenia, Quindío?",
    answer:
      "La Holanda se encuentra en la Vía Quimbaya - Alcalá, Vereda Jazmín, a 20 minutos del parque principal de Quimbaya y aproximadamente 40 minutos de Armenia, capital del Quindío. Está ubicada en el corazón del Eje Cafetero, cerca a Filandia (30 min), Salento (45 min) y el Aeropuerto El Edén.",
  },
  {
    question: "¿Es buena inversión comprar lotes en el Eje Cafetero?",
    answer:
      "Sí, el Eje Cafetero ha mostrado una valorización promedio del 15-20% anual en los últimos años, impulsado por el turismo, la gastronomía y la demanda de segundas residencias. Quimbaya específicamente ha crecido por su cercanía a Armenia, su clima templado (22°C promedio) y la infraestructura vía en mejoramiento. La Holanda ofrece lotes con proyección de plusvalía al estar en zona en expansión turística.",
  },
  {
    question: "¿Qué servicios públicos hay en los lotes de La Holanda?",
    answer:
      "La Holanda cuenta con vía principal de acceso, energía eléctrica disponible, y está en proceso dedotación de agua potable. La ubicación en zona rural de Quimbaya ofrece internet por satélite/4G, paisaje natural privilegiado y clima perfecto todo el año. Cada lote tiene acceso directo por vía principal.",
  },
  {
    question: "¿Dónde encontrar lotes baratos en el Quindío con escritura?",
    answer:
      "La Holanda ofrece lotes campestres en Quimbaya, Quindío, con precios desde $158 millones COP para terrenos de 2.005 m². Todos incluyen escritura pública individual con libertad de cargos. Comparado con lotes en Armenia o Calarcá, los lotes en Quimbaya ofrecen mejor relación precio-m² y están en zona de alto crecimiento turístico.",
  },
  {
    question: "¿Es Quimbaya un buen lugar para segunda vivienda o retiro?",
    answer:
      "Sí, Quimbaya es ideal para segunda vivienda o retiro por su clima templado de 22°C todo el año, cercanía a Armenia (40 min), Filandia (30 min) y Salento (45 min), y su ubicación en el Paisaje Cultural Cafetero, Patrimonio de la Humanidad. La Holanda ofrece lotes campestres para construir tu casa de descanso o vivienda permanente en un entorno natural privilegiado.",
  },
];

export function HomePage() {
  const scrollRevealRef = useScrollReveal({
    // Solo secciones: el <header> del hero contiene la imagen LCP y debe pintarse
    // de inmediato (sin opacity:0 inicial), o el LCP se retrasa hasta el mount.
    childSelector: "section",
    variant: "fade-up",
    staggerDelay: 100,
    rootMargin: "0px 0px -60px 0px",
  });

  return (
    <>
      <PageSEO
        title="La Holanda — Parcelación Campestre | Quimbaya, Quindío"
        description="La Holanda — Parcelación Campestre en Quimbaya, Quindío. Lotes campestres desde 500 m² con escritura pública, entorno natural cafetero y diseño arquitectónico incluido. Desarrollado por INGESOCC SAS."
        ogUrl="https://laholanda.ingesocc.com/"
        ogImage={cldUrl("https://res.cloudinary.com/j5a9xyaq/image/upload/v1784303937/laholanda/landscapes/DJI_0131.webp")}
        keywords="lotes campestres quimbaya quindío, parcelación la holanda, finca raíz eje cafetero, terrenos venta quimbaya, invertir quindío"
      />
      <BreadcrumbSchema items={[]} />
      <FAQSchema items={HOME_FAQS} />
      {/* Sin page-enter: su fade de opacity 0→1 (0.6s) retrasa el primer paint del hero/LCP */}
      <div ref={scrollRevealRef} className="w-full">
        <HeroSection />
        <section className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
          <HomeCarousel />
        </section>
        <AerialVideoSection />
        <MasterPlanSection />
        <ProcessSteps />
        <FeatureShowcase />
        <ProjectBenefits />
        <FeaturedLots />
        <InvestmentComparison />

        {/* Preguntas frecuentes — contenido SEO + rich results en Google */}
        <section className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto py-16 md:py-24">
          <div className="text-center mb-12">
            <h2 className="text-headline-md font-headline-md text-primary mb-3">
              Preguntas Frecuentes
            </h2>
            <p className="text-body-md font-body-md text-on-surface-variant max-w-2xl mx-auto">
              Resolvemos las dudas más comunes sobre la compra de lotes
              campestres en Quimbaya, Quindío.
            </p>
          </div>
          <div className="max-w-3xl mx-auto space-y-4">
            {HOME_FAQS.map((faq, i) => (
              <details
                key={i}
                className="group bg-surface-container-lowest border border-outline-variant/10 rounded-xl overflow-hidden"
              >
                <summary className="px-6 py-5 cursor-pointer font-label-bold text-primary text-body-md font-body-md flex items-center justify-between list-none hover:bg-surface-container-low/50 transition-colors">
                  <span>{faq.question}</span>
                  <span className="text-heritage-gold group-open:rotate-45 transition-transform text-xl shrink-0 ml-4">+</span>
                </summary>
                <div className="px-6 pb-5 text-body-md font-body-md text-on-surface-variant leading-relaxed">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        </section>

        <ContactFormWhenNearViewport />
      </div>
    </>
  );
}

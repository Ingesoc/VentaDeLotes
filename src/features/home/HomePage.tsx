import { lazy, Suspense, useEffect, useRef, useState } from "react";
import PageSEO from "@/components/seo/PageSEO";
import { HeroSection } from "./components/HeroSection";
import HomeCarousel from "@/components/home/HomeCarousel";
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
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Llegada directa vía ancla (#contacto): el formulario debe montarse de
    // inmediato (el navegador ya scrolleó hasta el wrapper, que siempre
    // existe). Sin esto, el ancla vive dentro del chunk lazy: al cargar la
    // página #contacto no existe, el navegador no scrollea y el observer
    // nunca dispara (bug detectado por los e2e de CI).
    if (window.location.hash === "#contacto") {
      setVisible(true);
      return;
    }
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
  }, []);

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
        description="La Holanda — Parcelación Campestre en Quimbaya, Quindío. Lotes campestres desde 500 m² con escritura pública, vías de acceso y diseño arquitectónico incluido. Desarrollado por INGESOCC SAS."
        ogUrl="https://www.laholanda.com/"
        ogImage={cldUrl("https://res.cloudinary.com/j5a9xyaq/image/upload/v1784303937/laholanda/landscapes/DJI_0131.webp")}
      />
      {/* Sin page-enter: su fade de opacity 0→1 (0.6s) retrasa el primer paint del hero/LCP */}
      <div ref={scrollRevealRef} className="w-full">
        <HeroSection />
        <section className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
          <HomeCarousel />
        </section>
        <MasterPlanSection />
        <ProcessSteps />
        <ProjectBenefits />
        <FeaturedLots />
        <InvestmentComparison />
        <ContactFormWhenNearViewport />
      </div>
    </>
  );
}

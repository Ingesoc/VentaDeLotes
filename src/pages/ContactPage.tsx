import PageSEO from "@/components/seo/PageSEO";
import BreadcrumbSchema from "@/components/seo/BreadcrumbSchema";
import { ContactForm } from "@/features/home/components/ContactForm";
import { project } from "@/constants/project";
import { Phone, Mail, MapPin } from "lucide-react";

export default function ContactPage() {
  return (
    <>
      <PageSEO
        title="Contacto — Asesoría Lotes Quimbaya | La Holanda"
        description="Contáctanos para asesoría personalizada sobre lotes campestres en Quimbaya, Quindío. WhatsApp 312 737 0811, formulario o llamada. Agenda tu visita a La Holanda hoy."
        ogUrl="https://laholanda.ingesocc.com/contact"
        keywords="contacto la holanda, asesoría lotes quimbaya, WhatsApp INGESOCC, agendar visita parcelación, phone lotes quindío"
      />
      <BreadcrumbSchema
        items={[{ name: "Contacto", url: "https://laholanda.ingesocc.com/contact" }]}
      />
      <div className="page-enter">
        {/* Hero pequeño */}
        <section className="pt-28 pb-16 px-margin-mobile md:px-margin-desktop bg-deep-forest relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(197,165,114,0.08),transparent_60%)]" />
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <span className="inline-block text-heritage-gold font-label-bold uppercase tracking-widest text-sm mb-4">
              Contáctanos
            </span>
            <h1 className="font-display-lg text-3xl sm:text-4xl md:text-display-lg text-warm-white drop-shadow-lg leading-tight text-balance">
              Hablemos de tu nuevo hogar
            </h1>
            <p className="text-body-md sm:text-body-lg font-body-lg text-surface-container-high max-w-2xl mx-auto mt-6">
              Déjanos tus datos y un asesor especializado te guiará en cada paso
              para hacer realidad tu santuario en el Quindío.
            </p>
          </div>
        </section>

        {/* Información de contacto */}
        <section className="py-section-gap px-margin-mobile md:px-margin-desktop bg-surface-container-low">
          <div className="max-w-6xl mx-auto">
            {/* h2 sr-only para que los h3 de las tarjetas tengan jerarquía
                válida (la página salta de h1 del hero a h3 sin h2). */}
            <h2 className="sr-only">Información de contacto</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              <div className="bg-surface-container-lowest rounded-xl p-8 text-center border border-outline-variant/10 hover-lift">
                <div className="w-14 h-14 bg-deep-forest/10 rounded-full flex items-center justify-center mx-auto mb-5">
                  <Phone className="w-6 h-6 text-deep-forest" />
                </div>
                <h3 className="font-label-bold text-primary mb-2">Teléfono</h3>
                <a
                  href={`tel:${project.contact.phone}`}
                  className="text-body-md font-body-md text-on-surface-variant hover:text-soft-gold transition-colors"
                >
                  {project.contact.phone}
                </a>
              </div>

              <div className="bg-surface-container-lowest rounded-xl p-8 text-center border border-outline-variant/10 hover-lift">
                <div className="w-14 h-14 bg-deep-forest/10 rounded-full flex items-center justify-center mx-auto mb-5">
                  <Mail className="w-6 h-6 text-deep-forest" />
                </div>
                <h3 className="font-label-bold text-primary mb-2">Correo</h3>
                <a
                  href={`mailto:${project.contact.email}`}
                  className="text-body-md font-body-md text-on-surface-variant hover:text-soft-gold transition-colors break-all"
                >
                  {project.contact.email}
                </a>
              </div>

              <div className="bg-surface-container-lowest rounded-xl p-8 text-center border border-outline-variant/10 hover-lift">
                <div className="w-14 h-14 bg-deep-forest/10 rounded-full flex items-center justify-center mx-auto mb-5">
                  <MapPin className="w-6 h-6 text-deep-forest" />
                </div>
                <h3 className="font-label-bold text-primary mb-2">Oficina</h3>
                <p className="text-body-md font-body-md text-on-surface-variant">
                  {project.contact.office}
                </p>
              </div>
            </div>

            {/* Mapa de la oficina */}
            <div className="rounded-2xl overflow-hidden shadow-xl border border-outline-variant/10 mb-16">
              <iframe
                src="https://www.google.com/maps?q=Km%206%20v%C3%ADa%20La%20Tebaida%2C%20Armenia%2C%20Quind%C3%ADo%2C%20Colombia&z=15&output=embed"
                width="100%"
                height="400"
                className="w-full border-0"
                sandbox="allow-scripts allow-popups"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Oficina INGESOCC SAS — Armenia, Km 6 vía La Tebaida, Bodega 2"
              />
            </div>

            {/* Formulario */}
            <ContactForm />
          </div>
        </section>
      </div>
    </>
  );
}

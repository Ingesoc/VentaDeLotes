import PageSEO from "@/components/seo/PageSEO";
import { ContactForm } from "@/features/home/components/ContactForm";
import { project } from "@/constants/project";
import { Phone, Mail, MapPin } from "lucide-react";

export default function ContactPage() {
  return (
    <>
      <PageSEO
        title="Contacto | La Holanda"
        description="Contáctanos para recibir asesoría personalizada sobre los lotes campestres en La Holanda, Quimbaya, Quindío."
        ogUrl="https://www.laholanda.com/contact"
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

            {/* Mapa embebido */}
            <div className="rounded-2xl overflow-hidden shadow-xl border border-outline-variant/10 mb-16">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d15905.886477864153!2d-75.769!3d4.619!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e1!3m2!1ses!2sco!4v1"
                width="100%"
                height="400"
                className="w-full border-0"
                sandbox="allow-scripts allow-popups"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Ubicación La Holanda — Vía Quimbaya-Alcalá, Vereda Jazmín"
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

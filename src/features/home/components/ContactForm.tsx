import { Send } from "lucide-react";
import {
  useContactForm,
  type SubmitLeadFn,
} from "../hooks/useContactForm";

interface ContactFormProps {
  /**
   * Función inyectable para persistir el lead (DIP). Por defecto usa la
   * implementación real sobre Supabase; los tests inyectan un mock.
   */
  submitLead?: SubmitLeadFn;
}

export function ContactForm({ submitLead }: ContactFormProps = {}) {
  const { register, handleSubmit, errors, isSubmitting, submitStatus } =
    useContactForm({ submitLead });

  return (
    <section
      id="contacto"
      className="py-section-gap px-margin-mobile md:px-margin-desktop bg-deep-forest relative"
    >
      <div className="max-w-4xl mx-auto bg-surface-container-lowest rounded-2xl p-8 md:p-12 shadow-2xl">
        <div className="text-center mb-10">
          <h2 className="text-headline-lg-mobile md:text-headline-lg font-headline-lg text-primary mb-4">
            Inicia tu Historia
          </h2>
          <p className="text-body-md font-body-md text-on-surface-variant">
            Déjanos tus datos y un asesor especializado te guiará en el proceso.
          </p>
        </div>

        {submitStatus === "success" && (
          <div className="mb-6 p-4 bg-deep-forest/10 text-deep-forest rounded-lg text-center font-medium">
            ¡Gracias! Tu mensaje ha sido enviado con éxito. Te contactaremos
            pronto.
          </div>
        )}
        {submitStatus === "error" && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg text-center font-medium">
            Hubo un error al enviar el formulario. Por favor, inténtalo de
            nuevo.
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
          noValidate
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="sr-only">
                Nombre
              </label>
              <input
                id="name"
                type="text"
                placeholder="Nombre completo"
                {...register("name")}
                className="w-full bg-transparent border-0 border-b border-outline-variant focus:ring-0 focus:border-heritage-gold text-body-md font-body-md safe-input text-on-background px-0 py-3 transition-colors placeholder:text-on-surface-variant/50"
              />
              {errors.name && (
                <p className="text-caption font-caption text-red-600 mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="email" className="sr-only">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="Correo electrónico"
                {...register("email")}
                className="w-full bg-transparent border-0 border-b border-outline-variant focus:ring-0 focus:border-heritage-gold text-body-md font-body-md safe-input text-on-background px-0 py-3 transition-colors placeholder:text-on-surface-variant/50"
              />
              {errors.email && (
                <p className="text-caption font-caption text-red-600 mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="phone" className="sr-only">
              Teléfono
            </label>
            <input
              id="phone"
              type="tel"
              placeholder="Número de teléfono"
              {...register("phone")}
              className="w-full bg-transparent border-0 border-b border-outline-variant focus:ring-0 focus:border-heritage-gold text-body-md font-body-md safe-input text-on-background px-0 py-3 transition-colors placeholder:text-on-surface-variant/50"
            />
            {errors.phone && (
              <p className="text-caption font-caption text-red-600 mt-1">
                {errors.phone.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="message" className="sr-only">
              Mensaje
            </label>
            <textarea
              id="message"
              rows={3}
              placeholder="¿En qué lote estás interesado?"
              {...register("message")}
              className="w-full bg-transparent border-0 border-b border-outline-variant focus:ring-0 focus:border-heritage-gold text-body-md font-body-md safe-input text-on-background px-0 py-3 transition-colors placeholder:text-on-surface-variant/50 resize-none"
            />
          </div>

          <div className="pt-4 text-center">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-heritage-gold text-primary px-8 sm:px-10 py-4 rounded-lg font-label-bold hover:opacity-90 transition-opacity inline-flex items-center gap-2 shadow-lg disabled:opacity-60 tap-target"
            >
              {isSubmitting ? "Enviando..." : "Enviar Solicitud"}
              <Send className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

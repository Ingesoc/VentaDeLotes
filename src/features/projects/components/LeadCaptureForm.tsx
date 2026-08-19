import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, CheckCircle2, MessageCircle } from "lucide-react";
import { submitLead } from "@/lib/leads";
import { trackContactInitiated, trackFormSubmitted } from "@/lib/analytics";

// ── Schema ───────────────────────────────────────────────────────

const captureSchema = z.object({
  name: z.string().min(2, "Ingresa tu nombre completo"),
  email: z.email("Correo electrónico inválido"),
  phone: z.string().min(7, "Ingresa un número de teléfono válido"),
});

type CaptureValues = z.infer<typeof captureSchema>;

// ── Props ────────────────────────────────────────────────────────

interface LeadCaptureFormProps {
  /** ID del lote que el usuario está viendo */
  lotId: string;
  /** Área del lote (para el mensaje prellenado de WhatsApp) */
  lotArea?: number;
  /** Precio del lote */
  lotPrice?: number;
}

// ── Component ────────────────────────────────────────────────────

/**
 * Formulario inline de captura de leads en la ficha de un lote.
 *
 * Aparece debajo de las specs y permite al usuario solicitar información
 * sin salir de la página. El canal de origen se captura automáticamente
 * de los UTM params y el lote de interés se asocia al lead.
 *
 * Flujo:
 *   1. Usuario llena nombre, email, teléfono
 *   2. Se envía el lead a Supabase con lotId y UTM params
 *   3. Se muestra mensaje de éxito con opción de WhatsApp
 */
export function LeadCaptureForm({
  lotId,
  lotArea,
  lotPrice,
}: LeadCaptureFormProps) {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CaptureValues>({
    resolver: zodResolver(captureSchema),
  });

  const onSubmit = async (data: CaptureValues) => {
    setStatus("idle");
    setErrorMsg("");

    // Track inicio de contacto
    trackContactInitiated(lotId, "formulario_ficha");

    const result = await submitLead({
      ...data,
      lotId,
      sourceChannel: "organico",
    });

    if (!result.ok) {
      console.error("Error al enviar lead:", result.error);
      setStatus("error");
      setErrorMsg("No se pudo enviar tu solicitud. Intenta de nuevo.");
      return;
    }

    // Track envío exitoso
    trackFormSubmitted(lotId, "ficha_lote");
    setStatus("success");
    reset();
  };

  // ── Estado de éxito ──────────────────────────────────────────

  if (status === "success") {
    return (
      <div className="bg-surface-container-lowest p-8 rounded-xl shadow-ambient border border-outline-variant/10">
        <div className="flex flex-col items-center text-center gap-4">
          <CheckCircle2 className="w-12 h-12 text-coffee-green" />
          <h3 className="text-headline-md font-headline-md text-primary">
            ¡Solicitud enviada!
          </h3>
          <p className="text-body-md text-on-surface-variant max-w-sm">
            Nuestro equipo se pondrá en contacto contigo pronto sobre el lote{" "}
            {lotId}.
          </p>
          <button
            type="button"
            onClick={() => setStatus("idle")}
            className="text-body-md text-heritage-gold hover:underline mt-2"
          >
            Enviar otra consulta
          </button>
        </div>
      </div>
    );
  }

  // ── Formulario ──────────────────────────────────────────────

  return (
    <div className="bg-surface-container-lowest p-8 rounded-xl shadow-ambient border border-outline-variant/10">
      <h3 className="text-headline-md font-headline-md text-primary mb-2 border-b border-outline-variant/20 pb-4">
        Solicitar información
      </h3>
      <p className="text-body-sm text-on-surface-variant mb-6">
        Déjanos tus datos y te contactaremos sobre el lote {lotId}
        {lotArea ? ` (${lotArea.toLocaleString("es-CO")} m²)` : ""}.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {status === "error" && (
          <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm font-medium">
            {errorMsg}
          </div>
        )}

        <div>
          <label
            htmlFor={`capture-name-${lotId}`}
            className="block text-label-bold font-label-bold text-primary mb-1"
          >
            Nombre completo *
          </label>
          <input
            id={`capture-name-${lotId}`}
            type="text"
            {...register("name")}
            placeholder="Tu nombre"
            className="w-full bg-transparent border border-outline-variant rounded-lg px-4 py-3 text-body-md text-on-background focus:ring-2 focus:ring-heritage-gold focus:border-transparent transition-colors placeholder:text-on-surface-variant/50"
          />
          {errors.name && (
            <p className="text-caption text-red-600 mt-1">
              {errors.name.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor={`capture-email-${lotId}`}
            className="block text-label-bold font-label-bold text-primary mb-1"
          >
            Correo electrónico *
          </label>
          <input
            id={`capture-email-${lotId}`}
            type="email"
            {...register("email")}
            placeholder="tu@email.com"
            className="w-full bg-transparent border border-outline-variant rounded-lg px-4 py-3 text-body-md text-on-background focus:ring-2 focus:ring-heritage-gold focus:border-transparent transition-colors placeholder:text-on-surface-variant/50"
          />
          {errors.email && (
            <p className="text-caption text-red-600 mt-1">
              {errors.email.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor={`capture-phone-${lotId}`}
            className="block text-label-bold font-label-bold text-primary mb-1"
          >
            Teléfono *
          </label>
          <input
            id={`capture-phone-${lotId}`}
            type="tel"
            {...register("phone")}
            placeholder="3XX XXX XXXX"
            className="w-full bg-transparent border border-outline-variant rounded-lg px-4 py-3 text-body-md text-on-background focus:ring-2 focus:ring-heritage-gold focus:border-transparent transition-colors placeholder:text-on-surface-variant/50"
          />
          {errors.phone && (
            <p className="text-caption text-red-600 mt-1">
              {errors.phone.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-deep-forest text-on-primary font-label-bold py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Enviando...
            </>
          ) : (
            <>
              <MessageCircle className="w-4 h-4" />
              Solicitar información
            </>
          )}
        </button>
      </form>

      {/* WhatsApp como alternativa rápida */}
      <div className="mt-4 text-center">
        <p className="text-caption text-on-surface-variant">
          ¿Prefieres WhatsApp?{" "}
          <a
            href={`https://wa.me/573127370811?text=${encodeURIComponent(
              `Hola, me interesa el lote ${lotId} de La Holanda en Quimbaya.` +
                (lotArea ? ` Área: ${lotArea.toLocaleString("es-CO")} m²` : "") +
                (lotPrice
                  ? `, precio: $${(lotPrice / 1_000_000).toLocaleString("es-CO")}M COP`
                  : "") +
                ". ¿Podemos coordinar una visita?",
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackContactInitiated(lotId, "whatsapp_alternativa")}
            className="text-heritage-gold hover:underline font-medium"
          >
            Escríbenos directo
          </a>
        </p>
      </div>
    </div>
  );
}

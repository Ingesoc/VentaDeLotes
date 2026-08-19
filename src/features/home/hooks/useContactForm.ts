import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { submitLead, type LeadData, type SubmitLeadResult } from "@/lib/leads";
import { trackFormSubmitted } from "@/lib/analytics";

const contactSchema = z.object({
  name: z.string().min(2, "Ingresa tu nombre completo"),
  email: z.email("Correo electrónico inválido"),
  phone: z.string().min(7, "Ingresa un número de teléfono válido"),
  message: z.string().optional(),
});

export type ContactFormValues = z.infer<typeof contactSchema>;

export type SubmitLeadFn = (data: LeadData) => Promise<SubmitLeadResult>;

export type SubmitStatus = "idle" | "success" | "error";

interface UseContactFormOptions {
  /**
   * Función inyectable para persistir el lead (DIP). Por defecto usa la
   * implementación real sobre Supabase; los tests inyectan un mock.
   */
  submitLead?: SubmitLeadFn;
}

/**
 * Lógica de negocio del formulario de contacto: validación (zod + RHF) y
 * envío del lead. Separada del JSX (SRP) para mantener el componente
 * puramente presentacional.
 */
export function useContactForm(options: UseContactFormOptions = {}) {
  const { submitLead: submitLeadFn = submitLead } = options;

  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>("idle");
  // Contador de envíos exitosos: renueva el temporizador si el usuario vuelve
  // a enviar mientras el mensaje de éxito sigue visible.
  const [submitCount, setSubmitCount] = useState(0);

  // El mensaje de éxito se oculta tras 5s. El cleanup del efecto limpia el
  // temporizador si el formulario se desmonta antes (evita setState tras
  // unmount y timers acumulados).
  useEffect(() => {
    if (submitStatus !== "success") return;
    const timer = window.setTimeout(() => setSubmitStatus("idle"), 5000);
    return () => window.clearTimeout(timer);
  }, [submitStatus, submitCount]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormValues) => {
    try {
      const result = await submitLeadFn(data);
      if (!result.ok) throw result.error;

      // Track envío exitoso del formulario de contacto
      trackFormSubmitted(undefined, "formulario_contacto");

      setSubmitStatus("success");
      setSubmitCount((c) => c + 1);
      reset();
    } catch (err) {
      console.error("Error al enviar lead a Supabase:", err);
      setSubmitStatus("error");
    }
  };

  return {
    register,
    errors,
    isSubmitting,
    submitStatus,
    handleSubmit: handleSubmit(onSubmit),
  };
}

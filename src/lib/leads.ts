import { supabase } from "@/lib/supabase";

export interface LeadData {
  name: string;
  email: string;
  phone: string;
  message?: string | null;
}

export type SubmitLeadResult = { ok: true } | { ok: false; error: unknown };

/**
 * Persiste un lead de contacto vía RPC en Supabase.
 *
 * Abstracción inyectable (DIP): los componentes consumen esta función —o una
 * equivalente en tests— en lugar del cliente de Supabase directamente, lo que
 * la hace testeable y sustituible.
 */
export async function submitLead(data: LeadData): Promise<SubmitLeadResult> {
  const { error } = await supabase.rpc("submit_lead", {
    p_name: data.name,
    p_email: data.email,
    p_phone: data.phone,
    p_message: data.message || null,
  });

  if (error) return { ok: false, error };

  // Notificación al equipo de ventas (Edge Function) — fire-and-forget.
  // Nunca debe bloquear ni afectar el resultado del formulario: si la
  // función no está desplegada o el envío falla, el lead ya quedó guardado.
  void supabase.functions
    .invoke("notify-lead", { body: data })
    .catch(() => undefined);

  return { ok: true };
}

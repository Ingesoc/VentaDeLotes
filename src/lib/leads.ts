import { supabase } from "@/lib/supabase";
import { getUtmParams } from "@/lib/analytics";

export type SourceChannel =
  | "organico"
  | "pauta_meta"
  | "pauta_google"
  | "referido"
  | "whatsapp"
  | "feria"
  | "otro";

export interface LeadData {
  name: string;
  email: string;
  phone: string;
  message?: string | null;
  /** Canal de adquisición (se infiere de UTM si no se provee). */
  sourceChannel?: SourceChannel;
  /** Lote de interés (se infiere del contexto si no se provee). */
  lotId?: string;
  /** Parámetros UTM explícitos (se leen de la URL si no se proveen). */
  utmSource?: string | null;
  utmMedium?: string | null;
  utmCampaign?: string | null;
}

export type SubmitLeadResult = { ok: true } | { ok: false; error: unknown };

/**
 * Persiste un lead de contacto vía RPC en Supabase.
 *
 * Abstracción inyectable (DIP): los componentes consumen esta función —o una
 * equivalente en tests— en lugar del cliente de Supabase directamente, lo que
 * la hace testeable y sustituible.
 *
 * Parámetros opcionales `sourceChannel`, `lotId` y UTM se incluyen en la
 * llamada RPC. Si no se proveen, se intenta inferir de la URL actual.
 */
export async function submitLead(data: LeadData): Promise<SubmitLeadResult> {
  // Inferir UTM de la URL si no se proporcionan explícitamente
  const utm = getUtmParams();

  const { error } = await supabase.rpc("submit_lead", {
    p_name: data.name,
    p_email: data.email,
    p_phone: data.phone,
    p_message: data.message || null,
    p_source_channel: data.sourceChannel ?? "organico",
    p_lot_id: data.lotId ?? null,
    p_utm_source: data.utmSource ?? utm.utm_source,
    p_utm_medium: data.utmMedium ?? utm.utm_medium,
    p_utm_campaign: data.utmCampaign ?? utm.utm_campaign,
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

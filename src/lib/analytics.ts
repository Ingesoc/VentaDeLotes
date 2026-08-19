/**
 * Analytics — sistema de tracking de eventos de producto.
 *
 * Diseño:
 *   - Todas las escrituras son fire-and-forget (nunca bloquean la UI).
 *   - Los UTM params se extraen una vez por sesión y se reutilizan.
 *   - El session ID se genera una vez y persiste en localStorage.
 *   - Todas las funciones son tolerantes a fallos: si Supabase no responde,
 *     se ignora silenciosamente.
 *
 * Tipos de eventos soportados (deben coincidir con el CHECK constraint
 * en la migración SQL de Supabase):
 *   - page_view        → vista genérica de página
 *   - lote_visto       → vista de ficha de lote
 *   - lote_favorito    → marcado como favorito
 *   - contacto_iniciado → clic en botón de contacto (WhatsApp, formulario)
 *   - visita_agendada   → submit de agendar visita
 *   - formulario_enviado → submit exitoso de formulario de lead
 *   - formulario_abandonado → 30s+ sin submit tras focus en formulario
 *   - filtro_aplicado   → cambio de filtros en catálogo
 *   - busqueda_realizada → búsqueda interna (futuro)
 */

import { supabase } from "@/lib/supabase";

// ── Tipos ────────────────────────────────────────────────────────

export type EventType =
  | "page_view"
  | "lote_visto"
  | "lote_favorito"
  | "contacto_iniciado"
  | "visita_agendada"
  | "formulario_enviado"
  | "formulario_abandonado"
  | "filtro_aplicado"
  | "busqueda_realizada";

export interface TrackEventPayload {
  eventType: EventType;
  lotId?: string;
  pagePath?: string;
  metadata?: Record<string, unknown>;
  timeOnPageMs?: number;
}

export interface UtmParams {
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
}

// ── Session ID ───────────────────────────────────────────────────

const SESSION_KEY = "lh_session_id";

/**
 * Retorna un ID de sesión persistente por pestaña.
 * Se genera una vez y se almacena en localStorage para que todos los
 * eventos de la misma sesión se agrupen correctamente.
 */
export function getSessionId(): string {
  try {
    const stored = localStorage.getItem(SESSION_KEY);
    if (stored) return stored;
  } catch {
    // localStorage no disponible (SSR, incógnito restringido, etc.)
  }

  const id = crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;

  try {
    localStorage.setItem(SESSION_KEY, id);
  } catch {
    // Ignorar — el tracking no debe romper la app
  }

  return id;
}

// ── UTM Params ───────────────────────────────────────────────────

const UTM_KEY = "lh_utm";
const UTM_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 días

/**
 * Extrae los parámetros UTM de la URL actual y los cachea en localStorage
 * durante 30 días. Si el usuario llegó por una campaña, todos los eventos
 * subsiguientes se asocian a esa campaña.
 *
 *flujo:
 *   1. Si hay UTM en la URL → guardar y retornar.
 *   2. Si no hay UTM en la URL → buscar en cache.
 *   3. Si el cache expiró → limpiar y retornar nulls.
 */
export function getUtmParams(): UtmParams {
  const urlParams = new URLSearchParams(window.location.search);
  const utmSource = urlParams.get("utm_source");
  const utmMedium = urlParams.get("utm_medium");
  const utmCampaign = urlParams.get("utm_campaign");

  // Si hay UTM en la URL, cachear
  if (utmSource || utmMedium || utmCampaign) {
    const data: UtmParams & { timestamp: number } = {
      utm_source: utmSource,
      utm_medium: utmMedium,
      utm_campaign: utmCampaign,
      timestamp: Date.now(),
    };

    try {
      localStorage.setItem(UTM_KEY, JSON.stringify(data));
    } catch {
      // Ignorar
    }

    return { utm_source: utmSource, utm_medium: utmMedium, utm_campaign: utmCampaign };
  }

  // Buscar en cache
  try {
    const cached = localStorage.getItem(UTM_KEY);
    if (cached) {
      const parsed = JSON.parse(cached) as UtmParams & { timestamp: number };
      if (Date.now() - parsed.timestamp < UTM_TTL_MS) {
        return {
          utm_source: parsed.utm_source,
          utm_medium: parsed.utm_medium,
          utm_campaign: parsed.utm_campaign,
        };
      }
      // Cache expirado — limpiar
      localStorage.removeItem(UTM_KEY);
    }
  } catch {
    // Ignorar
  }

  return { utm_source: null, utm_medium: null, utm_campaign: null };
}

// ── Track Event ──────────────────────────────────────────────────

/**
 * Registra un evento de producto en Supabase (fire-and-forget).
 *
 * Esta es la función central de tracking. Los componentes la llaman
 * cuando ocurre un evento significativo. Nunca lanza errores ni
 * bloquea la UI — si Supabase falla, se ignora.
 *
 * @example
 * ```ts
 * trackEvent({
 *   eventType: "lote_visto",
 *   lotId: "03",
 *   pagePath: "/projects/03",
 * });
 * ```
 */
export async function trackEvent(payload: TrackEventPayload): Promise<void> {
  try {
    const sessionId = getSessionId();
    const utm = getUtmParams();

    const metadata: Record<string, unknown> = {
      ...payload.metadata,
      ...utm,
    };

    // Solo incluir session_id si no está vacío
    const params: Record<string, unknown> = {
      p_event_type: payload.eventType,
      p_session_id: sessionId,
      p_page_path: payload.pagePath ?? window.location.pathname,
      p_user_agent: navigator.userAgent,
      p_referrer: document.referrer || null,
      p_metadata: Object.keys(metadata).length > 0 ? metadata : null,
    };

    if (payload.lotId) params.p_lot_id = payload.lotId;
    if (payload.timeOnPageMs != null) params.p_time_on_page_ms = payload.timeOnPageMs;

    await supabase.rpc("track_event", params);
  } catch {
    // Fire-and-forget: el tracking nunca debe romper la UI
  }
}

// ── Helpers de conveniencia ──────────────────────────────────────

/** Track vista de página genérica */
export function trackPageView(pagePath?: string): void {
  trackEvent({
    eventType: "page_view",
    pagePath: pagePath ?? window.location.pathname,
  });
}

/** Track vista de lote específico */
export function trackLotView(lotId: string): void {
  trackEvent({
    eventType: "lote_visto",
    lotId,
    pagePath: `/projects/${lotId}`,
  });
}

/** Track clic en contacto (WhatsApp, formulario, etc.) */
export function trackContactInitiated(lotId?: string, channel?: string): void {
  trackEvent({
    eventType: "contacto_iniciado",
    lotId,
    metadata: { channel },
  });
}

/** Track envío exitoso de formulario */
export function trackFormSubmitted(lotId?: string, formType?: string): void {
  trackEvent({
    eventType: "formulario_enviado",
    lotId,
    metadata: { form_type: formType },
  });
}

/** Track cambio de filtros */
export function trackFilterApplied(filters: Record<string, unknown>): void {
  trackEvent({
    eventType: "filtro_aplicado",
    metadata: { filters },
  });
}

/** Track favorito */
export function trackLotFavorited(lotId: string, isFavorited: boolean): void {
  trackEvent({
    eventType: "lote_favorito",
    lotId,
    metadata: { action: isFavorited ? "add" : "remove" },
  });
}

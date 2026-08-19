import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics";

/**
 * Registra una vista de página para un lote en Supabase.
 *
 * Emite dos eventos:
 *   1. `page_view` — vista genérica de página (compat con page_views anterior)
 *   2. `lote_visto` — evento específico de vista de lote (analytics enriquecido)
 */
export function useTrackPageView(lotId?: string) {
  useEffect(() => {
    if (!lotId) return;

    const pagePath = `/projects/${lotId}`;

    // Evento de vista de lote (analytics enriquecido)
    trackEvent({
      eventType: "lote_visto",
      lotId,
      pagePath,
    });
  }, [lotId]);
}

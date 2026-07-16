import { useEffect } from "react";
import { supabase } from "@/lib/supabase";

/** Registra una vista de página para un lote en Supabase. */
export function useTrackPageView(lotId?: string) {
  useEffect(() => {
    if (!lotId) return;

    const track = async () => {
      try {
        await supabase.rpc("track_page_view", {
          p_lot_id: lotId,
          p_page_path: `/projects/${lotId}`,
        });
      } catch {
        // Fallo silencioso — el tracking nunca debe romper la página
      }
    };

    track();
  }, [lotId]);
}

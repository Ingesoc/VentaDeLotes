/**
 * Query hooks para métricas de lotes.
 *
 * Usa la vista materializada `lotes_metricas` para datos pre-agregados.
 * Refresca periódicamente para mantener datos actualizados.
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { LotMetrics } from "../../types/metrics";

// ── Claves de query ──────────────────────────────────────────────

export const lotsMetricsKeys = {
  all: ["lots-metrics"] as const,
  list: () => [...lotsMetricsKeys.all, "list"] as const,
  detail: (lotId: string) => [...lotsMetricsKeys.all, "detail", lotId] as const,
};

// ── Queries ──────────────────────────────────────────────────────

/**
 * Fetch métricas de todos los lotes desde la vista materializada.
 */
export function useLotsMetrics() {
  return useQuery({
    queryKey: lotsMetricsKeys.list(),
    queryFn: async (): Promise<LotMetrics[]> => {
      const { data, error } = await supabase
        .from("lotes_metricas")
        .select("*")
        .order("total_vistas", { ascending: false });

      if (error) throw error;

      return (data ?? []) as LotMetrics[];
    },
  });
}

/**
 * Fetch métricas de un lote específico.
 */
export function useLotMetrics(lotId: string | null) {
  return useQuery({
    queryKey: lotsMetricsKeys.detail(lotId ?? ""),
    queryFn: async (): Promise<LotMetrics | null> => {
      if (!lotId) return null;

      const { data, error } = await supabase
        .from("lotes_metricas")
        .select("*")
        .eq("lot_id", lotId)
        .single();

      if (error) {
        // Si la vista no existe o el lote no tiene datos, no lanzar error
        if (error.code === "PGRST116" || error.code === "42P01") return null;
        throw error;
      }

      return data as LotMetrics;
    },
    enabled: lotId != null && lotId.length > 0,
  });
}

/**
 * Mutation para refrescar la vista materializada `lotes_metricas`.
 * Llama a la RPC `refresh_lotes_metricas()` en Supabase.
 *
 * Útil para el botón "Actualizar métricas" en el dashboard.
 */
export function useRefreshLotsMetrics() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { error } = await supabase.rpc("refresh_lotes_metricas" as never);
      if (error) throw error;
    },
    onSuccess: () => {
      // Invalidar la cache para que se refetch automáticamente
      queryClient.invalidateQueries({ queryKey: lotsMetricsKeys.all });
    },
  });
}

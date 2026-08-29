/**
 * Query hook para las estadísticas del dashboard admin.
 *
 * Usa la RPC get_admin_stats() que retorna todas las métricas
 * en una sola llamada al servidor, con días vacíos rellenados en 0.
 *
 * Separación de capas:
 *   - Esta función vive en la capa de datos (data/queries)
 *   - El componente DashboardPage la consume y renderiza
 *   - No hay agregación client-side: todo se hace en PostgreSQL
 */

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { AdminStats } from "../../types/admin-stats";

// ── Claves de query ──────────────────────────────────────────────

export const adminStatsKeys = {
  all: ["admin-stats"] as const,
  detail: (days: number) => [...adminStatsKeys.all, days] as const,
};

// ── Query ────────────────────────────────────────────────────────

/**
 * Fetch estadísticas completas del dashboard admin.
 *
 * Llama a la RPC get_admin_stats() en PostgreSQL, que agrega
 * todos los datos en una sola consulta optimizada.
 *
 * @param days - Número de días para las series temporales (default: 14)
 * @returns Objeto con data (AdminStats | null), isLoading, y error
 */
export function useAdminStats(days = 14) {
  return useQuery({
    queryKey: adminStatsKeys.detail(days),
    queryFn: async (): Promise<AdminStats> => {
      const { data, error } = await supabase.rpc("get_admin_stats" as never, {
        p_days: days,
        p_top_lots: 5,
        p_recent_leads: 5,
      } as never);

      if (error) throw error;

      // La RPC retorna NULL si el usuario no tiene acceso
      if (!data) {
        throw new Error(
          "No tienes permisos para ver las estadísticas del dashboard.",
        );
      }

      return data as AdminStats;
    },
    staleTime: 2 * 60 * 1000, // 2 min — los datos no cambian tan rápido
    retry: 1, // Un solo retry en caso de error de red
  });
}

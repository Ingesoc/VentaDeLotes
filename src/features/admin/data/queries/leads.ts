/**
 * Query hooks para leads.
 *
 * Usa TanStack Query para caching automático, refetch en background,
 * y manejo de estados de carga/error en toda la capa de UI.
 */

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type {
  Lead,
  LeadSummary,
  LeadFilters,
  Interaction,
  FunnelStageCount,
  SourceChannel,
  FunnelStage,
} from "../../types/lead";

// ── Claves de query ──────────────────────────────────────────────

export const leadKeys = {
  all: ["leads"] as const,
  lists: () => [...leadKeys.all, "list"] as const,
  list: (filters: LeadFilters) => [...leadKeys.lists(), filters] as const,
  details: () => [...leadKeys.all, "detail"] as const,
  detail: (id: number) => [...leadKeys.details(), id] as const,
  interactions: (leadId: number) => [...leadKeys.all, "interactions", leadId] as const,
  funnel: () => [...leadKeys.all, "funnel"] as const,
  channels: () => [...leadKeys.all, "channels"] as const,
  stats: () => [...leadKeys.all, "stats"] as const,
};

// ── Queries ──────────────────────────────────────────────────────

/**
 * Fetch lista de leads con filtros, ordenamiento y paginación.
 *
 * @example
 * ```tsx
 * const { data, isLoading } = useLeads({ stage: "nuevo", sortBy: "created_at" });
 * ```
 */
export function useLeads(filters: LeadFilters = {}) {
  return useQuery({
    queryKey: leadKeys.list(filters),
    queryFn: async (): Promise<{ leads: LeadSummary[]; total: number }> => {
      const {
        stage,
        channel,
        lotId,
        search,
        dateFrom,
        dateTo,
        sortBy = "created_at",
        sortDirection = "desc",
        page = 1,
        pageSize = 20,
      } = filters;

      let query = supabase
        .from("leads")
        .select(
          "id, name, email, phone, source_channel, funnel_stage, lot_id, score, last_contact_at, created_at",
          { count: "exact" },
        );

      // Filtros
      if (stage) query = query.eq("funnel_stage", stage);
      if (channel) query = query.eq("source_channel", channel);
      if (lotId) query = query.eq("lot_id", lotId);
      if (dateFrom) query = query.gte("created_at", dateFrom);
      if (dateTo) query = query.lte("created_at", dateTo);

      // Búsqueda parcial por nombre, email o teléfono
      if (search) {
        query = query.or(
          `name.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%`,
        );
      }

      // Ordenamiento
      query = query.order(sortBy, { ascending: sortDirection === "asc" });

      // Paginación
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) throw error;

      return {
        leads: (data ?? []) as LeadSummary[],
        total: count ?? 0,
      };
    },
    staleTime: 2 * 60 * 1000, // 2 min — los leads se actualizan frecuentemente
  });
}

/**
 * Fetch un lead específico por ID, con todas sus interacciones.
 */
export function useLeadById(id: number | null) {
  return useQuery({
    queryKey: leadKeys.detail(id ?? 0),
    queryFn: async (): Promise<Lead & { interacciones: Interaction[] }> => {
      if (!id) throw new Error("Lead ID is required");

      const [leadResult, interactionsResult] = await Promise.all([
        supabase.from("leads").select("*").eq("id", id).single(),
        supabase
          .from("interacciones")
          .select("*")
          .eq("lead_id", id)
          .order("created_at", { ascending: false }),
      ]);

      if (leadResult.error) throw leadResult.error;
      if (interactionsResult.error) throw interactionsResult.error;

      return {
        ...(leadResult.data as Lead),
        interacciones: (interactionsResult.data ?? []) as Interaction[],
      };
    },
    enabled: id != null && id > 0,
  });
}

/**
 * Fetch conteo de leads por etapa del embudo.
 * Usado para el funnel chart del dashboard.
 */
export function useFunnelCounts() {
  return useQuery({
    queryKey: leadKeys.funnel(),
    queryFn: async (): Promise<FunnelStageCount[]> => {
      const { data, error } = await supabase
        .from("leads")
        .select("funnel_stage");

      if (error) throw error;

      // Contar manualmente (Supabase no soporta GROUP BY directo)
      const stageOrder: FunnelStage[] = [
        "nuevo",
        "contactado",
        "visita_agendada",
        "negociando",
        "cerrado_ganado",
        "cerrado_perdido",
      ];

      const counts: Record<string, number> = {};
      for (const row of data ?? []) {
        const stage = (row as { funnel_stage: string }).funnel_stage;
        counts[stage] = (counts[stage] ?? 0) + 1;
      }

      return stageOrder.map((stage) => ({
        stage,
        count: counts[stage] ?? 0,
      }));
    },
  });
}

/**
 * Fetch rendimiento por canal de adquisición.
 */
export function useChannelPerformance() {
  return useQuery({
    queryKey: leadKeys.channels(),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("leads")
        .select("source_channel, funnel_stage");

      if (error) throw error;

      // Agrupar por canal
      const channelMap = new Map<
        SourceChannel,
        { total: number; won: number; lost: number }
      >();

      for (const row of data ?? []) {
        const r = row as { source_channel: SourceChannel; funnel_stage: string };
        const entry = channelMap.get(r.source_channel) ?? {
          total: 0,
          won: 0,
          lost: 0,
        };
        entry.total += 1;
        if (r.funnel_stage === "cerrado_ganado") entry.won += 1;
        if (r.funnel_stage === "cerrado_perdido") entry.lost += 1;
        channelMap.set(r.source_channel, entry);
      }

      return Array.from(channelMap.entries()).map(([channel, stats]) => ({
        channel,
        total_leads: stats.total,
        closed_won: stats.won,
        closed_lost: stats.lost,
        conversion_rate:
          stats.total > 0
            ? Math.round((stats.won / stats.total) * 1000) / 10
            : 0,
      }));
    },
  });
}

/**
 * Fetch estadísticas rápidas del dashboard de leads.
 */
export function useLeadStats() {
  return useQuery({
    queryKey: leadKeys.stats(),
    queryFn: async () => {
      const now = new Date();
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

      const [totalResult, recentResult, stageResult] = await Promise.all([
        supabase.from("leads").select("*", { count: "exact", head: true }),
        supabase
          .from("leads")
          .select("*", { count: "exact", head: true })
          .gte("created_at", sevenDaysAgo.toISOString()),
        supabase.from("leads").select("funnel_stage"),
      ]);

      if (totalResult.error) throw totalResult.error;
      if (recentResult.error) throw recentResult.error;
      if (stageResult.error) throw stageResult.error;

      // Contar leads nuevos en los últimos 30 días
      const { count: newLeads30d } = await supabase
        .from("leads")
        .select("*", { count: "exact", head: true })
        .gte("created_at", thirtyDaysAgo.toISOString());

      return {
        totalLeads: totalResult.count ?? 0,
        leadsLast7Days: recentResult.count ?? 0,
        leadsLast30Days: newLeads30d ?? 0,
        stageDistribution: (stageResult.data ?? []).reduce(
          (acc, row) => {
            const stage = (row as { funnel_stage: string }).funnel_stage;
            acc[stage] = (acc[stage] ?? 0) + 1;
            return acc;
          },
          {} as Record<string, number>,
        ),
      };
    },
  });
}

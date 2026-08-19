/**
 * Query hooks para datos de funnel y conversión.
 *
 * Estos hooks agregan datos de leads + eventos para construir
 * las visualizaciones del dashboard de analytics.
 */

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { TimeSeriesPoint } from "../../types/metrics";

// ── Claves de query ──────────────────────────────────────────────

export const analyticsKeys = {
  all: ["analytics"] as const,
  funnel: (days: number) => [...analyticsKeys.all, "funnel", days] as const,
  channels: () => [...analyticsKeys.all, "channels"] as const,
  lotsRanking: () => [...analyticsKeys.all, "lots-ranking"] as const,
  trends: (days: number) => [...analyticsKeys.all, "trends", days] as const,
  traffic: (days: number) => [...analyticsKeys.all, "traffic", days] as const,
};

// ── Helpers ──────────────────────────────────────────────────────

/** Genera puntos de tiempo vacíos para los últimos N días. */
function emptyDaysSeries(days: number): TimeSeriesPoint[] {
  const points: TimeSeriesPoint[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - i);
    const key = date.toISOString().slice(0, 10);
    points.push({
      date: key,
      label: date.toLocaleDateString("es-CO", {
        day: "numeric",
        month: "short",
      }),
      count: 0,
    });
  }
  return points;
}

/** Agrupa registros por día en una serie temporal. */
function bucketByDay(
  rows: Array<{ created_at?: string; viewed_at?: string }>,
  days: number,
): TimeSeriesPoint[] {
  const series = emptyDaysSeries(days);
  const counts = new Map<string, number>();

  for (const row of rows) {
    const ts = row.created_at ?? row.viewed_at;
    if (!ts) continue;
    const key = new Date(ts).toISOString().slice(0, 10);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }

  return series.map((point) => ({
    ...point,
    count: counts.get(point.date) ?? 0,
  }));
}

// ── Queries ──────────────────────────────────────────────────────

/**
 * Fetch datos del funnel de conversión para los últimos N días.
 * Retorna leads agrupados por etapa y serie temporal de leads nuevos.
 */
export function useFunnelData(days = 30) {
  return useQuery({
    queryKey: analyticsKeys.funnel(days),
    queryFn: async () => {
      const cutoff = new Date(
        Date.now() - days * 24 * 60 * 60 * 1000,
      ).toISOString();

      const { data: leadsData, error: leadsError } = await supabase
        .from("leads")
        .select("funnel_stage, created_at")
        .gte("created_at", cutoff);

      if (leadsError) throw leadsError;

      // Leads por etapa
      const stageCounts: Record<string, number> = {};
      for (const row of leadsData ?? []) {
        const stage = (row as { funnel_stage: string }).funnel_stage;
        stageCounts[stage] = (stageCounts[stage] ?? 0) + 1;
      }

      // Leads nuevos por día
      const leadsTrend = bucketByDay(
        (leadsData ?? []) as { created_at: string }[],
        days,
      );

      // Calcular tasas de conversión entre etapas
      const stageOrder = [
        "nuevo",
        "contactado",
        "visita_agendada",
        "negociando",
        "cerrado_ganado",
      ];

      const conversionRates = stageOrder.map((stage, i) => {
        const current = stageCounts[stage] ?? 0;
        const previous = i === 0 ? current : (stageCounts[stageOrder[i - 1]] ?? 0);
        return {
          stage,
          count: current,
          conversionFromPrevious:
            previous > 0 ? Math.round((current / previous) * 1000) / 10 : 0,
        };
      });

      return {
        stages: stageOrder.map((s) => ({
          stage: s,
          count: stageCounts[s] ?? 0,
        })),
        conversionRates,
        leadsTrend,
        totalLeads: leadsData?.length ?? 0,
      };
    },
  });
}

/**
 * Fetch rendimiento por canal de adquisición.
 */
export function useChannelAnalytics() {
  return useQuery({
    queryKey: analyticsKeys.channels(),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("leads")
        .select("source_channel, funnel_stage, created_at");

      if (error) throw error;

      // Agrupar por canal
      const channelMap = new Map<
        string,
        { total: number; won: number; lost: number; stages: Record<string, number> }
      >();

      for (const row of data ?? []) {
        const r = row as {
          source_channel: string;
          funnel_stage: string;
        };
        const entry = channelMap.get(r.source_channel) ?? {
          total: 0,
          won: 0,
          lost: 0,
          stages: {},
        };
        entry.total += 1;
        entry.stages[r.funnel_stage] = (entry.stages[r.funnel_stage] ?? 0) + 1;
        if (r.funnel_stage === "cerrado_ganado") entry.won += 1;
        if (r.funnel_stage === "cerrado_perdido") entry.lost += 1;
        channelMap.set(r.source_channel, entry);
      }

      return Array.from(channelMap.entries()).map(([channel, stats]) => ({
        channel,
        totalLeads: stats.total,
        closedWon: stats.won,
        closedLost: stats.lost,
        conversionRate:
          stats.total > 0
            ? Math.round((stats.won / stats.total) * 1000) / 10
            : 0,
        stages: stats.stages,
      }));
    },
  });
}

/**
 * Fetch ranking de lotes por métricas de interés.
 * Usa la vista materializada `lotes_metricas` si está disponible,
 * o calcula en tiempo real como fallback.
 */
export function useLotsRanking() {
  return useQuery({
    queryKey: analyticsKeys.lotsRanking(),
    queryFn: async () => {
      // Intentar usar la vista materializada primero
      const { data: viewData, error: viewError } = await supabase
        .from("lotes_metricas")
        .select("*")
        .order("total_vistas", { ascending: false });

      // Si la vista existe y funciona, usarla
      if (!viewError && viewData && viewData.length > 0) {
        return viewData as Array<{
          lot_id: string;
          status: string;
          area_m2: number | null;
          price: number | null;
          total_vistas: number;
          total_favoritos: number;
          total_leads: number;
          ventas: number;
          tasa_conversion_pct: number;
          tasa_cierre_pct: number;
          avg_time_on_page_s: number | null;
          dias_en_mercado: number | null;
        }>;
      }

      // Fallback: calcular en tiempo real
      const [eventsResult, leadsResult] = await Promise.all([
        supabase
          .from("eventos_producto")
          .select("lot_id, event_type")
          .not("lot_id", "is", null),
        supabase
          .from("leads")
          .select("lot_id, funnel_stage")
          .not("lot_id", "is", null),
      ]);

      const events = (eventsResult.data ?? []) as {
        lot_id: string;
        event_type: string;
      }[];
      const leads = (leadsResult.data ?? []) as {
        lot_id: string;
        funnel_stage: string;
      }[];

      // Agrupar métricas por lote
      const metricsMap = new Map<
        string,
        {
          vistas: number;
          favoritos: number;
          contactos: number;
          leads: number;
          ventas: number;
        }
      >();

      for (const ev of events) {
        const m = metricsMap.get(ev.lot_id) ?? {
          vistas: 0,
          favoritos: 0,
          contactos: 0,
          leads: 0,
          ventas: 0,
        };
        if (["page_view", "lote_visto"].includes(ev.event_type)) m.vistas += 1;
        if (ev.event_type === "lote_favorito") m.favoritos += 1;
        if (ev.event_type === "contacto_iniciado") m.contactos += 1;
        metricsMap.set(ev.lot_id, m);
      }

      for (const lead of leads) {
        const m = metricsMap.get(lead.lot_id) ?? {
          vistas: 0,
          favoritos: 0,
          contactos: 0,
          leads: 0,
          ventas: 0,
        };
        m.leads += 1;
        if (lead.funnel_stage === "cerrado_ganado") m.ventas += 1;
        metricsMap.set(lead.lot_id, m);
      }

      return Array.from(metricsMap.entries())
        .map(([lot_id, m]) => ({
          lot_id,
          status: "",
          area_m2: null as number | null,
          price: null as number | null,
          total_vistas: m.vistas,
          total_favoritos: m.favoritos,
          total_leads: m.leads,
          ventas: m.ventas,
          tasa_conversion_pct:
            m.vistas > 0 ? Math.round((m.leads / m.vistas) * 1000) / 10 : 0,
          tasa_cierre_pct:
            m.leads > 0 ? Math.round((m.ventas / m.leads) * 1000) / 10 : 0,
          avg_time_on_page_s: null as number | null,
          dias_en_mercado: null as number | null,
        }))
        .sort((a, b) => b.total_vistas - a.total_vistas);
    },
  });
}

/**
 * Fetch tendencias de tráfico (vistas por día).
 */
export function useTrafficTrends(days = 14) {
  return useQuery({
    queryKey: analyticsKeys.traffic(days),
    queryFn: async () => {
      const cutoff = new Date(
        Date.now() - days * 24 * 60 * 60 * 1000,
      ).toISOString();

      const { data, error } = await supabase
        .from("eventos_producto")
        .select("event_type, viewed_at, session_id")
        .gte("viewed_at", cutoff)
        .in("event_type", ["page_view", "lote_visto"]);

      if (error) throw error;

      const views = (data ?? []) as {
        event_type: string;
        viewed_at: string;
        session_id: string | null;
      }[];

      // Vistas por día
      const viewsTrend = bucketByDay(views, days);

      // Sesiones únicas
      const uniqueSessions = new Set(
        views.filter((v) => v.session_id).map((v) => v.session_id),
      );

      return {
        viewsTrend,
        totalViews: views.length,
        uniqueSessions: uniqueSessions.size,
      };
    },
  });
}

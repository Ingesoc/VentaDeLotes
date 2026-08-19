/**
 * Query hooks para eventos de producto (analytics).
 *
 * Trackea vistas, contactos, favoritos, filtros y otros eventos
 * de la plataforma para alimentar los dashboards de analytics.
 */

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type {
  ProductEvent,
  ProductEventType,
  EventTypeCount,
  TimeSeriesPoint,
} from "../../types/metrics";

// ── Claves de query ──────────────────────────────────────────────

export const eventKeys = {
  all: ["events"] as const,
  list: (days: number) => [...eventKeys.all, "list", days] as const,
  byType: (days: number) => [...eventKeys.all, "by-type", days] as const,
  byLot: (days: number) => [...eventKeys.all, "by-lot", days] as const,
  trend: (days: number, eventType?: string) =>
    [...eventKeys.all, "trend", days, eventType] as const,
};

// ── Queries ──────────────────────────────────────────────────────

/**
 * Fetch eventos de los últimos N días.
 * Retorna la lista de eventos (para tablas y drill-down).
 */
export function useEvents(days = 14, limit = 100) {
  return useQuery({
    queryKey: eventKeys.list(days),
    queryFn: async (): Promise<ProductEvent[]> => {
      const cutoff = new Date(
        Date.now() - days * 24 * 60 * 60 * 1000,
      ).toISOString();

      const { data, error } = await supabase
        .from("eventos_producto")
        .select("*")
        .gte("viewed_at", cutoff)
        .order("viewed_at", { ascending: false })
        .limit(limit);

      if (error) throw error;

      return (data ?? []) as ProductEvent[];
    },
  });
}

/**
 * Fetch conteo de eventos por tipo (últimos N días).
 * Usado para gráficos de distribución de eventos.
 */
export function useEventsByType(days = 14) {
  return useQuery({
    queryKey: eventKeys.byType(days),
    queryFn: async (): Promise<EventTypeCount[]> => {
      const cutoff = new Date(
        Date.now() - days * 24 * 60 * 60 * 1000,
      ).toISOString();

      const { data, error } = await supabase
        .from("eventos_producto")
        .select("event_type")
        .gte("viewed_at", cutoff);

      if (error) throw error;

      const counts: Record<string, number> = {};
      for (const row of data ?? []) {
        const type = (row as { event_type: string }).event_type;
        counts[type] = (counts[type] ?? 0) + 1;
      }

      return Object.entries(counts)
        .map(([event_type, count]) => ({
          event_type: event_type as ProductEventType,
          count,
        }))
        .sort((a, b) => b.count - a.count);
    },
  });
}

/**
 * Fetch eventos agrupados por lote (últimos N días).
 * Retorna ranking de lotes más vistos/más interacción.
 */
export function useEventsByLot(days = 14) {
  return useQuery({
    queryKey: eventKeys.byLot(days),
    queryFn: async () => {
      const cutoff = new Date(
        Date.now() - days * 24 * 60 * 60 * 1000,
      ).toISOString();

      const { data, error } = await supabase
        .from("eventos_producto")
        .select("lot_id, event_type, time_on_page_ms")
        .gte("viewed_at", cutoff)
        .not("lot_id", "is", null);

      if (error) throw error;

      // Agrupar por lote
      const lotMap = new Map<
        string,
        {
          vistas: number;
          favoritos: number;
          contactos: number;
          totalTimeMs: number;
          eventsCount: number;
        }
      >();

      for (const row of data ?? []) {
        const r = row as {
          lot_id: string;
          event_type: string;
          time_on_page_ms: number | null;
        };

        const m = lotMap.get(r.lot_id) ?? {
          vistas: 0,
          favoritos: 0,
          contactos: 0,
          totalTimeMs: 0,
          eventsCount: 0,
        };

        if (["page_view", "lote_visto"].includes(r.event_type)) m.vistas += 1;
        if (r.event_type === "lote_favorito") m.favoritos += 1;
        if (r.event_type === "contacto_iniciado") m.contactos += 1;
        if (r.time_on_page_ms) {
          m.totalTimeMs += r.time_on_page_ms;
          m.eventsCount += 1;
        }

        lotMap.set(r.lot_id, m);
      }

      return Array.from(lotMap.entries())
        .map(([lot_id, m]) => ({
          lot_id,
          vistas: m.vistas,
          favoritos: m.favoritos,
          contactos: m.contactos,
          avgTimeOnPageS:
            m.eventsCount > 0
              ? Math.round(m.totalTimeMs / m.eventsCount / 1000 * 10) / 10
              : null,
          conversionRate:
            m.vistas > 0
              ? Math.round((m.contactos / m.vistas) * 1000) / 10
              : 0,
        }))
        .sort((a, b) => b.vistas - a.vistas);
    },
  });
}

/**
 * Fetch tendencia temporal de un tipo de evento específico.
 * Retorna puntos por día para gráficos de línea.
 */
export function useEventTrend(days = 14, eventType?: ProductEventType) {
  return useQuery({
    queryKey: eventKeys.trend(days, eventType),
    queryFn: async (): Promise<TimeSeriesPoint[]> => {
      const cutoff = new Date(
        Date.now() - days * 24 * 60 * 60 * 1000,
      ).toISOString();

      let query = supabase
        .from("eventos_producto")
        .select("event_type, viewed_at")
        .gte("viewed_at", cutoff);

      if (eventType) {
        query = query.eq("event_type", eventType);
      }

      const { data, error } = await query;
      if (error) throw error;

      // Generar serie vacía
      const series: TimeSeriesPoint[] = [];
      for (let i = days - 1; i >= 0; i--) {
        const date = new Date();
        date.setHours(0, 0, 0, 0);
        date.setDate(date.getDate() - i);
        const key = date.toISOString().slice(0, 10);
        series.push({
          date: key,
          label: date.toLocaleDateString("es-CO", {
            day: "numeric",
            month: "short",
          }),
          count: 0,
        });
      }

      // Llenar con datos reales
      for (const row of data ?? []) {
        const key = new Date(
          (row as { viewed_at: string }).viewed_at,
        )
          .toISOString()
          .slice(0, 10);
        const point = series.find((p) => p.date === key);
        if (point) point.count += 1;
      }

      return series;
    },
  });
}

/**
 * Tipos para la RPC get_admin_stats() del dashboard.
 *
 * La RPC devuelve un objeto JSONB con todas las estadísticas
 * necesarias para el dashboard admin en una sola llamada.
 */

/** Punto de serie temporal (label + count). Compatible con ChartPoint. */
export interface StatsChartPoint {
  label: string;
  count: number;
}

/** KPI de lote más visitado. */
export interface TopLot {
  lot_id: string;
  views: number;
}

/** Lead resumido para el panel del dashboard. */
export interface RecentLead {
  name: string;
  email: string;
  created_at: string;
}

/** Respuesta completa de la RPC get_admin_stats(). */
export interface AdminStats {
  /** Número total de lotes en inventario. */
  total_lots: number;
  /** Número total de leads registrados. */
  total_leads: number;
  /** Número total de eventos/visitas en la tabla eventos_producto. */
  total_views: number;
  /** Número de lotes distintos que tienen al menos un evento registrado. */
  lots_with_views: number;
  /** Serie de visitas por día (últimos N días, días sin datos en 0). */
  views_by_day: StatsChartPoint[];
  /** Serie de leads por día (últimos N días, días sin datos en 0). */
  leads_by_day: StatsChartPoint[];
  /** Distribución de inventario por estado (label + count). */
  lots_by_status: StatsChartPoint[];
  /** Top N lotes más visitados. */
  top_lots: TopLot[];
  /** Últimos N leads registrados. */
  recent_leads: RecentLead[];
}

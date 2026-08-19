/**
 * Tipos para métricas de lotes y eventos de producto.
 */

// ── Evento de producto ───────────────────────────────────────────

export type ProductEventType =
  | "page_view"
  | "lote_visto"
  | "lote_favorito"
  | "contacto_iniciado"
  | "visita_agendada"
  | "formulario_enviado"
  | "formulario_abandonado"
  | "filtro_aplicado"
  | "busqueda_realizada";

/** Fila de la tabla `eventos_producto`. */
export interface ProductEvent {
  id: number;
  lot_id: string | null;
  page_path: string | null;
  event_type: ProductEventType;
  session_id: string | null;
  user_agent: string | null;
  referrer: string | null;
  time_on_page_ms: number | null;
  metadata: Record<string, unknown> | null;
  viewed_at: string;
}

// ── Métricas de lote (vista materializada) ───────────────────────

/** Fila de la vista materializada `lotes_metricas`. */
export interface LotMetrics {
  lot_id: string;
  status: string;
  area_m2: number | null;
  price: number | null;
  total_vistas: number;
  total_favoritos: number;
  contactos_iniciados: number;
  total_leads: number;
  ventas: number;
  tasa_conversion_pct: number;
  tasa_cierre_pct: number;
  avg_time_on_page_s: number | null;
  primera_vista_at: string | null;
  ultima_vista_at: string | null;
  dias_en_mercado: number | null;
}

// ── Estadísticas agregadas para el dashboard ─────────────────────

/** Punto para gráficos temporales (leads/vistas por día). */
export interface TimeSeriesPoint {
  date: string;
  label: string;
  count: number;
}

/** Conteo de eventos por tipo. */
export interface EventTypeCount {
  event_type: ProductEventType;
  count: number;
}

/** Estadísticas de tráfico por período. */
export interface TrafficStats {
  total_views: number;
  unique_sessions: number;
  avg_time_on_page_s: number;
  top_referrers: { referrer: string; count: number }[];
}

/** Resumen del dashboard de analytics. */
export interface AnalyticsDashboard {
  /** Leads totales en el período. */
  totalLeads: number;
  /** Vistas totales en el período. */
  totalViews: number;
  /** Tasa de conversión general (leads / vistas). */
  overallConversionRate: number;
  /** Leads por etapa del embudo. */
  funnelByStage: FunnelStageCount[];
  /** Leads por canal. */
  channelBreakdown: ChannelPerformance[];
  /** Tendencia diaria de leads. */
  leadsTrend: TimeSeriesPoint[];
  /** Tendencia diaria de vistas. */
  viewsTrend: TimeSeriesPoint[];
}

// Re-export from lead.ts for convenience
import type { FunnelStage, FunnelStageCount, ChannelPerformance } from "./lead";
export type { FunnelStage, FunnelStageCount, ChannelPerformance };

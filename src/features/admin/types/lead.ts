/**
 * Tipos para el dominio de leads e interacciones.
 *
 * Estos tipos reflejan exactamente el esquema de Supabase (post-migración
 * analytics-module) y se usan en toda la capa de datos del admin.
 */

// ── Lead ─────────────────────────────────────────────────────────

export type SourceChannel =
  | "organico"
  | "pauta_meta"
  | "pauta_google"
  | "referido"
  | "whatsapp"
  | "feria"
  | "otro";

export type FunnelStage =
  | "nuevo"
  | "contactado"
  | "visita_agendada"
  | "negociando"
  | "cerrado_ganado"
  | "cerrado_perdido";

/** Fila completa de la tabla `leads` en Supabase. */
export interface Lead {
  id: number;
  name: string;
  email: string;
  phone: string;
  message: string | null;
  source_channel: SourceChannel;
  funnel_stage: FunnelStage;
  lot_id: string | null;
  budget_min: number | null;
  budget_max: number | null;
  interest_location: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  last_contact_at: string | null;
  score: number;
  notes: string | null;
  created_at: string;
}

/** Lead con datos de*lote* adjuntos (para tablas enriquecidas). */
export interface LeadWithLot extends Lead {
  /** Datos del lote de interés (null si lot_id es null o el lote fue borrado). */
  lot: {
    id: string;
    area_m2: number | null;
    price: number | null;
    status: string;
  } | null;
}

/** Lead resumido para el panel de leads (sin campos pesados). */
export interface LeadSummary {
  id: number;
  name: string;
  email: string;
  phone: string;
  source_channel: SourceChannel;
  funnel_stage: FunnelStage;
  lot_id: string | null;
  score: number;
  last_contact_at: string | null;
  created_at: string;
}

// ── Interacción ──────────────────────────────────────────────────

export type InteractionType =
  | "llamada"
  | "mensaje_whatsapp"
  | "mensaje_email"
  | "visita_lote"
  | "visita_web"
  | "formulario_enviado";

export type InteractionChannel =
  | "telefono"
  | "whatsapp"
  | "email"
  | "presencial"
  | "web";

/** Fila de la tabla `interacciones`. */
export interface Interaction {
  id: number;
  lead_id: number;
  tipo: InteractionType;
  canal: InteractionChannel | null;
  notas: string | null;
  created_at: string;
}

// ── Filtros ──────────────────────────────────────────────────────

/** Filtros para la tabla de leads del admin. */
export interface LeadFilters {
  /** Filtrar por etapa del embudo. */
  stage?: FunnelStage;
  /** Filtrar por canal de adquisición. */
  channel?: SourceChannel;
  /** Filtrar por lote de interés. */
  lotId?: string;
  /** Buscar por nombre, email o teléfono (búsqueda parcial). */
  search?: string;
  /** Rango de fechas — inicio. */
  dateFrom?: string;
  /** Rango de fechas — fin. */
  dateTo?: string;
  /** Ordenar por campo. */
  sortBy?: "created_at" | "score" | "last_contact_at" | "name";
  /** Dirección del orden. */
  sortDirection?: "asc" | "desc";
  /** Página actual (para paginación). */
  page?: number;
  /** Tamaño de página. */
  pageSize?: number;
}

// ── Resumen para el admin ────────────────────────────────────────

/** Conteo de leads por etapa del embudo. */
export interface FunnelStageCount {
  stage: FunnelStage;
  count: number;
}

/** Resumen por canal de adquisición. */
export interface ChannelPerformance {
  channel: SourceChannel;
  total_leads: number;
  closed_won: number;
  closed_lost: number;
  conversion_rate: number;
}

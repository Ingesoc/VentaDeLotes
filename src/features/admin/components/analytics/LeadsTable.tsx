/**
 * LeadsTable — tabla filtrable/ordenable de leads.
 *
 * Usa HTML table puro + TanStack Query para fetching.
 * El sorting y filtering se hace en Supabase (server-side) para
 * escalabilidad con muchos leads.
 */

import { useState } from "react";
import { Loader2, Phone, Mail, ArrowUpDown } from "lucide-react";
import { useLeads } from "../../data/queries/leads";
import { useUpdateLeadStage } from "../../data/mutations/leads";
import type {
  FunnelStage,
  SourceChannel,
} from "../../types/lead";

// ── Labels ──────────────────────────────────────────────────────

const STAGE_LABELS: Record<FunnelStage, string> = {
  nuevo: "Nuevo",
  contactado: "Contactado",
  visita_agendada: "Visita Agendada",
  negociando: "Negociando",
  cerrado_ganado: "Cerrado Ganado",
  cerrado_perdido: "Cerrado Perdido",
};

const STAGE_COLORS: Record<FunnelStage, string> = {
  nuevo: "bg-blue-100 text-blue-800",
  contactado: "bg-yellow-100 text-yellow-800",
  visita_agendada: "bg-purple-100 text-purple-800",
  negociando: "bg-orange-100 text-orange-800",
  cerrado_ganado: "bg-green-100 text-green-800",
  cerrado_perdido: "bg-gray-100 text-gray-600",
};

const CHANNEL_LABELS: Record<SourceChannel, string> = {
  organico: "Orgánico",
  pauta_meta: "Meta",
  pauta_google: "Google",
  referido: "Referido",
  whatsapp: "WhatsApp",
  feria: "Feria",
  otro: "Otro",
};

const STAGE_ORDER: FunnelStage[] = [
  "nuevo",
  "contactado",
  "visita_agendada",
  "negociando",
  "cerrado_ganado",
  "cerrado_perdido",
];

// ── Component ────────────────────────────────────────────────────

interface LeadsTableProps {
  externalFilters?: {
    stage?: FunnelStage;
    channel?: SourceChannel;
    search?: string;
  };
}

export function LeadsTable({ externalFilters }: LeadsTableProps) {
  const [search, setSearch] = useState("");
  const [stageFilter, setStageFilter] = useState<FunnelStage | "">(
    externalFilters?.stage ?? "",
  );
  const [channelFilter, setChannelFilter] = useState<SourceChannel | "">(
    externalFilters?.channel ?? "",
  );
  const [sortBy, setSortBy] = useState<"created_at" | "score" | "name">("created_at");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const effectiveSearch = search || (externalFilters?.search ?? "");

  const { data, isLoading, error } = useLeads({
    stage: stageFilter || undefined,
    channel: channelFilter || undefined,
    search: effectiveSearch || undefined,
    sortBy,
    sortDirection: sortDir,
    pageSize: 50,
  });

  const updateStage = useUpdateLeadStage();
  const leads = data?.leads ?? [];

  const handleSort = (field: "created_at" | "score" | "name") => {
    if (sortBy === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(field);
      setSortDir("desc");
    }
  };

  // ── Loading / Error states ────────────────────────────────

  if (isLoading) {
    return (
      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 p-6">
        <div className="flex items-center justify-center h-48">
          <Loader2 className="w-6 h-6 animate-spin text-heritage-gold" />
          <span className="ml-2 text-on-surface-variant">Cargando leads...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 p-6">
        <div className="flex items-center justify-center h-48 text-red-600">
          <p>Error cargando leads. Verifica la conexión.</p>
        </div>
      </div>
    );
  }

  // ── Render ────────────────────────────────────────────────

  return (
    <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/20">
      {/* Header con filtros */}
      <div className="p-4 border-b border-outline-variant/20 space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nombre, email o teléfono..."
              className="w-full bg-transparent border border-outline-variant/30 rounded-lg px-4 py-2 text-body-md pl-10 focus:ring-2 focus:ring-heritage-gold focus:border-transparent"
            />
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
          </div>

          <select
            value={stageFilter}
            onChange={(e) => setStageFilter(e.target.value as FunnelStage | "")}
            className="bg-transparent border border-outline-variant/30 rounded-lg px-3 py-2 text-caption"
          >
            <option value="">Todas las etapas</option>
            {STAGE_ORDER.map((s) => (
              <option key={s} value={s}>
                {STAGE_LABELS[s]}
              </option>
            ))}
          </select>

          <select
            value={channelFilter}
            onChange={(e) =>
              setChannelFilter(e.target.value as SourceChannel | "")
            }
            className="bg-transparent border border-outline-variant/30 rounded-lg px-3 py-2 text-caption"
          >
            <option value="">Todos los canales</option>
            {Object.entries(CHANNEL_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <p className="text-caption text-on-surface-variant">
          {data?.total ?? 0} leads encontrados
        </p>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-outline-variant/20">
              <th className="text-left py-3 px-3 text-label-bold font-label-bold text-primary">
                Nombre
              </th>
              <th className="text-left py-3 px-3 text-label-bold font-label-bold text-primary">
                Teléfono
              </th>
              <th className="text-left py-3 px-3 text-label-bold font-label-bold text-primary">
                Canal
              </th>
              <th className="text-left py-3 px-3 text-label-bold font-label-bold text-primary">
                Etapa
              </th>
              <th className="text-left py-3 px-3 text-label-bold font-label-bold text-primary">
                Lote
              </th>
              <th
                className="text-left py-3 px-3 text-label-bold font-label-bold text-primary cursor-pointer hover:text-heritage-gold"
                onClick={() => handleSort("score")}
              >
                Score <ArrowUpDown className={`w-3 h-3 inline ml-1 ${sortBy === "score" ? "text-primary" : "opacity-40"}`} />
              </th>
              <th className="text-left py-3 px-3 text-label-bold font-label-bold text-primary">
                Último Contacto
              </th>
              <th
                className="text-left py-3 px-3 text-label-bold font-label-bold text-primary cursor-pointer hover:text-heritage-gold"
                onClick={() => handleSort("created_at")}
              >
                Creado <ArrowUpDown className={`w-3 h-3 inline ml-1 ${sortBy === "created_at" ? "text-primary" : "opacity-40"}`} />
              </th>
            </tr>
          </thead>
          <tbody>
            {leads.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  className="py-12 text-center text-on-surface-variant"
                >
                  No se encontraron leads con los filtros seleccionados.
                </td>
              </tr>
            ) : (
              leads.map((lead) => (
                <tr
                  key={lead.id}
                  className="border-b border-outline-variant/10 hover:bg-surface-container/50 transition-colors"
                >
                  <td className="py-3 px-3">
                    <p className="font-medium text-primary">{lead.name}</p>
                    <p className="text-caption text-on-surface-variant">
                      {lead.email}
                    </p>
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-1 text-on-surface-variant">
                      <Phone className="w-3 h-3" />
                      {lead.phone}
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <span className="text-caption bg-surface-container px-2 py-1 rounded-full">
                      {CHANNEL_LABELS[lead.source_channel] ?? lead.source_channel}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <select
                      value={lead.funnel_stage}
                      onChange={(e) =>
                        updateStage.mutate({
                          leadId: lead.id,
                          newStage: e.target.value as FunnelStage,
                        })
                      }
                      disabled={updateStage.isPending}
                      className={`text-caption font-bold px-2 py-1 rounded-full border-0 cursor-pointer ${STAGE_COLORS[lead.funnel_stage]}`}
                    >
                      {STAGE_ORDER.map((s) => (
                        <option key={s} value={s}>
                          {STAGE_LABELS[s]}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="py-3 px-3">
                    {lead.lot_id ? (
                      <span className="font-label-bold text-primary">
                        {lead.lot_id}
                      </span>
                    ) : (
                      <span className="text-on-surface-variant">—</span>
                    )}
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <div className="w-12 h-1.5 bg-surface-container rounded-full overflow-hidden">
                        <div
                          className="h-full bg-heritage-gold rounded-full"
                          style={{ width: `${lead.score}%` }}
                        />
                      </div>
                      <span className="text-caption text-on-surface-variant">
                        {lead.score}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    {lead.last_contact_at ? (
                      <span className="text-caption text-on-surface-variant">
                        {new Date(lead.last_contact_at).toLocaleDateString("es-CO", {
                          day: "numeric",
                          month: "short",
                        })}
                      </span>
                    ) : (
                      <span className="text-on-surface-variant">—</span>
                    )}
                  </td>
                  <td className="py-3 px-3">
                    <span className="text-caption text-on-surface-variant">
                      {new Date(lead.created_at).toLocaleDateString("es-CO", {
                        day: "numeric",
                        month: "short",
                        year: "2-digit",
                      })}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

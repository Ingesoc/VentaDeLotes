/**
 * FunnelChart — visualización del embudo de conversión.
 *
 * Muestra las etapas del funnel (nuevo → contactado → visita → negociando → cierre)
 * como un embudo horizontal con tasas de conversión entre etapas.
 */

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from "recharts";
import { Loader2, TrendingDown } from "lucide-react";
import { useFunnelData } from "../../data/queries/funnel";
import type { DateRangePreset } from "./DateRangeFilter";
import { getPresetDays } from "./dateRangeHelpers";

interface FunnelChartProps {
  datePreset: DateRangePreset;
}

const STAGE_LABELS: Record<string, string> = {
  nuevo: "Nuevo",
  contactado: "Contactado",
  visita_agendada: "Visita Agendada",
  negociando: "Negociando",
  cerrado_ganado: "Cerrado Ganado",
  cerrado_perdido: "Cerrado Perdido",
};

const STAGE_COLORS = [
  "#2D6A4F", // nuevo — verde fuerte
  "#40916C", // contactado
  "#52B788", // visita_agendada
  "#D4A373", // negociando — dorado
  "#1B4332", // cerrado_ganado — verde oscuro
  "#9CA3AF", // cerrado_perdido — gris
];

const CHART_TOOLTIP_STYLE = {
  backgroundColor: "#FAFAF8",
  border: "1px solid rgba(27,67,50,0.2)",
  borderRadius: 8,
  fontSize: 13,
  color: "#1B4332",
};

export function FunnelChart({ datePreset }: FunnelChartProps) {
  const days = getPresetDays(datePreset);
  const { data, isLoading, error } = useFunnelData(days);

  if (isLoading) {
    return (
      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 p-6">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-6 h-6 animate-spin text-heritage-gold" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 p-6">
        <div className="flex items-center justify-center h-64 text-red-600">
          <p>Error cargando datos del embudo.</p>
        </div>
      </div>
    );
  }

  const stages = data?.stages ?? [];
  const conversionRates = data?.conversionRates ?? [];
  const hasData = stages.some((s) => s.count > 0);

  return (
    <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 p-6">
      <h3 className="text-headline-md font-headline-md text-primary mb-2">
        Embudo de Conversión
      </h3>
      <p className="text-caption text-on-surface-variant mb-6">
        Últimos {days} días · {data?.totalLeads ?? 0} leads totales
      </p>

      {!hasData ? (
        <div className="flex flex-col items-center justify-center h-48 text-on-surface-variant gap-2">
          <TrendingDown className="w-8 h-8 opacity-40" />
          <p>No hay leads en el embudo para este período.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Gráfico de barras horizontal */}
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={stages}
                layout="vertical"
                margin={{ top: 0, right: 30, left: 100, bottom: 0 }}
              >
                <XAxis
                  type="number"
                  allowDecimals={false}
                  tick={{ fontSize: 11, fill: "#6B7280" }}
                />
                <YAxis
                  type="category"
                  dataKey="stage"
                  tickFormatter={(v: string) => STAGE_LABELS[v] ?? v}
                  tick={{ fontSize: 12, fill: "#1B4332" }}
                  width={90}
                />
                <Tooltip
                  contentStyle={CHART_TOOLTIP_STYLE}
                  formatter={(value) => [value, "Leads"]}
                  labelFormatter={(label) => STAGE_LABELS[String(label)] ?? String(label)}
                />
                <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                  {stages.map((_, index) => (
                    <Cell
                      key={stages[index].stage}
                      fill={STAGE_COLORS[index % STAGE_COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Tasas de conversión entre etapas */}
          <div className="border-t border-outline-variant/20 pt-4">
            <h4 className="text-label-bold font-label-bold text-primary mb-3">
              Conversión entre etapas
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {conversionRates.slice(1).map((cr, i) => (
                <div
                  key={cr.stage}
                  className="bg-surface rounded-lg p-3 text-center"
                >
                  <p className="text-body-lg font-bold text-primary">
                    {cr.count > 0 && conversionRates[i]?.count > 0
                      ? `${Math.round((cr.count / conversionRates[i].count) * 100)}%`
                      : "—"}
                  </p>
                  <p className="text-caption text-on-surface-variant">
                    {STAGE_LABELS[cr.stage]}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

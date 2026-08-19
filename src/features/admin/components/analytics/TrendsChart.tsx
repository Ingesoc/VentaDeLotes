/**
 * TrendsChart — tendencias temporales de leads y vistas.
 *
 * Muestra gráficos de línea con leads nuevos y vistas por día,
 * útil para detectar patrones y cohortes temporales.
 */

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import { Loader2, TrendingUp } from "lucide-react";
import { useFunnelData } from "../../data/queries/funnel";
import { useTrafficTrends } from "../../data/queries/funnel";
import type { DateRangePreset } from "./DateRangeFilter";
import { getPresetDays } from "./dateRangeHelpers";

interface TrendsChartProps {
  datePreset: DateRangePreset;
}

const CHART_TOOLTIP_STYLE = {
  backgroundColor: "#FAFAF8",
  border: "1px solid rgba(27,67,50,0.2)",
  borderRadius: 8,
  fontSize: 13,
  color: "#1B4332",
};

export function TrendsChart({ datePreset }: TrendsChartProps) {
  const days = getPresetDays(datePreset);

  const {
    data: funnelData,
    isLoading: funnelLoading,
  } = useFunnelData(days);

  const {
    data: trafficData,
    isLoading: trafficLoading,
  } = useTrafficTrends(days);

  const isLoading = funnelLoading || trafficLoading;

  if (isLoading) {
    return (
      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 p-6">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-6 h-6 animate-spin text-heritage-gold" />
        </div>
      </div>
    );
  }

  const leadsTrend = funnelData?.leadsTrend ?? [];
  const viewsTrend = trafficData?.viewsTrend ?? [];

  // Merge leads + views por día
  const mergedData = leadsTrend.map((pt, i) => ({
    date: pt.label,
    Leads: pt.count,
    Visitas: viewsTrend[i]?.count ?? 0,
  }));

  const hasData = mergedData.some((d) => d.Leads > 0 || d.Visitas > 0);

  return (
    <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 p-6">
      <h3 className="text-headline-md font-headline-md text-primary mb-2">
        Tendencias Temporales
      </h3>
      <p className="text-caption text-on-surface-variant mb-6">
        Leads nuevos y vistas por día · Últimos {days} días
      </p>

      {!hasData ? (
        <div className="flex flex-col items-center justify-center h-48 text-on-surface-variant gap-2">
          <TrendingUp className="w-8 h-8 opacity-40" />
          <p>No hay datos de tendencias para este período.</p>
        </div>
      ) : (
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={mergedData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(27,67,50,0.1)" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11, fill: "#6B7280" }}
                interval="preserveStartEnd"
              />
              <YAxis
                allowDecimals={false}
                tick={{ fontSize: 11, fill: "#6B7280" }}
                width={30}
              />
              <Tooltip contentStyle={CHART_TOOLTIP_STYLE} />
              <Legend />
              <Line
                type="monotone"
                dataKey="Visitas"
                stroke="#2D6A4F"
                strokeWidth={2}
                dot={{ r: 3, fill: "#2D6A4F" }}
              />
              <Line
                type="monotone"
                dataKey="Leads"
                stroke="#D4A373"
                strokeWidth={2}
                dot={{ r: 3, fill: "#D4A373" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* KPIs resumen */}
      <div className="grid grid-cols-3 gap-4 mt-6 border-t border-outline-variant/20 pt-4">
        <div className="text-center">
          <p className="text-2xl font-bold text-primary">
            {trafficData?.totalViews ?? 0}
          </p>
          <p className="text-caption text-on-surface-variant">Vistas totales</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-primary">
            {trafficData?.uniqueSessions ?? 0}
          </p>
          <p className="text-caption text-on-surface-variant">Sesiones únicas</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-primary">
            {funnelData?.totalLeads ?? 0}
          </p>
          <p className="text-caption text-on-surface-variant">Leads nuevos</p>
        </div>
      </div>
    </div>
  );
}

/**
 * ChannelPerformance — rendimiento por canal de adquisición.
 *
 * Muestra un bar chart con leads por canal (orgánico, pauta, referido, etc.)
 * y KPIs de tasa de cierre por canal.
 */

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import { Loader2, Megaphone } from "lucide-react";
import { useChannelAnalytics } from "../../data/queries/funnel";

const CHANNEL_LABELS: Record<string, string> = {
  organico: "Orgánico",
  pauta_meta: "Pauta Meta",
  pauta_google: "Pauta Google",
  referido: "Referido",
  whatsapp: "WhatsApp",
  feria: "Feria",
  otro: "Otro",
};

const CHANNEL_COLORS: Record<string, string> = {
  organico: "#2D6A4F",
  pauta_meta: "#1877F2",
  pauta_google: "#4285F4",
  referido: "#D4A373",
  whatsapp: "#25D366",
  feria: "#E74C3C",
  otro: "#9CA3AF",
};

const CHART_TOOLTIP_STYLE = {
  backgroundColor: "#FAFAF8",
  border: "1px solid rgba(27,67,50,0.2)",
  borderRadius: 8,
  fontSize: 13,
  color: "#1B4332",
};

export function ChannelPerformance() {
  const { data, isLoading, error } = useChannelAnalytics();

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
          <p>Error cargando datos por canal.</p>
        </div>
      </div>
    );
  }

  const channels = data ?? [];
  const hasData = channels.length > 0;

  // Preparar datos para el gráfico
  const chartData = channels.map((ch) => ({
    name: CHANNEL_LABELS[ch.channel] ?? ch.channel,
    Leads: ch.totalLeads,
    "Cerrados": ch.closedWon,
    Perdidos: ch.closedLost,
    channel: ch.channel,
  }));

  return (
    <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 p-6">
      <h3 className="text-headline-md font-headline-md text-primary mb-2">
        Rendimiento por Canal
      </h3>
      <p className="text-caption text-on-surface-variant mb-6">
        Leads generados y tasa de cierre por canal de adquisición
      </p>

      {!hasData ? (
        <div className="flex flex-col items-center justify-center h-48 text-on-surface-variant gap-2">
          <Megaphone className="w-8 h-8 opacity-40" />
          <p>No hay datos de canales disponibles.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Gráfico de barras agrupado */}
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(27,67,50,0.1)" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11, fill: "#6B7280" }}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 11, fill: "#6B7280" }}
                  width={30}
                />
                <Tooltip contentStyle={CHART_TOOLTIP_STYLE} />
                <Legend />
                <Bar dataKey="Leads" fill="#2D6A4F" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Cerrados" fill="#40916C" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Perdidos" fill="#D4A373" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* KPIs por canal */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {channels.map((ch) => (
              <div
                key={ch.channel}
                className="bg-surface rounded-lg p-4 border border-outline-variant/10"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{
                      backgroundColor: CHANNEL_COLORS[ch.channel] ?? "#9CA3AF",
                    }}
                  />
                  <span className="text-label-bold font-label-bold text-primary text-sm">
                    {CHANNEL_LABELS[ch.channel] ?? ch.channel}
                  </span>
                </div>
                <p className="text-2xl font-bold text-primary">{ch.totalLeads}</p>
                <p className="text-caption text-on-surface-variant">leads</p>
                <div className="mt-2 flex items-center gap-2">
                  <span
                    className={`text-caption font-bold ${
                      ch.conversionRate > 0
                        ? "text-coffee-green"
                        : "text-on-surface-variant"
                    }`}
                  >
                    {ch.conversionRate}% cierre
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

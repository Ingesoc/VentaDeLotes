/**
 * LotsRanking — ranking de lotes por métricas de interés.
 *
 * Muestra los lotes ordenados por vistas, con métricas de conversión
 * y favoritos. Detecta desalineación entre interés y cierre.
 */

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { Loader2, Trophy } from "lucide-react";
import { useLotsRanking } from "../../data/queries/funnel";

const CHART_TOOLTIP_STYLE = {
  backgroundColor: "#FAFAF8",
  border: "1px solid rgba(27,67,50,0.2)",
  borderRadius: 8,
  fontSize: 13,
  color: "#1B4332",
};

export function LotsRanking() {
  const { data, isLoading, error } = useLotsRanking();

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
          <p>Error cargando ranking de lotes.</p>
        </div>
      </div>
    );
  }

  const lots = data ?? [];
  const hasData = lots.length > 0;

  // Top 10 para el gráfico
  const topLots = lots.slice(0, 10);
  const chartData = topLots.map((l) => ({
    name: `Lote ${l.lot_id}`,
    Visitas: l.total_vistas,
    Leads: l.total_leads,
    Favoritos: l.total_favoritos,
    lot_id: l.lot_id,
  }));

  return (
    <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 p-6">
      <h3 className="text-headline-md font-headline-md text-primary mb-2">
        Ranking de Lotes
      </h3>
      <p className="text-caption text-on-surface-variant mb-6">
        Lotes más visitados vs. lotes con más conversión
      </p>

      {!hasData ? (
        <div className="flex flex-col items-center justify-center h-48 text-on-surface-variant gap-2">
          <Trophy className="w-8 h-8 opacity-40" />
          <p>No hay métricas de lotes disponibles.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Gráfico de barras */}
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
                <Bar dataKey="Visitas" fill="#2D6A4F" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Leads" fill="#D4A373" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Favoritos" fill="#40916C" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Tabla de ranking */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-outline-variant/20">
                  <th className="text-left py-3 px-2 text-label-bold font-label-bold text-primary">
                    #
                  </th>
                  <th className="text-left py-3 px-2 text-label-bold font-label-bold text-primary">
                    Lote
                  </th>
                  <th className="text-right py-3 px-2 text-label-bold font-label-bold text-primary">
                    Visitas
                  </th>
                  <th className="text-right py-3 px-2 text-label-bold font-label-bold text-primary">
                    Leads
                  </th>
                  <th className="text-right py-3 px-2 text-label-bold font-label-bold text-primary">
                    Favoritos
                  </th>
                  <th className="text-right py-3 px-2 text-label-bold font-label-bold text-primary">
                    Conversión
                  </th>
                  <th className="text-right py-3 px-2 text-label-bold font-label-bold text-primary">
                    Cierre
                  </th>
                </tr>
              </thead>
              <tbody>
                {lots.map((lot, i) => (
                  <tr
                    key={lot.lot_id}
                    className="border-b border-outline-variant/10 hover:bg-surface-container/50"
                  >
                    <td className="py-3 px-2">
                      <span
                        className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center ${
                          i < 3
                            ? "bg-heritage-gold text-primary"
                            : "bg-surface-container text-on-surface-variant"
                        }`}
                      >
                        {i + 1}
                      </span>
                    </td>
                    <td className="py-3 px-2 font-label-bold text-primary">
                      Lote {lot.lot_id}
                    </td>
                    <td className="py-3 px-2 text-right text-on-surface">
                      {lot.total_vistas.toLocaleString()}
                    </td>
                    <td className="py-3 px-2 text-right text-on-surface">
                      {lot.total_leads.toLocaleString()}
                    </td>
                    <td className="py-3 px-2 text-right text-on-surface">
                      {lot.total_favoritos.toLocaleString()}
                    </td>
                    <td className="py-3 px-2 text-right">
                      <span
                        className={`font-bold ${
                          lot.tasa_conversion_pct > 5
                            ? "text-coffee-green"
                            : lot.tasa_conversion_pct > 0
                              ? "text-heritage-gold"
                              : "text-on-surface-variant"
                        }`}
                      >
                        {lot.tasa_conversion_pct}%
                      </span>
                    </td>
                    <td className="py-3 px-2 text-right">
                      <span
                        className={`font-bold ${
                          lot.tasa_cierre_pct > 10
                            ? "text-coffee-green"
                            : lot.tasa_cierre_pct > 0
                              ? "text-heritage-gold"
                              : "text-on-surface-variant"
                        }`}
                      >
                        {lot.tasa_cierre_pct}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

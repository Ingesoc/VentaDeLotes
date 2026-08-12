// Este archivo ya se carga de forma diferida (lazy) desde DashboardPage, que a
// su vez es lazy por ruta: recharts solo entra en el bundle del dashboard.
// react-doctor-disable-next-line prefer-dynamic-import
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

export interface ChartPoint {
  label: string;
  count: number;
}

interface DashboardChartsProps {
  viewsByDay: ChartPoint[];
  leadsByDay: ChartPoint[];
  lotsByStatus: ChartPoint[];
  days: number;
}

const STATUS_COLORS: Record<string, string> = {
  disponible: "#1B4332",
  reservado: "#D4A373",
  vendido: "#081C15",
  no_disponible: "#9CA3AF",
};

const CHART_TOOLTIP_STYLE = {
  backgroundColor: "#FAFAF8",
  border: "1px solid rgba(27,67,50,0.2)",
  borderRadius: 8,
  fontSize: 13,
  color: "#1B4332",
};

export function DashboardCharts({
  viewsByDay,
  leadsByDay,
  lotsByStatus,
  days,
}: DashboardChartsProps) {
  const hasViews = viewsByDay.some((point) => point.count > 0);
  const hasLeads = leadsByDay.some((point) => point.count > 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 p-6">
        <h3 className="text-headline-md font-headline-md text-primary mb-6">
          Visitas de los últimos {days} días
        </h3>
        {hasViews ? (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={viewsByDay}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(27,67,50,0.1)" />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 11, fill: "#6B7280" }}
                  interval="preserveStartEnd"
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 11, fill: "#6B7280" }}
                  width={30}
                />
                <Tooltip
                  cursor={{ fill: "rgba(27,67,50,0.06)" }}
                  contentStyle={CHART_TOOLTIP_STYLE}
                />
                <Bar
                  dataKey="count"
                  name="Visitas"
                  fill="#2D6A4F"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p className="text-on-surface-variant text-body-md">
            No hay visitas registradas en los últimos {days} días.
          </p>
        )}
      </div>

      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 p-6">
        <h3 className="text-headline-md font-headline-md text-primary mb-6">
          Leads de los últimos {days} días
        </h3>
        {hasLeads ? (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={leadsByDay}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(27,67,50,0.1)" />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 11, fill: "#6B7280" }}
                  interval="preserveStartEnd"
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 11, fill: "#6B7280" }}
                  width={30}
                />
                <Tooltip contentStyle={CHART_TOOLTIP_STYLE} />
                <Line
                  type="monotone"
                  dataKey="count"
                  name="Leads"
                  stroke="#D4A373"
                  strokeWidth={2}
                  dot={{ r: 3, fill: "#D4A373" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p className="text-on-surface-variant text-body-md">
            No hay leads registrados en los últimos {days} días.
          </p>
        )}
      </div>

      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 p-6 lg:col-span-2">
        <h3 className="text-headline-md font-headline-md text-primary mb-6">
          Lotes por estado
        </h3>
        {lotsByStatus.length > 0 ? (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={lotsByStatus}
                  dataKey="count"
                  nameKey="label"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={90}
                  paddingAngle={3}
                  label={(props) => {
                    const datum = props.payload as
                      | { label?: string; count?: number }
                      | undefined;
                    return `${datum?.label ?? ""}: ${datum?.count ?? 0}`;
                  }}
                >
                  {lotsByStatus.map((entry) => (
                    <Cell
                      key={entry.label}
                      fill={STATUS_COLORS[entry.label] ?? "#9CA3AF"}
                    />
                  ))}
                </Pie>
                <Tooltip contentStyle={CHART_TOOLTIP_STYLE} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p className="text-on-surface-variant text-body-md">
            No hay lotes registrados.
          </p>
        )}
      </div>
    </div>
  );
}

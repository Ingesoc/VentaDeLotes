import { lazy, Suspense } from "react";
import { Eye, MessageSquare, TrendingUp, Warehouse } from "lucide-react";
import { useAdminStats } from "./data/queries/admin-stats";

// Los gráficos (Recharts) se cargan de forma diferida: solo entran en el
// bundle del dashboard, que ya es lazy por ruta.
const DashboardCharts = lazy(() =>
  import("./DashboardCharts").then((m) => ({ default: m.DashboardCharts })),
);

const DAYS = 14;

export function Component() {
  return <DashboardPage />;
}

export function DashboardPage() {
  const {
    data: stats,
    isLoading,
    error,
  } = useAdminStats(DAYS);

  // ── Estado de carga global ────────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-heritage-gold border-t-transparent rounded-full animate-spin" />
          <p className="text-on-surface-variant">Cargando estadísticas...</p>
        </div>
      </div>
    );
  }

  // ── Estado de error global ────────────────────────────────────
  if (error || !stats) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-headline-lg font-headline-lg text-primary">
            Dashboard
          </h1>
          <p className="text-body-md text-on-surface-variant mt-1">
            Resumen general del sitio
          </p>
        </div>
        <div className="bg-red-50 text-red-700 rounded-xl p-6 text-body-md">
          <p className="font-semibold mb-1">Error cargando estadísticas</p>
          <p className="text-sm">
            {error?.message ?? "No se pudieron cargar los datos. Verifica la conexión con Supabase."}
          </p>
        </div>
      </div>
    );
  }

  // ── Datos listos ──────────────────────────────────────────────
  const cards = [
    {
      label: "Total Lotes",
      value: stats.total_lots,
      icon: Warehouse,
      color: "bg-primary/10 text-primary",
    },
    {
      label: "Leads Recibidos",
      value: stats.total_leads,
      icon: MessageSquare,
      color: "bg-heritage-gold/10 text-heritage-gold",
    },
    {
      label: "Visitas a Páginas",
      value: stats.total_views,
      icon: Eye,
      color: "bg-coffee-green/10 text-coffee-green",
    },
    {
      label: "Lotes con Visitas",
      value: stats.lots_with_views,
      icon: TrendingUp,
      color: "bg-primary/10 text-primary",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-headline-lg font-headline-lg text-primary">
          Dashboard
        </h1>
        <p className="text-body-md text-on-surface-variant mt-1">
          Resumen general del sitio
        </p>
      </div>

      {/* Tarjetas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => (
          <div
            key={card.label}
            className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 p-6 flex items-start gap-4"
          >
            <div className={`p-3 rounded-lg ${card.color}`}>
              <card.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-primary">{card.value}</p>
              <p className="text-caption text-on-surface-variant">
                {card.label}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Gráficos (carga diferida) */}
      <Suspense
        fallback={
          <div className="h-64 flex items-center justify-center text-on-surface-variant">
            Cargando gráficos...
          </div>
        }
      >
        <DashboardCharts
          viewsByDay={stats.views_by_day}
          leadsByDay={stats.leads_by_day}
          lotsByStatus={stats.lots_by_status}
          days={DAYS}
        />
      </Suspense>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Más vistos */}
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 p-6">
          <h3 className="text-headline-md font-headline-md text-primary mb-6">
            Lotes más visitados
          </h3>
          {stats.top_lots.length === 0 ? (
            <p className="text-on-surface-variant text-body-md">
              No hay visitas registradas aún.
            </p>
          ) : (
            <div className="space-y-4">
              {stats.top_lots.map((lot, i) => (
                <div
                  key={lot.lot_id}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-deep-forest text-on-primary text-xs font-bold flex items-center justify-center">
                      {i + 1}
                    </span>
                    <span className="font-label-bold text-primary">
                      Lote {lot.lot_id}
                    </span>
                  </div>
                  <span className="flex items-center gap-1 text-body-md text-on-surface-variant">
                    <Eye className="w-4 h-4" />
                    {lot.views} visitas
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Leads recientes */}
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 p-6">
          <h3 className="text-headline-md font-headline-md text-primary mb-6">
            Últimos leads
          </h3>
          {stats.recent_leads.length === 0 ? (
            <p className="text-on-surface-variant text-body-md">
              No hay leads registrados aún.
            </p>
          ) : (
            <div className="space-y-4">
              {stats.recent_leads.map((lead) => (
                <div
                  key={lead.email}
                  className="flex items-center justify-between"
                >
                  <div>
                    <p className="font-label-bold text-primary">{lead.name}</p>
                    <p className="text-caption text-on-surface-variant">
                      {lead.email}
                    </p>
                  </div>
                  <span className="text-caption text-on-surface-variant">
                    {new Date(lead.created_at).toLocaleDateString("es-CO", {
                      day: "numeric",
                      month: "short",
                    })}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

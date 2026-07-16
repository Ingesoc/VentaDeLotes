import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  Eye,
  MessageSquare,
  TrendingUp,
  Warehouse,
} from "lucide-react";

interface DashboardStats {
  totalLots: number;
  totalLeads: number;
  totalPageViews: number;
  mostViewedLots: { lot_id: string; views: number }[];
  recentLeads: { name: string; email: string; created_at: string }[];
}

export function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Ejecutar consultas independientes en paralelo
        const [
          { count: totalLots },
          { count: totalLeads },
          { count: totalPageViews },
          { data: viewsData },
          { data: recentLeadsData },
        ] = await Promise.all([
          supabase.from("lots").select("*", { count: "exact", head: true }),
          supabase.from("leads").select("*", { count: "exact", head: true }),
          supabase.from("page_views").select("*", { count: "exact", head: true }),
          supabase.from("page_views").select("lot_id").not("lot_id", "is", null),
          supabase.from("leads").select("name, email, created_at").order("created_at", { ascending: false }).limit(5),
        ]);

        const viewCounts: Record<string, number> = {};
        viewsData?.forEach((v) => {
          if (v.lot_id) viewCounts[v.lot_id] = (viewCounts[v.lot_id] || 0) + 1;
        });

        const mostViewedLots = Object.entries(viewCounts)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 5)
          .map(([lot_id, views]) => ({ lot_id, views }));

        setStats({
          totalLots: totalLots ?? 0,
          totalLeads: totalLeads ?? 0,
          totalPageViews: totalPageViews ?? 0,
          mostViewedLots,
          recentLeads: recentLeadsData ?? [],
        });
      } catch (err) {
        console.error("Error fetching dashboard stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-heritage-gold border-t-transparent rounded-full animate-spin" />
          <p className="text-on-surface-variant">Cargando estadísticas...</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-16">
        <p className="text-on-surface-variant">
          No se pudieron cargar las estadísticas. Verifica la conexión con Supabase.
        </p>
      </div>
    );
  }

  const cards = [
    {
      label: "Total Lotes",
      value: stats.totalLots,
      icon: Warehouse,
      color: "bg-primary/10 text-primary",
    },
    {
      label: "Leads Recibidos",
      value: stats.totalLeads,
      icon: MessageSquare,
      color: "bg-heritage-gold/10 text-heritage-gold",
    },
    {
      label: "Visitas a Páginas",
      value: stats.totalPageViews,
      icon: Eye,
      color: "bg-coffee-green/10 text-coffee-green",
    },
    {
      label: "Lotes con Visitas",
      value: stats.mostViewedLots.length,
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Más vistos */}
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 p-6">
          <h3 className="text-headline-md font-headline-md text-primary mb-6">
            Lotes más visitados
          </h3>
          {stats.mostViewedLots.length === 0 ? (
            <p className="text-on-surface-variant text-body-md">
              No hay visitas registradas aún.
            </p>
          ) : (
            <div className="space-y-4">
              {stats.mostViewedLots.map((lot, i) => (
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
          {stats.recentLeads.length === 0 ? (
            <p className="text-on-surface-variant text-body-md">
              No hay leads registrados aún.
            </p>
          ) : (
            <div className="space-y-4">
              {stats.recentLeads.map((lead) => (
                <div key={lead.email} className="flex items-center justify-between">
                  <div>
                    <p className="font-label-bold text-primary">
                      {lead.name}
                    </p>
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

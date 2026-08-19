/**
 * LeadsPage — gestión de leads del panel de administración.
 *
 * Muestra:
 *   1. Tarjetas de resumen (total leads, últimos 7 días, últimos 30 días)
 *   2. Tabla filtrable/ordenable de leads con TanStack Table
 */

import { useState } from "react";
import { Loader2, Users, Calendar, TrendingUp, Download } from "lucide-react";
import { useLeadStats } from "./data/queries/leads";
import { LeadsTable } from "./components/analytics/LeadsTable";
import { supabase } from "@/lib/supabase"

export function Component() {
  return <LeadsPage />;
}

const STAGE_LABELS: Record<string, string> = {
  nuevo: "Nuevos",
  contactado: "Contactados",
  visita_agendada: "Visitas Agendadas",
  negociando: "Negociando",
  cerrado_ganado: "Cerrados Ganados",
  cerrado_perdido: "Cerrados Perdidos",
};

export function LeadsPage() {
  const { data: stats, isLoading, error } = useLeadStats();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-headline-lg font-headline-lg text-primary">
            Gestión de Leads
          </h1>
          <p className="text-body-md text-on-surface-variant mt-1">
            Administra y da seguimiento a los leads de La Holanda
          </p>
        </div>
        <ExportButton
          onView="vista_export_leads"
          filename="leads-completos"
          label="Exportar CSV"
        />
      </div>

      {/* Tarjetas de resumen */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 p-6"
            >
              <div className="flex items-center justify-center h-16">
                <Loader2 className="w-5 h-5 animate-spin text-heritage-gold" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-700 rounded-xl p-4 text-sm">
          Error cargando estadísticas de leads.
        </div>
      ) : stats ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Total Leads"
            value={stats.totalLeads}
            icon={Users}
            color="bg-primary/10 text-primary"
          />
          <StatCard
            label="Últimos 7 días"
            value={stats.leadsLast7Days}
            icon={Calendar}
            color="bg-heritage-gold/10 text-heritage-gold"
          />
          <StatCard
            label="Últimos 30 días"
            value={stats.leadsLast30Days}
            icon={TrendingUp}
            color="bg-coffee-green/10 text-coffee-green"
          />
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 p-6">
            <p className="text-caption text-on-surface-variant mb-2">
              Por etapa
            </p>
            <div className="space-y-1">
              {Object.entries(stats.stageDistribution)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 4)
                .map(([stage, count]) => (
                  <div key={stage} className="flex justify-between text-caption">
                    <span className="text-on-surface-variant">
                      {STAGE_LABELS[stage] ?? stage}
                    </span>
                    <span className="font-bold text-primary">{count}</span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      ) : null}

      {/* Tabla de leads */}
      <LeadsTable />
    </div>
  );
}

// ── Stat Card ──────────────────────────────────────────────────

interface StatCardProps {
  label: string;
  value: number;
  icon: typeof Users;
  color: string;
}

function StatCard({ label, value, icon: Icon, color }: StatCardProps) {
  return (
    <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 p-6 flex items-start gap-4">
      <div className={`p-3 rounded-lg ${color}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-2xl font-bold text-primary">{value}</p>
        <p className="text-caption text-on-surface-variant">{label}</p>
      </div>
    </div>
  );
}

// ── Export Button ───────────────────────────────────────────────

interface ExportButtonProps {
  onView: string;
  filename: string;
  label: string;
}

/**
 * Botón que descarga datos de una vista de Supabase como CSV.
 * Consulta la vista directamente y genera el CSV en el cliente.
 */
function ExportButton({ onView, filename, label }: ExportButtonProps) {
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    setExporting(true);
    try {
      const { data, error } = await supabase
        .from(onView)
        .select("*")
        .limit(10000);

      if (error) throw error;
      if (!data || data.length === 0) {
        alert("No hay datos para exportar.");
        return;
      }

      // Generar CSV
      const headers = Object.keys(data[0]);
      const csvRows = [headers.join(",")];
      for (const row of data) {
        const values = headers.map((h) => {
          const val = row[h];
          if (val === null || val === undefined) return "";
          const str = String(val);
          return str.includes(",") || str.includes("\n") || str.includes('"')
            ? `"${str.replace(/"/g, '""')}"`
            : str;
        });
        csvRows.push(values.join(","));
      }

      // Descargar
      const blob = new Blob([csvRows.join("\n")], {
        type: "text/csv;charset=utf-8;",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${filename}-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Export error:", err);
      alert("Error al exportar datos.");
    } finally {
      setExporting(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleExport}
      disabled={exporting}
      className="flex items-center gap-2 px-4 py-2 border border-outline-variant/30 rounded-lg text-caption font-caption text-on-surface-variant hover:bg-surface-container transition-colors disabled:opacity-50"
    >
      {exporting ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Download className="w-4 h-4" />
      )}
      {exporting ? "Exportando..." : label}
    </button>
  );
}

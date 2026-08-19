/**
 * DateRangeFilter — filtro de rango de fechas reutilizable para dashboards.
 *
 * Permite seleccionar rangos predefinidos (7d, 30d, 90d) o fechas personalizadas.
 * Se usa en el dashboard de analytics y en la tabla de leads.
 */

import { Calendar } from "lucide-react";

export type DateRangePreset = "7d" | "30d" | "90d" | "custom";

interface DateRangeFilterProps {
  /** Rango predefinido seleccionado. */
  preset: DateRangePreset;
  /** Callback al cambiar el rango. */
  onPresetChange: (preset: DateRangePreset) => void;
  /** Fecha inicio (solo para preset "custom"). */
  dateFrom?: string;
  /** Fecha fin (solo para preset "custom"). */
  dateTo?: string;
  /** Callback al cambiar fechas custom. */
  onDateChange?: (from: string, to: string) => void;
}

export function DateRangeFilter({
  preset,
  onPresetChange,
  dateFrom,
  dateTo,
  onDateChange,
}: DateRangeFilterProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Calendar className="w-4 h-4 text-on-surface-variant" />

      {/* Presets */}
      <div className="flex rounded-lg border border-outline-variant/30 overflow-hidden">
        {([
          { value: "7d" as const, label: "7 días" },
          { value: "30d" as const, label: "30 días" },
          { value: "90d" as const, label: "90 días" },
        ]).map((p) => (
          <button
            key={p.value}
            type="button"
            onClick={() => onPresetChange(p.value)}
            className={`px-3 py-1.5 text-caption font-caption transition-colors ${
              preset === p.value
                ? "bg-deep-forest text-on-primary"
                : "bg-surface text-on-surface-variant hover:bg-surface-container"
            }`}
          >
            {p.label}
          </button>
        ))}
        <button
          type="button"
          onClick={() => onPresetChange("custom")}
          className={`px-3 py-1.5 text-caption font-caption transition-colors ${
            preset === "custom"
              ? "bg-deep-forest text-on-primary"
              : "bg-surface text-on-surface-variant hover:bg-surface-container"
          }`}
        >
          Personalizado
        </button>
      </div>

      {/* Fechas custom */}
      {preset === "custom" && (
        <div className="flex items-center gap-2 ml-2">
          <input
            type="date"
            value={dateFrom ?? ""}
            onChange={(e) => onDateChange?.(e.target.value, dateTo ?? "")}
            className="border border-outline-variant/30 rounded-lg px-3 py-1.5 text-caption bg-surface text-on-surface"
          />
          <span className="text-on-surface-variant">—</span>
          <input
            type="date"
            value={dateTo ?? ""}
            onChange={(e) => onDateChange?.(dateFrom ?? "", e.target.value)}
            className="border border-outline-variant/30 rounded-lg px-3 py-1.5 text-caption bg-surface text-on-surface"
          />
        </div>
      )}
    </div>
  );
}

/**
 * Helpers para el filtro de rango de fechas.
 * Extraídos de DateRangeFilter.tsx para cumplir con react-refresh/only-export-components.
 */

import type { DateRangePreset } from "./DateRangeFilter";

const PRESETS: { value: DateRangePreset; days: number }[] = [
  { value: "7d", days: 7 },
  { value: "30d", days: 30 },
  { value: "90d", days: 90 },
];

/**
 * Retorna los días del preset seleccionado o 30 por defecto.
 */
export function getPresetDays(preset: DateRangePreset): number {
  return PRESETS.find((p) => p.value === preset)?.days ?? 30;
}

/**
 * Retorna la fecha ISO de inicio para un preset dado.
 */
export function getPresetStartDate(
  preset: DateRangePreset,
  customFrom?: string,
): string {
  if (preset === "custom" && customFrom) return customFrom;
  const days = getPresetDays(preset);
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
}

export interface ChartPoint {
  label: string;
  count: number;
}

/**
 * Agrupa registros por día dentro de una ventana de `days` días.
 * Los registros sin fecha (p. ej. mocks de e2e) se ignoran.
 */
export function bucketByDay(
  rows: Array<{ created_at?: string; viewed_at?: string }>,
  days: number,
): ChartPoint[] {
  const labels: { key: string; label: string }[] = [];
  const counts: Record<string, number> = {};

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - i);
    const key = date.toISOString().slice(0, 10);
    labels.push({
      key,
      label: date.toLocaleDateString("es-CO", {
        day: "numeric",
        month: "short",
      }),
    });
    counts[key] = 0;
  }

  rows.forEach((row) => {
    const timestamp = row.created_at ?? row.viewed_at;
    if (!timestamp) return;
    const key = new Date(timestamp).toISOString().slice(0, 10);
    if (key in counts) counts[key] += 1;
  });

  return labels.map(({ key, label }) => ({ label, count: counts[key] }));
}

import { describe, it, expect } from "vitest";
import { bucketByDay } from "../analytics";

/** Crea una fecha local a las 12:00 (segura para cualquier zona horaria). */
function localNoon(daysAgo: number): Date {
  const date = new Date();
  date.setHours(12, 0, 0, 0);
  date.setDate(date.getDate() - daysAgo);
  return date;
}

describe("bucketByDay", () => {
  it("devuelve un punto por día en la ventana, todos en cero sin datos", () => {
    const points = bucketByDay([], 7);
    expect(points).toHaveLength(7);
    expect(points.every((point) => point.count === 0)).toBe(true);
  });

  it("cuenta los registros que caen dentro de la ventana", () => {
    const points = bucketByDay(
      [
        { created_at: localNoon(0).toISOString() },
        { created_at: localNoon(1).toISOString() },
        { created_at: localNoon(1).toISOString() },
      ],
      3,
    );

    expect(points).toHaveLength(3);
    // El último punto es hoy (1 registro); el penúltimo es ayer (2 registros)
    expect(points[2].count).toBe(1);
    expect(points[1].count).toBe(2);
    expect(points[0].count).toBe(0);
  });

  it("ignora los registros sin fecha", () => {
    const points = bucketByDay([{}, { viewed_at: undefined }], 2);
    expect(points.every((point) => point.count === 0)).toBe(true);
  });

  it("usa viewed_at cuando no hay created_at", () => {
    const points = bucketByDay([{ viewed_at: localNoon(0).toISOString() }], 1);
    expect(points[0].count).toBe(1);
  });

  it("no cuenta registros fuera de la ventana", () => {
    const points = bucketByDay([{ created_at: localNoon(10).toISOString() }], 3);
    expect(points.every((point) => point.count === 0)).toBe(true);
  });
});

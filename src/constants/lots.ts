export type LotStatus = "disponible" | "reservado" | "vendido";

export interface Lot {
  id: string; // "01".."16"
  areaM2: number | null; // null = pendiente de confirmar con el levantamiento real
  /** COP. undefined = precio aún no definido por el cliente — no mostrar cifras inventadas */
  price?: number;
  status: LotStatus;
  aerialImage: string;
  perspectiveImage: string;
  topography?: string;
  view?: string;
  access?: string;
  /** true si la foto aérea es compartida con un lote vecino (mismo encuadre) */
  sharedAerialWith?: string;
}

/**
 * Datos reales confirmados a partir de las fotos aéreas entregadas (áreas en m²).
 * Lotes 01 y 10–16 todavía no tienen foto aérea cercana propia ni área confirmada:
 * quedan con areaM2: null y usan el render del plano general como imagen temporal.
 * TODO (Juan / cliente): reemplazar precios, estados reales y completar áreas faltantes.
 */
export const lots: Lot[] = [
  {
    id: "01",
    areaM2: null,
    status: "disponible",
    aerialImage: "/lots/masterplan-render.jpg",
    perspectiveImage: "/lots/perspectiva-general.jpg",
  },
  {
    id: "02",
    areaM2: 2008,
    status: "disponible",
    aerialImage: "/lots/lote-02-03-aerial.jpg",
    perspectiveImage: "/lots/perspectiva-general.jpg",
    sharedAerialWith: "03",
  },
  {
    id: "03",
    areaM2: 2013,
    status: "disponible",
    aerialImage: "/lots/lote-02-03-aerial.jpg",
    perspectiveImage: "/lots/perspectiva-general.jpg",
    sharedAerialWith: "02",
  },
  {
    id: "04",
    areaM2: 2004,
    status: "disponible",
    aerialImage: "/lots/lote-04-05-aerial.jpg",
    perspectiveImage: "/lots/perspectiva-general.jpg",
    sharedAerialWith: "05",
  },
  {
    id: "05",
    areaM2: 2005,
    status: "disponible",
    aerialImage: "/lots/lote-04-05-aerial.jpg",
    perspectiveImage: "/lots/perspectiva-general.jpg",
    sharedAerialWith: "04",
  },
  {
    id: "06",
    areaM2: 2005,
    status: "disponible",
    aerialImage: "/lots/lote-06-aerial.jpg",
    perspectiveImage: "/lots/perspectiva-general.jpg",
  },
  {
    id: "07",
    areaM2: 2010,
    status: "disponible",
    aerialImage: "/lots/lote-07-08-aerial.jpg",
    perspectiveImage: "/lots/perspectiva-general.jpg",
    sharedAerialWith: "08",
  },
  {
    id: "08",
    areaM2: 2005,
    status: "disponible",
    aerialImage: "/lots/lote-07-08-aerial.jpg",
    perspectiveImage: "/lots/perspectiva-general.jpg",
    sharedAerialWith: "07",
    topography: "Ondulada suave",
    view: "Panorámica al valle",
    access: "Directo principal",
  },
  {
    id: "09",
    areaM2: 2011,
    status: "disponible",
    aerialImage: "/lots/lote-09-aerial.jpg",
    perspectiveImage: "/lots/perspectiva-general.jpg",
  },
  ...["10", "11", "12", "13", "14", "15", "16"].map((id) => ({
    id,
    areaM2: null,
    status: "disponible" as LotStatus,
    aerialImage: "/lots/masterplan-render.jpg",
    perspectiveImage: "/lots/perspectiva-general.jpg",
  })),
];

export function getLotById(id: string): Lot | undefined {
  return lots.find((lot) => lot.id === id);
}

export function getRelatedLots(id: string, count = 2): Lot[] {
  const index = lots.findIndex((lot) => lot.id === id);
  if (index === -1) return lots.slice(0, count);
  return lots.filter((lot) => lot.id !== id).slice(0, count);
}

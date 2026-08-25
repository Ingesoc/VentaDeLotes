import { cldUrl, CLD_WIDTHS } from "@/lib/cloudinary";

export type LotStatus = "disponible" | "reservado" | "vendido" | "no_disponible";

export interface PriceSchedule {
  "2026-09-15": number;
  "2027-09-15": number;
  "2028-10-15": number;
}

/**
 * Media de referencia de escala (foto/video con persona para dimensionar
 * el lote). Contenido opcional por lote: mientras es `undefined`, la sección
 * "Dimensiona el lote" del detalle no se renderiza.
 *
 * `alt` es obligatorio a nivel de tipo: no se puede agregar media sin
 * descripción accesible.
 */
export interface ScaleReferenceMedia {
  type: "image" | "video";
  /** URL de Cloudinary (imagen o .mp4) o de YouTube (embed) */
  url: string;
  alt: string;
}

export interface Lot {
  id: string;
  areaM2: number;
  price?: number;
  priceSchedule?: PriceSchedule;
  status: LotStatus;
  aerialImage: string;
  perspectiveImage: string;
  /**
   * Galería adicional del lote (fotos propias de tierra, frentes, etc.),
   * además de las vistas aérea/perspectiva. Vacío o ausente mientras no hay
   * fotos específicas — la galería muestra solo las vistas base.
   */
  images?: string[];
  scaleReferenceMedia?: ScaleReferenceMedia;
  topography?: string;
  view?: string;
  access?: string;
  sharedAerialWith?: string;
  /** Coordenadas geográficas aproximadas del lote */
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export const lots: Lot[] = [
  {
    id: "01",
    areaM2: 8910.37,
    price: undefined,
    status: "no_disponible",    aerialImage: cldUrl("https://res.cloudinary.com/j5a9xyaq/image/upload/v1784946345/laholanda/lots/loteo-general-drone.jpg", CLD_WIDTHS.LARGE),
    perspectiveImage: cldUrl("https://res.cloudinary.com/j5a9xyaq/image/upload/v1784946353/laholanda/lots/perspectiva-lotes-1-10-11-12-drone.jpg", CLD_WIDTHS.LARGE),
    coordinates: { lat: 4.61923, lng: -75.76700 },
  },
  {
    id: "02",
    areaM2: 2008,
    price: 189242850,
    priceSchedule: {
      "2026-09-15": 189242850,
      "2027-09-15": 258963900,
      "2028-10-15": 298804500,
    },
    status: "disponible",
    aerialImage: cldUrl("https://res.cloudinary.com/j5a9xyaq/image/upload/v1784946305/laholanda/lots/lote-02-03-drone.jpg", CLD_WIDTHS.LARGE),
    perspectiveImage: cldUrl("https://res.cloudinary.com/j5a9xyaq/image/upload/v1784946349/laholanda/lots/perspectiva-general-drone.jpg", CLD_WIDTHS.LARGE),
    sharedAerialWith: "03",
    coordinates: { lat: 4.61866, lng: -75.76802 },
  },
  {
    id: "03",
    areaM2: 2013,
    price: 185619550,
    priceSchedule: {
      "2026-09-15": 185619550,
      "2027-09-15": 254005700,
      "2028-10-15": 293083500,
    },
    status: "disponible",
    aerialImage: cldUrl("https://res.cloudinary.com/j5a9xyaq/image/upload/v1784946305/laholanda/lots/lote-02-03-drone.jpg", CLD_WIDTHS.LARGE),
    perspectiveImage: cldUrl("https://res.cloudinary.com/j5a9xyaq/image/upload/v1784946349/laholanda/lots/perspectiva-general-drone.jpg", CLD_WIDTHS.LARGE),
    sharedAerialWith: "02",
    coordinates: { lat: 4.61832, lng: -75.76834 },
  },
  {
    id: "04",
    areaM2: 2004,
    price: 165570750,
    priceSchedule: {
      "2026-09-15": 165570750,
      "2027-09-15": 226570500,
      "2028-10-15": 261427500,
    },
    status: "disponible",
    aerialImage: cldUrl("https://res.cloudinary.com/j5a9xyaq/image/upload/v1784946309/laholanda/lots/lote-04-05-drone.jpg", CLD_WIDTHS.LARGE),
    perspectiveImage: cldUrl("https://res.cloudinary.com/j5a9xyaq/image/upload/v1784946349/laholanda/lots/perspectiva-general-drone.jpg", CLD_WIDTHS.LARGE),
    sharedAerialWith: "05",
    coordinates: { lat: 4.61799, lng: -75.76865 },
  },
  {
    id: "05",
    areaM2: 2005,
    price: 169412550,
    priceSchedule: {
      "2026-09-15": 169412550,
      "2027-09-15": 231827700,
      "2028-10-15": 267493500,
    },
    status: "disponible",
    aerialImage: cldUrl("https://res.cloudinary.com/j5a9xyaq/image/upload/v1784946309/laholanda/lots/lote-04-05-drone.jpg", CLD_WIDTHS.LARGE),
    perspectiveImage: cldUrl("https://res.cloudinary.com/j5a9xyaq/image/upload/v1784946349/laholanda/lots/perspectiva-general-drone.jpg", CLD_WIDTHS.LARGE),
    sharedAerialWith: "04",
    coordinates: { lat: 4.61752, lng: -75.76901 },
  },
  {
    id: "06",
    areaM2: 2005,
    price: 158822900,
    priceSchedule: {
      "2026-09-15": 158822900,
      "2027-09-15": 217336600,
      "2028-10-15": 250773000,
    },
    status: "disponible",
    aerialImage: cldUrl("https://res.cloudinary.com/j5a9xyaq/image/upload/v1784946328/laholanda/lots/lote-06-drone.jpg", CLD_WIDTHS.LARGE),
    perspectiveImage: cldUrl("https://res.cloudinary.com/j5a9xyaq/image/upload/v1784946349/laholanda/lots/perspectiva-general-drone.jpg", CLD_WIDTHS.LARGE),
    coordinates: { lat: 4.61891, lng: -75.77010 },
  },
  {
    id: "07",
    areaM2: 2010,
    price: 159082250,
    priceSchedule: {
      "2026-09-15": 159082250,
      "2027-09-15": 217691500,
      "2028-10-15": 251182500,
    },
    status: "disponible",
    aerialImage: cldUrl("https://res.cloudinary.com/j5a9xyaq/image/upload/v1784946331/laholanda/lots/lote-07-08-drone.jpg", CLD_WIDTHS.LARGE),
    perspectiveImage: cldUrl("https://res.cloudinary.com/j5a9xyaq/image/upload/v1784946349/laholanda/lots/perspectiva-general-drone.jpg", CLD_WIDTHS.LARGE),
    sharedAerialWith: "08",
    coordinates: { lat: 4.61934, lng: -75.76963 },
  },
  {
    id: "08",
    areaM2: 2005,
    price: 184469100,
    priceSchedule: {
      "2026-09-15": 184469100,
      "2027-09-15": 252431400,
      "2028-10-15": 291267000,
    },
    status: "disponible",
    aerialImage: cldUrl("https://res.cloudinary.com/j5a9xyaq/image/upload/v1784946331/laholanda/lots/lote-07-08-drone.jpg", CLD_WIDTHS.LARGE),
    perspectiveImage: cldUrl("https://res.cloudinary.com/j5a9xyaq/image/upload/v1784946349/laholanda/lots/perspectiva-general-drone.jpg", CLD_WIDTHS.LARGE),
    sharedAerialWith: "07",
    topography: "Ondulada suave",
    view: "Panorámica al valle",
    access: "Directo principal",
    coordinates: { lat: 4.61973, lng: -75.76933 },
  },
  {
    id: "09",
    areaM2: 2011,
    price: 189883150,
    priceSchedule: {
      "2026-09-15": 189883150,
      "2027-09-15": 259840100,
      "2028-10-15": 299815500,
    },
    status: "disponible",
    aerialImage: cldUrl("https://res.cloudinary.com/j5a9xyaq/image/upload/v1784946336/laholanda/lots/lote-09-drone.jpg", CLD_WIDTHS.LARGE),
    perspectiveImage: cldUrl("https://res.cloudinary.com/j5a9xyaq/image/upload/v1784946349/laholanda/lots/perspectiva-general-drone.jpg", CLD_WIDTHS.LARGE),
    coordinates: { lat: 4.62017, lng: -75.76905 },
  },
  {
    id: "10",
    areaM2: 2966,
    price: undefined,
    status: "disponible",    aerialImage: cldUrl("https://res.cloudinary.com/j5a9xyaq/image/upload/v1784946345/laholanda/lots/loteo-general-drone.jpg", CLD_WIDTHS.LARGE),
    perspectiveImage: cldUrl("https://res.cloudinary.com/j5a9xyaq/image/upload/v1784946353/laholanda/lots/perspectiva-lotes-1-10-11-12-drone.jpg", CLD_WIDTHS.LARGE),
    coordinates: { lat: 4.62028, lng: -75.76756 },
  },
  {
    id: "11",
    areaM2: 2502,
    price: 237690000,
    priceSchedule: {
      "2026-09-15": 237690000,
      "2027-09-15": 325260000,
      "2028-10-15": 375300000,
    },
    status: "disponible",    aerialImage: cldUrl("https://res.cloudinary.com/j5a9xyaq/image/upload/v1784946345/laholanda/lots/loteo-general-drone.jpg", CLD_WIDTHS.LARGE),
    perspectiveImage: cldUrl("https://res.cloudinary.com/j5a9xyaq/image/upload/v1784946353/laholanda/lots/perspectiva-lotes-1-10-11-12-drone.jpg", CLD_WIDTHS.LARGE),
    coordinates: { lat: 4.62062, lng: -75.76813 },
  },
  {
    id: "12",
    areaM2: 2456,
    price: 233320000,
    priceSchedule: {
      "2026-09-15": 233320000,
      "2027-09-15": 319280000,
      "2028-10-15": 368400000,
    },
    status: "disponible",    aerialImage: cldUrl("https://res.cloudinary.com/j5a9xyaq/image/upload/v1784946345/laholanda/lots/loteo-general-drone.jpg", CLD_WIDTHS.LARGE),
    perspectiveImage: cldUrl("https://res.cloudinary.com/j5a9xyaq/image/upload/v1784946353/laholanda/lots/perspectiva-lotes-1-10-11-12-drone.jpg", CLD_WIDTHS.LARGE),
    coordinates: { lat: 4.62085, lng: -75.76879 },
  },
  {
    id: "13",
    areaM2: 3216,
    price: 305520000,
    priceSchedule: {
      "2026-09-15": 305520000,
      "2027-09-15": 418080000,
      "2028-10-15": 482400000,
    },
    status: "disponible",
    aerialImage: cldUrl("https://res.cloudinary.com/j5a9xyaq/image/upload/v1784946340/laholanda/lots/lote-13-14-drone.jpg", CLD_WIDTHS.LARGE),
    perspectiveImage: cldUrl("https://res.cloudinary.com/j5a9xyaq/image/upload/v1784946357/laholanda/lots/perspectiva-lotes-13-14-drone.jpg", CLD_WIDTHS.LARGE),
    coordinates: { lat: 4.62074, lng: -75.77030 },
  },
  {
    id: "14",
    areaM2: 2518,
    price: 239210000,
    priceSchedule: {
      "2026-09-15": 239210000,
      "2027-09-15": 327340000,
      "2028-10-15": 377700000,
    },
    status: "disponible",
    aerialImage: cldUrl("https://res.cloudinary.com/j5a9xyaq/image/upload/v1784946340/laholanda/lots/lote-13-14-drone.jpg", CLD_WIDTHS.LARGE),
    perspectiveImage: cldUrl("https://res.cloudinary.com/j5a9xyaq/image/upload/v1784946357/laholanda/lots/perspectiva-lotes-13-14-drone.jpg", CLD_WIDTHS.LARGE),
    coordinates: { lat: 4.62012, lng: -75.77081 },
  },
  {
    id: "15",
    areaM2: 2908,
    price: undefined,
    status: "disponible",    aerialImage: cldUrl("https://res.cloudinary.com/j5a9xyaq/image/upload/v1784946345/laholanda/lots/loteo-general-drone.jpg", CLD_WIDTHS.LARGE),
    perspectiveImage: cldUrl("https://res.cloudinary.com/j5a9xyaq/image/upload/v1784946349/laholanda/lots/perspectiva-general-drone.jpg", CLD_WIDTHS.LARGE),
    coordinates: { lat: 4.61937, lng: -75.77152 },
  },
  {
    id: "16",
    areaM2: 6689,
    price: undefined,
    status: "disponible",    aerialImage: cldUrl("https://res.cloudinary.com/j5a9xyaq/image/upload/v1784946345/laholanda/lots/loteo-general-drone.jpg", CLD_WIDTHS.LARGE),
    perspectiveImage: cldUrl("https://res.cloudinary.com/j5a9xyaq/image/upload/v1784946349/laholanda/lots/perspectiva-general-drone.jpg", CLD_WIDTHS.LARGE),
    coordinates: { lat: 4.61846, lng: -75.77122 },
  },
];

export function getLotById(id: string): Lot | undefined {
  return lots.find((lot) => lot.id === id);
}

export function getRelatedLots(id: string, count = 2): Lot[] {
  const index = lots.findIndex((lot) => lot.id === id);
  if (index === -1) return lots.slice(0, count);
  return lots.filter((lot) => lot.id !== id).slice(0, count);
}

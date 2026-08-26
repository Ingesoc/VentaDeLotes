/**
 * Videos aéreos de la finca — sección independiente de la home
 * (`AerialVideoSection`), fuera del carrusel para garantizar visibilidad.
 *
 * Los clips viven en YouTube (embed con youtube-nocookie, carga perezosa
 * vía `YouTubeVideo`): no hay costo de storage ni ancho de banda propio y
 * se actualizan cambiando solo el `videoId` aquí.
 */

export interface AerialVideoClip {
  /** ID de YouTube (la parte `N7LYM3pt_hg` de la URL del embed) */
  videoId: string;
  title: string;
  description?: string;
}

export const aerialVideoClips: AerialVideoClip[] = [
  {
    videoId: "hT4bLxh-8uo",
    title: "La Holanda desde el aire",
    description:
      "Recorrido aéreo por la parcelación: lotes, vías y paisaje cafetero.",
  },
  {
    videoId: "djCWm-dv5Gg",
    title: "Vuelo sobre los lotes",
    description: "Perspectiva aérea de los lotes disponibles.",
  },
  {
    videoId: "BZQVeSE1xSs",
    title: "El entorno natural",
    description: "Guaduales, cafetales y montañas alrededor de La Holanda.",
  },
  {
    videoId: "7FAwZoHTWvc",
    title: "Vistazo a la naturaleza",
    description: "Guaduales, café y montañas de La Holanda.",
  },
  {
    videoId: "N7LYM3pt_hg",
    title: "Recorrido panorámico",
    description: "Panorámica general de la finca al atardecer.",
  },
  {
    videoId: "IMDJ2EklNDY",
    title: "La Holanda en detalle",
    description: "Acercamiento aéreo a los frentes de cada lote.",
  },
];

export function getAerialClipById(videoId: string): AerialVideoClip | undefined {
  return aerialVideoClips.find((clip) => clip.videoId === videoId);
}

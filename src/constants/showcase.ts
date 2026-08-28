/**
 * Sección "Ambientación" de la home — 3 items con refuerzo visual.
 *
 * Contenido 100% config-driven: cuando llegue el material final basta con
 * completar `imageUrl` / `extraImages` / `cta.url` en este archivo. Mientras
 * un valor es `null`, el componente renderiza un placeholder con aspect-ratio
 * fijo (sin romper el layout ni penalizar CLS) y los CTAs sin URL no se
 * renderizan.
 *
 * Naming convention de assets en Cloudinary (carpeta `laholanda/showcase/`):
 *   - showcase/item-1/main.jpg
 *   - showcase/item-2/main.jpg, showcase/item-2/plano-{n}.jpg
 *   - showcase/item-3/obra.jpg, showcase/item-3/logo-ingesoc.png
 */

/** Plataformas sociales soportadas para los CTA del showcase. */
export type SocialPlatform = "facebook" | "linkedin";

export interface ShowcaseCta {
  label: string;
  /**
   * URL del destino. Si es `null` el botón NO se renderiza
   * (p. ej. LinkedIn hasta que el perfil esté listo).
   */
  url: string | null;
  platform: SocialPlatform;
}

export interface ShowcaseImage {
  url: string;
  /** Alt text obligatorio a nivel de tipo para toda imagen del showcase. */
  alt: string;
}

export interface ShowcaseItem {
  order: number;
  title: string;
  description: string;
  /** Imagen principal. `null` → placeholder "Imagen próximamente". */
  imageUrl: string | null;
  imageAlt: string;
  /** Collage de imágenes secundarias (grid responsive). Vacío → placeholder. */
  extraImages: ShowcaseImage[];
  cta?: ShowcaseCta | null;
}

// URLs definitivas pendientes; al agregarlas aquí se activan solos los
// placeholders y los botones (control por dato, sin cambios de código).
// Para la imagen/logo de cada item, subir el asset a Cloudinary
// (`laholanda/showcase/…`) y poner aquí su URL con cldUrl().
const INGESOC_FACEBOOK_URL: string | null = null;

export const showcaseItems: ShowcaseItem[] = [
  {
    order: 1,
    title: "Lotes listos para construir",
    description:
      "Terrenos delimitados con acceso por vía principal, rodeados de paisaje cafetero y listos para tu casa de descanso.",
    imageUrl: null,
    imageAlt: "Vista del lote campestre en La Holanda",
    extraImages: [],
    cta: null,
  },
  {
    order: 2,
    title: "Diseño arquitectónico incluido",
    description:
      "Cada lote incluye diseño arquitectónico tipo, implantado según topografía, con paquete completo de planos.",
    imageUrl: null,
    imageAlt: "Diseño arquitectónico tipo implantado en el lote",
    // Collage de planos (estructural, hidrosanitario, eléctrico…)
    extraImages: [],
    cta: null,
  },
  {
    order: 3,
    title: "Obras respaldadas por INGESOCC",
    description:
      "Más de 30 años de experiencia construyendo en el Quindío. Conoce nuestros proyectos realizados.",
    imageUrl: null,
    imageAlt: "Obra realizada por INGESOCC SAS",
    extraImages: [],
    cta: {
      label: "Síguenos en Facebook",
      url: INGESOC_FACEBOOK_URL,
      platform: "facebook",
    },
  },
];

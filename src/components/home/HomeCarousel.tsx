import { useMemo } from "react";
import { Link } from "react-router";
import { ArrowRight } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { cldUrl, CLD_WIDTHS } from "@/lib/cloudinary";

interface CarouselSlide {
  src: string;
  alt: string;
  title: string;
  description: string;
}

// El video aéreo ya no vive en el carrusel: tiene su propia sección
// independiente (`AerialVideoSection`) para garantizar visibilidad.
const slides: CarouselSlide[] = [
  {
    src: cldUrl("https://res.cloudinary.com/j5a9xyaq/image/upload/v1787838725/festival_de_faroles_quimbaya_1_tf6kay.webp", CLD_WIDTHS.CAROUSEL),
    alt: "Festival de Velas y Faroles",
    title: "Festival de Velas y Faroles",
    description: "La festividad más mágica de Quimbaya, donde las calles se visten de luces y hermosos faroles artesanales.",
  },
  {
    src: cldUrl("https://res.cloudinary.com/j5a9xyaq/image/upload/v1787838726/arrieros_utpgk8.webp", CLD_WIDTHS.CAROUSEL),
    alt: "Legado Arriero",
    title: "Legado y Tradición Arriera",
    description: "Siente las profundas raíces de la cultura cafetera y la hospitalidad de nuestra gente.",
  },
  {
    src: cldUrl("https://res.cloudinary.com/j5a9xyaq/image/upload/v1787838725/cafetales_fftekm.webp", CLD_WIDTHS.CAROUSEL),
    alt: "Paisaje Cultural Cafetero",
    title: "Paisaje Cultural Cafetero",
    description: "Explora cafetales infinitos declarados Patrimonio de la Humanidad por la UNESCO.",
  },
  {
    src: cldUrl("https://res.cloudinary.com/j5a9xyaq/image/upload/v1787838726/piscinas_l8ntf1.webp", CLD_WIDTHS.CAROUSEL),
    alt: "Bienestar y Recreación",
    title: "Bienestar en el Paraíso",
    description: "Comodidades exclusivas y senderos ecológicos integrados en la exuberante flora nativa.",
  },
];

/**
 * Carrusel de la home con slides turísticos de Quindío.
 * Solo imágenes (lazy): los videos aéreos viven en `AerialVideoSection`.
 */
export default function HomeCarousel() {
  const autoplay = useMemo(
    () =>
      Autoplay({
        delay: 5000,
        // Con `true`, una interacción detiene el carrusel permanentemente
        // hasta recargar; `false` reanuda el autoplay tras el arrastre.
        stopOnInteraction: false,
      }),
    [],
  );
  const [emblaRef] = useEmblaCarousel({ loop: true }, [autoplay]);

  return (
    <div className="relative rounded-2xl overflow-hidden shadow-2xl w-full max-w-5xl mx-auto my-12 border border-outline-variant/20">
      {/* h2 sr-only para que los h3 de cada slide tengan jerarquía válida
          (la home salta de h1 del hero a h3 sin h2 intermedio). */}
      <h2 className="sr-only">Descubre Quindío</h2>
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {slides.map((s) => (
            <div
              key={s.alt}
              className="flex-[0_0_100%] min-w-0 relative h-[300px] sm:h-[400px] md:h-[450px]"
            >
              <img
                src={s.src}
                alt={s.alt}
                width={1200}
                height={675}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover"
              />
              {/* Overlay degradado */}
              <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent"></div>
              {/* Contenido del slide — pointer-events-none para no bloquear el arrastre; solo el CTA recibe clics */}
              <div className="pointer-events-none absolute bottom-0 left-0 right-0 p-5 sm:p-8 md:p-12 text-white flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6 z-10">
                <div className="max-w-2xl">
                  <span className="text-heritage-gold font-label-bold tracking-widest uppercase mb-2 block text-sm">
                    Descubre Quindío
                  </span>
                  <h3 className="font-headline-lg text-lg sm:text-2xl md:text-3xl text-white mb-2 leading-tight">
                    {s.title}
                  </h3>
                  <p className="text-xs sm:text-sm md:text-base text-surface-variant/90 leading-relaxed max-w-lg">
                    {s.description}
                  </p>
                </div>
                <div>
                  <Link
                    to="/descubre-quindio"
                    className="pointer-events-auto inline-flex items-center gap-2 bg-heritage-gold text-primary hover:bg-white px-5 sm:px-6 py-3 rounded-lg font-label-bold transition-colors duration-300 text-xs sm:text-sm whitespace-nowrap tap-target"
                  >
                    Conocer Más
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

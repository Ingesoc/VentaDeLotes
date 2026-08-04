import { useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cldUrl, CLD_WIDTHS } from "@/lib/cloudinary";

interface Park {
  name: string;
  location: string;
  description: string;
  image: string;
}

const parks: Park[] = [
  {
    name: "Parque Nacional del Café",
    location: "Montenegro, Quindío",
    description:
      "Cafetales, arquitectura tradicional y teleféricos que cuentan la historia del grano más famoso de Colombia.",
    image: cldUrl(
      "https://res.cloudinary.com/j5a9xyaq/image/upload/v1785554666/images_lcdc1k.jpg",
      CLD_WIDTHS.LARGE,
    ),
  },
  {
    name: "Valle del Cocora",
    location: "Salento, Quindío",
    description:
      "Las palmas de cera más altas del mundo custodian un valle de niebla, senderos y ríos cristalinos.",
    image: cldUrl(
      "https://res.cloudinary.com/j5a9xyaq/image/upload/v1785554996/VALLEDELCOCORA_fh4a1m.jpg",
      CLD_WIDTHS.LARGE,
    ),
  },
  {
    name: "Panaca",
    location: "Quimbaya, Quindío",
    description:
      "Un parque temático agropecuario donde se vive la cultura del campo con más de 4.000 animales.",
    image: cldUrl(
      "https://res.cloudinary.com/j5a9xyaq/image/upload/v1785554668/panaca_anqpkd.webp",
      CLD_WIDTHS.LARGE,
    ),
  },
  {
    name: "RECUCA",
    location: "Quimbaya, Quindío",
    description:
      "El Parque Nacional de la Cultura Agropecuaria: tradición, historia y naturaleza para toda la familia.",
    image: cldUrl(
      "https://res.cloudinary.com/j5a9xyaq/image/upload/v1785554996/recuca_l9cioz.jpg",
      CLD_WIDTHS.LARGE,
    ),
  },
  {
    name: "Parque de los Arrieros",
    location: "Km 3 vía Montenegro–Quimbaya",
    description:
      "Un homenaje a los arrieros y la colonización paisa: senderos ecológicos, arquitectura colonial, trapiche y shows en vivo.",
    image: cldUrl(
      "https://res.cloudinary.com/j5a9xyaq/image/upload/v1785554666/los_arrieros_ko7u8g.jpg",
      CLD_WIDTHS.LARGE,
    ),
  },
];

export default function QuindioParks() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 4500, stopOnInteraction: false }),
  ]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  return (
    <section className="relative py-section-gap bg-deep-forest text-white overflow-hidden">
      <div className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto relative z-10">
        <div className="text-center mb-12">
          <span className="inline-block text-heritage-gold font-label-bold uppercase tracking-widest text-sm mb-4">
            Explora la región
          </span>
          <h2 className="font-display-lg text-display-lg-mobile mb-4">
            Parques y Atractivos del Quindío
          </h2>
          <p className="font-body-lg text-surface-variant/80 max-w-2xl mx-auto">
            A minutos de tu lote, los destinos más emblemáticos del Eje Cafetero
            te esperan.
          </p>
        </div>

        <div className="relative">
          <div
            className="overflow-hidden rounded-2xl shadow-2xl border border-white/10"
            ref={emblaRef}
          >
            <div className="flex">
              {parks.map((park) => (
                <div
                  key={park.name}
                  className="flex-[0_0_100%] min-w-0 relative h-[320px] sm:h-[420px] md:h-[480px]"
                >
                  <img
                    src={park.image}
                    alt={park.name}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/40 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 md:p-14">
                    <span className="text-heritage-gold font-label-bold tracking-widest uppercase text-sm block mb-2">
                      {park.location}
                    </span>
                    <h3 className="font-headline-lg text-xl sm:text-2xl md:text-3xl text-white mb-2">
                      {park.name}
                    </h3>
                    <p className="text-sm sm:text-base text-surface-variant/90 max-w-xl leading-relaxed">
                      {park.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Controles */}
          <button
            onClick={scrollPrev}
            type="button"
            aria-label="Anterior"
            className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-surface/20 backdrop-blur border border-white/20 text-white flex items-center justify-center hover:bg-heritage-gold hover:text-primary transition-colors tap-target"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={scrollNext}
            type="button"
            aria-label="Siguiente"
            className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-surface/20 backdrop-blur border border-white/20 text-white flex items-center justify-center hover:bg-heritage-gold hover:text-primary transition-colors tap-target"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    </section>
  );
}

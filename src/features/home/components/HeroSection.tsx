import { Helmet } from "react-helmet-async";
import { project } from "@/constants/project";
import { cldUrl, CLD_WIDTHS } from "@/lib/cloudinary";

const HERO_IMAGE = cldUrl("https://res.cloudinary.com/j5a9xyaq/image/upload/v1784304519/laholanda/landscapes/Loteo%20General.webp", CLD_WIDTHS.HERO);

export function HeroSection() {
  return (
    <>
      <Helmet>
        <link rel="preload" as="image" href={HERO_IMAGE} fetchPriority="high" />
      </Helmet>
      <header className="relative h-dvh w-full flex items-center justify-center overflow-hidden">
      {/* Imagen real (no background-image) para que el preload de arriba la
          reutilice en un único fetch y priorice el LCP. */}
      <img
        alt={`Vista aérea espectacular del plan maestro de ${project.name} en ${project.location.municipality}, ${project.location.department}, con paisajes verdes y lotes orgánicos`}
        className="absolute inset-0 z-0 h-full w-full object-cover"
        fetchPriority="high"
        src={HERO_IMAGE}
      />
      <div className="absolute inset-0 z-10 bg-deep-forest/40"></div>
      <div className="relative z-20 text-center px-margin-mobile max-w-4xl mx-auto flex flex-col items-center gap-6 mt-20">
        <span className="inline-block text-heritage-gold font-label-bold uppercase tracking-widest text-sm">
          {project.type} · {project.developer}
        </span>
        <h1 className="font-display-lg text-3xl sm:text-4xl md:text-display-lg text-warm-white drop-shadow-lg leading-tight text-balance">
          {project.name}
        </h1>
        <p className="text-body-md sm:text-body-lg font-body-lg text-surface-container-high max-w-2xl">
          {project.tagline}
        </p>
        <p className="text-caption sm:text-body-md font-body-md text-surface-variant/80">
          {project.location.address} · {project.location.municipality}, {project.location.department}
        </p>
        <a
          className="bg-soft-gold text-deep-forest px-6 sm:px-8 py-4 rounded-lg font-body-md sm:font-body-lg font-medium hover:brightness-110 transition-[filter] shadow-xl mt-2 inline-block tap-target"
          href="#lotes"
        >
          Conoce los lotes disponibles
        </a>
      </div>
    </header>
    </>
  );
}

import { project } from "@/constants/project";

export function HeroSection() {
  return (
    <header className="relative h-screen w-full flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{ backgroundImage: "url('https://res.cloudinary.com/j5a9xyaq/image/upload/v1784304519/laholanda/landscapes/Loteo%20General.webp')" }}
      >
        <img
          alt={`Vista aérea espectacular del plan maestro de ${project.name} en ${project.location.municipality}, ${project.location.department}, con paisajes verdes y lotes orgánicos`}
          className="sr-only"
          src="https://res.cloudinary.com/j5a9xyaq/image/upload/v1784304519/laholanda/landscapes/Loteo%20General.webp"
        />
      </div>
      <div className="absolute inset-0 z-10 bg-deep-forest/40"></div>
      <div className="relative z-20 text-center px-margin-mobile max-w-4xl mx-auto flex flex-col items-center gap-6 mt-20">
        <span className="inline-block text-heritage-gold font-label-bold uppercase tracking-widest text-sm">
          {project.type} · {project.developer}
        </span>
        <h1 className="font-display-lg text-4xl md:text-display-lg text-warm-white drop-shadow-lg leading-tight">
          {project.name}
        </h1>
        <p className="text-body-lg font-body-lg text-surface-container-high max-w-2xl">
          {project.tagline}
        </p>
        <p className="text-body-md font-body-md text-surface-variant/80">
          {project.location.address} · {project.location.municipality}, {project.location.department}
        </p>
        <a
          className="bg-soft-gold text-deep-forest px-8 py-4 rounded-lg font-body-lg font-medium hover:brightness-110 transition-all shadow-xl mt-2 inline-block"
          href="#lotes"
        >
          Conoce los lotes disponibles
        </a>
      </div>
    </header>
  );
}

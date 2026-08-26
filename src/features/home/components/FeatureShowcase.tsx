import { ImagePlus } from "lucide-react";
import { FacebookIcon, LinkedinIcon } from "@/components/icons/SocialIcons";
import { showcaseItems } from "@/constants/showcase";
import type { ShowcaseItem } from "@/constants/showcase";
import { ImageCollage } from "./ImageCollage";

/** Placeholder de imagen con aspect-ratio fijo (sin CLS) mientras llega el asset. */
function MediaPlaceholder({ label }: { label: string }) {
  return (
    <div
      role="img"
      aria-label={`Próximamente: ${label}`}
      className="aspect-[4/3] rounded-xl border border-dashed border-outline-variant/40 bg-surface-container-high flex flex-col items-center justify-center gap-3 text-on-surface-variant"
    >
      <div className="bg-surface-container-lowest p-4 rounded-full">
        <ImagePlus className="w-7 h-7 text-heritage-gold" aria-hidden="true" />
      </div>
      <span className="text-body-sm font-body-sm">Imagen próximamente</span>
    </div>
  );
}

const platformIcons = {
  facebook: FacebookIcon,
  linkedin: LinkedinIcon,
} as const;

function ShowcaseCard({ item }: { item: ShowcaseItem }) {
  const Icon = item.cta?.platform
    ? platformIcons[item.cta.platform]
    : undefined;

  return (
    <article className="bg-surface-container-lowest rounded-2xl overflow-hidden border border-outline-variant/20 shadow-ambient flex flex-col">
      {/* Media: imagen principal, collage de secundarias o placeholder */}
      {item.extraImages.length > 0 ? (
        <div className="p-4 pb-0">
          <ImageCollage images={item.extraImages} label={item.title} />
        </div>
      ) : item.imageUrl ? (
        <img
          src={item.imageUrl}
          alt={item.imageAlt}
          loading="lazy"
          decoding="async"
          width={800}
          height={600}
          className="w-full aspect-[4/3] object-cover bg-surface-container-high"
        />
      ) : (
        <div className="p-4 pb-0">
          <MediaPlaceholder label={item.imageAlt} />
        </div>
      )}

      <div className="p-6 md:p-8 flex flex-col gap-4 grow">
        <h3 className="text-headline-md font-headline-md text-primary">
          {item.title}
        </h3>
        <p className="text-body-md font-body-md text-on-surface-variant grow">
          {item.description}
        </p>

        {/* CTA controlado por dato: sin URL no se renderiza (LinkedIn se
            activará solo cuando el perfil esté listo). */}
        {item.cta && item.cta.url && Icon && (
          <a
            href={item.cta.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 self-start bg-deep-forest text-on-primary px-5 py-2.5 rounded-lg font-label-bold transition-opacity hover:opacity-90 tap-target"
          >
            <Icon className="w-4 h-4" aria-hidden="true" />
            {item.cta.label}
          </a>
        )}
      </div>
    </article>
  );
}

/**
 * Sección "Ambientación" de la home — 3 items con refuerzo visual:
 * foto atractiva de un lote, diseño arquitectónico + collage de planos y
 * obra realizada + redes sociales. Contenido config-driven desde
 * `src/constants/showcase.ts` (placeholders automáticos si falta material).
 */
export function FeatureShowcase() {
  return (
    <section
      id="ambientacion"
      aria-labelledby="showcase-heading"
      className="py-section-gap bg-surface-container cv-auto [contain-intrinsic-size:auto_1100px]"
    >
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
        <div className="text-center mb-16">
          <h2
            id="showcase-heading"
            className="text-headline-lg-mobile md:text-headline-lg font-headline-lg text-primary mb-4"
          >
            Un proyecto para vivirlo
          </h2>
          <p className="text-body-lg font-body-lg text-on-surface-variant max-w-2xl mx-auto">
            Del lote al diseño y la construcción: así se ve La Holanda sobre el
            terreno.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...showcaseItems]
            .sort((a, b) => a.order - b.order)
            .map((item) => (
              <ShowcaseCard key={item.order} item={item} />
            ))}
        </div>
      </div>
    </section>
  );
}

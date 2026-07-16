import { Check, Hammer } from "lucide-react";
import { project } from "@/constants/project";

export function ProjectBenefits() {
  return (
    <section id="lotes" className="py-section-gap bg-surface-container-low">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
        <div className="text-center mb-16">
          <h2 className="text-headline-lg-mobile md:text-headline-lg font-headline-lg text-primary mb-4">
            Todo incluido en tu inversión
          </h2>
          <p className="text-body-lg font-body-lg text-on-surface-variant max-w-2xl mx-auto">
            {project.developer} te ofrece un proceso completo y transparente para que tu nuevo hogar sea una realidad.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Incluye */}
          <div className="bg-surface-container-lowest rounded-2xl p-8 md:p-10 border border-outline-variant/20">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-full bg-deep-forest flex items-center justify-center">
                <Check className="w-6 h-6 text-on-primary" />
              </div>
              <h3 className="text-headline-md font-headline-md text-primary">
                Incluye
              </h3>
            </div>
            <ul className="space-y-4">
              {project.purchaseIncludes.map((item) => (
                <li key={item} className="flex items-start gap-4">
                  <Check className="w-5 h-5 text-heritage-gold mt-0.5 shrink-0" />
                  <span className="text-body-md font-body-md text-on-surface">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Construcción */}
          <div className="bg-surface-container-lowest rounded-2xl p-8 md:p-10 border border-outline-variant/20">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-full bg-heritage-gold flex items-center justify-center">
                <Hammer className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-headline-md font-headline-md text-primary">
                Servicios de Construcción
              </h3>
            </div>
            <ul className="space-y-4">
              {project.constructionServices.map((item) => (
                <li key={item} className="flex items-start gap-4">
                  <span className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold mt-0.5 shrink-0">
                    ✓
                  </span>
                  <span className="text-body-md font-body-md text-on-surface">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

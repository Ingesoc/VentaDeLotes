import { Shield, Landmark, Building2 } from "lucide-react";
import { roiFeatures } from "@/constants/marketStats";

/** Mapa de id de característica ROI → iconos reales de Lucide */
const roiIcons = {
  Shield,
  Landmark,
  Building2,
} as const;

export function RoiAnalysis() {
  return (
    <section id="roi" className="py-section-gap bg-surface">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-headline-lg font-headline-lg text-primary mb-4">
            Por qué la Tierra es el Mejor Activo
          </h2>
          <p className="text-body-lg font-body-lg text-on-surface-variant max-w-2xl mx-auto">
            Más allá de la apreciación del estilo de vida, la tierra rural en el Eje Cafetero de Colombia ofrece ventajas financieras incomparables.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {roiFeatures.map((feature) => {
            const Icon = roiIcons[feature.icon as keyof typeof roiIcons];
            return (
              <div
                key={feature.id}
                className="bg-surface-container-low p-8 rounded-xl border border-outline-variant/30 text-center hover:-translate-y-2 transition-transform duration-300"
              >
                <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-6">
                  <Icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-headline-md font-headline-md text-on-surface mb-4">
                  {feature.title}
                </h3>
                <p className="text-body-md font-body-md text-on-surface-variant">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

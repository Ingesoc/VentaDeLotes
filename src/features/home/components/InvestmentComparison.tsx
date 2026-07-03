import { Check, Minus, GripHorizontal } from "lucide-react";

export function InvestmentComparison() {
  return (
    <section className="py-section-gap bg-surface-container-low">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
        {/* Encabezado */}
        <div className="text-center mb-16">
          <h2 className="text-headline-lg font-headline-lg text-primary mb-4">
            Comparación de Inversión Inteligente
          </h2>
          <p className="text-body-lg font-body-lg text-on-surface-variant">
            Vea por qué la tierra rural supera la densidad urbana.
          </p>
        </div>

        {/* Tarjetas */}
        <div className="flex flex-col md:flex-row gap-8 justify-center items-stretch max-w-4xl mx-auto">
          {/* Apartamento en la Ciudad */}
          <div className="flex-1 bg-surface p-8 rounded-xl border border-outline-variant/30 flex flex-col">
            <h3 className="text-headline-md font-headline-md text-on-surface-variant mb-6 text-center">
              Apartamento en la Ciudad
            </h3>
            <ul className="space-y-6 flex-1">
              <li className="flex items-start gap-4">
                <Minus className="w-5 h-5 text-error mt-1 shrink-0" />
                <div>
                  <p className="font-label-bold text-on-surface">
                    Alto Costo Inicial
                  </p>
                  <p className="text-caption text-on-surface-variant">
                    Precio premium por metro cuadrado.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <Minus className="w-5 h-5 text-error mt-1 shrink-0" />
                <div>
                  <p className="font-label-bold text-on-surface">
                    Altos Costos de Administración
                  </p>
                  <p className="text-caption text-on-surface-variant">
                    Mantenimiento mensual en continuo aumento.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <GripHorizontal className="w-5 h-5 text-outline mt-1 shrink-0" />
                <div>
                  <p className="font-label-bold text-on-surface">
                    Apreciación Moderada
                  </p>
                  <p className="text-caption text-on-surface-variant">
                    La saturación del mercado limita el crecimiento.
                  </p>
                </div>
              </li>
            </ul>
          </div>

          {/* Lote Rural (Destacado) */}
          <div className="flex-1 bg-primary text-on-primary p-8 rounded-xl border border-heritage-gold/30 shadow-[0_12px_40px_rgba(27,67,50,0.2)] transform md:-translate-y-4 flex flex-col relative overflow-hidden">
            {/* Etiqueta de Recomendado */}
            <div className="absolute top-0 right-0 bg-heritage-gold text-primary text-caption font-label-bold px-4 py-1 rounded-bl-lg">
              Recomendado
            </div>

            <h3 className="text-headline-md font-headline-md text-heritage-gold mb-6 text-center">
              Lote Rural en el Quindío
            </h3>
            <ul className="space-y-6 flex-1">
              <li className="flex items-start gap-4">
                <Check className="w-5 h-5 text-heritage-gold mt-1 shrink-0" />
                <div>
                  <p className="font-label-bold text-on-primary">
                    Punto de Entrada Accesible
                  </p>
                  <p className="text-caption text-surface-variant/80">
                    Costo significativamente menor por metro cuadrado.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <Check className="w-5 h-5 text-heritage-gold mt-1 shrink-0" />
                <div>
                  <p className="font-label-bold text-on-primary">
                    Cero Administración / Mantenimiento
                  </p>
                  <p className="text-caption text-surface-variant/80">
                    Sin cuotas mensuales. Su tierra, sus reglas.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <Check className="w-5 h-5 text-heritage-gold mt-1 shrink-0" />
                <div>
                  <p className="font-label-bold text-on-primary">
                    Alto Potencial de Apreciación
                  </p>
                  <p className="text-caption text-surface-variant/80">
                    El turismo en auge y la oferta limitada impulsan los valores.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <Check className="w-5 h-5 text-heritage-gold mt-1 shrink-0" />
                <div>
                  <p className="font-label-bold text-on-primary">
                    Listo para Ingresos Pasivos
                  </p>
                  <p className="text-caption text-surface-variant/80">
                    Desarrolle y alquile a través de Airbnb para rendimientos premium.
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

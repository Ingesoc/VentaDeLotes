import { Flag, FileText, KeyRound } from "lucide-react";

const steps = [
  {
    icon: Flag,
    title: "1. Separación",
    description:
      "Reserva tu lote con un anticipo inicial para asegurar la ubicación deseada.",
  },
  {
    icon: FileText,
    title: "2. Promesa",
    description:
      "Firma de la promesa de compraventa y establecimiento del plan de pagos.",
  },
  {
    icon: KeyRound,
    title: "3. Escrituración",
    description:
      "Entrega oficial y escrituración del lote para comenzar tu proyecto.",
    highlighted: true,
  },
];

export function AcquisitionSteps() {
  return (
    <div className="mb-section-gap">
      <h2 className="text-headline-lg-mobile md:text-headline-lg font-headline-lg text-primary text-center mb-12">
        Pasos legales de la compra
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {steps.map((step) => (
          <div
            key={step.title}
            className="flex flex-col items-center text-center p-8 bg-surface-container-lowest rounded-xl shadow-ambient border border-outline-variant/10"
          >
            <div
              className={`w-16 h-16 rounded-full flex items-center justify-center mb-6 ${
                step.highlighted
                  ? "bg-heritage-gold/20 text-primary"
                  : "bg-deep-forest/5 text-deep-forest"
              }`}
            >
              <step.icon className="w-8 h-8" />
            </div>
            <h4 className="text-lot-number font-lot-number text-primary mb-3">
              {step.title}
            </h4>
            <p className="text-body-md font-body-md text-on-surface-variant">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

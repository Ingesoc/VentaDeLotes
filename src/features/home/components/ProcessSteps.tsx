import { Building2, Home, Mountain, type LucideIcon } from "lucide-react";

const steps: { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: Mountain,
    title: "1. Compra tu lote",
    description:
      "Elige el espacio perfecto dentro de nuestro entorno natural exclusivo, con precio especial por pago de contado o separación con el 60% inicial y saldo al momento de escriturar.",
  },
  {
    icon: Building2,
    title: "2. Diseño",
    description:
      "Recibe un diseño arquitectónico tipo, o un diseño personalizado acorde a tus necesidades (servicio adicional).",
  },
  {
    icon: Home,
    title: "3. Construcción",
    description:
      "Podemos cotizar, planificar y diseñar la casa de tus sueños; construye con nosotros (servicio adicional).",
  },
];

export function ProcessSteps() {
  return (
    <section className="py-14 md:py-20 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto cv-auto [contain-intrinsic-size:auto_1100px]">
      <div className="text-center mb-10">
        <h2 className="text-headline-lg-mobile md:text-headline-lg font-headline-lg text-primary mb-4">
          Cómo funciona
        </h2>
        <p className="text-body-lg font-body-lg text-on-surface-variant max-w-2xl mx-auto">
          Un proceso simple y transparente para construir tu santuario.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
        <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-px bg-outline-variant/30 z-0" />
        {steps.map((step) => (
          <div
            key={step.title}
            className="relative z-10 flex flex-col items-center text-center bg-surface-container-lowest p-6 rounded-xl shadow-ambient border border-outline-variant/10 hover-lift"
          >
            <div className="w-14 h-14 bg-deep-forest text-on-primary rounded-full flex items-center justify-center mb-4 shadow-md">
              <step.icon className="h-6 w-6" aria-hidden="true" />
            </div>
            <h3 className="text-headline-md font-headline-md text-primary mb-3">
              {step.title}
            </h3>
            <p className="text-body-md font-body-md text-on-surface-variant">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

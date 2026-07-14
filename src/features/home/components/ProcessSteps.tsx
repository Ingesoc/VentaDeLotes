import { Mountain, Building2, Home } from "lucide-react";

const steps = [
  {
    icon: Mountain,
    title: "1. Compra tu lote",
    description:
      "Elige el espacio perfecto dentro de nuestro entorno natural exclusivo.",
  },
  {
    icon: Building2,
    title: "2. Diseño",
    description:
      "Recibe un paquete de diseño arquitectónico armónico con el paisaje.",
  },
  {
    icon: Home,
    title: "3. Construcción",
    description:
      "Construimos tu casa asegurando los más altos estándares de calidad.",
  },
];

export function ProcessSteps() {
  return (
    <section className="py-section-gap px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-headline-lg-mobile md:text-headline-lg font-headline-lg text-primary mb-4">
          Cómo funciona
        </h2>
        <p className="text-body-lg font-body-lg text-on-surface-variant max-w-2xl mx-auto">
          Un proceso simple y transparente para construir tu santuario.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
        <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-px bg-outline-variant/30 z-0" />
        {steps.map((step) => (
          <div
            key={step.title}
            className="relative z-10 flex flex-col items-center text-center bg-surface-container-lowest p-8 rounded-xl shadow-ambient border border-outline-variant/10"
          >
            <div className="w-20 h-20 bg-deep-forest text-on-primary rounded-full flex items-center justify-center mb-6 shadow-md">
              <step.icon className="w-9 h-9" />
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

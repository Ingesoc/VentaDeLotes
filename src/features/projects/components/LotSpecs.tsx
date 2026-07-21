import { MessageCircle } from "lucide-react";
import type { Lot } from "@/constants/lots";

interface LotSpecsProps {
  lot: Lot;
}

export function LotSpecs({ lot }: LotSpecsProps) {
  const specs = [
    {
      label: "Área Total",
      value: lot.areaM2
        ? `${lot.areaM2.toLocaleString("es-CO")} m²`
        : "Por confirmar",
    },
    { label: "Topografía", value: lot.topography ?? "Por confirmar" },
    { label: "Vista", value: lot.view ?? "Por confirmar" },
    { label: "Acceso Vía", value: lot.access ?? "Por confirmar" },
  ];

  return (
    <div className="bg-surface-container-lowest p-8 rounded-xl shadow-ambient border border-outline-variant/10">
      <h3 className="text-headline-md font-headline-md text-primary mb-6 border-b border-outline-variant/20 pb-4">
        Especificaciones
      </h3>
      <dl className="flex flex-col gap-4">
        {specs.map((spec, i) => (
          <div
            key={spec.label}
            className={`flex justify-between items-center py-2 ${
              i < specs.length - 1 ? "border-b border-outline-variant/20" : ""
            }`}
          >
            <dt className="text-body-md font-body-md text-on-surface-variant">
              {spec.label}
            </dt>
            <dd className="text-body-md font-body-md font-medium text-primary">
              {spec.value}
            </dd>
          </div>
        ))}
      </dl>

      <a
        href="https://wa.me/"
        target="_blank"
        rel="noopener noreferrer"
        className="w-full mt-8 flex items-center justify-center gap-2 bg-heritage-gold text-primary py-4 rounded-lg font-label-bold hover:opacity-90 transition-opacity shadow-md"
      >
        <MessageCircle className="w-5 h-5" />
        Reservar este lote
      </a>
    </div>
  );
}

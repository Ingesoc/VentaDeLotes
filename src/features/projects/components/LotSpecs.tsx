import type { Lot } from "@/constants/lots";
import { project } from "@/constants/project";
import { formatExactPrice } from "@/lib/format";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";

interface LotSpecsProps {
  lot: Lot;
}

export function LotSpecs({ lot }: LotSpecsProps) {
  const isAvailable = lot.status === "disponible";

  // Mensaje prellenado para WhatsApp: identifica el lote para que el asesor
  // sepa exactamente qué reservar sin que el cliente escriba nada.
  const reservationMessage = isAvailable
    ? `Hola, me interesa reservar el lote ${lot.id} de La Holanda en Quimbaya. ` +
      `Área: ${lot.areaM2.toLocaleString("es-CO")} m²` +
      (lot.price ? `, precio: ${formatExactPrice(lot.price)}` : "") +
      ". ¿Podemos coordinar una visita?"
    : `Hola, me interesa el lote ${lot.id} de La Holanda en Quimbaya. ` +
      `Área: ${lot.areaM2.toLocaleString("es-CO")} m². ` +
      "¿Me pueden confirmar disponibilidad?";

  const specs = [
    {
      label: "Precio",
      value: lot.price ? formatExactPrice(lot.price) : "Consultar precio",
    },
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
      <h2 className="text-headline-md font-headline-md text-primary mb-6 border-b border-outline-variant/20 pb-4">
        Especificaciones
      </h2>
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
        href={`https://wa.me/${project.contact.whatsapp}?text=${encodeURIComponent(reservationMessage)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full mt-8 flex items-center justify-center gap-2 bg-heritage-gold text-primary py-4 rounded-lg font-label-bold hover:opacity-90 transition-opacity shadow-md"
      >
        <WhatsAppIcon className="w-5 h-5" />
        {isAvailable ? "Reservar este lote" : "Consultar disponibilidad"}
      </a>
    </div>
  );
}

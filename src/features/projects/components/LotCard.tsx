import { Link } from "react-router-dom";
import { Ruler, DollarSign } from "lucide-react";
import type { Lot } from "@/constants/lots";
import { LazyImage } from "@/components/ui/LazyImage";

function formatPrice(price: number): string {
  const millones = price / 1_000_000;
  if (millones >= 100) {
    return `$${Math.round(millones).toLocaleString("es-CO")}M`;
  }
  return `$${millones.toLocaleString("es-CO", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  })}M`;
}

const statusStyles: Record<Lot["status"], { label: string; badge: string }> = {
  disponible: {
    label: "Disponible",
    badge: "bg-deep-forest text-on-primary",
  },
  reservado: {
    label: "Reservado",
    badge: "bg-heritage-gold text-primary",
  },
  vendido: {
    label: "Vendido",
    badge: "bg-obsidian/70 text-white",
  },
};

interface LotCardProps {
  lot: Lot;
}

export function LotCard({ lot }: LotCardProps) {
  const status = statusStyles[lot.status];
  const isSold = lot.status === "vendido";

  return (
    <div
      className={`bg-surface-container-lowest border border-outline-variant/20 rounded-xl overflow-hidden shadow-ambient flex flex-col group hover-lift ${
        isSold ? "opacity-70 grayscale-[30%]" : ""
      }`}
    >
      <div className="relative">
        <LazyImage
          src={lot.aerialImage}
          alt={`Vista aérea del Lote ${lot.id}${
            lot.areaM2 ? ` — ${lot.areaM2} m²` : ""
          }`}
          aspectClassName="aspect-[4/3]"
          className="img-zoom"
        />
        <span
          className={`absolute top-4 right-4 px-3 py-1 rounded-full text-label-caps font-label-caps uppercase ${status.badge}`}
        >
          {status.label}
        </span>
      </div>

      <div className="p-6 flex flex-col grow">
        <h3 className="text-lot-number font-lot-number text-primary mb-2">
          Lote {lot.id}
        </h3>
        {lot.price && (
          <p className="text-lot-number font-lot-number text-primary mb-2 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-heritage-gold" />
            {formatPrice(lot.price)}
            <span className="text-caption font-caption text-on-surface-variant font-normal">COP</span>
          </p>
        )}
        <p className="text-body-md font-body-md text-on-surface-variant flex items-center gap-2 mb-6 grow">
          <Ruler className="w-4 h-4" />
          {lot.areaM2
            ? `${lot.areaM2.toLocaleString("es-CO")} m²`
            : "Área por confirmar"}
        </p>

        {isSold ? (
          <button
            disabled
            type="button"
            className="w-full border border-outline-variant text-outline-variant font-label-bold py-3 rounded-lg cursor-not-allowed"
          >
            No disponible
          </button>
        ) : (
          <Link
            to={`/projects/${lot.id}`}
            className="w-full text-center border-2 border-deep-forest text-deep-forest font-label-bold py-3 rounded-lg hover:bg-deep-forest hover:text-on-primary transition-colors"
          >
            Ver detalle
          </Link>
        )}
      </div>
    </div>
  );
}

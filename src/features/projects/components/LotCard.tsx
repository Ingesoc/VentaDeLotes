import { useCallback } from "react";
import { Link } from "react-router";
import { Ruler, DollarSign, Heart } from "lucide-react";
import type { Lot } from "@/constants/lots";
import { LazyImage } from "@/components/ui/LazyImage";
import { formatPrice, formatExactPrice } from "@/lib/format";
import { useSavedLots } from "@/features/projects/hooks/useSavedLots";
import { trackLotFavorited } from "@/lib/analytics";

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
  no_disponible: {
    label: "No disponible",
    badge: "bg-obsidian/70 text-white",
  },
};

interface LotCardProps {
  lot: Lot;
}

export function LotCard({ lot }: LotCardProps) {
  const status = statusStyles[lot.status];
  const isUnavailable =
    lot.status === "vendido" || lot.status === "no_disponible";
  const { isSaved, toggleSave } = useSavedLots();
  const saved = isSaved(lot.id);

  const handleToggleSave = useCallback(() => {
    const newState = !saved;
    toggleSave(lot.id);
    trackLotFavorited(lot.id, newState);
  }, [saved, toggleSave, lot.id]);

  return (
    <div
      className={`bg-surface-container-lowest border border-outline-variant/20 rounded-xl overflow-hidden shadow-ambient flex flex-col group hover-lift ${
        isUnavailable ? "opacity-70 grayscale-[30%]" : ""
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
        <button
          type="button"
          onClick={handleToggleSave}
          aria-label={
            saved
              ? `Quitar el lote ${lot.id} de guardados`
              : `Guardar el lote ${lot.id}`
          }
          aria-pressed={saved}
          className="absolute top-3 left-3 z-10 p-2.5 rounded-full bg-surface/85 backdrop-blur-md border border-outline-variant/20 shadow-sm hover:scale-110 active:scale-95 transition-transform tap-target"
        >
          <Heart
            className={`w-5 h-5 ${
              saved
                ? "fill-heritage-gold text-heritage-gold"
                : "text-on-surface-variant"
            }`}
          />
        </button>
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
        {lot.price ? (
          <div className="mb-2">
            <p className="text-body-lg font-body-lg text-primary flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-heritage-gold" />
              {formatPrice(lot.price)}
              <span className="text-caption font-caption text-on-surface-variant font-normal">COP</span>
            </p>
            <p className="text-body-md font-body-md text-on-surface-variant">
              {formatExactPrice(lot.price)}
            </p>
          </div>
        ) : (
          <p className="text-body-lg font-body-lg text-primary mb-2 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-heritage-gold" />
            Consultar precio
          </p>
        )}
        <p className="text-body-md font-body-md text-on-surface-variant flex items-center gap-2 mb-6 grow">
          <Ruler className="w-4 h-4" />
          {lot.areaM2
            ? `${lot.areaM2.toLocaleString("es-CO")} m²`
            : "Área por confirmar"}
        </p>

        {isUnavailable ? (
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

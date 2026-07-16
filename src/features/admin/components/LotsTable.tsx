import { useState } from "react";
import {
  Pencil,
  Check,
  X,
  Loader2,
  Image as ImageIcon,
} from "lucide-react";
import type { Lot } from "./useLots";

const statusColors: Record<string, string> = {
  disponible: "bg-deep-forest text-on-primary",
  reservado: "bg-heritage-gold text-primary",
  vendido: "bg-obsidian/70 text-white",
};

interface LotsTableProps {
  lots: Lot[];
  saving: boolean;
  uploading: string | null;
  onSave: (id: string, updates: { status: Lot["status"]; price: number | null }) => Promise<boolean>;
  onUploadImage: (lotId: string) => void;
}

function LotRow({
  lot,
  saving,
  uploading,
  onSave,
  onUploadImage,
}: {
  lot: Lot;
  saving: boolean;
  uploading: string | null;
  onSave: (id: string, updates: { status: Lot["status"]; price: number | null }) => Promise<boolean>;
  onUploadImage: (lotId: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState<{ status: Lot["status"]; price: number | null }>({
    status: lot.status,
    price: lot.price,
  });

  const handleSave = async () => {
    const ok = await onSave(lot.id, editForm);
    if (ok) setEditing(false);
  };

  const handleCancel = () => {
    setEditing(false);
    setEditForm({ status: lot.status, price: lot.price });
  };

  return (
    <tr className="border-b border-outline-variant/10 hover:bg-surface-container/50 transition-colors">
      <td className="px-6 py-4">
        <span className="font-label-bold text-primary">
          Lote {lot.id}
        </span>
      </td>
      <td className="px-6 py-4 text-body-md text-on-surface-variant">
        {lot.area_m2
          ? `${lot.area_m2.toLocaleString("es-CO")} m²`
          : "—"}
      </td>
      <td className="px-6 py-4">
        {editing ? (
          <input
            type="number"
            value={editForm.price ?? ""}
            onChange={(e) =>
              setEditForm((prev) => ({
                ...prev,
                price: e.target.value ? Number(e.target.value) : null,
              }))
            }
            placeholder="COP"
            className="w-32 px-3 py-1 border border-outline-variant/50 rounded text-body-md font-body-md focus:ring-2 focus:ring-heritage-gold focus:border-transparent"
          />
        ) : (
          <span className="text-body-md text-on-surface-variant">
            {lot.price
              ? `$${(lot.price / 1_000_000).toLocaleString("es-CO")}M`
              : "—"}
          </span>
        )}
      </td>
      <td className="px-6 py-4">
        {editing ? (
          <select
            value={editForm.status}
            onChange={(e) =>
              setEditForm((prev) => ({
                ...prev,
                status: e.target.value as Lot["status"],
              }))
            }
            aria-label="Estado del lote"
            className="px-3 py-1 border border-outline-variant/50 rounded text-body-md font-body-md focus:ring-2 focus:ring-heritage-gold focus:border-transparent"
          >
            <option value="disponible">Disponible</option>
            <option value="reservado">Reservado</option>
            <option value="vendido">Vendido</option>
          </select>
        ) : (
          <span
            className={`inline-block px-3 py-1 rounded-full text-caption font-caption uppercase ${statusColors[lot.status]}`}
          >
            {lot.status}
          </span>
        )}
      </td>
      <td className="px-6 py-4">
        <button
          onClick={() => onUploadImage(lot.id)}
          type="button"
          disabled={uploading === lot.id}
          className="flex items-center gap-2 text-body-md font-body-md text-on-surface-variant hover:text-heritage-gold transition-colors disabled:opacity-50"
        >
          {uploading === lot.id ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <ImageIcon className="w-4 h-4" />
          )}
          <span className="text-caption truncate max-w-[120px]">
            {lot.aerial_image.includes("res.cloudinary.com")
              ? "✅ Cloudinary"
              : "Subir imagen"}
          </span>
        </button>
      </td>
      <td className="px-6 py-4 text-right">
        {editing ? (
          <div className="flex items-center justify-end gap-2">
            <button
              onClick={handleSave}
              type="button"
              disabled={saving}
              aria-label="Guardar cambios"
              className="p-2 rounded-lg bg-deep-forest text-on-primary hover:opacity-90 transition-all disabled:opacity-60"
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Check className="w-4 h-4" />
              )}
            </button>
            <button
              onClick={handleCancel}
              type="button"
              aria-label="Cancelar edición"
              className="p-2 rounded-lg border border-outline-variant/50 text-on-surface-variant hover:bg-surface-container transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setEditing(true)}
            type="button"
            aria-label="Editar lote"
            className="p-2 rounded-lg border border-outline-variant/50 text-on-surface-variant hover:bg-surface-container transition-colors"
          >
            <Pencil className="w-4 h-4" />
          </button>
        )}
      </td>
    </tr>
  );
}

export function LotsTable({
  lots,
  saving,
  uploading,
  onSave,
  onUploadImage,
}: LotsTableProps) {
  return (
    <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-outline-variant/20">
              <th className="text-left px-6 py-4 text-caption font-caption text-on-surface-variant uppercase tracking-wider">
                Lote
              </th>
              <th className="text-left px-6 py-4 text-caption font-caption text-on-surface-variant uppercase tracking-wider">
                Área
              </th>
              <th className="text-left px-6 py-4 text-caption font-caption text-on-surface-variant uppercase tracking-wider">
                Precio
              </th>
              <th className="text-left px-6 py-4 text-caption font-caption text-on-surface-variant uppercase tracking-wider">
                Estado
              </th>
              <th className="text-left px-6 py-4 text-caption font-caption text-on-surface-variant uppercase tracking-wider">
                Imagen
              </th>
              <th className="text-right px-6 py-4 text-caption font-caption text-on-surface-variant uppercase tracking-wider">
                Acción
              </th>
            </tr>
          </thead>
          <tbody>
            {lots.map((lot) => (
              <LotRow
                key={lot.id}
                lot={lot}
                saving={saving}
                uploading={uploading}
                onSave={onSave}
                onUploadImage={onUploadImage}
              />
            ))}
          </tbody>
        </table>
      </div>

      {lots.length === 0 && (
        <div className="text-center py-16 text-on-surface-variant">
          No se encontraron lotes
        </div>
      )}
    </div>
  );
}

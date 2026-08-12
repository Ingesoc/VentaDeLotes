import { useEffect, useRef, useState } from "react";
import { Loader2, X } from "lucide-react";
import { useLots, type Lot } from "./components/useLots";
import { LotsHeader } from "./components/LotsHeader";
import { LotsTable } from "./components/LotsTable";

const LOT_STATUSES: Lot["status"][] = [
  "disponible",
  "reservado",
  "vendido",
  "no_disponible",
];

const statusLabel: Record<Lot["status"], string> = {
  disponible: "Disponible",
  reservado: "Reservado",
  vendido: "Vendido",
  no_disponible: "No disponible",
};

export function Component() {
  return <LotsPage />;
}

export function LotsPage() {
  const {
    lots,
    loading,
    saving,
    uploading,
    saveLot,
    createLot,
    deleteLot,
    handleUploadImage,
  } = useLots();
  const [search, setSearch] = useState("");

  // Estado del modal de creación
  const [showCreate, setShowCreate] = useState(false);
  const [newLot, setNewLot] = useState({
    id: "",
    areaM2: "",
    price: "",
    status: "disponible" as Lot["status"],
  });
  const [createError, setCreateError] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDialogElement | null>(null);

  // El modal usa el elemento <dialog> nativo (focus trapping + ESC gratis)
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (showCreate && !dialog.open) {
      dialog.showModal();
    } else if (!showCreate && dialog.open) {
      dialog.close();
    }
  }, [showCreate]);

  const filteredLots = lots.filter(
    (lot) =>
      lot.id.includes(search) || lot.status.includes(search.toLowerCase()),
  );

  const openCreateModal = () => {
    setNewLot({ id: "", areaM2: "", price: "", status: "disponible" });
    setCreateError(null);
    setShowCreate(true);
  };

  const closeCreateModal = () => {
    if (saving) return;
    setShowCreate(false);
    setCreateError(null);
  };

  const handleCreateLot = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError(null);

    if (!newLot.id.trim()) {
      setCreateError("El ID del lote es obligatorio (ej: 17).");
      return;
    }

    const result = await createLot({
      id: newLot.id.trim(),
      areaM2: newLot.areaM2 ? Number(newLot.areaM2) : null,
      price: newLot.price ? Number(newLot.price) : null,
      status: newLot.status,
    });

    if (!result.ok) {
      setCreateError(result.error ?? "No se pudo crear el lote.");
      return;
    }

    setShowCreate(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-heritage-gold" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <LotsHeader
        search={search}
        onSearchChange={setSearch}
        onNewLot={openCreateModal}
        creating={saving}
      />

      <LotsTable
        lots={filteredLots}
        saving={saving}
        uploading={uploading}
        onSave={saveLot}
        onUploadImage={handleUploadImage}
        onDelete={deleteLot}
      />

      <p className="text-caption text-on-surface-variant">
        Mostrando {filteredLots.length} de {lots.length} lotes
      </p>

      {/* Modal: crear lote (dialog nativo) */}
      <dialog
        ref={dialogRef}
        onClose={closeCreateModal}
        aria-labelledby="create-lot-title"
        className="w-full max-w-md rounded-2xl shadow-2xl bg-surface-container-lowest p-0 backdrop:bg-black/50 m-auto"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant/20">
          <h2 id="create-lot-title" className="text-headline-md font-headline-md text-primary">
            Crear lote
          </h2>
          <button
            type="button"
            onClick={closeCreateModal}
            disabled={saving}
            aria-label="Cerrar"
            className="p-2 rounded-lg text-on-surface-variant hover:bg-surface-container transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleCreateLot} className="px-6 py-6 space-y-5">
              {createError && (
                <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm font-medium">
                  {createError}
                </div>
              )}

              <div>
                <label
                  htmlFor="new-lot-id"
                  className="block text-label-bold font-label-bold text-primary mb-2"
                >
                  ID del lote *
                </label>
                <input
                  id="new-lot-id"
                  type="text"
                  value={newLot.id}
                  onChange={(e) =>
                    setNewLot((prev) => ({ ...prev, id: e.target.value }))
                  }
                  placeholder="Ej: 17"
                  required
                  autoFocus
                  className="w-full bg-transparent border border-outline-variant rounded-lg px-4 py-3 text-body-md font-body-md text-on-background focus:ring-2 focus:ring-heritage-gold focus:border-transparent transition-colors placeholder:text-on-surface-variant/50"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="new-lot-area"
                    className="block text-label-bold font-label-bold text-primary mb-2"
                  >
                    Área (m²)
                  </label>
                  <input
                    id="new-lot-area"
                    type="number"
                    min="0"
                    value={newLot.areaM2}
                    onChange={(e) =>
                      setNewLot((prev) => ({ ...prev, areaM2: e.target.value }))
                    }
                    placeholder="Ej: 2000"
                    className="w-full bg-transparent border border-outline-variant rounded-lg px-4 py-3 text-body-md font-body-md text-on-background focus:ring-2 focus:ring-heritage-gold focus:border-transparent transition-colors placeholder:text-on-surface-variant/50"
                  />
                </div>
                <div>
                  <label
                    htmlFor="new-lot-price"
                    className="block text-label-bold font-label-bold text-primary mb-2"
                  >
                    Precio (COP)
                  </label>
                  <input
                    id="new-lot-price"
                    type="number"
                    min="0"
                    value={newLot.price}
                    onChange={(e) =>
                      setNewLot((prev) => ({ ...prev, price: e.target.value }))
                    }
                    placeholder="Ej: 200000000"
                    className="w-full bg-transparent border border-outline-variant rounded-lg px-4 py-3 text-body-md font-body-md text-on-background focus:ring-2 focus:ring-heritage-gold focus:border-transparent transition-colors placeholder:text-on-surface-variant/50"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="new-lot-status"
                  className="block text-label-bold font-label-bold text-primary mb-2"
                >
                  Estado
                </label>
                <select
                  id="new-lot-status"
                  value={newLot.status}
                  onChange={(e) =>
                    setNewLot((prev) => ({
                      ...prev,
                      status: e.target.value as Lot["status"],
                    }))
                  }
                  className="w-full bg-transparent border border-outline-variant rounded-lg px-4 py-3 text-body-md font-body-md text-on-background focus:ring-2 focus:ring-heritage-gold focus:border-transparent transition-colors"
                >
                  {LOT_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {statusLabel[status]}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full bg-deep-forest text-on-primary font-label-bold py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Creando...
                  </>
                ) : (
                  "Crear lote"
                )}
              </button>
            </form>
      </dialog>
    </div>
  );
}

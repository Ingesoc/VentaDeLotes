import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useLots } from "./components/useLots";
import { LotsHeader } from "./components/LotsHeader";
import { LotsTable } from "./components/LotsTable";

export function Component() {
  return <LotsPage />;
}

export function LotsPage() {
  const { lots, loading, saving, uploading, saveLot, handleUploadImage } =
    useLots();
  const [search, setSearch] = useState("");

  const filteredLots = lots.filter(
    (lot) =>
      lot.id.includes(search) || lot.status.includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-heritage-gold" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <LotsHeader search={search} onSearchChange={setSearch} />

      <LotsTable
        lots={filteredLots}
        saving={saving}
        uploading={uploading}
        onSave={saveLot}
        onUploadImage={handleUploadImage}
      />

      <p className="text-caption text-on-surface-variant">
        Mostrando {filteredLots.length} de {lots.length} lotes
      </p>
    </div>
  );
}

import { Search } from "lucide-react";

interface LotsHeaderProps {
  search: string;
  onSearchChange: (value: string) => void;
}

export function LotsHeader({ search, onSearchChange }: LotsHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-headline-lg font-headline-lg text-primary">
          Gestión de Lotes
        </h1>
        <p className="text-body-md text-on-surface-variant mt-1">
          Edita estado, precio e imágenes de los lotes
        </p>
      </div>

      <div className="relative w-full sm:w-72">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Buscar lote..."
          className="w-full pl-10 pr-4 py-2 bg-surface-container-lowest border border-outline-variant/30 rounded-lg text-body-md font-body-md text-on-background focus:ring-2 focus:ring-heritage-gold focus:border-transparent transition-all"
        />
      </div>
    </div>
  );
}

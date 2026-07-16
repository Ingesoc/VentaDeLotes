import { Mountain } from "lucide-react";

interface EmptyStateProps {
  onClearFilters: () => void;
}

export function EmptyState({ onClearFilters }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="bg-deep-forest/5 p-8 rounded-full mb-6">
        <Mountain className="w-12 h-12 text-deep-forest" />
      </div>
      <h3 className="text-headline-md font-headline-md text-primary mb-2">
        No encontramos resultados
      </h3>
      <p className="text-body-md font-body-md text-on-surface-variant max-w-sm mb-8">
        No hay lotes que coincidan con los filtros seleccionados. Intenta con
        otros criterios.
      </p>
      <button
        onClick={onClearFilters}
        type="button"
        className="bg-deep-forest text-on-primary px-8 py-3 rounded-lg font-label-bold hover:opacity-90 transition-opacity"
      >
        Limpiar filtros
      </button>
    </div>
  );
}

import type { LotStatus } from "@/constants/lots";

export type AreaRange = "all" | "under-2005" | "2005-2010" | "over-2010";

interface LotFiltersProps {
  status: LotStatus | "all";
  onStatusChange: (status: LotStatus | "all") => void;
  areaRange: AreaRange;
  onAreaRangeChange: (range: AreaRange) => void;
}

export function LotFilters({
  status,
  onStatusChange,
  areaRange,
  onAreaRangeChange,
}: LotFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-end w-full lg:w-auto">
      <div className="flex flex-col w-full sm:w-48">
        <label
          htmlFor="filter-status"
          className="text-label-caps font-label-caps text-on-surface-variant mb-2 uppercase"
        >
          Estado
        </label>
        <select
          id="filter-status"
          value={status}
          onChange={(e) => onStatusChange(e.target.value as LotStatus | "all")}
          className="bg-transparent border-0 border-b border-outline-variant focus:ring-0 focus:border-heritage-gold text-body-md font-body-md text-primary pb-2 pl-0"
        >
          <option value="all">Todos los estados</option>
          <option value="disponible">Disponible</option>
          <option value="reservado">Reservado</option>
          <option value="vendido">Vendido</option>
        </select>
      </div>

      <div className="flex flex-col w-full sm:w-48">
        <label
          htmlFor="filter-area"
          className="text-label-caps font-label-caps text-on-surface-variant mb-2 uppercase"
        >
          Área (m²)
        </label>
        <select
          id="filter-area"
          value={areaRange}
          onChange={(e) => onAreaRangeChange(e.target.value as AreaRange)}
          className="bg-transparent border-0 border-b border-outline-variant focus:ring-0 focus:border-heritage-gold text-body-md font-body-md text-primary pb-2 pl-0"
        >
          <option value="all">Todos los tamaños</option>
          <option value="under-2005">Menos de 2005 m²</option>
          <option value="2005-2010">2005 - 2010 m²</option>
          <option value="over-2010">Más de 2010 m²</option>
        </select>
      </div>
    </div>
  );
}

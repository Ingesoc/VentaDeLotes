import { useEffect, useMemo, useState } from "react";
import { lots as staticLots, type Lot } from "@/constants/lots";
import { fetchPublicLots } from "@/lib/lotService";

/**
 * Carga los lotes públicos: arranca con los datos estáticos (render
 * inmediato) y en segundo plano intenta obtener los datos vivos de Supabase
 * cuando VITE_LIVE_LOTS=true. Si la consulta falla, permanece en modo
 * estático.
 */
export function usePublicLots() {
  const [lots, setLots] = useState<Lot[]>(staticLots);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    fetchPublicLots().then((result) => {
      if (cancelled) return;
      setLots(result);
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return { lots, loading };
}

/**
 * Obtiene un lote por id desde la lista viva (o estática) y sus lotes
 * relacionados, en una sola suscripción de datos.
 */
export function usePublicLot(id?: string) {
  const { lots, loading } = usePublicLots();

  const lot = useMemo(
    () => (id ? lots.find((item) => item.id === id) : undefined),
    [lots, id],
  );

  const relatedLots = useMemo(
    () => (lot ? lots.filter((item) => item.id !== lot.id).slice(0, 2) : []),
    [lots, lot],
  );

  return { lot, relatedLots, loading };
}

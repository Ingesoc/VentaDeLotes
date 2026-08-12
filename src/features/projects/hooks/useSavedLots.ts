import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "laholanda:saved-lots";

function readSaved(): string[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed)
      ? parsed.filter((item): item is string => typeof item === "string")
      : [];
  } catch {
    return [];
  }
}

function writeSaved(ids: string[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch {
    // Almacenamiento no disponible (modo privado, etc.) — la lista solo vive en memoria.
  }
}

/* ─── Mini-store compartido ─────────────────────────────────────────
 * Todas las instancias del hook comparten el mismo estado, de modo que un
 * toggle en una tarjeta se refleja al instante en las demás (por ejemplo si
 * el mismo lote aparece en varias secciones de la página) y en /saved.
 */
let cachedIds: string[] = readSaved();
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

/**
 * Lotes favoritos del visitante, persistidos en localStorage (sin cuenta ni
 * backend). El corazón de las tarjetas y la página /saved comparten este hook.
 */
export function useSavedLots() {
  const [savedIds, setSavedIds] = useState<string[]>(cachedIds);

  useEffect(() => {
    const sync = () => setSavedIds(cachedIds);
    listeners.add(sync);
    return () => {
      listeners.delete(sync);
    };
  }, []);

  const toggleSave = useCallback((id: string) => {
    const next = cachedIds.includes(id)
      ? cachedIds.filter((item) => item !== id)
      : [...cachedIds, id];
    cachedIds = next;
    writeSaved(next);
    emit();
  }, []);

  const isSaved = useCallback((id: string) => cachedIds.includes(id), []);

  return { savedIds, toggleSave, isSaved };
}

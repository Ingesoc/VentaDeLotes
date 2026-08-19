import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { uploadImage } from "@/lib/cloudinary";

export interface Lot {
  id: string;
  area_m2: number | null;
  price: number | null;
  status: "disponible" | "reservado" | "vendido" | "no_disponible";
  aerial_image: string;
}

export function useLots() {
  const [lots, setLots] = useState<Lot[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadLots = async () => {
      try {
        const { data, error } = await supabase
          .from("lots")
          .select("*")
          .order("id");

        if (error) throw error;
        if (!cancelled) setLots(data ?? []);
      } catch (err) {
        if (!cancelled) console.error("Error loading lots:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadLots();
    return () => { cancelled = true; };
  }, []);

  const saveLot = useCallback(async (id: string, updates: { status: Lot["status"]; price: number | null }) => {
    // Validación en JS: precio no puede ser negativo
    if (updates.price !== null && updates.price < 0) {
      console.error("El precio no puede ser negativo.");
      return false;
    }
    setSaving(true);
    try {
      const { error } = await supabase
        .from("lots")
        .update({
          status: updates.status,
          price: updates.price ?? null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id);

      if (error) throw error;

      setLots((prev) =>
        prev.map((l) => (l.id === id ? { ...l, ...updates } : l))
      );
      return true;
    } catch (err) {
      console.error("Error saving lot:", err);
      setError("No se pudo guardar el lote. Intenta de nuevo.");
      return false;
    } finally {
      setSaving(false);
    }
  }, []);

  const handleUploadImage = useCallback(async (lotId: string) => {
    setUploading(lotId);
    try {
      const url = await uploadImage();
      if (url) {
        const { error } = await supabase
          .from("lots")
          .update({
            aerial_image: url,
            updated_at: new Date().toISOString(),
          })
          .eq("id", lotId);

        if (error) throw error;

        setLots((prev) =>
          prev.map((l) =>
            l.id === lotId ? { ...l, aerial_image: url } : l
          )
        );
      }
    } catch (err) {
      console.error("Error uploading image:", err);
      setError("No se pudo subir la imagen. Intenta de nuevo.");
    } finally {
      setUploading(null);
    }
  }, []);

  const reloadLots = useCallback(async () => {
    const { data, error } = await supabase
      .from("lots")
      .select("*")
      .order("id");

    if (error) throw error;
    setLots(data ?? []);
  }, []);

  const createLot = useCallback(
    async (input: {
      id: string;
      areaM2: number | null;
      price: number | null;
      status: Lot["status"];
    }): Promise<{ ok: boolean; error?: string }> => {
      // Validación en JS: precio no negativo, área positiva
      if (input.price !== null && input.price < 0) {
        return { ok: false, error: "El precio no puede ser negativo." };
      }
      if (input.areaM2 !== null && input.areaM2 <= 0) {
        return { ok: false, error: "El área debe ser mayor a 0." };
      }
      setSaving(true);
      try {
        const { error } = await supabase.from("lots").insert({
          id: input.id,
          area_m2: input.areaM2,
          price: input.price,
          status: input.status,
          aerial_image: "",
          perspective_image: "",
        });
        if (error) throw error;

        await reloadLots();
        return { ok: true };
      } catch (err) {
        console.error("Error creating lot:", err);
        return {
          ok: false,
          error:
            err instanceof Error
              ? err.message
              : "No se pudo crear el lote. Verifica que el ID no exista ya.",
        };
      } finally {
        setSaving(false);
      }
    },
    [reloadLots],
  );

  const deleteLot = useCallback(async (id: string): Promise<boolean> => {
    setSaving(true);
    try {
      const { error } = await supabase.from("lots").delete().eq("id", id);
      if (error) throw error;

      setLots((prev) => prev.filter((lot) => lot.id !== id));
      return true;
    } catch (err) {
      console.error("Error deleting lot:", err);
      setError("No se pudo eliminar el lote. Intenta de nuevo.");
      return false;
    } finally {
      setSaving(false);
    }
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return {
    lots,
    loading,
    saving,
    uploading,
    error,
    clearError,
    saveLot,
    createLot,
    deleteLot,
    handleUploadImage,
  };
}

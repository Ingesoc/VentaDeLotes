import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { uploadImage } from "@/lib/cloudinary";

export interface Lot {
  id: string;
  area_m2: number | null;
  price: number | null;
  status: "disponible" | "reservado" | "vendido";
  aerial_image: string;
}

export function useLots() {
  const [lots, setLots] = useState<Lot[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);

  const loadLots = async () => {
    try {
      const { data, error } = await supabase
        .from("lots")
        .select("*")
        .order("id");

      if (error) throw error;
      setLots(data ?? []);
    } catch (err) {
      console.error("Error loading lots:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLots();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveLot = useCallback(async (id: string, updates: { status: Lot["status"]; price: number | null }) => {
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
    } finally {
      setUploading(null);
    }
  }, []);

  return {
    lots,
    loading,
    saving,
    uploading,
    saveLot,
    handleUploadImage,
  };
}

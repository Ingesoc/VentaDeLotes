/**
 * Mutation hooks para leads.
 *
 * Manejan la escritura de datos (actualizar stage, agregar notas,
 * registrar interacciones) con invalidación automática de queries
 * para mantener la UI sincronizada.
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { leadKeys } from "../queries/leads";
import type { FunnelStage } from "../../types/lead";

// ── Mutation: actualizar etapa del embudo ────────────────────────

interface UpdateStageInput {
  leadId: number;
  newStage: FunnelStage;
  notas?: string;
}

/**
 * Actualiza la etapa del embudo de un lead.
 * Usa la RPC `update_lead_stage` que también registra la interacción.
 */
export function useUpdateLeadStage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ leadId, newStage, notas }: UpdateStageInput) => {
      const { error } = await supabase.rpc("update_lead_stage" as never, {
        p_lead_id: leadId,
        p_new_stage: newStage,
        p_notas: notas || null,
      } as never);

      if (error) throw error;
    },
    onSuccess: (_data, variables) => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: leadKeys.all });
      // También invalidar el detalle del lead específico
      queryClient.invalidateQueries({
        queryKey: leadKeys.detail(variables.leadId),
      });
    },
  });
}

// ── Mutation: actualizar notas del lead ──────────────────────────

interface UpdateNotesInput {
  leadId: number;
  notes: string;
}

/**
 * Actualiza las notas internas de un lead.
 */
export function useUpdateLeadNotes() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ leadId, notes }: UpdateNotesInput) => {
      const { error } = await supabase
        .from("leads")
        .update({ notes })
        .eq("id", leadId);

      if (error) throw error;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: leadKeys.all });
      queryClient.invalidateQueries({
        queryKey: leadKeys.detail(variables.leadId),
      });
    },
  });
}

// ── Mutation: actualizar score del lead ──────────────────────────

interface UpdateScoreInput {
  leadId: number;
  score: number;
}

/**
 * Actualiza el score de un lead (0-100).
 */
export function useUpdateLeadScore() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ leadId, score }: UpdateScoreInput) => {
      const clampedScore = Math.max(0, Math.min(100, score));
      const { error } = await supabase
        .from("leads")
        .update({ score: clampedScore })
        .eq("id", leadId);

      if (error) throw error;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: leadKeys.all });
      queryClient.invalidateQueries({
        queryKey: leadKeys.detail(variables.leadId),
      });
    },
  });
}

// ── Mutation: registrar interacción manual ───────────────────────

interface AddInteractionInput {
  leadId: number;
  tipo: "llamada" | "mensaje_whatsapp" | "mensaje_email" | "visita_lote";
  canal?: "telefono" | "whatsapp" | "email" | "presencial";
  notas?: string;
}

/**
 * Registra una interacción manual del equipo de ventas con un lead.
 */
export function useAddInteraction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ leadId, tipo, canal, notas }: AddInteractionInput) => {
      const { error } = await supabase.from("interacciones").insert({
        lead_id: leadId,
        tipo,
        canal: canal ?? null,
        notas: notas ?? null,
      });

      if (error) throw error;

      // Actualizar last_contact_at del lead
      await supabase
        .from("leads")
        .update({ last_contact_at: new Date().toISOString() })
        .eq("id", leadId);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: leadKeys.all });
      queryClient.invalidateQueries({
        queryKey: leadKeys.detail(variables.leadId),
      });
      queryClient.invalidateQueries({
        queryKey: leadKeys.interactions(variables.leadId),
      });
    },
  });
}

// ── Mutation: eliminar lead ──────────────────────────────────────

/**
 * Elimina un lead (solo para admins).
 */
export function useDeleteLead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (leadId: number) => {
      const { error } = await supabase
        .from("leads")
        .delete()
        .eq("id", leadId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: leadKeys.all });
    },
  });
}

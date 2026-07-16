import type { SupabaseClient } from "@supabase/supabase-js";

/** Verifica si un email pertenece a un administrador usando RPC. */
export async function checkAdminStatus(
  supabase: SupabaseClient,
  userEmail: string | undefined,
) {
  if (!userEmail) return false;
  const { data, error } = await supabase.rpc("has_backstage_access", {
    user_email: userEmail,
  });

  if (error) {
    console.error("Error checking admin status:", error.message);
    return false;
  }
  return !!data;
}

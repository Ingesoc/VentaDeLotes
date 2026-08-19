// ============================================================
// Edge Function: export-data
// ============================================================
// Exporta datos de analytics en formato CSV.
//
// Solo accesible para administradores autenticados.
// Usa las vistas de exportación (vista_export_leads, vista_export_events).
//
// Despliegue:
//   npx supabase functions deploy export-data
//
// Uso:
//   GET /functions/v1/export-data?table=leads
//   GET /functions/v1/export-data?table=events
//   GET /functions/v1/export-data?table=funnel
//
// Headers requeridos:
//   Authorization: Bearer <supabase_access_token>

import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// ── Tipos ─────────────────────────────────────────────────────

type TableName = "leads" | "events" | "funnel";

interface ExportRow {
  [key: string]: string | number | boolean | null;
}

// ── Helpers ───────────────────────────────────────────────────

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

/**
 * Convierte un array de objetos a CSV.
 */
function toCsv(rows: ExportRow[]): string {
  if (rows.length === 0) return "";

  const headers = Object.keys(rows[0]);
  const lines = [headers.join(",")];

  for (const row of rows) {
    const values = headers.map((h) => {
      const val = row[h];
      if (val === null || val === undefined) return "";
      const str = String(val);
      // Escapar comillas y envolver en comillas si contiene comas, saltos o comillas
      if (
        str.includes(",") ||
        str.includes("\n") ||
        str.includes('"')
      ) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    });
    lines.push(values.join(","));
  }

  return lines.join("\n");
}

// ── Vistas de exportación ─────────────────────────────────────

const VIEWS: Record<TableName, string> = {
  leads: "vista_export_leads",
  events: "vista_export_events",
  funnel: "vista_export_funnel",
};

const VIEW_LABELS: Record<TableName, string> = {
  leads: "leads-completos",
  events: "eventos-producto",
  funnel: "funnel-atribucion",
};

// ── Handler ───────────────────────────────────────────────────

serve(async (req) => {
  // CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "GET") {
    return json({ error: "Método no permitido. Usa GET." }, 405);
  }

  // ── Auth ────────────────────────────────────────────────

  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    return json({ error: "Token de autenticación requerido." }, 401);
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? "",
    { global: { headers: { Authorization: authHeader } } },
  );

  // Verificar que el usuario es admin
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return json({ error: "No autenticado." }, 401);
  }

  // Usar service role para acceder a las vistas
  const adminClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
  );

  // Verificar admin
  const { data: isAdmin } = await adminClient.rpc("has_backstage_access", {
    user_email: user.email,
  });

  if (!isAdmin) {
    return json({ error: "Acceso denegado. Solo administradores." }, 403);
  }

  // ── Params ─────────────────────────────────────────────

  const url = new URL(req.url);
  const table = url.searchParams.get("table") as TableName | null;

  if (!table || !VIEWS[table]) {
    return json(
      {
        error: "Parámetro 'table' requerido.",
        validValues: ["leads", "events", "funnel"],
      },
      400,
    );
  }

  // ── Query ──────────────────────────────────────────────

  try {
    const viewName = VIEWS[table];
    const { data, error } = await adminClient
      .from(viewName)
      .select("*")
      .limit(10000); // Límite de seguridad

    if (error) {
      console.error(`Error querying ${viewName}:`, error);
      return json(
        {
          error: `Error al consultar ${viewName}. ¿Ejecutaste la migración de exportación?`,
          detail: error.message,
        },
        500,
      );
    }

    const rows = (data ?? []) as ExportRow[];

    if (url.searchParams.get("format") === "json") {
      // Retornar JSON si se pide
      return new Response(JSON.stringify(rows, null, 2), {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
          "Content-Disposition": `attachment; filename="${VIEW_LABELS[table]}.json"`,
        },
      });
    }

    // CSV por defecto
    const csv = toCsv(rows);
    const date = new Date().toISOString().slice(0, 10);

    return new Response(csv, {
      headers: {
        ...corsHeaders,
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${VIEW_LABELS[table]}-${date}.csv"`,
      },
    });
  } catch (err) {
    console.error("Export error:", err);
    return json({ error: "Error interno al exportar datos." }, 500);
  }
});

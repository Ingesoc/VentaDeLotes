// ============================================================
// Edge Function: notify-lead
// ============================================================
// Se invoca desde el cliente tras registrar un lead (ver src/lib/leads.ts).
// Envía un correo de aviso al equipo de ventas vía Resend.
//
// Despliegue (requiere Supabase CLI):
//   npx supabase login
//   npx supabase link --project-ref <TU_PROJECT_REF>
//   npx supabase secrets set RESEND_API_KEY=<key> \
//     NOTIFY_TO_EMAILS=gerencia.ingesocc@gmail.com \
//     NOTIFY_FROM_EMAIL="La Holanda <onboarding@resend.dev>"
//   npx supabase functions deploy notify-lead
//
// Secretos:
//   RESEND_API_KEY   — API key de https://resend.com/api-keys
//   NOTIFY_TO_EMAILS — destinatarios separados por coma
//   NOTIFY_FROM_EMAIL — remitente (por defecto el dominio compartido de Resend)

import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY") ?? "";
const NOTIFY_TO_EMAILS = (Deno.env.get("NOTIFY_TO_EMAILS") ?? "")
  .split(",")
  .map((email) => email.trim())
  .filter(Boolean);
const NOTIFY_FROM_EMAIL =
  Deno.env.get("NOTIFY_FROM_EMAIL") ?? "La Holanda <onboarding@resend.dev>";

const RESEND_ENDPOINT = "https://api.resend.com/emails";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface LeadPayload {
  name: string;
  email: string;
  phone: string;
  message?: string | null;
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

/** Escapa HTML para que los datos del lead no puedan inyectar markup en el correo. */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function buildLeadEmail(payload: LeadPayload): string {
  const rows: Array<[string, string]> = [
    ["Nombre", escapeHtml(payload.name)],
    ["Correo", escapeHtml(payload.email)],
    ["Teléfono", escapeHtml(payload.phone)],
    ["Mensaje", escapeHtml(payload.message || "—")],
  ];

  const rowsHtml = rows
    .map(
      ([label, value]) =>
        `<tr>
           <td style="padding:8px 12px;font-weight:600;color:#1B4332;white-space:nowrap;">${label}</td>
           <td style="padding:8px 12px;color:#334155;">${value}</td>
         </tr>`,
    )
    .join("");

  return `
    <div style="font-family:Inter,Arial,sans-serif;max-width:560px;margin:0 auto;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;">
      <div style="background:#1B4332;padding:20px 24px;">
        <h1 style="color:#FAFAF8;margin:0;font-size:18px;">Nuevo lead recibido</h1>
        <p style="color:#D4A373;margin:4px 0 0;font-size:13px;">La Holanda — Parcelación Campestre</p>
      </div>
      <table style="width:100%;border-collapse:collapse;background:#FAFAF8;">
        <tbody>${rowsHtml}</tbody>
      </table>
      <p style="padding:16px 24px;margin:0;font-size:12px;color:#64748b;background:#F1F5F9;">
        Un visitante del sitio web solicitó información. Contáctalo lo antes posible.
      </p>
    </div>`;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return json({ error: "Método no permitido" }, 405);
  }

  let payload: LeadPayload;
  try {
    payload = await req.json();
  } catch {
    return json({ error: "JSON inválido" }, 400);
  }

  if (!payload?.name || !payload?.email || !payload?.phone) {
    return json({ error: "Campos obligatorios: name, email, phone" }, 400);
  }

  if (!RESEND_API_KEY) {
    console.error("RESEND_API_KEY no configurada");
    return json({ error: "Servidor mal configurado" }, 500);
  }

  if (NOTIFY_TO_EMAILS.length === 0) {
    console.error("NOTIFY_TO_EMAILS no configurada");
    return json({ error: "Servidor mal configurado" }, 500);
  }

  const emailResult = await fetch(RESEND_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: NOTIFY_FROM_EMAIL,
      to: NOTIFY_TO_EMAILS,
      subject: `Nuevo lead: ${payload.name} (${payload.phone})`,
      html: buildLeadEmail(payload),
    }),
  });

  if (!emailResult.ok) {
    const detail = await emailResult.text();
    console.error("Resend error:", detail);
    return json({ error: "No se pudo enviar la notificación" }, 502);
  }

  return json({ ok: true });
});

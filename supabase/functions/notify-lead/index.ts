// ============================================================
// Edge Function: notify-lead
// ============================================================
// Se invoca desde el cliente tras registrar un lead (ver src/lib/leads.ts).
// Envía:
//   1. Correo de aviso al equipo de ventas.
//   2. Correo de confirmación al lead (usuario que llenó el formulario).
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

import { Resend } from "npm:resend@4";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY") ?? "";
const NOTIFY_TO_EMAILS = (Deno.env.get("NOTIFY_TO_EMAILS") ?? "")
  .split(",")
  .map((email) => email.trim())
  .filter(Boolean);
const NOTIFY_FROM_EMAIL =
  Deno.env.get("NOTIFY_FROM_EMAIL") ?? "La Holanda <onboarding@resend.dev>";

const resend = new Resend(RESEND_API_KEY);

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

/** Escapa HTML para que los datos del lead no puedan inyectar markup. */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// ── Email al equipo de ventas ────────────────────────────────

function buildTeamEmailHtml(payload: LeadPayload): string {
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

// ── Email de confirmación al lead ────────────────────────────

function buildLeadConfirmationHtml(name: string): string {
  return `
    <div style="font-family:Inter,Arial,sans-serif;max-width:560px;margin:0 auto;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;">
      <div style="background:#1B4332;padding:20px 24px;">
        <h1 style="color:#FAFAF8;margin:0;font-size:18px;">¡Gracias por contactarnos!</h1>
        <p style="color:#D4A373;margin:4px 0 0;font-size:13px;">La Holanda — Parcelación Campestre</p>
      </div>
      <div style="padding:24px;background:#FAFAF8;">
        <p style="color:#334155;font-size:15px;line-height:1.6;margin:0 0 16px;">
          Hola <strong>${escapeHtml(name)}</strong>,
        </p>
        <p style="color:#334155;font-size:15px;line-height:1.6;margin:0 0 16px;">
          Hemos recibido tu mensaje y nuestro equipo se pondrá en contacto
          contigo lo antes posible.
        </p>
        <p style="color:#334155;font-size:15px;line-height:1.6;margin:0 0 16px;">
          Si necesitas atención inmediata, puedes escribirnos por WhatsApp al
          <a href="https://wa.me/573217151831" style="color:#1B4332;font-weight:600;">321 715 1831</a>.
        </p>
        <p style="color:#334155;font-size:15px;line-height:1.6;margin:0;">
          ¡Esperamos conocerte pronto en La Holanda!
        </p>
      </div>
      <p style="padding:16px 24px;margin:0;font-size:12px;color:#64748b;background:#F1F5F9;text-align:center;">
        La Holanda — Quimbaya, Quindío · 
        <a href="https://laholanda.ingesocc.com" style="color:#1B4332;">laholanda.ingesocc.com</a>
      </p>
    </div>`;
}

// ── Handler ──────────────────────────────────────────────────

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

  // 1. Notificación al equipo de ventas
  const { error: teamError } = await resend.emails.send({
    from: NOTIFY_FROM_EMAIL,
    to: NOTIFY_TO_EMAILS,
    subject: `Nuevo lead: ${payload.name} (${payload.phone})`,
    html: buildTeamEmailHtml(payload),
  });

  if (teamError) {
    console.error("Resend team email error:", teamError);
    return json({ error: "No se pudo enviar la notificación" }, 502);
  }

  // 2. Confirmación al lead (fire-and-forget — no bloquea la respuesta)
  const { error: confirmError } = await resend.emails.send({
    from: NOTIFY_FROM_EMAIL,
    to: [payload.email],
    subject: "¡Gracias por contactarnos! — La Holanda",
    html: buildLeadConfirmationHtml(payload.name),
  });

  if (confirmError) {
    // No es crítico: el lead ya se guardó y la notificación al equipo se envió.
    console.error("Resend confirmation email error:", confirmError);
  }

  return json({ ok: true });
});

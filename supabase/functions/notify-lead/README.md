# notify-lead

Edge Function de Supabase que envía un correo de aviso al equipo de ventas
cuando el formulario de contacto registra un lead nuevo. Usa la API de Resend.

## Cómo funciona

1. El visitante llena el formulario de contacto.
2. `src/lib/leads.ts` registra el lead con la RPC `submit_lead` (se guarda en
   la tabla `leads`).
3. En paralelo (sin bloquear el formulario) se invoca esta función:
   `supabase.functions.invoke("notify-lead", { body: { name, email, phone, message } })`.
4. La función valida los datos y envía el correo a los destinatarios de
   `NOTIFY_TO_EMAILS`.

Si la función no está desplegada o el envío falla, el formulario funciona
igual: el lead ya quedó guardado en la base de datos.

## Despliegue

Requisitos: [Supabase CLI](https://supabase.com/docs/guides/cli) y una cuenta
en [Resend](https://resend.com) (free tier: 3000 correos/mes).

```bash
# 1. Crear el API key en https://resend.com/api-keys
#    Para probar sin dominio propio se usa el dominio compartido
#    onboarding@resend.dev como remitente.

# 2. Vincular el proyecto (una sola vez)
npx supabase login
npx supabase link --project-ref TU_PROJECT_REF

# 3. Configurar los secretos
npx supabase secrets set \
  RESEND_API_KEY=re_xxxxxxxx \
  NOTIFY_TO_EMAILS=gerencia.ingesocc@gmail.com \
  NOTIFY_FROM_EMAIL="La Holanda <onboarding@resend.dev>"

# 4. Desplegar
npx supabase functions deploy notify-lead
```

## Secretos

| Variable           | Obligatoria | Descripción |
| ------------------ | ----------- | ----------- |
| `RESEND_API_KEY`   | Sí          | API key de Resend |
| `NOTIFY_TO_EMAILS` | Sí          | Destinatarios separados por coma |
| `NOTIFY_FROM_EMAIL` | No         | Remitente; por defecto `La Holanda <onboarding@resend.dev>` |

## Notas

- Para enviar correos a destinatarios externos (no solo a tu propia cuenta)
  hay que verificar un dominio propio en Resend. Mientras tanto, el dominio
  compartido `onboarding@resend.dev` permite recibir el aviso en el correo de
  la empresa (la cuenta que creó el API key).
- La función valida el JWT de forma predeterminada (`verify_jwt = true`):
  solo se puede invocar desde el cliente con la anon key del proyecto, no por
  cualquiera.

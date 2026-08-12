---
tags:
  - media
  - cloudinary
  - images
  - lazy-loading
created: 2026-07-21
updated: 2026-08-12
---

# Manejo de medios

## Estrategia de imágenes

Todas las imágenes del proyecto se sirven desde Cloudinary (CDN) para:

- Carga optimizada (formatos modernos y compresión automática).
- Transformaciones bajo demanda (redimensionado).
- Caché global en el CDN.
- Sin costo de ancho de banda del servidor.

## Utilidad `cldUrl`

`src/lib/cloudinary.ts` exporta la función `cldUrl(url, width?)`, que agrega transformaciones de optimización a una URL de Cloudinary:

```typescript
cldUrl(url)                    // f_auto,q_auto
cldUrl(url, CLD_WIDTHS.HERO)   // f_auto,q_auto,dpr_auto,w_1920
cldUrl(url, 600)               // f_auto,q_auto,dpr_auto,w_600
```

- `f_auto`: formato automático (WebP, AVIF, etc.).
- `q_auto`: calidad automática optimizada.
- `dpr_auto`: densidad de píxeles según el dispositivo (pantallas Retina).
- `w_{width}`: redimensiona al ancho especificado.

### Anchos predefinidos (CLD_WIDTHS)

| Constante | Ancho | Uso |
| --- | --- | --- |
| `HERO` | 1920 | Imágenes a pantalla completa |
| `CAROUSEL` | 1200 | Carrusel de la home |
| `MASTERPLAN` | 1280 | Plano general |
| `LARGE` | 1000 | Galerías y secciones grandes |
| `CARD` | 800 | Tarjetas y features |
| `THUMB` | 400 | Miniaturas |
| `LOGO` | 200 | Logotipos |

## Widget de subida (panel admin)

`uploadImage()` abre el widget de Cloudinary para que los admins suban imágenes aéreas:

```typescript
export function uploadImage(): Promise<string | null> {
  // Abre cloudinary.createUploadWidget con:
  // cloudName, uploadPreset, sources: ["local", "url", "camera"]
  // multiple: false, maxFiles: 1, resourceType: "image"
}
```

Configuración requerida:

- `VITE_CLOUDINARY_CLOUD_NAME` — cloud name de Cloudinary.
- `VITE_CLOUDINARY_UPLOAD_PRESET` — upload preset (unsigned).

El script del widget se carga en `index.html`:

```html
<script src="https://upload-widget.cloudinary.com/global/all.js" type="text/javascript"></script>
```

Flujo: el admin hace clic en subir imagen, el widget se abre, el usuario selecciona el archivo, Cloudinary devuelve la `secure_url` y la URL se guarda en la tabla `lots` (columna `aerial_image`).

El script `scripts/upload-lots.mjs` (`bun run upload:lots`) sube en lote las imágenes de los lotes desde el proyecto.

## Componente LazyImage

Carga diferida de imágenes con placeholder:

```typescript
<LazyImage
  src="https://res.cloudinary.com/..."
  alt="Lote 01 - Vista aérea"
  aspectClassName="aspect-[4/3]"
  priority={false}
/>
```

Características:

- Skeleton animado mientras carga.
- Transición suave (fade-in) cuando la imagen está lista.
- Aspect ratio fijo para evitar cambios de layout (CLS).
- `loading="lazy"` y `decoding="async"` por defecto.
- `priority`: carga inmediata (`eager` + `fetchPriority="high"`) para imágenes visibles al inicio.

## Video de YouTube (YouTubeVideo)

Componente con carga perezosa (click-to-load):

- Muestra la miniatura del video con un botón de play.
- El iframe solo se monta al hacer clic (ahorra descargas).
- Usa el dominio `youtube-nocookie.com` (privacidad).
- Autoplay silenciado opcional (prop `autoplay`): agrega `autoplay=1&mute=1` y muestra un botón para activar el sonido.
- El iframe lleva `sandbox` sin `allow-same-origin` (seguridad).

## Caché en la PWA

El service worker (vite-plugin-pwa) cachea:

- App shell: JS, CSS, HTML e iconos (precache).
- Imágenes de Cloudinary: stale-while-revalidate (30 días, 100 entradas).
- Google Fonts: cache-first (1 año).
- API de Supabase: network-first (1 hora).

## Trackeo de vistas de página

El hook `useTrackPageView` registra las visitas a páginas de lotes:

```typescript
// src/hooks/useTrackPageView.ts
useEffect(() => {
  if (!lotId) return;
  supabase.rpc("track_page_view", {
    p_lot_id: lotId,
    p_page_path: `/projects/${lotId}`,
  }).catch(() => {});
}, [lotId]);
```

El trackeo es silencioso: si falla, nunca rompe la página.

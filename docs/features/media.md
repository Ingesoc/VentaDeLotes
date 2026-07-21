---
tags:
  - media
  - cloudinary
  - images
  - lazy-loading
created: 2026-07-21
---

# 🖼️ Manejo de Medios

## Estrategia de Imágenes
Todas las imágenes del proyecto se sirven desde **Cloudinary CDN** para:
- Carga optimizada (formatos modernos, compresión automática)
- Transformaciones on-the-fly (redimensionamiento, recorte)
- Caché global en CDN
- Sin costo de ancho de banda del servidor

## Cloudinary Upload Widget

### Widget de Subida
Integrado en el panel de administración para que los admins puedan subir imágenes aéreas de lotes:

```typescript
// src/lib/cloudinary.ts
const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

export function uploadImage(): Promise<string | null> {
  const widget = cloudinary.createUploadWidget({
    cloudName: CLOUD_NAME,
    uploadPreset: UPLOAD_PRESET,
    sources: ["local", "url", "camera"],
    multiple: false,
    maxFiles: 1,
    cropping: false,
    resourceType: "image",
    clientAllowedFormats: ["png", "jpg", "jpeg", "webp", "svg"],
  }, callback);

  widget.open();
}
```

### Configuración
Variables de entorno requeridas:
- `VITE_CLOUDINARY_CLOUD_NAME` — Cloud name de Cloudinary
- `VITE_CLOUDINARY_UPLOAD_PRESET` — Upload preset (unsigned para subida desde cliente)

El script del widget se carga en `index.html`:
```html
<script src="https://upload-widget.cloudinary.com/global/all.js" type="text/javascript"></script>
```

### Flujo de Subida
```
Admin hace clic en "Subir imagen"
  → Widget Cloudinary se abre
  → Admin selecciona archivo local/URL/cámara
  → Cloudinary procesa y devuelve secure_url
  → URL se guarda en Supabase (tabla lots, columna aerial_image)
  → UI se actualiza con la nueva imagen
```

## LazyImage Component
Componente utilitario para carga diferida de imágenes con placeholder:

```typescript
<LazyImage
  src="https://res.cloudinary.com/..."
  alt="Lote 01 - Vista aérea"
  aspectClassName="aspect-[4/3]"
  priority={false}
/>
```

### Características
- **Placeholder de carga:** Skeleton animado (pulse) mientras la imagen carga
- **Transición suave:** Fade-in de 500ms cuando la imagen está lista
- **Aspect ratio fijo:** Evita Cumulative Layout Shift (CLS)
- **Lazy loading nativo:** `loading="lazy"` con `decoding="async"`
- **Priority:** `loading="eager"` + `fetchPriority="high"` para imágenes above-the-fold

## Cloudinary URLs
Las imágenes se referencian directamente desde Cloudinary:

```
https://res.cloudinary.com/j5a9xyaq/image/upload/v{timestamp}/laholanda/{category}/{filename}
```

### Categorías
| Categoría | Propósito |
|-----------|-----------|
| `laholanda/lots/` | Imágenes aéreas de lotes individuales |
| `laholanda/landscapes/` | Paisajes generales del Quindío |
| `laholanda/masterplan/` | Planos y renders del master plan |

## Constantes de Lotes (Mock Data)
Los datos de los lotes (incluyendo URLs de imágenes) se definen estáticamente en `src/constants/lots.ts`:

```typescript
export const lots: Lot[] = [
  {
    id: "01",
    areaM2: 8910.37,
    price: 189242850,
    status: "disponible",
    aerialImage: "https://res.cloudinary.com/.../lote-01-aerial.jpg",
    perspectiveImage: "https://res.cloudinary.com/.../perspectiva-general.jpg",
  },
  // ... 16 lotes en total
];
```

## Trackeo de Page Views
El hook `useTrackPageView` registra visitas a páginas de lotes individuales:

```typescript
// src/hooks/useTrackPageView.ts
export function useTrackPageView(lotId?: string) {
  useEffect(() => {
    if (!lotId) return;
    supabase.rpc("track_page_view", {
      p_lot_id: lotId,
      p_page_path: `/projects/${lotId}`,
    });
  }, [lotId]);
}
```

El trackeo es **silencioso** — nunca debe romper la página si falla.

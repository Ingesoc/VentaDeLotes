# Multimedia: naming convention y flujo de carga

Guía para subir el material multimedia (fotos, videos, planos) sin tocar
componentes. Todo el contenido de la home y del detalle de lote es
**config-driven**: los componentes leen URLs desde `src/constants/` y
renderizan placeholders cuando un valor es `null`.

## Dónde se aloja el material

**Cloudinary** (CDN + transformaciones responsive). El equipo dev sube los
assets desde el panel de Cloudinary o vía el widget del panel admin. La
aplicación construye las URLs con `cldUrl()` (`src/lib/cloudinary.ts`), que
aplica `f_auto + q_auto + dpr_auto + w_{width}`.

Los videos aéreos viven en **YouTube** (ver `src/constants/aerialVideos.ts`);
para reemplazar o agregar clips basta editar el `videoId` ahí.

## Naming convention (carpeta `laholanda/` en Cloudinary)

| Asset | Ruta en Cloudinary |
| --- | --- |
| Foto principal item 1 del showcase | `showcase/item-1/main.jpg` |
| Diseño arquitectónico implantado | `showcase/item-2/main.jpg` |
| Collage de planos | `showcase/item-2/plano-{n}.jpg` |
| Obra realizada / logo INGESOCC | `showcase/item-3/obra.jpg`, `showcase/item-3/logo-ingesoc.png` |
| Fotos adicionales de un lote | `lots/{lote_id}/{n}.jpg` |
| Referencia de escala (foto) | `lots/{lote_id}/scale-reference.jpg` |
| Referencia de escala (video) | `lots/{lote_id}/scale-reference.mp4` |
| Videos aéreos (YouTube) | `videoId` en `src/constants/aerialVideos.ts` |

## Dónde se registran las URLs

| Contenido | Archivo | Campo |
| --- | --- | --- |
| Items del showcase (home) | `src/constants/showcase.ts` | `imageUrl`, `extraImages[]`, `cta.url` |
| Galería extra por lote | `src/constants/lots.ts` | `Lot.images: string[]` |
| Referencia de escala por lote | `src/constants/lots.ts` | `Lot.scaleReferenceMedia: { type, url, alt }` |
| Videos aéreos (home) | `src/constants/aerialVideos.ts` | `aerialVideoClips[].videoId` |

Cuando `VITE_LIVE_LOTS=true`, los campos `images` y `scale_reference_media`
también se leen de la tabla `lots` en Supabase (columnas jsonb), con
fallback a los valores estáticos de `src/constants/lots.ts`.

## Estados y reglas

1. **Placeholder vs oculto:** el showcase muestra placeholder "Imagen
   próximamente" cuando `imageUrl === null`. La referencia de escala es
   opcional por lote: si no existe, la sección "Dimensiona el lote" no se
   renderiza (sin caja vacía).
2. **CTAs controlados por dato:** un CTA con `url: null` no se renderiza
   (LinkedIn se activará solo cuando el perfil esté listo).
3. **Alt text obligatorio a nivel de tipo:** toda imagen nueva exige su
   campo `alt` — no se puede agregar media sin descripción accesible.
4. **Sin layout shift:** todos los contenedores de media tienen aspect-ratio
   fijo; respetar las proporciones sugeridas al recortar (16:9 para videos,
   4:3 para fotos de lote).
5. **Lazy loading:** las imágenes fuera del viewport usan `loading="lazy"`.
   Los videos aéreos usan click-to-load (miniatura + botón de play) para
   no descargar iframes innecesarios.

## Componentes afectados por cada tipo de media

| Media | Componente | Comportamiento placeholder |
| --- | --- | --- |
| Fotos adicionales de lote | `LotGallery` | "Fotos del Lote X próximamente" + CTA contacto |
| Referencia de escala | `ScaleReferenceMedia` | Sección oculta (no renderiza nada) |
| Showcase item (sin imagen) | `FeatureShowcase` | "Imagen próximamente" con aspect-ratio fijo |
| Showcase item (collage vacío) | `ImageCollage` | Grid 2x2 con placeholders de mismo aspect-ratio |
| Video aéreo | `AerialVideoSection` | Miniatura de YouTube con botón de play |

## Checklist al subir material nuevo

- [ ] Subir el asset a Cloudinary con el nombre de la tabla anterior.
- [ ] Copiar la URL y registrarla en el archivo de constantes indicado.
- [ ] Completar el `alt` descriptivo (en español, menciona qué se ve).
- [ ] Verificar desktop + mobile que el placeholder fue reemplazado.
- [ ] Si el lote tiene `images[]` vacío, agregar la URL de la nueva foto.
- [ ] Si la referencia de escala es video de YouTube, usar el `videoId` directo.

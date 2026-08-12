---
tags:
  - database
  - supabase
  - schema
  - sql
created: 2026-07-21
updated: 2026-08-12
---

# Base de datos

## Diagrama

Ver el [diagrama del modelo de datos](../diagrams/database.html) (HTML, se abre en el navegador). Muestra las tablas, sus relaciones, las funciones RPC y las políticas de acceso.

## Tecnología: Supabase (PostgreSQL)

Supabase provee una base de datos PostgreSQL administrada con:

- Autenticación integrada.
- Row Level Security (RLS).
- API REST automática.
- Funciones RPC.

## Esquema

La definición completa está en `supabase/migration.sql`.

### Tabla `admins`

Usuarios con acceso al panel de administración.

| Columna | Tipo | Descripción |
| --- | --- | --- |
| `id` | bigint (PK, identity) | Identificador |
| `email` | text (UNIQUE) | Email del administrador |
| `role_name` | text | Rol (default: admin) |
| `created_at` | timestamptz | Fecha de creación |

### Tabla `lots`

Información de cada lote.

| Columna | Tipo | Descripción |
| --- | --- | --- |
| `id` | text (PK) | Identificador (01 a 16) |
| `area_m2` | numeric | Área en metros cuadrados |
| `price` | bigint | Precio en COP |
| `status` | text | disponible, reservado, vendido, no_disponible |
| `aerial_image` | text | URL de la imagen aérea en Cloudinary |
| `perspective_image` | text | URL de la imagen en perspectiva |
| `topography` / `view_text` / `access` | text | Detalles opcionales del lote |
| `shared_aerial_with` | text | Otro lote que comparte la imagen aérea |
| `coordinates` | jsonb | Coordenadas geográficas aproximadas (`{"lat": ..., "lng": ...}`) |
| `created_at` / `updated_at` | timestamptz | Fechas |

### Tabla `page_views`

Visitas a páginas de lotes (analíticas básicas).

| Columna | Tipo | Descripción |
| --- | --- | --- |
| `id` | bigint (PK, identity) | Identificador |
| `lot_id` | text (FK a lots) | Lote visitado |
| `page_path` | text | Ruta visitada |
| `viewed_at` | timestamptz | Fecha de la visita |

### Tabla `leads`

Contactos del formulario de la página principal.

| Columna | Tipo | Descripción |
| --- | --- | --- |
| `id` | bigint (PK, identity) | Identificador |
| `name` | text | Nombre del interesado |
| `email` | text | Email |
| `phone` | text | Teléfono |
| `message` | text | Mensaje opcional |
| `created_at` | timestamptz | Fecha de creación |

## Funciones RPC

Las funciones se definen con `SECURITY DEFINER` y evitan exponer los nombres de las tablas en el bundle del frontend.

### `is_admin(email)`

Función auxiliar que comprueba si un email está en `admins`. Se usa dentro de las políticas RLS.

### `has_backstage_access(user_email)`

Verifica si un email tiene permisos de administrador. La usa `checkAdmin.ts` en el frontend.

```sql
CREATE OR REPLACE FUNCTION has_backstage_access(user_email text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (SELECT 1 FROM admins WHERE email = user_email);
$$;
```

### `track_page_view(p_lot_id, p_page_path)`

Registra una visita a una página de lote. La usa el hook `useTrackPageView`.

### `submit_lead(p_name, p_email, p_phone, p_message)`

Inserta un contacto en la tabla `leads`. La usa el formulario de contacto a través de `src/lib/leads.ts`.

## Row Level Security (RLS)

Todas las tablas tienen RLS habilitado:

- `lots`: lectura pública de todos los lotes (el sitio muestra los estados disponible, reservado, vendido y no disponible); escritura solo para admins (`is_admin`).
- `page_views` y `leads`: solo lectura para admins.
- `admins`: solo lectura para admins (mediante la función `is_admin`, evitando recursión).

Las escrituras públicas (leads y vistas) se hacen exclusivamente a través de las RPC `SECURITY DEFINER`, nunca con inserciones directas.

## Modo datos vivos (lotes públicos desde Supabase)

El sitio público (Home, Proyectos y Detalle de lote) puede leer la tabla `lots` en vivo en lugar de las constantes `src/constants/lots.ts`. Así, los cambios de estado/precio que hace el admin en el panel se reflejan de inmediato en el sitio público.

- Servicio: `src/lib/lotService.ts` (`fetchPublicLots`).
- Hook: `src/features/projects/hooks/usePublicLots.ts`.
- El modo se activa con la variable `VITE_LIVE_LOTS=true`. Mientras esté apagada (o si la consulta falla o la tabla está vacía), se usan las constantes estáticas.
- Los campos que la BD no tenga (null) se completan con el valor estático correspondiente.

**Orden de despliegue recomendado:** 1) aplicar `supabase/migration-live-lots.sql` en Supabase, 2) activar `VITE_LIVE_LOTS=true` en el entorno de producción. Así se evita mostrar datos del seed antiguo mientras la BD no esté sincronizada.

## Migraciones y scripts

| Archivo | Propósito |
| --- | --- |
| `supabase/migration.sql` | Esquema completo: tablas, RPCs, políticas RLS y seed de lotes |
| `supabase/recreate-schema.sql` | Recrea el esquema desde cero |
| `supabase/security-fix.sql` | Correcciones de seguridad de las funciones y políticas |
| `supabase/fix-rls.sql` | Ajustes de las políticas RLS |
| `supabase/seed-real-data.sql` | Datos de prueba/seed |
| `supabase/migration-live-lots.sql` | Modo vivos: columna `coordinates`, seed completo con precios/URLs reales y RLS de lectura pública de todos los lotes |

## Migraciones y scripts

| Archivo | Propósito |
| --- | --- |
| `supabase/migration.sql` | Esquema completo: tablas, RPCs, políticas RLS y seed de lotes |
| `supabase/recreate-schema.sql` | Recrea el esquema desde cero |
| `supabase/security-fix.sql` | Correcciones de seguridad de las funciones y políticas |
| `supabase/fix-rls.sql` | Ajustes de las políticas RLS |
| `supabase/seed-real-data.sql` | Datos de prueba/seed |

## Regenerar la base de datos

1. Ejecuta `supabase/recreate-schema.sql` (o `migration.sql`) en el SQL Editor de Supabase.
2. Ejecuta `supabase/migration-live-lots.sql` para el seed completo y la lectura pública de todos los lotes.
3. Verifica que las funciones RPC se hayan creado correctamente.
4. Agrega los emails de los admins en la tabla `admins`.

## Consideraciones

- La tabla `lots` usa `text` como PK para mantener consistencia con los IDs alfanuméricos.
- Los precios se almacenan en COP (pesos colombianos) como `bigint`.
- Las URLs de Cloudinary se guardan completas.
- El único camino de escritura pública es a través de las RPC.

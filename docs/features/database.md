---
tags:
  - database
  - supabase
  - schema
  - sql
created: 2026-07-21
---

# 🗄️ Base de Datos

## Tecnología: Supabase (PostgreSQL)

Supabase provee una base de datos PostgreSQL administrada con:
- Autenticación integrada
- Row Level Security (RLS)
- API REST automática
- Realtime subscriptions
- Funciones RPC

## Esquema de Base de Datos

### Tablas

#### `lots`
Almacena la información de cada lote del proyecto.

| Columna | Tipo | Descripción |
|---------|------|-------------|
| `id` | `text` (PK) | Identificador del lote (01, 02, ..., 16) |
| `area_m2` | `numeric` | Área en metros cuadrados |
| `price` | `numeric` | Precio actual en COP |
| `status` | `text` | Estado: disponible, reservado, vendido |
| `aerial_image` | `text` | URL de imagen aérea en Cloudinary |
| `created_at` | `timestamp` | Fecha de creación |
| `updated_at` | `timestamp` | Última actualización |

#### `admin_users`
Usuarios con acceso al panel de administración.

| Columna | Tipo | Descripción |
|---------|------|-------------|
| `id` | `uuid` (PK) | ID único |
| `email` | `text` | Email del administrador |
| `created_at` | `timestamp` | Fecha de creación |

### Funciones RPC

#### `has_backstage_access`
Verifica si un email tiene permisos de administrador.

```sql
CREATE OR REPLACE FUNCTION has_backstage_access(user_email TEXT)
RETURNS BOOLEAN
LANGUAGE sql SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM admin_users WHERE email = user_email
  );
$$;
```

- `SECURITY DEFINER`: se ejecuta con permisos del creador de la función
- Retorna `BOOLEAN` (true/false)
- Usada por `checkAdmin.ts` en el frontend

#### `track_page_view`
Registra visitas a páginas de lotes (analíticas básicas).

```sql
CREATE OR REPLACE FUNCTION track_page_view(
  p_lot_id TEXT,
  p_page_path TEXT
) ...
```

### Row Level Security (RLS)

Las tablas tienen políticas RLS habilitadas:

- **`lots`**: Lectura pública para cualquier usuario autenticado o anónimo. Escritura solo para admins.
- **`admin_users`**: Solo lectura desde la función RPC; no expuesta directamente.

## Migraciones

Las migraciones están en `supabase/migration.sql` e incluyen:

1. **Creación de tablas** (`lots`, `admin_users`)
2. **Funciones RPC** (`has_backstage_access`, `track_page_view`)
3. **Políticas RLS** para cada tabla
4. **Seed data** inicial (lotes y admin users)

## Archivos Relacionados

| Archivo | Propósito |
|---------|-----------|
| `supabase/migration.sql` | Migración principal del esquema |
| `supabase/fix-rls.sql` | Correcciones de políticas RLS |
| `supabase/seed-real-data.sql` | Datos de prueba/seed |

## Regeneración de Base de Datos

Para resetear la base de datos local:

1. Ejecutar `supabase/migration.sql` en el SQL Editor de Supabase
2. Ejecutar `supabase/seed-real-data.sql` para datos de prueba
3. Verificar que las funciones RPC se crearon correctamente

## Consideraciones
- La tabla `lots` usa `text` como PK para mantener consistencia con los IDs alfanuméricos
- Los precios se almacenan en COP (pesos colombianos) como `numeric` sin decimales
- Las URLs de Cloudinary se almacenan completas (no IDs relativos)
- El RLS asegura que solo admins puedan modificar datos

---
tags:
  - admin
  - crud
  - dashboard
created: 2026-07-21
---

# 🛠️ Panel de Administración

## Descripción General
Panel protegido para la gestión de lotes del proyecto La Holanda. Accesible solo para usuarios con rol de administrador.

## Rutas
- `/admin/login` — Inicio de sesión (público)
- `/admin/dashboard` — Dashboard principal
- `/admin/lots` — Gestión de lotes (CRUD)

## Componentes

### LoginPage
Página de inicio de sesión simple con formulario email + contraseña. Usa Supabase Auth.

### DashboardPage
Resumen visual del proyecto con métricas clave. Pendiente de implementación completa de gráficos.

### LotsPage
Página principal de gestión de lotes con:
- Tabla de todos los lotes con datos en línea
- Estados: disponible, reservado, vendido
- Editor de precios in-line
- Subida de imágenes aéreas vía Cloudinary Widget
- Búsqueda y filtros

### Componentes Internos

#### LotsTable
Tabla editable con las columnas:
- ID del lote
- Área (m²) — solo lectura
- Precio — editable
- Estado — selector (disponible/reservado/vendido)
- Imagen aérea — preview + botón de carga

#### useLots Hook
Hook personalizado que maneja:
- Carga de lotes desde Supabase
- Edición de precio y estado
- Subida de imágenes a Cloudinary
- Estados de carga (loading, saving, uploading)

```typescript
interface UseLotsReturn {
  lots: Lot[];
  loading: boolean;
  saving: boolean;
  uploading: string | null;    // lotId que está subiendo imagen
  saveLot: (id: string, updates: { status, price }) => Promise<boolean>;
  handleUploadImage: (lotId: string) => Promise<void>;
}
```

#### LotsHeader
Encabezado de la página con:
- Título y contador de lotes
- Botón de recarga
- Filtros de búsqueda

## Protección de Rutas
Todas las rutas `/admin/*` están protegidas por [[docs/features/authentication#Admin Guard|AdminGuard]] que verifica:
1. Sesión activa en Supabase
2. Rol de administrador vía RPC `has_backstage_access`

## Estados de UI
| Estado | Visual | Descripción |
|--------|--------|-------------|
| Loading | Spinner animado en fondo verde | Carga inicial de datos |
| Saving | Indicador de guardado | Persistiendo cambios en Supabase |
| Uploading | Indicador por lote | Subiendo imagen a Cloudinary |
| Error | Console.error + feedback visual | Fallo en operación |

## Layout
- Sidebar oscuro con navegación y botón de logout
- Header sticky con indicador "Panel de Administración"
- Contenido principal con padding responsivo

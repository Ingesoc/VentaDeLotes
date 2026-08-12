---
tags:
  - admin
  - crud
  - dashboard
created: 2026-07-21
updated: 2026-08-12
---

# Panel de administración

## Descripción general

Panel protegido para la gestión de los lotes del proyecto La Holanda. Solo accesible para usuarios con rol de administrador.

## Rutas

- `/admin/login` — Inicio de sesión (público).
- `/admin/dashboard` — Dashboard principal.
- `/admin/lots` — Gestión de lotes (CRUD).

## Diagrama

Ver el [diagrama del panel de administración](../diagrams/admin-panel.html) (HTML, se abre en el navegador). Muestra la estructura del panel: el guard de rutas, las páginas y su conexión con Supabase y Cloudinary.

## Componentes

### LoginPage

Formulario de email y contraseña. Usa Supabase Auth y verifica el rol admin con la RPC `has_backstage_access` antes de permitir el acceso. Incluye enlace para recuperar la contraseña (envía un correo con `resetPasswordForEmail`).

### DashboardPage

Resumen con métricas del proyecto y gráficos (Recharts):

- Tarjetas con conteo de lotes, leads, visitas y lotes con visitas.
- Gráfico de barras: visitas de los últimos 14 días.
- Gráfico de líneas: leads de los últimos 14 días.
- Gráfico de torta: lotes por estado (disponible, reservado, vendido, no disponible).
- Listas: lotes más visitados y últimos leads.
- Datos obtenidos directamente de Supabase.

### LotsPage

Página principal de gestión de lotes con:

- Tabla de todos los lotes con datos en línea.
- Estados: disponible, reservado, vendido, no disponible.
- Creación de lotes nuevos (modal con ID, área, precio y estado).
- Edición de precios y estado en línea.
- Eliminación de lotes con confirmación inline.
- Subida de imágenes aéreas con el widget de Cloudinary.
- Búsqueda por ID o estado.

### Componentes internos

#### LotsTable

Tabla editable con columnas: ID, área (solo lectura), precio (editable), estado (selector) e imagen aérea (vista previa + botón de subida).

#### useLots (hook)

Hook que maneja:

- Carga de lotes desde Supabase.
- Edición de precio y estado (`saveLot`).
- Creación de lotes (`createLot`) y eliminación (`deleteLot`).
- Subida de imágenes a Cloudinary (`handleUploadImage`).
- Estados de carga (loading, saving, uploading).

#### LotsHeader

Encabezado de la página con título, búsqueda y botón para crear un lote nuevo.

## Protección de rutas

Todas las rutas `/admin/*` están protegidas por `AdminGuard`, que verifica:

1. Sesión activa en Supabase.
2. Rol de administrador vía la RPC `has_backstage_access`.

## Estados de UI

| Estado | Descripción |
| --- | --- |
| Loading | Spinner durante la carga inicial de datos |
| Saving | Indicador al persistir cambios en Supabase (editar, crear o eliminar) |
| Uploading | Indicador por lote al subir imagen a Cloudinary |
| Error | Mensaje visible (crear lote, login) o en consola |

## Layout

- Sidebar oscuro con navegación y botón de logout.
- Header con el título "Panel de administración".
- Contenido principal con padding responsive.

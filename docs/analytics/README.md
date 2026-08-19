# 📊 Analytics Module — La Holanda

Documentación completa del módulo de analítica y captura de leads.

## Índice

1. [Modelo de datos](#1-modelo-de-datos)
2. [Eventos trackeados](#2-eventos-trackeados)
3. [Queries de análisis](#3-queries-de-análisis)
4. [Exportación de datos](#4-exportación-de-datos)
5. [Sugerencias de modelos ML](#5-sugerencias-de-modelos-ml)
6. [Configuración y despliegue](#6-configuración-y-despliegue)

---

## 1. Modelo de datos

### Tablas principales

```
┌─────────────┐     ┌──────────────────┐     ┌─────────────────────┐
│    leads     │────▶│  interacciones   │     │  eventos_producto   │
│  (extendida) │     │  (log contacts)  │     │  (platform events)  │
└──────┬──────┘     └──────────────────┘     └─────────────────────┘
       │                                              │
       │         ┌──────────────────┐                 │
       └────────▶│  lotes_metricas  │◀────────────────┘
                 │  (materialized)  │
                 └──────────────────┘
```

### Tabla `leads` (extendida)

| Columna | Tipo | Descripción |
|---------|------|-------------|
| `id` | bigint (PK) | ID autoincremental |
| `name` | text | Nombre completo |
| `email` | text | Correo electrónico |
| `phone` | text | Teléfono |
| `message` | text | Mensaje del formulario (opcional) |
| `source_channel` | text | Canal de adquisición: `organico`, `pauta_meta`, `pauta_google`, `referido`, `whatsapp`, `feria`, `otro` |
| `funnel_stage` | text | Etapa del embudo: `nuevo`, `contactado`, `visita_agendada`, `negociando`, `cerrado_ganado`, `cerrado_perdido` |
| `lot_id` | text (FK→lots) | Lote de interés |
| `budget_min` | bigint | Presupuesto mínimo estimado (COP) |
| `budget_max` | bigint | Presupuesto máximo estimado (COP) |
| `interest_location` | text | Ubicación de interés |
| `utm_source` | text | UTM source (campaña) |
| `utm_medium` | text | UTM medium (canal) |
| `utm_campaign` | text | UTM campaign (nombre) |
| `last_contact_at` | timestamptz | Último contacto registrado |
| `score` | smallint | Score de calidad (0-100) |
| `notes` | text | Notas internas del equipo |
| `created_at` | timestamptz | Fecha de creación |

### Tabla `interacciones`

| Columna | Tipo | Descripción |
|---------|------|-------------|
| `id` | bigint (PK) | ID autoincremental |
| `lead_id` | bigint (FK→leads) | Lead asociado |
| `tipo` | text | Tipo: `llamada`, `mensaje_whatsapp`, `mensaje_email`, `visita_lote`, `visita_web`, `formulario_enviado` |
| `canal` | text | Canal: `telefono`, `whatsapp`, `email`, `presencial`, `web` |
| `notas` | text | Notas de la interacción |
| `created_at` | timestamptz | Fecha de la interacción |

### Tabla `eventos_producto`

| Columna | Tipo | Descripción |
|---------|------|-------------|
| `id` | bigint (PK) | ID autoincremental |
| `lot_id` | text (FK→lots) | Lote relacionado (nullable) |
| `page_path` | text | Ruta de la página |
| `event_type` | text | Tipo: `page_view`, `lote_visto`, `lote_favorito`, `contacto_iniciado`, `visita_agendada`, `formulario_enviado`, `formulario_abandonado`, `filtro_aplicado` |
| `session_id` | text | ID de sesión del usuario |
| `user_agent` | text | User agent del navegador |
| `referrer` | text | URL de referencia |
| `time_on_page_ms` | integer | Tiempo en página (ms) |
| `metadata` | jsonb | Datos flexibles (UTM, filtros, etc.) |
| `viewed_at` | timestamptz | Timestamp del evento |

### Vista materializada `lotes_metricas`

Métricas pre-agregadas por lote (se refresca con `refresh_lotes_metricas()`):

| Columna | Descripción |
|---------|-------------|
| `total_vistas` | Total de vistas del lote |
| `total_favoritos` | Veces marcado como favorito |
| `contactos_iniciados` | Clics en "contactar" |
| `total_leads` | Leads asociados |
| `ventas` | Leads cerrados ganados |
| `tasa_conversion_pct` | Leads / vistas × 100 |
| `tasa_cierre_pct` | Ventas / leads × 100 |
| `avg_time_on_page_s` | Tiempo promedio en página (segundos) |
| `dias_en_mercado` | Días desde primera vista |

### Vistas de exportación

| Vista | Descripción |
|-------|-------------|
| `vista_export_leads` | Leads completos con interacciones y datos de lote |
| `vista_export_events` | Eventos de producto con UTM extraídos del metadata |
| `vista_export_funnel` | Cruce leads + eventos para análisis de atribución |

---

## 2. Eventos trackeados

### Tier 1 — Críticos

| Evento | Trigger | Propósito |
|--------|---------|-----------|
| `lote_visto` | Carga de `/projects/:id` | Base del funnel |
| `contacto_iniciado` | Clic en WhatsApp/formulario | Mide intención |
| `formulario_enviado` | Submit exitoso de formulario | Conversión a lead |
| `page_view` | Cualquier ruta | Tráfico general |

### Tier 2 — Importantes

| Evento | Trigger | Propósito |
|--------|---------|-----------|
| `lote_favorito` | Click en corazón/bookmark | Señal de alta intención |
| `visita_agendada` | Submit de agendar visita | Avance en embudo |
| `filtro_aplicado` | Cambio de filtros en catálogo | Qué buscan los usuarios |
| `formulario_abandonado` | 30s+ sin submit tras focus | Detectar fricción |

### Flujo de tracking

```
Componente React
    │
    ▼
trackEvent()  ──▶  lib/analytics.ts
    │
    ▼
Supabase RPC track_event()  ──▶  tabla eventos_producto
    │
    ▼
vista materializada lotes_metricas  ──▶  Dashboard admin
```

---

## 3. Queries de análisis

### Embudo de conversión

```sql
-- Leads por etapa del embudo
SELECT funnel_stage, count(*) AS total
FROM leads
GROUP BY funnel_stage
ORDER BY
  CASE funnel_stage
    WHEN 'nuevo' THEN 1
    WHEN 'contactado' THEN 2
    WHEN 'visita_agendada' THEN 3
    WHEN 'negociando' THEN 4
    WHEN 'cerrado_ganado' THEN 5
    WHEN 'cerrado_perdido' THEN 6
  END;
```

### Rendimiento por canal

```sql
-- Leads y tasa de cierre por canal
SELECT
  source_channel,
  count(*) AS total_leads,
  count(*) FILTER (WHERE funnel_stage = 'cerrado_ganado') AS cerrados,
  ROUND(
    count(*) FILTER (WHERE funnel_stage = 'cerrado_ganado')::numeric /
    NULLIF(count(*), 0) * 100, 1
  ) AS tasa_cierre_pct
FROM leads
GROUP BY source_channel
ORDER BY total_leads DESC;
```

### Cohortes temporales

```sql
-- Leads por semana
SELECT
  date_trunc('week', created_at) AS semana,
  count(*) AS nuevos_leads,
  count(*) FILTER (WHERE funnel_stage = 'cerrado_ganado') AS cerrados
FROM leads
GROUP BY semana
ORDER BY semana DESC;
```

### Atribución UTM

```sql
-- Leads por campaña UTM
SELECT
  utm_source,
  utm_medium,
  utm_campaign,
  count(*) AS total,
  count(*) FILTER (WHERE funnel_stage = 'cerrado_ganado') AS conversiones
FROM leads
WHERE utm_source IS NOT NULL
GROUP BY utm_source, utm_medium, utm_campaign
ORDER BY total DESC;
```

### Engagement por lote

```sql
-- Métricas de engagement por lote
SELECT * FROM lotes_metricas
ORDER BY total_vistas DESC;
```

### Tiempo entre interacciones

```sql
-- Tiempo promedio entre contactos por lead
SELECT
  lead_id,
  AVG(
    EXTRACT(EPOCH FROM (
      created_at - LAG(created_at) OVER (
        PARTITION BY lead_id ORDER BY created_at
      )
    )) / 3600
  ) AS avg_hours_between_contacts
FROM interacciones
GROUP BY lead_id
HAVING count(*) > 1;
```

---

## 4. Exportación de datos

### Opción 1: SQL Editor (Supabase Dashboard)

```sql
-- Exportar leads completos como CSV
COPY (SELECT * FROM vista_export_leads) TO '/tmp/leads.csv' WITH CSV HEADER;

-- O simplemente seleccionar y copiar:
SELECT * FROM vista_export_leads;
```

### Opción 2: Edge Function (API)

```bash
# Autenticarse y exportar
curl -H "Authorization: Bearer <token>" \
  "https://<project>.supabase.co/functions/v1/export-data?table=leads" \
  -o leads.csv

# Formatos disponibles: leads, events, funnel
# Formato de salida: CSV (default) o JSON (?format=json)
```

### Opción 3: Python (supabase-py)

```python
from supabase import create_client

supabase = create_client(url, anon_key)

# Leads
leads = supabase.table("vista_export_leads").select("*").execute()
import pandas as pd
df_leads = pd.DataFrame(leads.data)
df_leads.to_csv("leads.csv", index=False)

# Eventos
events = supabase.table("vista_export_events").select("*").execute()
df_events = pd.DataFrame(events.data)
df_events.to_csv("events.csv", index=False)
```

### Opción 4: Conexión directa a PostgreSQL

```python
import psycopg2
import pandas as pd

conn = psycopg2.connect("postgresql://postgres:[password]@db.[project].supabase.co:5432/postgres")

df_leads = pd.read_sql("SELECT * FROM vista_export_leads", conn)
df_events = pd.read_sql("SELECT * FROM vista_export_events", conn)
df_funnel = pd.read_sql("SELECT * FROM vista_export_funnel", conn)

# Guardar como Parquet para análisis en notebooks
df_leads.to_parquet("leads.parquet")
df_events.to_parquet("events.parquet")
```

---

## 5. Sugerencias de modelos ML

> **Nota:** Los modelos NO se implementan en esta fase. El foco es dejar los datos bien estructurados e instrumentados para que el análisis sea posible.

### 5.1 Scoring predictivo de leads

**Objetivo:** Predecir la probabilidad de que un lead se convierta en venta.

**Features sugeridas:**
- `source_channel` (one-hot encoded)
- `total_interacciones`
- `total_llamadas`, `total_whatsapp`, `total_visitas_lote`
- `dias_desde_creacion`
- `lote_area_m2`, `lote_precio`
- `utm_source`, `utm_medium`
- `time_on_page_ms` (promedio)
- `num_favoritos`

**Modelos sugeridos:**
- Random Forest (interpretable, bueno para features categóricas)
- XGBoost (mejor performance, maneja valores faltantes)
- Logistic Regression (baseline, interpretable)

**Métricas:** AUC-ROC, Precision@K, Recall

### 5.2 Segmentación de clientes

**Objetivo:** Agrupar leads por comportamiento para personalizar seguimiento.

**Features sugeridas:**
- Frecuencia de visitas
- Canal preferido
- Rango de presupuesto
- Lotes de interés
- Tiempo en página

**Modelos sugeridos:**
- K-Means (simple, interpretable)
- DBSCAN (detecta outliers)
- Hierarchical Clustering (para dendrogramas)

### 5.3 Modelo de atribución multicanal

**Objetivo:** Determinar qué canal contribuye más a las conversiones.

**Enfoques:**
- Last-touch attribution (simple, ya disponible con UTM)
- Markov chains (modela transiciones entre canales)
- Data-driven attribution (Google Analytics style)

**Datos necesarios:**
- `session_id` para agrupar eventos por usuario
- `utm_source/medium/campaign` por sesión
- `funnel_stage` para medir conversión

### 5.4 Test A/B de variantes de captura

**Objetivo:** Medir qué variantes del formulario convierten más.

**Variantes sugeridas:**
- Preview del lote vs. formulario directo
- Formulario corto (3 campos) vs. largo (5+ campos)
- WhatsApp CTA vs. formulario inline
- Modal vs. inline vs. página dedicada

**Métricas:**
- Tasa de submission
- Tasa de conversión a venta
- Tiempo medio de fill

**Implementación:**
```sql
-- Agregar columna de variante a leads
ALTER TABLE leads ADD COLUMN ab_variant text;
-- Asignar variante aleatoria en el frontend
-- Medir conversión por variante
```

---

## 6. Configuración y despliegue

### Migración SQL

```bash
# Ejecutar en Supabase Dashboard → SQL Editor
# 1. migration-analytics-module.sql (tablas + RPCs)
# 2. vista_export_leads.sql (vistas de exportación)
# 3. migration-lots-constraints.sql (CHECK constraints)
```

### Edge Functions

```bash
# Instalar Supabase CLI
npm install -g supabase

# Login y link
npx supabase login
npx supabase link --project-ref <TU_PROJECT_REF>

# Deploy
npx supabase functions deploy export-data
npx supabase functions deploy notify-lead
```

### Variables de entorno

| Variable | Descripción | Ubicación |
|----------|-------------|-----------|
| `VITE_SUPABASE_URL` | URL de Supabase | `.env` |
| `VITE_SUPABASE_ANON_KEY` | Anon key de Supabase | `.env` |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key | Edge Functions |
| `RESEND_API_KEY` | API key de Resend | Edge Functions |

### Cron job para refrescar métricas

```sql
-- Refrescar vista materializada cada 5 minutos
-- (configurar en Supabase Dashboard → Database → Extensions → pg_cron)
SELECT cron.schedule(
  'refresh-lotes-metrics',
  '*/5 * * * *',
  $$SELECT refresh_lotes_metricas()$$
);
```

---

## Estructura de archivos

```
src/
├── lib/
│   └── analytics.ts              # Core: trackEvent, getUtmParams, getSessionId
├── hooks/
│   └── useTrackEvent.ts          # Hook React para tracking
├── features/admin/
│   ├── types/
│   │   ├── lead.ts               # Tipos de leads e interacciones
│   │   └── metrics.ts            # Tipos de métricas y eventos
│   ├── data/
│   │   ├── queries/
│   │   │   ├── leads.ts          # useLeads, useLeadById, useFunnelCounts
│   │   │   ├── funnel.ts         # useFunnelData, useChannelAnalytics
│   │   │   ├── lots-metrics.ts   # useLotsMetrics, useRefreshLotsMetrics
│   │   │   └── events.ts         # useEvents, useEventsByType
│   │   └── mutations/
│   │       └── leads.ts          # useUpdateLeadStage, useAddInteraction
│   ├── components/analytics/
│   │   ├── DateRangeFilter.tsx   # Filtro de fechas reutilizable
│   │   ├── FunnelChart.tsx       # Embudo de conversión
│   │   ├── ChannelPerformance.tsx # Rendimiento por canal
│   │   ├── LotsRanking.tsx       # Ranking de lotes
│   │   ├── LeadsTable.tsx        # Tabla de leads
│   │   └── TrendsChart.tsx       # Tendencias temporales
│   ├── AnalyticsPage.tsx         # Dashboard de analytics
│   └── LeadsPage.tsx             # Gestión de leads
supabase/
├── migration-analytics-module.sql # Migración principal
├── vista_export_leads.sql         # Vistas de exportación
├── migration-lots-constraints.sql # CHECK constraints
└── functions/
    ├── export-data/               # Edge Function para CSV export
    └── notify-lead/               # Edge Function para notificaciones
docs/analytics/
└── README.md                      # Este archivo
```

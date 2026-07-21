---
tags:
  - seo
  - meta
  - helmet
  - sitemap
created: 2026-07-21
---

# 🔍 SEO y Meta Tags

## Estrategia SEO
Optimización para motores de búsqueda enfocada en:
- **Palabras clave:** lotes campestres Quimbaya, parcelación Quindío, inversión inmobiliaria Eje Cafetero
- **Audiencia local:** Colombia, especialmente Eje Cafetero
- **Contenido semántico:** Schema.org JSON-LD para RealEstateSubdivision

## Componente PageSEO
Wrapper alrededor de `react-helmet-async` que inyecta etiquetas en el `<head>`:

```typescript
<PageSEO
  title="Invertir en Quindío"
  description="Oportunidades de inversión en lotes campestres..."
  ogImage="https://res.cloudinary.com/..."
/>
```

### Propiedades
| Prop | Default | Descripción |
|------|---------|-------------|
| `title` | "La Holanda — Parcelación Campestre..." | Título de la página |
| `description` | Descripción por defecto del proyecto | Meta description |
| `ogImage` | Imagen panorámica del Quindío | Open Graph image |
| `ogUrl` | `https://www.laholanda.com/` | URL canónica |
| `ogType` | "website" | Tipo Open Graph |
| `keywords` | Keywords por defecto | Meta keywords |
| `noindex` | false | Para páginas que no deben indexarse |

### Tags Incluidos
- **Standard:** title, description, keywords, author, robots, canonical
- **Open Graph:** og:type, og:url, og:title, og:description, og:image, og:locale (es_CO)
- **Twitter Card:** summary_large_image con title, description, image
- **Geo:** geo.region (CO-QUI), geo.placename, geo.position, ICBM

## Sitemap (vite-plugin-sitemap)
Generación automática de `sitemap.xml` durante el build:

```typescript
// vite.config.ts
sitemap({
  hostname: "https://www.laholanda.com",
  dynamicRoutes: ["/", "/investment", "/projects", "/descubre-quindio"],
  priority: {
    "/": 1.0,
    "/investment": 0.9,
    "/projects": 0.9,
    "/descubre-quindio": 0.8,
  },
  changefreq: "weekly",
  exclude: ["/admin", "/admin/*"],
})
```

## Structured Data (JSON-LD)
Schema.org markup inyectado en `index.html`:

```json
{
  "@context": "https://schema.org",
  "@type": "RealEstateSubdivision",
  "name": "La Holanda",
  "description": "Parcelación campestre en Quimbaya, Quindío...",
  "url": "https://www.laholanda.com/",
  "geo": { "latitude": "4.6225", "longitude": "-75.7597" },
  "address": {
    "addressLocality": "Quimbaya",
    "addressRegion": "Quindío",
    "addressCountry": "CO"
  },
  "developer": {
    "@type": "Organization",
    "name": "INGESOCC SAS",
    "contactPoint": {
      "telephone": "+57-3217151831",
      "email": "gerencia.ingesocc@gmail.com"
    }
  }
}
```

## Consideraciones
- Las páginas admin (`/admin/*`) están excluidas del sitemap
- El canonical apunta siempre a `https://www.laholanda.com/`
- `react-helmet-async` permite que cada página defina sus propios meta tags
- Las imágenes OG usan Cloudinary con dimensiones óptimas (1200x630)

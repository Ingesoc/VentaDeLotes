---
tags:
  - seo
  - meta
  - helmet
  - sitemap
created: 2026-07-21
updated: 2026-08-12
---

# SEO y meta tags

## Estrategia

Optimización para buscadores enfocada en:

- Palabras clave: lotes campestres Quimbaya, parcelación Quindío, inversión inmobiliaria Eje Cafetero.
- Audiencia local: Colombia, con énfasis en el Eje Cafetero.
- Contenido semántico: Schema.org JSON-LD de tipo `RealEstateSubdivision`.

## Componente PageSEO

Envuelve `react-helmet-async` e inyecta las etiquetas en el `<head>`:

```typescript
<PageSEO
  title="Invertir en Quindío"
  description="Oportunidades de inversión en lotes campestres..."
  ogImage="https://res.cloudinary.com/..."
  ogUrl="https://laholanda.ingesocc.com/investment"
/>
```

### Propiedades

| Prop | Descripción |
| --- | --- |
| `title` | Título de la página (se le agrega " | La Holanda") |
| `description` | Meta description |
| `ogImage` | Imagen para Open Graph |
| `ogUrl` | URL canónica |
| `ogType` | Tipo Open Graph (default: website) |
| `keywords` | Palabras clave |
| `noindex` | Si es true, la página no se indexa (se usa en admin) |

El componente incluye etiquetas estándar, Open Graph (`og:locale` es_CO), Twitter Card y robots. Los tags geográficos y el JSON-LD viven en `index.html`.

## Sitemap (vite-plugin-sitemap)

Se genera automáticamente durante el build con `vite.config.ts`:

```typescript
const LOT_ROUTES = ["/projects/01", ..., "/projects/16"];

sitemap({
  hostname: "https://laholanda.ingesocc.com",
  dynamicRoutes: ["/", "/investment", "/projects", "/descubre-quindio", "/contact", ...LOT_ROUTES],
  priority: {
    "/": 1.0,
    "/investment": 0.9,
    "/projects": 0.9,
    "/descubre-quindio": 0.8,
    "/contact": 0.8,
    // las 16 rutas de lotes con prioridad 0.7
  },
  changefreq: "weekly",
  exclude: ["/admin", "/admin/*"],
  generateRobotsTxt: false,
})
```

## Datos estructurados (JSON-LD)

Se inyectan en `index.html`:

```json
{
  "@context": "https://schema.org",
  "@type": "RealEstateSubdivision",
  "name": "La Holanda",
  "description": "Parcelación campestre en Quimbaya, Quindío...",
  "url": "https://laholanda.ingesocc.com/",
  "geo": { "@type": "GeoCoordinates", "latitude": "4.6225", "longitude": "-75.7597" },
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Quimbaya",
    "addressRegion": "Quindío",
    "addressCountry": "CO"
  },
  "developer": {
    "@type": "Organization",
    "name": "INGESOCC SAS",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+57-3217151831",
      "email": "gerencia.ingesocc@gmail.com"
    }
  }
}
```

## Meta tags base (`index.html`)

- Título y descripción de la home.
- Favicons generados con realfavicongenerator.
- Open Graph y Twitter Card con imagen de Cloudinary (1200x630).
- Tags geográficos: `geo.region` (CO-QUI), `geo.placename`, `geo.position`, `ICBM`.
- Iconos locales con lucide-react (sin librerías de iconos de terceros, lo que reduce el peso y las peticiones externas).

## Consideraciones

- Las páginas admin (`/admin/*`) se excluyen del sitemap y usan `noindex`.
- El canonical apunta a `https://laholanda.ingesocc.com/`.
- Cada página define sus propios meta tags con `PageSEO`.
- Las imágenes OG usan Cloudinary con optimización automática.

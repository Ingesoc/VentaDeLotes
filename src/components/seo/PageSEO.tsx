import { Helmet } from "react-helmet-async";
import { cldUrl } from "@/lib/cloudinary";

interface PageSEOProps {
  title?: string;
  description?: string;
  ogImage?: string;
  ogUrl?: string;
  ogType?: string;
  keywords?: string;
  /** Canonical URL explícita. Si se omite, se construye dinámicamente. */
  canonical?: string;
  /** Si la página no debe aparecer en buscadores */
  noindex?: boolean;
}

const SITE_NAME = "La Holanda — Parcelación Campestre";
const PREFERRED_DOMAIN = "https://laholanda.ingesocc.com";
const DEFAULT_TITLE = `${SITE_NAME} | Quimbaya, Quindío`;
const DEFAULT_DESCRIPTION =
  "La Holanda — Parcelación Campestre en Quimbaya, Quindío. Lotes campestres desde 500 m² con escritura pública, vías de acceso y diseño arquitectónico incluido. Desarrollado por INGESOCC SAS.";
const DEFAULT_OG_IMAGE = cldUrl(
  "https://res.cloudinary.com/j5a9xyaq/image/upload/v1784303937/laholanda/landscapes/DJI_0131.webp"
);
const DEFAULT_KEYWORDS =
  "lotes campestres, parcelación quimbaya, quindío, la holanda, ingesocc, lotes baratos, finca raíz eje cafetero, vivir en quindío, inversión inmobiliaria, lote con escritura";

/**
 * Detecta el dominio actual y retorna la URL base canónica.
 * Siempre retorna el dominio de deploy (laholanda.ingesocc.com) como canónico.
 */
function getCanonicalBase(): string {
  // Siempre retornar el dominio de deploy como canónico
  return PREFERRED_DOMAIN;
}

export default function PageSEO({
  title,
  description,
  ogImage,
  ogUrl,
  ogType = "website",
  keywords,
  canonical,
  noindex = false,
}: PageSEOProps) {
  const finalTitle = title ? `${title} | La Holanda` : DEFAULT_TITLE;
  const finalDescription = description ?? DEFAULT_DESCRIPTION;
  const finalImage = ogImage ?? DEFAULT_OG_IMAGE;
  const finalKeywords = keywords ?? DEFAULT_KEYWORDS;

  // Canonical: siempre apunta al dominio de deploy (laholanda.ingesocc.com)
  const canonicalBase = getCanonicalBase();
  // Si ogUrl es una ruta relativa, construir URL completa con el dominio correcto
  const finalUrl = canonicalBase + (ogUrl ? (ogUrl.startsWith("http") ? new URL(ogUrl).pathname : ogUrl) : "/");
  const canonicalUrl = canonical ?? finalUrl;

  return (
    <Helmet>
      <title>{finalTitle}</title>
      <meta name="description" content={finalDescription} />
      <meta name="keywords" content={finalKeywords} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={finalUrl} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:image" content={finalImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:locale" content="es_CO" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={finalTitle} />
      <meta name="twitter:description" content={finalDescription} />
      <meta name="twitter:image" content={finalImage} />

      {/* Hreflang — indica a Google que el contenido es en español
          y está orientado a Colombia (CO), pero es relevante para
          hablantes de español en toda LATAM y España */}
      <link rel="alternate" hrefLang="es-CO" href={finalUrl} />
      <link rel="alternate" hrefLang="es" href={finalUrl} />
      <link rel="alternate" hrefLang="x-default" href={finalUrl} />

      {/* Geo Tags (redundantes con index.html pero necesarias si
          el crawler solo procesa el Helmet output tras hidratación) */}
      <meta name="geo.region" content="CO-QUI" />
      <meta name="geo.placename" content="Quimbaya" />

      {/* Robots */}
      {noindex && <meta name="robots" content="noindex, nofollow" />}
    </Helmet>
  );
}

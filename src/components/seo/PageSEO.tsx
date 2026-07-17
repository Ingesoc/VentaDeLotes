import { Helmet } from "react-helmet-async";

interface PageSEOProps {
  title?: string;
  description?: string;
  ogImage?: string;
  ogUrl?: string;
  ogType?: string;
  keywords?: string;
  /** Si la página no debe aparecer en buscadores */
  noindex?: boolean;
}

const DEFAULT_TITLE = "La Holanda — Parcelación Campestre | Quimbaya, Quindío";
const DEFAULT_DESCRIPTION =
  "La Holanda — Parcelación Campestre en Quimbaya, Quindío. Lotes campestres desde 500 m² con escritura pública, vías de acceso y diseño arquitectónico incluido. Desarrollado por INGESOCC SAS.";
const DEFAULT_OG_IMAGE =
  "https://res.cloudinary.com/j5a9xyaq/image/upload/v1784303937/laholanda/landscapes/DJI_0131.webp";
const DEFAULT_OG_URL = "https://www.laholanda.com/";
const DEFAULT_KEYWORDS =
  "lotes campestres, parcelación quimbaya, quindío, la holanda, ingesocc, lotes baratos, finca raíz eje cafetero, vivir en quindío, inversión inmobiliaria, lote con escritura";

export default function PageSEO({
  title,
  description,
  ogImage,
  ogUrl,
  ogType = "website",
  keywords,
  noindex = false,
}: PageSEOProps) {
  const finalTitle = title ? `${title} | La Holanda` : DEFAULT_TITLE;
  const finalDescription = description ?? DEFAULT_DESCRIPTION;
  const finalImage = ogImage ?? DEFAULT_OG_IMAGE;
  const finalUrl = ogUrl ?? DEFAULT_OG_URL;
  const finalKeywords = keywords ?? DEFAULT_KEYWORDS;

  return (
    <Helmet>
      <title>{finalTitle}</title>
      <meta name="description" content={finalDescription} />
      <meta name="keywords" content={finalKeywords} />

      {/* Open Graph */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={finalUrl} />
      <meta property="og:site_name" content="La Holanda — Parcelación Campestre" />
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

      {/* Robots */}
      {noindex && <meta name="robots" content="noindex, nofollow" />}
    </Helmet>
  );
}

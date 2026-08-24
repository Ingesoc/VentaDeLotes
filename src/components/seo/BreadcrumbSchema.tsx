import { Helmet } from "react-helmet-async";

export interface BreadcrumbItem {
  name: string;
  url: string;
}

interface BreadcrumbSchemaProps {
  items: BreadcrumbItem[];
}

/**
 * BreadcrumbList schema JSON-LD.
 *
 * Se usa en todas las páginas internas para que Google muestre
 * migas de pan en los resultados de búsqueda (SERP features).
 * El primer item siempre es "Inicio" apuntando a la home.
 */
export default function BreadcrumbSchema({ items }: BreadcrumbSchemaProps) {
  const DOMAIN = "https://laholanda.ingesocc.com";
  // Siempre canonicalizar al dominio preferido

  // Siempre preceder con "Inicio"
  const fullItems: BreadcrumbItem[] = [
    { name: "Inicio", url: `${DOMAIN}/` },
    ...items,
  ];

  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: fullItems.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
}

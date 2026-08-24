import { Helmet } from "react-helmet-async";

/**
 * LocalBusiness + Organization schema JSON-LD.
 *
 * Se renderiza una sola vez en RootLayout y alimenta el Knowledge Panel
 * de Google Maps / Business Profile. Incluye NAP (Nombre, Dirección,
 * Teléfono) consistente con el footer y el schema de index.html.
 */
export default function LocalBusinessSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: "La Holanda — Parcelación Campestre",
    alternateName: "La Holanda",
    description:
      "Parcelación campestre en Quimbaya, Quindío. Lotes desde 500 m² con escritura pública, vías de acceso y diseño arquitectónico incluido.",
    url: "https://laholanda.ingesocc.com",
    image:
      "https://res.cloudinary.com/j5a9xyaq/image/upload/v1784303937/laholanda/landscapes/DJI_0131.webp",
    telephone: "+57-3217151831",
    email: "gerencia.ingesocc@gmail.com",
    address: {
      "@type": "PostalAddress",
      // Oficina comercial (la parcelación está en Quimbaya, pero la oficina
      // de atención al público está en Armenia — la dirección que Google Maps
      // y GBP deben mostrar)
      streetAddress: "Km 6 vía La Tebaida, Bodega 2, Armenia",
      addressLocality: "Armenia",
      addressRegion: "Quindío",
      addressCountry: "CO",
      postalCode: "630001",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 4.6225,
      longitude: -75.7597,
    },
    areaServed: [
      {
        "@type": "City",
        name: "Quimbaya",
        containedInPlace: {
          "@type": "State",
          name: "Quindío",
        },
      },
      {
        "@type": "City",
        name: "Armenia",
      },
      {
        "@type": "City",
        name: "Filandia",
      },
      {
        "@type": "City",
        name: "Salento",
      },
    ],
    priceRange: "$$",
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: "08:00",
      closes: "18:00",
    },
    // Agregar URLs de redes sociales y Google Business Profile aquí
    // cuando estén configurados. Ejemplo:
    // sameAs: ["https://maps.app.goo.gl/XXXXX", "https://instagram.com/laholanda"]
    sameAs: [],
    hasMap: "https://maps.app.goo.gl/XXXXX", // Reemplazar con URL real del GBP
    parentOrganization: {
      "@type": "Organization",
      name: "INGESOCC SAS",
      url: "https://laholanda.ingesocc.com",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+57-3217151831",
      contactType: "sales",
      email: "gerencia.ingesocc@gmail.com",
      availableLanguage: ["Spanish"],
    },
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
}

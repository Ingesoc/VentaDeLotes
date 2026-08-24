import { Helmet } from "react-helmet-async";

export interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSchemaProps {
  items: FAQItem[];
}

/**
 * FAQPage schema JSON-LD.
 *
 * Aparece como rich result en Google (preguntas expandibles) y es
 * cada vez más relevante para AI Overviews (SGE) de Google en 2026.
 * Se renderiza en la home y en la página de inversión como contenido
 * que captura búsquedas informativas de alta intención.
 */
export default function FAQSchema({ items }: FAQSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
}

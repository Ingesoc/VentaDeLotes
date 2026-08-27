import { Link } from "react-router";
import PageSEO from "@/components/seo/PageSEO";
import BreadcrumbSchema from "@/components/seo/BreadcrumbSchema";
import { cldUrl } from "@/lib/cloudinary";
import { useScrollReveal } from "@/hooks/useScrollReveal";

interface BlogArticle {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  image: string;
}

const ARTICLES: BlogArticle[] = [
  {
    slug: "guia-compra-lote-rural-quindio",
    title: "Cómo Comprar un Lote Rural en Quindío: Guía Completa 2026",
    excerpt:
      "Todo lo que necesitas saber antes de comprar un lote rural en Quindío: requisitos legales, escrituración, precios reales, zonas recomendadas y cómo evitar errores costosos.",
    category: "Guía de Compra",
    date: "Agosto 2026",
    readTime: "12 min",
    image: cldUrl("https://res.cloudinary.com/j5a9xyaq/image/upload/v1784303937/laholanda/landscapes/DJI_0131.webp"),
  },
  {
    slug: "escrituracion-lotes-colombia",
    title: "Escrituración de Lotes en Colombia: Todo lo que Necesitas Saber",
    excerpt:
      "Proceso completo de escrituración de un lote rural: documentos, costos, tiempos, y cómo proteger tu inversión con la debida diligencia legal.",
    category: "Guía Legal",
    date: "Agosto 2026",
    readTime: "10 min",
    image: cldUrl("https://res.cloudinary.com/j5a9xyaq/image/upload/v1787838725/cafetales_fftekm.webp"),
  },
  {
    slug: "inversion-eje-cafetero-finca-raiz",
    title: "Por Qué el Eje Cafetero es la Mejor Inversión en Finca Raíz",
    excerpt:
      "Datos reales de plusvalía, comparativa con otras regiones de Colombia, y por qué los inversores inteligentes están apostando por el Quindío, Caldas y Risaralda.",
    category: "Inversión",
    date: "Agosto 2026",
    readTime: "11 min",
    image: cldUrl("https://res.cloudinary.com/j5a9xyaq/image/upload/v1784303937/laholanda/landscapes/DJI_0131.webp"),
  },
  {
    slug: "quimbaya-vs-filandia-vs-salento",
    title: "Quimbaya vs Filandia vs Salento: ¿Dónde Comprar Tu Lote?",
    excerpt:
      "Los tres municipios más buscados del Quindío para compra de lotes rurales. Comparativa real de precios, servicios, potencial turístico y conveniencia según tu perfil.",
    category: "Comparativa",
    date: "Agosto 2026",
    readTime: "9 min",
    image: cldUrl("https://res.cloudinary.com/j5a9xyaq/image/upload/v1787838725/cafetales_fftekm.webp"),
  },
  {
    slug: "financiacion-compra-lotes-rurales",
    title: "Financiación para Comprar un Lote Rural en Colombia",
    excerpt:
      "Todas las opciones de pago para adquirir un lote rural: crédito hipotecario, pago directo con desarrollador, líneas de Bancóldex y planes de cuotas flexibles.",
    category: "Financiación",
    date: "Agosto 2026",
    readTime: "8 min",
    image: cldUrl("https://res.cloudinary.com/j5a9xyaq/image/upload/v1784303937/laholanda/landscapes/DJI_0131.webp"),
  },
  {
    slug: "vivir-en-quimbaya",
    title: "Vivir en Quimbaya: Todo lo que Necesitas Saber",
    excerpt:
      "Clima perfecto de 22°C, servicios públicos, colegios, hospitales, seguridad, conectividad y por qué cientos de familias están eligiendo Quimbaya para vivir.",
    category: "Estilo de Vida",
    date: "Agosto 2026",
    readTime: "10 min",
    image: cldUrl("https://res.cloudinary.com/j5a9xyaq/image/upload/v1784303937/laholanda/landscapes/DJI_0131.webp"),
  },
  {
    slug: "lotes-con-escritura-publica-verificar",
    title: "Lotes con Escritura Pública: Qué Verificar Antes de Comprar",
    excerpt:
      "Guía completa para verificar la documentación legal de un lote antes de comprar: escritura pública, libertad de cargos, plano catastral y más. Evita errores costosos.",
    category: "Guía Legal",
    date: "Agosto 2026",
    readTime: "9 min",
    image: cldUrl("https://res.cloudinary.com/j5a9xyaq/image/upload/v1787838725/cafetales_fftekm.webp"),
  },
];

const categoryColors: Record<string, string> = {
  "Guía de Compra": "bg-deep-forest text-on-primary",
  "Guía Legal": "bg-heritage-gold text-primary",
  "Inversión": "bg-deep-forest text-on-primary",
  Comparativa: "bg-heritage-gold text-primary",
  Financiación: "bg-deep-forest text-on-primary",
  "Estilo de Vida": "bg-heritage-gold text-primary",
};

export default function BlogIndex() {
  const scrollRevealRef = useScrollReveal({
    childSelector: ".grid > *",
    variant: "fade-up",
    staggerDelay: 80,
    rootMargin: "0px 0px -60px 0px",
  });

  return (
    <>
      <PageSEO
        title="Blog — Guías de Compra de Lotes en Quindío"
        description="Artículos y guías para comprar lotes rurales en Quindío, Colombia. Escrituración, financiación, inversión, comparativas de zonas y consejos prácticos. Actualizado 2026."
        ogUrl="https://laholanda.ingesocc.com/blog"
        ogImage={cldUrl("https://res.cloudinary.com/j5a9xyaq/image/upload/v1784303937/laholanda/landscapes/DJI_0131.webp")}
        keywords="blog lotes Quindío, guías compra lote Colombia, escrituración lote, inversión finca raíz, lotes Quimbaya"
      />
      <BreadcrumbSchema
        items={[{ name: "Blog", url: "https://laholanda.ingesocc.com/blog" }]}
      />

      <div className="page-enter">
        {/* Hero */}
        <section className="pt-28 pb-16 px-margin-mobile md:px-margin-desktop bg-deep-forest relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(197,165,114,0.08),transparent_60%)]" />
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <span className="inline-block text-heritage-gold font-label-bold uppercase tracking-widest text-sm mb-4">
              Blog La Holanda
            </span>
            <h1 className="font-display-lg text-3xl sm:text-4xl md:text-display-lg text-warm-white drop-shadow-lg leading-tight text-balance mb-6">
              Guías para Comprar Tu Lote en Quindío
            </h1>
            <p className="text-body-md sm:text-body-lg font-body-lg text-surface-container-high max-w-2xl mx-auto">
              Artículos escritos por expertos para ayudarte a tomar la mejor
              decisión al comprar un lote rural en el Eje Cafetero de Colombia.
            </p>
          </div>
        </section>

        {/* Grid de artículos */}
        <section
          ref={scrollRevealRef}
          className="py-16 md:py-24 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {ARTICLES.map((article) => (
              <Link
                key={article.slug}
                to={`/blog/${article.slug}`}
                className="group bg-surface-container-lowest border border-outline-variant/20 rounded-xl overflow-hidden shadow-ambient hover-lift flex flex-col"
              >
                {/* Imagen */}
                <div className="relative aspect-[16/9] overflow-hidden">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                    decoding="async"
                  />
                  <span
                    className={`absolute top-3 left-3 px-3 py-1 rounded-full text-label-caps font-label-caps uppercase ${
                      categoryColors[article.category] ?? "bg-deep-forest text-on-primary"
                    }`}
                  >
                    {article.category}
                  </span>
                </div>

                {/* Contenido */}
                <div className="p-6 flex flex-col grow">
                  <div className="flex items-center gap-2 text-caption font-caption text-on-surface-variant mb-3">
                    <span>{article.date}</span>
                    <span>·</span>
                    <span>{article.readTime} de lectura</span>
                  </div>
                  <h2 className="text-headline-sm font-headline-sm text-primary mb-3 group-hover:text-heritage-gold transition-colors">
                    {article.title}
                  </h2>
                  <p className="text-body-md font-body-md text-on-surface-variant leading-relaxed grow">
                    {article.excerpt}
                  </p>
                  <span className="mt-4 text-deep-forest font-label-bold text-body-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                    Leer artículo
                    <span className="text-heritage-gold">→</span>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 px-margin-mobile md:px-margin-desktop bg-surface-container-low">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-headline-md font-headline-md text-primary mb-4">
              ¿Listo para Encontrar Tu Lote?
            </h2>
            <p className="text-body-md font-body-md text-on-surface-variant max-w-2xl mx-auto mb-8">
              Explora nuestros lotes disponibles en Quimbaya, Quindío, con
              escritura pública, vías de acceso y diseño arquitectónico
              incluido.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/projects"
                className="inline-block bg-deep-forest text-on-primary px-8 py-4 rounded-lg font-label-bold hover:brightness-110 transition-[filter]"
              >
                Ver Lotes Disponibles
              </Link>
              <Link
                to="/contact"
                className="inline-block border-2 border-deep-forest text-deep-forest px-8 py-4 rounded-lg font-label-bold hover:bg-deep-forest hover:text-on-primary transition-colors"
              >
                Contactar Asesor
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

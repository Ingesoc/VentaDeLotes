import { Link } from "react-router";
import PageSEO from "@/components/seo/PageSEO";
import BreadcrumbSchema from "@/components/seo/BreadcrumbSchema";
import FAQSchema from "@/components/seo/FAQSchema";
import { project } from "@/constants/project";
import { cldUrl } from "@/lib/cloudinary";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const ARTICLE_FAQS = [
  {
    question: "¿Cuál es el municipio más barato para comprar lote en Quindío?",
    answer:
      "Quimbaya es el municipio más accesible del Quindío para compra de lotes campestres. Los precios arrancan desde $150 millones COP para terrenos de 2.000 m², con escritura pública incluida. Comparado con Filandia ($250M+) y Salento ($300M+), Quimbaya ofrece mejor relación precio-m² y alto potencial de plusvalía.",
  },
  {
    question: "¿Dónde es mejor inversión: Quimbaya, Filandia o Salento?",
    answer:
      "Depende de tu objetivo. Para plusvalía pura con bajo punto de entrada: Quimbaya (18-22% anual). Para alquiler turístico (Airbnb): Salento y Filandia (mayor demanda de turistas). Para equilibrio entre ambos: Filandia. Para vivienda permanente con servicios: Armenia. Cada zona tiene ventajas diferentes según tu perfil de inversor.",
  },
  {
    question: "¿Qué tan lejos está Quimbaya de Armenia?",
    answer:
      "Quimbaya está a 40 minutos de Armenia por la vía principal. La distancia es de aproximadamente 25 km. La vía está en buen estado y conecta directamente con la capital departamental. También está a 30 minutos de Filandia y 45 minutos de Salento.",
  },
  {
    question: "¿Se puede vivir permanentemente en Quimbaya?",
    answer:
      "Sí, Quimbaya es ideal para vivienda permanente. Cuenta con clima perfecto de 22°C, servicios públicos disponibles, colegios, centros de salud, y una comunidad activa. La cercanía a Armenia (40 min) permite acceso a servicios urbanos especializados. Muchos habitantes de Armenia y Bogotá se están mudando a Quimbaya por la calidad de vida.",
  },
  {
    question: "¿Qué servicios hay en los lotes de Quimbaya?",
    answer:
      "Depende de la parcelación. En La Holanda, los lotes cuentan con vía principal de acceso pavimentada, energía eléctrica disponible, y están en proceso de dotación de agua potable. Otros proyectos pueden tener diferentes niveles de servicios. Siempre verifica: energía, agua, vía de acceso, y alcantarillado antes de comprar.",
  },
];

export default function QuimbayaVsFilandiaVsSalento() {
  const scrollRevealRef = useScrollReveal({
    childSelector: "section",
    variant: "fade-up",
    staggerDelay: 100,
    rootMargin: "0px 0px -60px 0px",
  });

  return (
    <>
      <PageSEO
        title="Quimbaya vs Filandia vs Salento: Dónde Comprar Lote"
        description="Comparativa completa de Quimbaya, Filandia y Salento para comprar lote en Quindío. Precios reales 2026, servicios, potencial de plusvalía y recomendación según tu perfil de inversor."
        ogUrl="https://laholanda.ingesocc.com/blog/quimbaya-vs-filandia-vs-salento"
        ogImage={cldUrl("https://res.cloudinary.com/j5a9xyaq/image/upload/v1787838725/cafetales_fftekm.webp")}
        ogType="article"
        keywords="Quimbaya vs Filandia vs Salento, mejor zona Quindío comprar lote, lotes Quimbaya precio, lotes Filandia, lotes Salento, dónde comprar lote Quindío 2026"
      />
      <BreadcrumbSchema
        items={[
          { name: "Blog", url: "https://laholanda.ingesocc.com/blog" },
          { name: "Quimbaya vs Filandia vs Salento", url: "https://laholanda.ingesocc.com/blog/quimbaya-vs-filandia-vs-salento" },
        ]}
      />
      <FAQSchema items={ARTICLE_FAQS} />

      <div ref={scrollRevealRef} className="page-enter">
        {/* Hero del artículo */}
        <section className="pt-28 pb-16 px-margin-mobile md:px-margin-desktop bg-deep-forest relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(197,165,114,0.08),transparent_60%)]" />
          <div className="max-w-4xl mx-auto relative z-10">
            <span className="inline-block text-heritage-gold font-label-bold uppercase tracking-widest text-sm mb-4">
              Comparativa Quindío 2026
            </span>
            <h1 className="font-display-lg text-3xl sm:text-4xl md:text-display-lg text-warm-white drop-shadow-lg leading-tight text-balance mb-6">
              Quimbaya vs Filandia vs Salento: ¿Dónde Comprar Tu Lote?
            </h1>
            <p className="text-body-md sm:text-body-lg font-body-lg text-surface-container-high max-w-2xl">
              Los tres municipios más buscados del Quindío para compra de
              lotes rurales. Comparativa real de precios, servicios,
              potencial turístico y conveniencia según tu perfil.
            </p>
            <p className="text-caption font-caption text-warm-white/60 mt-4">
              Por {project.developer} · Actualizado agosto 2026 · 9 min de lectura
            </p>
          </div>
        </section>

        {/* Contenido del artículo */}
        <article className="py-16 md:py-24 px-margin-mobile md:px-margin-desktop">
          <div className="max-w-3xl mx-auto space-y-8 text-body-md font-body-md text-on-surface-variant leading-relaxed">
            {/* Introducción */}
            <p className="text-body-lg font-body-lg">
              Elegir el municipio correcto para comprar un lote en el Quindío
              es la decisión más importante de tu inversión. No es lo mismo
              comprar en Quimbaya que en Salento: los precios, el estilo de
              vida, el potencial turístico y la liquidez de la inversión son
              completamente diferentes.
            </p>
            <p>
              Esta comparativa analiza los tres municipios más buscados del
              Quindío para compra de lotes rurales, con datos reales de precios,
              servicios y potencial de inversión. Al final, una recomendación
              según tu perfil de comprador.
            </p>

            {/* Comparativa rápida */}
            <section className="my-8">
              <h2 className="text-headline-md font-headline-md text-primary mb-6">
                Comparativa Rápida
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b-2 border-outline-variant/20">
                      <th className="py-3 px-4 font-label-bold text-primary">Característica</th>
                      <th className="py-3 px-4 font-label-bold text-primary">Quimbaya</th>
                      <th className="py-3 px-4 font-label-bold text-primary">Filandia</th>
                      <th className="py-3 px-4 font-label-bold text-primary">Salento</th>
                    </tr>
                  </thead>
                  <tbody className="text-on-surface-variant">
                    <tr className="border-b border-outline-variant/10">
                      <td className="py-3 px-4 font-medium">Precio lote 2.000 m²</td>
                      <td className="py-3 px-4 text-deep-forest font-label-bold">$150M - $200M</td>
                      <td className="py-3 px-4">$250M - $400M</td>
                      <td className="py-3 px-4">$300M - $500M</td>
                    </tr>
                    <tr className="border-b border-outline-variant/10">
                      <td className="py-3 px-4 font-medium">Precio/m²</td>
                      <td className="py-3 px-4 text-deep-forest font-label-bold">$75K - $100K</td>
                      <td className="py-3 px-4">$125K - $200K</td>
                      <td className="py-3 px-4">$150K - $250K</td>
                    </tr>
                    <tr className="border-b border-outline-variant/10">
                      <td className="py-3 px-4 font-medium">Plusvalía anual</td>
                      <td className="py-3 px-4 text-deep-forest font-label-bold">18-22%</td>
                      <td className="py-3 px-4">15-18%</td>
                      <td className="py-3 px-4">12-16%</td>
                    </tr>
                    <tr className="border-b border-outline-variant/10">
                      <td className="py-3 px-4 font-medium">Distancia Armenia</td>
                      <td className="py-3 px-4">40 min</td>
                      <td className="py-3 px-4">45 min</td>
                      <td className="py-3 px-4">55 min</td>
                    </tr>
                    <tr className="border-b border-outline-variant/10">
                      <td className="py-3 px-4 font-medium">Demanda turística</td>
                      <td className="py-3 px-4">Media</td>
                      <td className="py-3 px-4">Alta</td>
                      <td className="py-3 px-4 text-deep-forest font-label-bold">Muy alta</td>
                    </tr>
                    <tr className="border-b border-outline-variant/10">
                      <td className="py-3 px-4 font-medium">Ideal para</td>
                      <td className="py-3 px-4 text-deep-forest font-label-bold">Inversión + vivienda</td>
                      <td className="py-3 px-4">Equilibrio</td>
                      <td className="py-3 px-4">Turismo / Airbnb</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-medium">Liquidez al vender</td>
                      <td className="py-3 px-4">Media</td>
                      <td className="py-3 px-4">Media-Alta</td>
                      <td className="py-3 px-4 text-deep-forest font-label-bold">Alta</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* Quimbaya */}
            <section>
              <h2 className="text-headline-md font-headline-md text-primary mb-4 mt-12">
                Quimbaya — La Oportunidad que Aún Puedes Atrapar
              </h2>
              <p className="mb-4">
                Quimbaya es el municipio con mejor relación precio-potencial
                del Quindío. Ubicado en el centro del departamento, ofrece
                lotes campestres a precios accesibles con un potencial de
                plusvalía del 18-22% anual — el más alto de los tres
                municipios.
              </p>
              <h3 className="text-headline-sm font-headline-sm text-primary mb-3 mt-6">
                Ventajas
              </h3>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>
                  <strong>Precios más bajos:</strong> Lotes desde $150 millones
                  COP para 2.000 m². El punto de entrada más bajo del Quindío.
                </li>
                <li>
                  <strong>Mayor plusvalía:</strong> 18-22% anual, impulsado por
                  el crecimiento turístico y la demanda de segundas residencias.
                </li>
                <li>
                  <strong>Acceso directo:</strong> Conectado por la vía
                  Armenia-Quimbaya-Alcalá, a 40 min de Armenia y 30 min de
                  Filandia.
                </li>
                <li>
                  <strong>Servicios disponibles:</strong> Energía eléctrica,
                  vías de acceso, y desarrollo urbano en crecimiento.
                </li>
                <li>
                  <strong>Cultura cafetera:</strong> Fiestas del café, cultura
                  arriera, y paisajes del Patrimonio UNESCO.
                </li>
              </ul>
              <h3 className="text-headline-sm font-headline-sm text-primary mb-3 mt-6">
                Desventajas
              </h3>
              <ul className="list-disc pl-6 space-y-2 mb-6">
                <li>Menor turismo internacional comparado con Salento</li>
                <li>Menos opciones de restaurantes y vida nocturna</li>
                <li>Liquidez media al vender (toma más tiempo que Salento)</li>
              </ul>
              <div className="bg-heritage-gold/10 border-l-4 border-heritage-gold p-4 rounded-r-lg my-6">
                <p className="text-primary font-label-bold mb-1">
                  💡 Ideal para:
                </p>
                <p>
                  Inversores que buscan alto retorno con bajo punto de entrada,
                  compradores de segundas residencias que no necesitan turismo
                  internacional, y quienes planean construir en 3-5 años
                  mientras la plusvalía crece.
                </p>
              </div>
            </section>

            {/* Filandia */}
            <section>
              <h2 className="text-headline-md font-headline-md text-primary mb-4 mt-12">
                Filandia — El Equilibrio Perfecto
              </h2>
              <p className="mb-4">
                Filandia es el municipio con mejor equilibrio entre precio,
                turismo y calidad de vida. Ha crecido exponencialmente en los
                últimos años gracias a su oferta gastronómica, miradores y
                cercanía con Armenia.
              </p>
              <h3 className="text-headline-sm font-headline-sm text-primary mb-3 mt-6">
                Ventajas
              </h3>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>
                  <strong>Gastronomía reconocida:</strong> Restaurants de clase
                  mundial, cafés de especialidad, y experiencias gastronómicas
                  que atraen turistas nacionales e internacionales.
                </li>
                <li>
                  <strong>Miradores:</strong> El mirador de Filandia es uno de
                  los más visitados del Quindío. Ofrece vistas panorámicas del
                  valle del Quindío.
                </li>
                <li>
                  <strong>Turismo creciente:</strong> Demanda alta de Airbnb y
                  alojamiento turístico. Buen potencial para alquiler vacacional.
                </li>
                <li>
                  <strong>Cercanía:</strong> A 45 min de Armenia, 30 min de
                  Quimbaya, y acceso fácil a Salento.
                </li>
              </ul>
              <h3 className="text-headline-sm font-headline-sm text-primary mb-3 mt-6">
                Desventajas
              </h3>
              <ul className="list-disc pl-6 space-y-2 mb-6">
                <li>Precios más altos que Quimbaya ($250M+ para 2.000 m²)</li>
                <li>Mayor competencia de proyectos inmobiliarios</li>
                <li>Algunas zonas ya están saturadas de desarrollo</li>
              </ul>
              <div className="bg-heritage-gold/10 border-l-4 border-heritage-gold p-4 rounded-r-lg my-6">
                <p className="text-primary font-label-bold mb-1">
                  💡 Ideal para:
                </p>
                <p>
                  Inversores que buscan equilibrio entre plusvalía e ingresos
                  por Airbnb, compradores que valoran gastronomía y cultura, y
                  quienes quieren una segunda residencia con potencial de alquiler
                  turístico.
                </p>
              </div>
            </section>

            {/* Salento */}
            <section>
              <h2 className="text-headline-md font-headline-md text-primary mb-4 mt-12">
                Salento — La Estrella Turística
              </h2>
              <p className="mb-4">
                Salento es el municipio más turístico del Quindío y uno de los
                más visitados de Colombia. El Valle de Cocora, el Parque
                Nacional Natural y los senderos del友子 lo convierten en un
                destino de clase mundial.
              </p>
              <h3 className="text-headline-sm font-headline-sm text-primary mb-3 mt-6">
                Ventajas
              </h3>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>
                  <strong>Turismo internacional:</strong> Salento recibe
                  millones de turistas al año. La demanda de alojamiento es
                  constante todo el año.
                </li>
                <li>
                  <strong>Alto potencial Airbnb:</strong> Los retornos por
                  alquiler turístico son los más altos del Quindío (10-15%
                  anual sobre la inversión total).
                </li>
                <li>
                  <strong>Liquidez alta:</strong> Es más fácil vender un lote
                  en Salento que en otros municipios por la demanda constante.
                </li>
                <li>
                  <strong>Naturaleza privilegiada:</strong> Valle de Cocora,
                  senderos, avistamiento de aves, y paisajes únicos.
                </li>
              </ul>
              <h3 className="text-headline-sm font-headline-sm text-primary mb-3 mt-6">
                Desventajas
              </h3>
              <ul className="list-disc pl-6 space-y-2 mb-6">
                <li>
                  <strong>Precios altos:</strong> Lotes desde $300 millones COP
                  para 2.000 m². El punto de entrada más alto.
                </li>
                <li>
                  <strong>Saturación turística:</strong> En temporadas altas,
                  el tráfico y la aglomeración pueden ser molestos.
                </li>
                <li>
                  <strong>Cercanía:</strong> A 55 min de Armenia, el más lejano
                  de los tres municipios.
                </li>
              </ul>
              <div className="bg-heritage-gold/10 border-l-4 border-heritage-gold p-4 rounded-r-lg my-6">
                <p className="text-primary font-label-bold mb-1">
                  💡 Ideal para:
                </p>
                <p>
                  Inversores enfocados en alquiler turístico (Airbnb),
                  compradores que buscan la mayor liquidez posible, y quienes
                  tienen presupuesto más alto y buscan retorno inmediato.
                </p>
              </div>
            </section>

            {/* Recomendación */}
            <section>
              <h2 className="text-headline-md font-headline-md text-primary mb-4 mt-12">
                ¿Cuál Elegir? Recomendación por Perfil
              </h2>
              <div className="space-y-4 my-6">
                <div className="bg-surface-container-low rounded-xl p-6">
                  <h3 className="text-headline-sm font-headline-sm text-primary mb-2">
                    🏆 Si buscas mayor plusvalía con bajo presupuesto
                  </h3>
                  <p className="text-deep-forest font-label-bold mb-1">
                    → Quimbaya
                  </p>
                  <p>
                    Lotes desde $150M COP con plusvalía del 18-22% anual. El
                    mejor retorno de inversión del Quindío.
                  </p>
                </div>
                <div className="bg-surface-container-low rounded-xl p-6">
                  <h3 className="text-headline-sm font-headline-sm text-primary mb-2">
                    🏆 Si quieres equilibrio entre inversión y uso personal
                  </h3>
                  <p className="text-deep-forest font-label-bold mb-1">
                    → Filandia
                  </p>
                  <p>
                    Buenos restaurantes, turismo creciente, y precios
                    intermedios. Ideal para segunda residencia con potencial de
                    alquiler.
                  </p>
                </div>
                <div className="bg-surface-container-low rounded-xl p-6">
                  <h3 className="text-headline-sm font-headline-sm text-primary mb-2">
                    🏆 Si tu prioridad es ingresos por Airbnb
                  </h3>
                  <p className="text-deep-forest font-label-bold mb-1">
                    → Salento
                  </p>
                  <p>
                    Mayor demanda turística, mejor liquidez al vender, pero
                    precios más altos. Retorno por alquiler del 10-15% anual.
                  </p>
                </div>
              </div>
            </section>

            {/* CTA */}
            <section className="bg-surface-container-low rounded-2xl p-8 md:p-12 my-12">
              <h2 className="text-headline-md font-headline-md text-primary mb-4">
                Tu Lote en Quimbaya te Espera
              </h2>
              <p className="mb-4">
                Si Quimbaya es tu municipio elegido, La Holanda ofrece los
                lotes con mejor relación precio-calidad de la zona. Con
                escritura pública incluida, diseño arquitectónico tipo, y acceso
                por vía principal, es la inversión inteligente en el corazón del
                Eje Cafetero.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/projects"
                  className="inline-block bg-deep-forest text-on-primary px-8 py-4 rounded-lg font-label-bold hover:brightness-110 transition-[filter] text-center"
                >
                  Ver Lotes Disponibles en Quimbaya
                </Link>
                <Link
                  to="/investment"
                  className="inline-block border-2 border-deep-forest text-deep-forest px-8 py-4 rounded-lg font-label-bold hover:bg-deep-forest hover:text-on-primary transition-colors text-center"
                >
                  Ver Análisis de Inversión
                </Link>
              </div>
            </section>

            {/* FAQ visible */}
            <section className="mt-16">
              <h2 className="text-headline-md font-headline-md text-primary mb-6">
                Preguntas Frecuentes
              </h2>
              <div className="space-y-4">
                {ARTICLE_FAQS.map((faq, i) => (
                  <details
                    key={i}
                    className="group bg-surface-container-lowest border border-outline-variant/10 rounded-xl overflow-hidden"
                  >
                    <summary className="px-6 py-5 cursor-pointer font-label-bold text-primary text-body-md font-body-md flex items-center justify-between list-none hover:bg-surface-container-low/50 transition-colors">
                      <span>{faq.question}</span>
                      <span className="text-heritage-gold group-open:rotate-45 transition-transform text-xl shrink-0 ml-4">
                        +
                      </span>
                    </summary>
                    <div className="px-6 pb-5 text-body-md font-body-md text-on-surface-variant leading-relaxed">
                      {faq.answer}
                    </div>
                  </details>
                ))}
              </div>
            </section>

            {/* Enlaces internos */}
            <section className="mt-12 pt-8 border-t border-outline-variant/20">
              <h3 className="text-headline-sm font-headline-sm text-primary mb-4">
                Artículos relacionados
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/blog/guia-compra-lote-rural-quindio" className="text-deep-forest underline hover:text-heritage-gold">
                    Guía Completa para Comprar un Lote Rural en Quindío 2026
                  </Link>
                </li>
                <li>
                  <Link to="/blog/inversion-eje-cafetero-finca-raiz" className="text-deep-forest underline hover:text-heritage-gold">
                    Por Qué el Eje Cafetero es la Mejor Inversión en Finca Raíz
                  </Link>
                </li>
                <li>
                  <Link to="/blog/escrituracion-lotes-colombia" className="text-deep-forest underline hover:text-heritage-gold">
                    Escrituración de Lotes en Colombia: Guía Paso a Paso
                  </Link>
                </li>
              </ul>
            </section>
          </div>
        </article>
      </div>
    </>
  );
}

import { Link } from "react-router";
import PageSEO from "@/components/seo/PageSEO";
import BreadcrumbSchema from "@/components/seo/BreadcrumbSchema";
import FAQSchema from "@/components/seo/FAQSchema";
import { project } from "@/constants/project";
import { cldUrl } from "@/lib/cloudinary";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const ARTICLE_FAQS = [
  {
    question: "¿Cuánto se ha valorizado los lotes en el Eje Cafetero?",
    answer:
      "Los lotes en el Eje Cafetero han mostrado una valorización promedio del 15-20% anual en los últimos 5 años. En municipios como Quimbaya, Filandia y Salento, la demanda de segundas residencias y el crecimiento turístico han impulsado los precios. Un lote de $180 millones COP puede superar los $300 millones en 3-4 años con esta tasa de crecimiento.",
  },
  {
    question: "¿Es mejor invertir en lotes o en apartamentos en Colombia?",
    answer:
      "Los lotes rurales en el Eje Cafetero ofrecen ventajas sobre apartamentos urbanos: mayor plusvalía anual (15-20% vs 8-12% en ciudades principales), costo de mantenimiento más bajo, posibilidad de construir a tu medida, y uso como segunda vivienda o inversión turística (Airbnb). Sin embargo, son menos líquidos: vender un lote toma más tiempo que vender un apartamento.",
  },
  {
    question: "¿Cuál es el mejor municipio del Quindío para invertir?",
    answer:
      "Para inversión en plusvalía pura, Quimbaya ofrece la mejor relación precio-potencial: lotes desde $150 millones COP con escritura pública, en zona de alto crecimiento turístico. Para inversión turística, Salento y Filandia tienen mayor demanda de Airbnb pero precios más altos. Armenia ofrece mejor liquidez por ser la capital departamental.",
  },
  {
    question: "¿Se puede alquilar un lote del Eje Cafetero por Airbnb?",
    answer:
      "Sí, pero con consideraciones. Puedes construir una cabaña o casa campestre en tu lote y alquilarla por Airbnb. El Eje Cafetero recibe millones de turistas al año, y la demanda de alojamiento rural es alta. Los retornos promedio son del 8-12% anual sobre la inversión total (lote + construcción). En La Holanda, el diseño arquitectónico tipo incluido te ayuda a construir más rápido.",
  },
  {
    question: "¿Qué riesgos tiene invertir en lotes rurales?",
    answer:
      "Los principales riesgos son: (1) menor liquidez comparada con bienes urbanos, (2) necesidad de verificar documentación legal cuidadosamente, (3) costos de urbanización si el lote no tiene servicios, y (4) fluctuaciones del mercado inmobiliario. Estos riesgos se mitigan comprando en parcelaciones establecidas con escritura pública, servicios disponibles y desarrollo probado.",
  },
];

export default function InversionEjeCafetero() {
  const scrollRevealRef = useScrollReveal({
    childSelector: "section",
    variant: "fade-up",
    staggerDelay: 100,
    rootMargin: "0px 0px -60px 0px",
  });

  return (
    <>
      <PageSEO
        title="Invertir en Finca Raíz en el Eje Cafetero: ¿Por Qué?"
        description="Descubre por qué el Eje Cafetero es la mejor opción para invertir en finca raíz en Colombia 2026. Plusvalía del 15-20% anual, datos reales de mercado y zonas con mayor potencial."
        ogUrl="https://laholanda.ingesocc.com/blog/inversion-eje-cafetero-finca-raiz"
        ogImage={cldUrl("https://res.cloudinary.com/j5a9xyaq/image/upload/v1784303937/laholanda/landscapes/DJI_0131.webp")}
        ogType="article"
        keywords="inversión finca raíz eje cafetero, invertir lotes Quindío, plusvalía eje cafetero, inversión inmobiliaria Colombia 2026, lotes valorización Quimbaya, segunda vivienda Colombia"
      />
      <BreadcrumbSchema
        items={[
          { name: "Blog", url: "https://laholanda.ingesocc.com/blog" },
          { name: "Inversión Eje Cafetero", url: "https://laholanda.ingesocc.com/blog/inversion-eje-cafetero-finca-raiz" },
        ]}
      />
      <FAQSchema items={ARTICLE_FAQS} />

      <div ref={scrollRevealRef} className="page-enter">
        {/* Hero del artículo */}
        <section className="pt-28 pb-16 px-margin-mobile md:px-margin-desktop bg-deep-forest relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(197,165,114,0.08),transparent_60%)]" />
          <div className="max-w-4xl mx-auto relative z-10">
            <span className="inline-block text-heritage-gold font-label-bold uppercase tracking-widest text-sm mb-4">
              Análisis de Inversión 2026
            </span>
            <h1 className="font-display-lg text-3xl sm:text-4xl md:text-display-lg text-warm-white drop-shadow-lg leading-tight text-balance mb-6">
              Por Qué el Eje Cafetero es la Mejor Inversión en Finca Raíz
            </h1>
            <p className="text-body-md sm:text-body-lg font-body-lg text-surface-container-high max-w-2xl">
              Datos reales de plusvalía, comparativa con otras regiones de
              Colombia, y por qué los inversores inteligentes están apostando
              por el Quindío, Caldas y Risaralda.
            </p>
            <p className="text-caption font-caption text-warm-white/60 mt-4">
              Por {project.developer} · Actualizado agosto 2026 · 11 min de lectura
            </p>
          </div>
        </section>

        {/* Contenido del artículo */}
        <article className="py-16 md:py-24 px-margin-mobile md:px-margin-desktop">
          <div className="max-w-3xl mx-auto space-y-8 text-body-md font-body-md text-on-surface-variant leading-relaxed">
            {/* Introducción */}
            <p className="text-body-lg font-body-lg">
              Invertir en finca raíz en Colombia ya no es exclusivo de grandes
              capitales. El Eje Cafetero — conformado por Caldas, Risaralda y
              Quindío — se ha consolidado como la región con mayor potencial de
              plusvalía del país, superando a ciudades como Bogotá y Medellín
              en rentabilidad anual.
            </p>
            <p>
              Con datos de los últimos 5 años que muestran valorizaciones del
              15-20% anual, un crecimiento turístico sostenido, y precios
              todavía accesibles comparados con otras zonas, el Eje Cafetero
              ofrece una oportunidad que no durará para siempre.
            </p>

            {/* Sección 1 */}
            <section>
              <h2 className="text-headline-md font-headline-md text-primary mb-4 mt-12">
                1. Datos Reales: Plusvalía del Eje Cafetero
              </h2>
              <p className="mb-4">
                Las cifras hablan por sí solas. Estos son los datos de
                valorización de lotes rurales en el Eje Cafetero según fuentes
                del sector inmobiliario:
              </p>
              <div className="overflow-x-auto my-6">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b-2 border-outline-variant/20">
                      <th className="py-3 px-4 font-label-bold text-primary">Zona</th>
                      <th className="py-3 px-4 font-label-bold text-primary">Plusvalía anual</th>
                      <th className="py-3 px-4 font-label-bold text-primary">Precio m² (2026)</th>
                      <th className="py-3 px-4 font-label-bold text-primary">Proyección 3 años</th>
                    </tr>
                  </thead>
                  <tbody className="text-on-surface-variant">
                    <tr className="border-b border-outline-variant/10">
                      <td className="py-3 px-4">Quimbaya (campestre)</td>
                      <td className="py-3 px-4 font-medium text-deep-forest">18-22%</td>
                      <td className="py-3 px-4">$75.000 - $175.000/m²</td>
                      <td className="py-3 px-4">+$120M - $280M COP</td>
                    </tr>
                    <tr className="border-b border-outline-variant/10">
                      <td className="py-3 px-4">Filandia</td>
                      <td className="py-3 px-4 font-medium text-deep-forest">15-18%</td>
                      <td className="py-3 px-4">$250.000 - $500.000/m²</td>
                      <td className="py-3 px-4">+$130M - $450M COP</td>
                    </tr>
                    <tr className="border-b border-outline-variant/10">
                      <td className="py-3 px-4">Salento</td>
                      <td className="py-3 px-4 font-medium text-deep-forest">12-16%</td>
                      <td className="py-3 px-4">$300.000 - $600.000/m²</td>
                      <td className="py-3 px-4">+$110M - $350M COP</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4">Bogotá (periferia)</td>
                      <td className="py-3 px-4">8-12%</td>
                      <td className="py-3 px-4">$500.000 - $1.200.000/m²</td>
                      <td className="py-3 px-4">+$120M - $430M COP</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p>
                <strong>Dato clave:</strong> Quimbaya ofrece la mayor plusvalía
                anual (18-22%) con el precio por m² más bajo del Eje Cafetero.
                Esto significa que tu inversión crece más rápido que en cualquier
                otra zona, y el punto de entrada es más bajo.
              </p>
            </section>

            {/* Sección 2 */}
            <section>
              <h2 className="text-headline-md font-headline-md text-primary mb-4 mt-12">
                2. ¿Por Qué el Eje Cafetero Crece Más Que Otras Regiones?
              </h2>
              <p className="mb-4">
                La valorización acelerada del Eje Cafetero no es casualidad.
                Hay factores estructurales que la impulsan:
              </p>
              <ul className="list-disc pl-6 space-y-3 mb-6">
                <li>
                  <strong>Turismo récord:</strong> El Eje Cafetero recibe más de
                  3 millones de turistas al año. El Paisaje Cultural Cafetero,
                  declarado Patrimonio de la Humanidad por la UNESCO, es el
                  principal atractivo. Esto genera demanda constante de
                  alojamiento y propiedades vacacionales.
                </li>
                <li>
                  <strong>Segundas residencias:</strong> Colombianos de Bogotá,
                  Medellín y Cali están comprando segundas residencias en el
                  Eje Cafetero por su clima perfecto (22°C), cercanía a las
                  grandes ciudades, y precios accesibles.
                </li>
                <li>
                  <strong>Inversión extranjera:</strong> El dólar fuerte ha
                  hecho que compradores de España, Estados Unidos y otros países
                  vean el Eje Cafetero como una oportunidad de repatriación de
                  capital con alto retorno.
                </li>
                <li>
                  <strong>Infraestructura en mejora:</strong> La vía
                  Armenia-Quimbaya-Alcalá está en proceso de mejoramiento, y
                  el Aeropuerto El Edén conecta la región con Bogotá,
                  Medellín y destinos internacionales.
                </li>
                <li>
                  <strong>Gastronomía y cultura:</strong> La gastronomía del
                  Eje Cafetero (café de especialidad, trucha arcoíris, plátano
                  hartón) y su cultura arriera generan un atractivo turístico
                  único que mantiene la demanda alta.
                </li>
              </ul>
            </section>

            {/* Sección 3 */}
            <section>
              <h2 className="text-headline-md font-headline-md text-primary mb-4 mt-12">
                3. Comparativa: Lotes vs Apartamentos vs CDT
              </h2>
              <p className="mb-4">
                ¿Dónde pone tu dinero un inversionista inteligente en 2026?
                Comparación real:
              </p>
              <div className="overflow-x-auto my-6">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b-2 border-outline-variant/20">
                      <th className="py-3 px-4 font-label-bold text-primary">Tipo de inversión</th>
                      <th className="py-3 px-4 font-label-bold text-primary">Retorno anual</th>
                      <th className="py-3 px-4 font-label-bold text-primary">Punto de entrada</th>
                      <th className="py-3 px-4 font-label-bold text-primary">Liquidez</th>
                    </tr>
                  </thead>
                  <tbody className="text-on-surface-variant">
                    <tr className="border-b border-outline-variant/10">
                      <td className="py-3 px-4">Lote Eje Cafetero</td>
                      <td className="py-3 px-4 font-medium text-deep-forest">15-22%</td>
                      <td className="py-3 px-4">$150M - $350M COP</td>
                      <td className="py-3 px-4">Baja (3-6 meses)</td>
                    </tr>
                    <tr className="border-b border-outline-variant/10">
                      <td className="py-3 px-4">Apartamento Bogotá</td>
                      <td className="py-3 px-4">8-12%</td>
                      <td className="py-3 px-4">$250M - $600M COP</td>
                      <td className="py-3 px-4">Alta (1-2 meses)</td>
                    </tr>
                    <tr className="border-b border-outline-variant/10">
                      <td className="py-3 px-4">CDT bancario</td>
                      <td className="py-3 px-4">10-12%</td>
                      <td className="py-3 px-4">$1M COP mínimo</td>
                      <td className="py-3 px-4">Alta (al vencimiento)</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4">Fondo de inversión</td>
                      <td className="py-3 px-4">6-10%</td>
                      <td className="py-3 px-4">$500K COP mínimo</td>
                      <td className="py-3 px-4">Media (1-5 días)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p>
                <strong>Conclusión:</strong> Los lotes del Eje Cafetero ofrecen
                el mayor retorno de inversión (15-22% anual), con un punto de
                entrada accesible ($150M COP). La única desventaja es la menor
                liquidez: vender un lote toma más tiempo que vender un
                apartamento. Pero para inversores con horizonte de 3-5 años,
                esta es la mejor opción del mercado.
              </p>
            </section>

            {/* Sección 4 */}
            <section>
              <h2 className="text-headline-md font-headline-md text-primary mb-4 mt-12">
                4. Estrategias de Inversión en Finca Raíz
              </h2>
              <p className="mb-4">
                Existen tres estrategias principales para invertir en finca raíz
                en el Eje Cafetero:
              </p>
              <h3 className="text-headline-sm font-headline-sm text-primary mb-3 mt-8">
                Estrategia 1: Compra y retención (plusvalía)
              </h3>
              <p className="mb-4">
                Compras un lote, lo mantienes 3-5 años mientras se valoriza, y
                lo vendes con ganancia. Es la estrategia más simple y con menor
                riesgo. Requiere: verificar escritura pública, elegir zona en
                crecimiento, y tener paciencia.
              </p>
              <h3 className="text-headline-sm font-headline-sm text-primary mb-3 mt-8">
                Estrategia 2: Compra, construye y alquila (Airbnb)
              </h3>
              <p className="mb-4">
                Compras el lote, construyes una cabaña o casa campestre, y la
                alquilas por Airbnb. El retorno incluye plusvalía del terreno +
                ingresos por alquiler. Retorno estimado: 15-22% (plusvalía) +
                8-12% (alquiler) = 23-34% anual combinado. Requiere: inversión
                inicial mayor (lote + construcción), gestión del alquiler.
              </p>
              <h3 className="text-headline-sm font-headline-sm text-primary mb-3 mt-8">
                Estrategia 3: Compra para segunda vivienda
              </h3>
              <p className="mb-4">
                Compras para uso personal como casa de campo o retiro. No
                generas ingreso directo, pero la plusvalía sigue creciendo y
                ahorras en arriendos de vacaciones. Es la estrategia más común
                entre compradores del exterior que buscan repatriar capital.
              </p>
            </section>

            {/* Sección 5 */}
            <section>
              <h2 className="text-headline-md font-headline-md text-primary mb-4 mt-12">
                5. Caso Real: Inversión en La Holanda
              </h2>
              <p className="mb-4">
                Veamos un ejemplo concreto de inversión en La Holanda,
                Quimbaya:
              </p>
              <div className="bg-surface-container-low rounded-xl p-6 my-6 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-on-surface-variant">Lote elegido:</span>
                  <span className="text-primary font-label-bold">Lote 06 — 2.005 m²</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-on-surface-variant">Precio de compra:</span>
                  <span className="text-primary font-label-bold">$158.822.900 COP</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-on-surface-variant">Plusvalía anual estimada:</span>
                  <span className="text-deep-forest font-label-bold">18-22%</span>
                </div>
                <div className="border-t border-outline-variant/20 pt-3 flex justify-between items-center">
                  <span className="text-on-surface-variant">Valor estimado en 3 años:</span>
                  <span className="text-primary font-label-bold text-lg">$280M - $320M COP</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-on-surface-variant">Ganancia estimada:</span>
                  <span className="text-deep-forest font-label-bold">$120M - $160M COP</span>
                </div>
              </div>
              <p>
                Este ejemplo asume una valorización conservadora del 18% anual.
                Con la tendencia actual del mercado, es realista esperar estas
                cifras en un horizonte de 3 años.
              </p>
            </section>

            {/* Sección 6 */}
            <section>
              <h2 className="text-headline-md font-headline-md text-primary mb-4 mt-12">
                6. Riesgos y Cómo Mitigarlos
              </h2>
              <ul className="list-disc pl-6 space-y-3 mb-6">
                <li>
                  <strong>Menor liquidez:</strong> Vender un lote toma más tiempo
                  que vender un apartamento. Mitigación: comprar en zonas con
                  alta demanda turística y proyectos en crecimiento.
                </li>
                <li>
                  <strong>Documentación legal:</strong> Comprar un lote sin
                  escritura pública es extremadamente arriesgado. Mitigación:
                  exiger siempre escritura pública con libertad de cargos.
                </li>
                <li>
                  <strong>Servicios públicos:</strong> Un lote sin acceso a
                  energía o agua puede ser difícil de desarrollar. Mitigación:
                  comprar en parcelaciones establecidas con servicios
                  disponibles.
                </li>
                <li>
                  <strong>Mercado cíclico:</strong> El mercado inmobiliario puede
                  tener fluctuaciones. Mitigación: invertir con horizonte de
                  3-5 años mínimo, no esperar retornos a corto plazo.
                </li>
              </ul>
            </section>

            {/* Sección 7 — CTA */}
            <section className="bg-surface-container-low rounded-2xl p-8 md:p-12 my-12">
              <h2 className="text-headline-md font-headline-md text-primary mb-4">
                Invierte en La Holanda Hoy
              </h2>
              <p className="mb-4">
                Si buscas una inversión en finca raíz con alto potencial de
                plusvalía, servicios incluidos y escritura pública garantizada,
                La Holanda es tu mejor opción en el Quindío.
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-6 text-on-surface-variant">
                <li>Lotes desde 2.005 m² con escritura pública incluida</li>
                <li>Precios desde $158 millones COP</li>
                <li>Diseño arquitectónico tipo incluido</li>
                <li>Acceso por vía principal pavimentada</li>
                <li>Zona de alto crecimiento turístico</li>
              </ul>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/investment"
                  className="inline-block bg-deep-forest text-on-primary px-8 py-4 rounded-lg font-label-bold hover:brightness-110 transition-[filter] text-center"
                >
                  Ver Análisis de Inversión
                </Link>
                <Link
                  to="/projects"
                  className="inline-block border-2 border-deep-forest text-deep-forest px-8 py-4 rounded-lg font-label-bold hover:bg-deep-forest hover:text-on-primary transition-colors text-center"
                >
                  Ver Lotes Disponibles
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
                  <Link to="/blog/escrituracion-lotes-colombia" className="text-deep-forest underline hover:text-heritage-gold">
                    Escrituración de Lotes en Colombia: Guía Paso a Paso
                  </Link>
                </li>
                <li>
                  <Link to="/descubre-quindio" className="text-deep-forest underline hover:text-heritage-gold">
                    Descubre Quindío — Patrimonio de la Humanidad
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

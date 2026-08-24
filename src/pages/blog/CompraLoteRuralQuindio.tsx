import { Link } from "react-router";
import PageSEO from "@/components/seo/PageSEO";
import BreadcrumbSchema from "@/components/seo/BreadcrumbSchema";
import FAQSchema from "@/components/seo/FAQSchema";
import { project } from "@/constants/project";
import { cldUrl } from "@/lib/cloudinary";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const ARTICLE_FAQS = [
  {
    question: "¿Cuánto cuesta comprar un lote rural en Quindío?",
    answer:
      "Los precios de lotes rurales en Quindío varían según la ubicación y el tamaño. En Quimbaya, lotes campestres desde 2.000 m² tienen precios desde $150 millones COP hasta $350 millones COP. En Armenia los precios son más altos por la cercanía urbana. En La Holanda los lotes arrancan desde $158 millones COP con escritura pública incluida.",
  },
  {
    question: "¿Qué documentos necesito para comprar un lote rural en Colombia?",
    answer:
      "Necesitas: cédula de ciudadanía vigente, certificado de tradición y libertad de gravámenes del predio, plano catastral aprobado, paz y salvo de valorización municipal, y el documento de compraventa otorgado ante notaría. En La Holanda gestionamos todos estos trámites incluyendo la escrituración individual.",
  },
  {
    question: "¿Se puede financiar la compra de un lote rural?",
    answer:
      "Sí, muchas inmobiliarias ofrecen planes de pago directo con el desarrollador. En La Holanda puedes reservar con un anticipo y financiar el saldo en cuotas. También existen opciones de crédito hipotecario para lotes en algunos bancos, aunque las tasas son más altas que para vivienda urbana.",
  },
  {
    question: "¿Cuánto tarda el proceso de escrituración de un lote?",
    answer:
      "El proceso de escrituración de un lote rural en Colombia toma entre 30 y 90 días dependiendo de la complejidad del trámite. Incluye verificación de libertad de cargos, avalúo catastral, trámite ante notaría y registro en la Oficina de Registro de Instrumentos Públicos. En La Holanda gestionamos todo el proceso.",
  },
  {
    question: "¿Es seguro comprar un lote rural sin escritura?",
    answer:
      "No es recomendable. Un lote sin escritura puede tener problemas legales como invasión, doble venta o falta de claridad en los linderos. Siempre verifica que el predio tenga escritura pública con libertad de cargos. En La Holanda todos los lotes incluyen escritura pública individual.",
  },
];

export default function CompraLoteRuralQuindio() {
  const scrollRevealRef = useScrollReveal({
    childSelector: "section",
    variant: "fade-up",
    staggerDelay: 100,
    rootMargin: "0px 0px -60px 0px",
  });

  return (
    <>
      <PageSEO
        title="Guía para Comprar un Lote Rural en Quindío 2026"
        description="Guía completa para comprar un lote rural en Quindío, Colombia. Requisitos legales, escrituración, precios, zonas recomendadas y consejos para invertir en el Eje Cafetero. Actualizada 2026."
        ogUrl="https://laholanda.ingesocc.com/blog/guia-compra-lote-rural-quindio"
        ogImage={cldUrl("https://res.cloudinary.com/j5a9xyaq/image/upload/v1784303937/laholanda/landscapes/DJI_0131.webp")}
        ogType="article"
        keywords="comprar lote rural Quindío, escrituración lote Colombia, lotes en venta Quindío 2026, invertir lote eje cafetero, requisitos compra terreno rural, lotes campestres Quimbaya"
      />
      <BreadcrumbSchema
        items={[
          { name: "Blog", url: "https://laholanda.ingesocc.com/blog" },
          { name: "Guía Compra Lote Rural Quindío", url: "https://laholanda.ingesocc.com/blog/guia-compra-lote-rural-quindio" },
        ]}
      />
      <FAQSchema items={ARTICLE_FAQS} />

      <div ref={scrollRevealRef} className="page-enter">
        {/* Hero del artículo */}
        <section className="pt-28 pb-16 px-margin-mobile md:px-margin-desktop bg-deep-forest relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(197,165,114,0.08),transparent_60%)]" />
          <div className="max-w-4xl mx-auto relative z-10">
            <span className="inline-block text-heritage-gold font-label-bold uppercase tracking-widest text-sm mb-4">
              Guía 2026
            </span>
            <h1 className="font-display-lg text-3xl sm:text-4xl md:text-display-lg text-warm-white drop-shadow-lg leading-tight text-balance mb-6">
              Cómo Comprar un Lote Rural en Quindío: Guía Completa 2026
            </h1>
            <p className="text-body-md sm:text-body-lg font-body-lg text-surface-container-high max-w-2xl">
              Todo lo que necesitas saber antes de comprar un lote rural en
              Quindío: requisitos legales, escrituración, precios reales,
              zonas recomendadas y cómo evitar errores costosos.
            </p>
            <p className="text-caption font-caption text-warm-white/60 mt-4">
              Por {project.developer} · Actualizado agosto 2026 · 12 min de lectura
            </p>
          </div>
        </section>

        {/* Contenido del artículo */}
        <article className="py-16 md:py-24 px-margin-mobile md:px-margin-desktop">
          <div className="max-w-3xl mx-auto space-y-8 text-body-md font-body-md text-on-surface-variant leading-relaxed">
            {/* Introducción */}
            <p className="text-body-lg font-body-lg">
              Comprar un lote rural en Quindío se ha convertido en una de las
              mejores oportunidades de inversión inmobiliaria en Colombia. Con un
              clima perfecto de 22°C todo el año, paisajes del Paisaje Cultural
              Cafetero (Patrimonio de la Humanidad por la UNESCO), y precios
              masih accessibles comparados con ciudades principales, el Quindío
              ofrece una ventana que no durará para siempre.
            </p>
            <p>
              Esta guía está diseñada para compradores que buscan su primer lote
              rural ya sea para construir una segunda vivienda, invertir en plusvalía,
              o establecerse permanentemente en el Eje Cafetero. Los datos de precios
              y procesos legales están actualizados para 2026.
            </p>

            {/* Sección 1 */}
            <section>
              <h2 className="text-headline-md font-headline-md text-primary mb-4 mt-12">
                1. ¿Por Qué Comprar un Lote en Quindío?
              </h2>
              <p className="mb-4">
                El Quindío es el departamento más pequeño de Colombia pero uno de
                los más valorados para vivir e invertir. Estas son las razones
                concretas:
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-6">
                <li>
                  <strong>Clima perfecto:</strong> Temperatura promedio de 22°C
                  todo el año, sin extremos de calor o frío.
                </li>
                <li>
                  <strong>Ubicación estratégica:</strong> A 40 minutos de Armenia
                  (capital), 30 min de Filandia, 45 min de Salento, y menos de 1
                  hora del Aeropuerto El Edén.
                </li>
                <li>
                  <strong>Valorización acelerada:</strong> Los lotes en la zona han
                  mostrado un crecimiento del 15-20% anual en los últimos 5 años,
                  impulsado por el turismo y la demanda de segundas residencias.
                </li>
                <li>
                  <strong>Turismo en crecimiento:</strong> El Eje Cafetero recibe
                  más de 3 millones de turistas al año, generando demanda de
                  alojamiento y propiedades vacacionales.
                </li>
                <li>
                  <strong>Calidad de vida:</strong> Paisajes naturales, cultura
                  cafetera, gastronomía de clase mundial, y una comunidad acogedora.
                </li>
              </ul>
            </section>

            {/* Sección 2 */}
            <section>
              <h2 className="text-headline-md font-headline-md text-primary mb-4 mt-12">
                2. Zonas Recomendadas para Comprar Lote en Quindío
              </h2>
              <p className="mb-4">
                No todas las zonas del Quindío son iguales. Aquí las más
                relevantes para compra de lotes rurales:
              </p>

              <h3 className="text-headline-sm font-headline-sm text-primary mb-3 mt-8">
                Quimbaya — La joya del Quindío
              </h3>
              <p className="mb-4">
                Quimbaya está en el centro del departamento, con acceso directo
                por la vía Armenia-Quimbaya-Alcalá. Es ideal para quienes buscan
                lotes campestres con escritura pública a precios accesibles
                (desde $150 millones COP para lotes de 2.000 m²). La zona está
                en pleno crecimiento turístico y de infraestructura vía.
              </p>

              <h3 className="text-headline-sm font-headline-sm text-primary mb-3 mt-8">
                Armenia — Capital con opciones rurales
              </h3>
              <p className="mb-4">
                La capital del Quindío ofrece lotes en las afueras con precios
                más altos pero mejor acceso a servicios. Ideal para quienes
                necesitan conectividad urbana y naturaleza al mismo tiempo.
              </p>

              <h3 className="text-headline-sm font-headline-sm text-primary mb-3 mt-8">
                Filandia y Salento — Para amantes del turismo
              </h3>
              <p className="mb-4">
                Estos municipios son destino turístico internacional. Los lotes
                aquí son más caros pero tienen alto potencial de renta por
                Airbnb o alojamiento turístico. Salento es el acceso al Valle
                de Cocora y el Parque Nacional Natural.
              </p>
            </section>

            {/* Sección 3 */}
            <section>
              <h2 className="text-headline-md font-headline-md text-primary mb-4 mt-12">
                3. Requisitos Legales para Comprar un Lote Rural
              </h2>
              <p className="mb-4">
                El proceso de compra de un lote rural en Colombia tiene
                requisitos específicos que difieren de una vivienda urbana:
              </p>
              <ol className="list-decimal pl-6 space-y-3 mb-6">
                <li>
                  <strong>Cédula de ciudadanía vigente</strong> — Tanto el
                  comprador como el vendedor.
                </li>
                <li>
                  <strong>Certificado de tradición y libertad de gravámenes</strong> —
                  Emitido por la Oficina de Registro de Instrumentos Públicos.
                  Verifica que no haya embargos, hipotecas o limitaciones al
                  dominio.
                </li>
                <li>
                  <strong>Plano catastral aprobado</strong> — Define los linderos
                  exactos del predio. Si no existe, debe elaborarse antes de la
                  escrituración.
                </li>
                <li>
                  <strong>Paz y salvo de valorización</strong> — Certificado del
                  municipio que confirma que no hay deudas pendientes por
                  valorización.
                </li>
                <li>
                  <strong>Avalúo catastral</strong> — Determina el valor del predio
                  para efectos tributarios.
                </li>
                <li>
                  <strong>Escritura pública</strong> — El documento de compraventa
                  otorgado ante notaría, que debe registrarse en la Oficina de
                  Registro.
                </li>
              </ol>
              <div className="bg-heritage-gold/10 border-l-4 border-heritage-gold p-4 rounded-r-lg my-6">
                <p className="text-primary font-label-bold mb-1">
                  💡 Consejo práctico:
                </p>
                <p>
                  Siempre verifica que el lote tenga <strong>libertad de
                  cargos</strong> antes de firmar cualquier documento. Un lote con
                  cargos pendientes puede generar problemas legales graves. En{" "}
                  <Link to="/projects" className="text-deep-forest underline hover:text-heritage-gold">
                    La Holanda
                  </Link>{" "}
                  todos los lotes incluyen escritura pública individual con libertad
                  de cargos verificada.
                </p>
              </div>
            </section>

            {/* Sección 4 */}
            <section>
              <h2 className="text-headline-md font-headline-md text-primary mb-4 mt-12">
                4. Proceso de Escrituración Paso a Paso
              </h2>
              <p className="mb-4">
                Una vez que elegiste tu lote y acordaste el precio, el proceso
                de escrituración toma entre 30 y 90 días:
              </p>
              <ol className="list-decimal pl-6 space-y-3 mb-6">
                <li>
                  <strong>Verificación de documentos:</strong> El notario verifica
                  la libertad de cargos, identidad de las partes y documentación
                  del predio.
                </li>
                <li>
                  <strong>Elaboración de la escritura:</strong> El notario redacta
                  la minuta de compraventa con las condiciones acordadas.
                </li>
                <li>
                  <strong>Firma ante notaría:</strong> Ambas partes firman la
                  escritura en presencia del notario.
                </li>
                <li>
                  <strong>Registro:</strong> La escritura se registra en la Oficina
                  de Registro de Instrumentos Públicos. Este paso es fundamental
                  para que la compra tenga efectos frente a terceros.
                </li>
                <li>
                  <strong>Entrega del lote:</strong> Una vez registrado, el vendedor
                  entrega el lote con sus linderos y documentos.
                </li>
              </ol>
            </section>

            {/* Sección 5 */}
            <section>
              <h2 className="text-headline-md font-headline-md text-primary mb-4 mt-12">
                5. Precios Reales de Lotes Rurales en Quindío (2026)
              </h2>
              <p className="mb-4">
                Los precios varían significativamente según la zona, el tamaño y
                los servicios disponibles. Estos son los rangos reales para 2026:
              </p>
              <div className="overflow-x-auto my-6">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b-2 border-outline-variant/20">
                      <th className="py-3 px-4 font-label-bold text-primary">Zona</th>
                      <th className="py-3 px-4 font-label-bold text-primary">Área típica</th>
                      <th className="py-3 px-4 font-label-bold text-primary">Rango de precio</th>
                      <th className="py-3 px-4 font-label-bold text-primary">Precio/m²</th>
                    </tr>
                  </thead>
                  <tbody className="text-on-surface-variant">
                    <tr className="border-b border-outline-variant/10">
                      <td className="py-3 px-4">Quimbaya (campestre)</td>
                      <td className="py-3 px-4">2.000 - 4.000 m²</td>
                      <td className="py-3 px-4">$150M - $350M COP</td>
                      <td className="py-3 px-4">$75.000 - $175.000/m²</td>
                    </tr>
                    <tr className="border-b border-outline-variant/10">
                      <td className="py-3 px-4">Armenia (periferia)</td>
                      <td className="py-3 px-4">500 - 2.000 m²</td>
                      <td className="py-3 px-4">$200M - $600M COP</td>
                      <td className="py-3 px-4">$400.000 - $800.000/m²</td>
                    </tr>
                    <tr className="border-b border-outline-variant/10">
                      <td className="py-3 px-4">Filandia</td>
                      <td className="py-3 px-4">1.000 - 3.000 m²</td>
                      <td className="py-3 px-4">$250M - $500M COP</td>
                      <td className="py-3 px-4">$250.000 - $500.000/m²</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4">Salento</td>
                      <td className="py-3 px-4">1.000 - 5.000 m²</td>
                      <td className="py-3 px-4">$300M - $800M COP</td>
                      <td className="py-3 px-4">$300.000 - $600.000/m²</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p>
                Los lotes en Quimbaya ofrecen la mejor relación precio-m² del
                departamento, con acceso a servicios y cercanía a las principales
                ciudades del Eje Cafetero.
              </p>
            </section>

            {/* Sección 6 */}
            <section>
              <h2 className="text-headline-md font-headline-md text-primary mb-4 mt-12">
                6. Errores Comunes al Comprar un Lote Rural
              </h2>
              <ul className="list-disc pl-6 space-y-3 mb-6">
                <li>
                  <strong>No verificar la escritura:</strong> Comprar un lote sin
                  escritura pública es el error más costoso. Sin escritura, no
                  tienes garantía legal de propiedad.
                </li>
                <li>
                  <strong>No revisar linderos:</strong> Sin plano catastral
                  aprobado, los linderos pueden ser ambiguos y generar conflictos
                  con vecinos.
                </li>
                <li>
                  <strong>Olvidar los servicios públicos:</strong> Verifica si el
                  lote tiene acceso a energía eléctrica, agua potable y vía de
                  acceso antes de comprar.
                </li>
                <li>
                  <strong>No considerar la topografía:</strong> Un lote muy
                  pendiente puede incrementar significativamente el costo de
                  construcción.
                </li>
                <li>
                  <strong>Contratar un abogado:</strong> Aunque el notario verifica
                  documentos, un abogado independiente puede revisar el contrato
                  antes de firmar.
                </li>
              </ul>
            </section>

            {/* Sección 7 — CTA */}
            <section className="bg-surface-container-low rounded-2xl p-8 md:p-12 my-12">
              <h2 className="text-headline-md font-headline-md text-primary mb-4">
                Encuentra Tu Lote en La Holanda
              </h2>
              <p className="mb-6">
                Si estás buscando un lote campestre en Quimbaya con escritura
                pública, vías de acceso y diseño arquitectónico incluido, La
                Holanda es la opción ideal. Con lotes desde 2.005 m² y precios
                desde $158 millones COP, puedes construir tu casa de campo o
                segunda vivienda en el corazón del Eje Cafetero.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/projects"
                  className="inline-block bg-deep-forest text-on-primary px-8 py-4 rounded-lg font-label-bold hover:brightness-110 transition-[filter] text-center"
                >
                  Ver Lotes Disponibles
                </Link>
                <Link
                  to="/contact"
                  className="inline-block border-2 border-deep-forest text-deep-forest px-8 py-4 rounded-lg font-label-bold hover:bg-deep-forest hover:text-on-primary transition-colors text-center"
                >
                  Agendar Visita
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
                  <Link to="/investment" className="text-deep-forest underline hover:text-heritage-gold">
                    Invertir en Quindío — Plusvalía y Crecimiento en el Eje Cafetero
                  </Link>
                </li>
                <li>
                  <Link to="/descubre-quindio" className="text-deep-forest underline hover:text-heritage-gold">
                    Descubre Quindío — Patrimonio de la Humanidad
                  </Link>
                </li>
                <li>
                  <Link to="/projects" className="text-deep-forest underline hover:text-heritage-gold">
                    Ver Lotes Disponibles en La Holanda
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

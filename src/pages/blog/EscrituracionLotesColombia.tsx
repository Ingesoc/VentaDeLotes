import { Link } from "react-router";
import PageSEO from "@/components/seo/PageSEO";
import BreadcrumbSchema from "@/components/seo/BreadcrumbSchema";
import FAQSchema from "@/components/seo/FAQSchema";
import { project } from "@/constants/project";
import { cldUrl } from "@/lib/cloudinary";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const ARTICLE_FAQS = [
  {
    question: "¿Cuánto tarda el proceso de escrituración de un lote en Colombia?",
    answer:
      "El proceso completo toma entre 30 y 90 días dependiendo de la complejidad. La verificación de libertad de cargos toma 5-10 días, la elaboración de la escritura 5-15 días, y el registro en la Oficina de Instrumentos Públicos 10-30 días adicionales. En lotes nuevos de parcelaciones como La Holanda, el proceso es más ágil porque la documentación ya está preparada.",
  },
  {
    question: "¿Cuánto cuesta escriturar un lote en Colombia?",
    answer:
      "Los costos incluyen: honorarios notariales (aproximadamente $300.000 - $800.000 COP dependiendo del valor del predio), registro en Instrumentos Públicos ($150.000 - $400.000 COP), y impuestos como el stamp duty (3 por mil del valor de la transacción). En una parcelación como La Holanda, la escrituración está incluida en el precio del lote.",
  },
  {
    question: "¿Qué es la libertad de cargos y por qué es importante?",
    answer:
      "La libertad de cargos es un certificado que verifica que un predio no tiene embargos, hipotecas, limitaciones al dominio ni otros gravámenes registrados. Es el documento más importante al comprar un lote: sin él, podrías adquirir un predio con deudas o restricciones legales. Siempre solicita este certificado antes de firmar cualquier contrato de compraventa.",
  },
  {
    question: "¿Puedo escriturar un lote sin abogado?",
    answer:
      "Sí, el trámite notarial no requiere abogado, pero se recomienda tener asesoría legal independiente, especialmente si el lote no es nuevo o si hay negociaciones complejas. El notario verifica documentos pero no representa a ninguna de las partes. Un abogado puede revisar el contrato antes de firmar y proteger tus intereses.",
  },
  {
    question: "¿Qué pasa si compro un lote sin escritura pública?",
    answer:
      "Comprar un lote sin escritura es extremadamente arriesgado. Sin escritura, no tienes prueba legal de propiedad, no puedes venderlo formalmente, no puedes construir legalmente, y podrías enfrentar problemas de doble venta o invasión. Siempre exige escritura pública con libertad de cargos. En La Holanda, todos los lotes ya incluyen escrituración individual.",
  },
];

export default function EscrituracionLotesColombia() {
  const scrollRevealRef = useScrollReveal({
    childSelector: "section",
    variant: "fade-up",
    staggerDelay: 100,
    rootMargin: "0px 0px -60px 0px",
  });

  return (
    <>
      <PageSEO
        title="Escrituración de Lotes en Colombia: Guía Paso a Paso"
        description="Aprende cómo escriturar un lote en Colombia: requisitos, costos, tiempos y errores comunes. Guía actualizada 2026 con todo lo que necesitas saber sobre escritura pública de terrenos."
        ogUrl="https://laholanda.ingesocc.com/blog/escrituracion-lotes-colombia"
        ogImage={cldUrl("https://res.cloudinary.com/j5a9xyaq/image/upload/v1784304240/laholanda/events/cafetales.jpg")}
        ogType="article"
        keywords="escrituración lote Colombia, escritura pública terreno, cómo escriturar lote rural, proceso escrituración Colombia, costos escrituración lote, libertad de cargos"
      />
      <BreadcrumbSchema
        items={[
          { name: "Blog", url: "https://laholanda.ingesocc.com/blog" },
          { name: "Escrituración de Lotes", url: "https://laholanda.ingesocc.com/blog/escrituracion-lotes-colombia" },
        ]}
      />
      <FAQSchema items={ARTICLE_FAQS} />

      <div ref={scrollRevealRef} className="page-enter">
        {/* Hero del artículo */}
        <section className="pt-28 pb-16 px-margin-mobile md:px-margin-desktop bg-deep-forest relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(197,165,114,0.08),transparent_60%)]" />
          <div className="max-w-4xl mx-auto relative z-10">
            <span className="inline-block text-heritage-gold font-label-bold uppercase tracking-widest text-sm mb-4">
              Guía Legal 2026
            </span>
            <h1 className="font-display-lg text-3xl sm:text-4xl md:text-display-lg text-warm-white drop-shadow-lg leading-tight text-balance mb-6">
              Escrituración de Lotes en Colombia: Todo lo que Necesitas Saber
            </h1>
            <p className="text-body-md sm:text-body-lg font-body-lg text-surface-container-high max-w-2xl">
              Proceso completo de escrituración de un lote rural: documentos,
              costos, tiempos, y cómo proteger tu inversión con la debida
              diligencia legal.
            </p>
            <p className="text-caption font-caption text-warm-white/60 mt-4">
              Por {project.developer} · Actualizado agosto 2026 · 10 min de lectura
            </p>
          </div>
        </section>

        {/* Contenido del artículo */}
        <article className="py-16 md:py-24 px-margin-mobile md:px-margin-desktop">
          <div className="max-w-3xl mx-auto space-y-8 text-body-md font-body-md text-on-surface-variant leading-relaxed">
            {/* Introducción */}
            <p className="text-body-lg font-body-lg">
              La escrituración es el acto legal que te convierte en propietario
              formal de un lote en Colombia. Sin una escritura pública válida, tu
              inversión no está protegida: no puedes vender, no puedes construir
              legalmente, y no tienes prueba de propiedad ante terceros.
            </p>
            <p>
              Esta guía explica el proceso completo de escrituración de un lote
              rural en Colombia, desde la verificación inicial hasta el registro
              final. Ya sea que estés comprando tu primer lote o verificando la
              documentación de un predio existente, aquí encontrarás todo lo que
              necesitas saber.
            </p>

            {/* Sección 1 */}
            <section>
              <h2 className="text-headline-md font-headline-md text-primary mb-4 mt-12">
                1. ¿Qué es la Escrituración y Por Qué Importa?
              </h2>
              <p className="mb-4">
                La escrituración es el proceso mediante el cual se formaliza la
                compraventa de un inmueble ante un notario público, y se registra
                en la Oficina de Registro de Instrumentos Públicos. Este proceso
                tiene dos efectos fundamentales:
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-6">
                <li>
                  <strong>Efecto entre las partes:</strong> La escritura pública
                  prueba que existió un contrato de compraventa entre el vendedor
                  y el comprador, con todas las condiciones acordadas.
                </li>
                <li>
                  <strong>Efecto frente a terceros:</strong> Solo después de
                  registrarse en la Oficina de Registro, la compraventa tiene
                  efectos legales frente a terceros (otros compradores,
                  acreedores, etc.).
                </li>
              </ul>
              <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg my-6">
                <p className="text-red-700 font-label-bold mb-1">
                  ⚠️ Dato importante:
                </p>
                <p className="text-red-600">
                  Un contrato de compraventa que no se registre en Instrumentos
                  Públicos no tiene efectos frente a terceros. Si el vendedor
                  vende el mismo lote a otra persona y esa persona lo registra
                  primero, ella es la propietaria legal, sin importar quién
                  pagó primero.
                </p>
              </div>
            </section>

            {/* Sección 2 */}
            <section>
              <h2 className="text-headline-md font-headline-md text-primary mb-4 mt-12">
                2. Documentos Requeridos para Escriturar un Lote
              </h2>
              <p className="mb-4">
                Antes de iniciar el proceso, necesitas reunir los siguientes
                documentos:
              </p>
              <h3 className="text-headline-sm font-headline-sm text-primary mb-3 mt-8">
                Del vendedor:
              </h3>
              <ol className="list-decimal pl-6 space-y-2 mb-6">
                <li>
                  <strong>Cédula de ciudadanía</strong> — Copia del documento de
                  identidad del vendedor.
                </li>
                <li>
                  <strong>Certificado de tradición y libertad de gravámenes</strong> —
                  Emitido por la Oficina de Registro. Verifica que no haya
                  embargos, hipotecas o limitaciones al dominio.
                </li>
                <li>
                  <strong>Plano catastral aprobado</strong> — Define los linderos
                  exactos del predio. Si no existe, debe elaborarse por un
                  topógrafo y aprobarse en el municipio.
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
                  <strong>Certificado de libertad de uso del suelo</strong> —
                  Verifica que el predio puede ser utilizado para el fin
                  deseado (construcción, agricultura, etc.).
                </li>
              </ol>

              <h3 className="text-headline-sm font-headline-sm text-primary mb-3 mt-8">
                Del comprador:
              </h3>
              <ol className="list-decimal pl-6 space-y-2 mb-6">
                <li>
                  <strong>Cédula de ciudadanía vigente</strong> — Copia del
                  documento de identidad.
                </li>
                <li>
                  <strong>RUT (Registro Único Tributario)</strong> — Solo si
                  aplica para efectos fiscales.
                </li>
                <li>
                  <strong>Comprobante de fondos</strong> — En algunos casos, el
                  notario puede solicitar prueba de origen de los fondos para
                  prevenir lavado de activos.
                </li>
              </ol>
            </section>

            {/* Sección 3 */}
            <section>
              <h2 className="text-headline-md font-headline-md text-primary mb-4 mt-12">
                3. Proceso de Escrituración Paso a Paso
              </h2>
              <p className="mb-4">
                El proceso completo sigue estos 6 pasos:
              </p>
              <ol className="list-decimal pl-6 space-y-3 mb-6">
                <li>
                  <strong>Verificación de documentos:</strong> El notario revisa
                  la libertad de cargos, identidad de las partes, plano
                  catastral y documentos del predio. Si hay inconsistencias, el
                  proceso se detiene hasta resolverlas.
                </li>
                <li>
                  <strong>Elaboración de la minuta:</strong> El notario redacta
                  la minuta de compraventa con las condiciones acordadas:
                  precio, forma de pago, linderos, y obligaciones de cada parte.
                </li>
                <li>
                  <strong>Revisión y aprobación:</strong> Las partes revisan la
                  minuta. Es recomendable que un abogado independiente la revise
                  antes de la firma.
                </li>
                <li>
                  <strong>Firma de la escritura:</strong> Ambas partes firman la
                  escritura en presencia del notario. El notario verifica la
                  identidad y capacidad legal de los firmantes.
                </li>
                <li>
                  <strong>Pago de impuestos:</strong> Se paga el impuesto de
                  registro (3 por mil del valor de la transacción) y los
                  honorarios notariales.
                </li>
                <li>
                  <strong>Registro en Instrumentos Públicos:</strong> La escritura
                  se registra en la Oficina de Registro. Este paso es fundamental
                  para que la compra tenga efectos frente a terceros.
                </li>
              </ol>
              <div className="bg-heritage-gold/10 border-l-4 border-heritage-gold p-4 rounded-r-lg my-6">
                <p className="text-primary font-label-bold mb-1">
                  💡 Consejo práctico:
                </p>
                <p>
                  En una parcelación nueva como{" "}
                  <Link to="/projects" className="text-deep-forest underline hover:text-heritage-gold">
                    La Holanda
                  </Link>
                  , la documentación del predio ya está preparada (plano
                  catastral aprobado, libertad de cargos verificada). Esto
                  reduce significativamente los tiempos de escrituración: de
                  90 días a 30-45 días.
                </p>
              </div>
            </section>

            {/* Sección 4 */}
            <section>
              <h2 className="text-headline-md font-headline-md text-primary mb-4 mt-12">
                4. Costos de Escrituración en Colombia (2026)
              </h2>
              <p className="mb-4">
                Los costos de escrituración varían según el valor del predio y la
                complejidad del trámite. Estos son los rangos aproximados para
                2026:
              </p>
              <div className="overflow-x-auto my-6">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b-2 border-outline-variant/20">
                      <th className="py-3 px-4 font-label-bold text-primary">Concepto</th>
                      <th className="py-3 px-4 font-label-bold text-primary">Costo aproximado</th>
                      <th className="py-3 px-4 font-label-bold text-primary">¿Quién paga?</th>
                    </tr>
                  </thead>
                  <tbody className="text-on-surface-variant">
                    <tr className="border-b border-outline-variant/10">
                      <td className="py-3 px-4">Impuesto de registro (3 por mil)</td>
                      <td className="py-3 px-4">3‰ del valor de la transacción</td>
                      <td className="py-3 px-4">Comprador</td>
                    </tr>
                    <tr className="border-b border-outline-variant/10">
                      <td className="py-3 px-4">Honorarios notariales</td>
                      <td className="py-3 px-4">$300.000 - $800.000 COP</td>
                      <td className="py-3 px-4">Compartido (50/50 habitual)</td>
                    </tr>
                    <tr className="border-b border-outline-variant/10">
                      <td className="py-3 px-4">Registro en Instrumentos Públicos</td>
                      <td className="py-3 px-4">$150.000 - $400.000 COP</td>
                      <td className="py-3 px-4">Comprador</td>
                    </tr>
                    <tr className="border-b border-outline-variant/10">
                      <td className="py-3 px-4">Certificado de tradición</td>
                      <td className="py-3 px-4">$50.000 - $100.000 COP</td>
                      <td className="py-3 px-4">Vendedor</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4">Avalúo catastral</td>
                      <td className="py-3 px-4">$80.000 - $200.000 COP</td>
                      <td className="py-3 px-4">Vendedor</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p>
                <strong>Ejemplo real:</strong> Para un lote de $200 millones COP,
                el impuesto de registro sería de $600.000 COP (3‰), más
                honorarios notariales de aproximadamente $500.000 COP, más registro
                de $250.000 COP. Total de costos de escrituración: aproximadamente
                $1.350.000 COP.
              </p>
            </section>

            {/* Sección 5 */}
            <section>
              <h2 className="text-headline-md font-headline-md text-primary mb-4 mt-12">
                5. Tiempos de Escrituración
              </h2>
              <p className="mb-4">
                Los tiempos varían según la complejidad del caso:
              </p>
              <div className="overflow-x-auto my-6">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b-2 border-outline-variant/20">
                      <th className="py-3 px-4 font-label-bold text-primary">Fase</th>
                      <th className="py-3 px-4 font-label-bold text-primary">Tiempo típico</th>
                      <th className="py-3 px-4 font-label-bold text-primary">¿Qué lo retrasa?</th>
                    </tr>
                  </thead>
                  <tbody className="text-on-surface-variant">
                    <tr className="border-b border-outline-variant/10">
                      <td className="py-3 px-4">Verificación de documentos</td>
                      <td className="py-3 px-4">5-10 días</td>
                      <td className="py-3 px-4">Documentos faltantes, cargos pendientes</td>
                    </tr>
                    <tr className="border-b border-outline-variant/10">
                      <td className="py-3 px-4">Elaboración de minuta</td>
                      <td className="py-3 px-4">5-15 días</td>
                      <td className="py-3 px-4">Negociación de condiciones</td>
                    </tr>
                    <tr className="border-b border-outline-variant/10">
                      <td className="py-3 px-4">Firma y pago</td>
                      <td className="py-3 px-4">1-3 días</td>
                      <td className="py-3 px-4">Disponibilidad de las partes</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4">Registro</td>
                      <td className="py-3 px-4">10-30 días</td>
                      <td className="py-3 px-4">Carga en la Oficina de Registro</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p>
                <strong>Total estimado:</strong> 30-60 días para lotes nuevos con
                documentación preparada. 60-90 días para lotes con
                complejidades legales.
              </p>
            </section>

            {/* Sección 6 */}
            <section>
              <h2 className="text-headline-md font-headline-md text-primary mb-4 mt-12">
                6. Errores Comunes en la Escrituración
              </h2>
              <ul className="list-disc pl-6 space-y-3 mb-6">
                <li>
                  <strong>No verificar la libertad de cargos:</strong> El error
                  más grave. Un lote con embargos o hipotecas puede generar
                  pérdidas financieras enormes.
                </li>
                <li>
                  <strong>No registrar la escritura:</strong> Muchas personas
                  firman la escritura pero no la registran. Sin registro, la
                  compra no tiene efectos frente a terceros.
                </li>
                <li>
                  <strong>Confundir posesión con propiedad:</strong> Habitar un
                  lote no te convierte en propietario. Solo la escritura pública
                  registrada prueba la propiedad legal.
                </li>
                <li>
                  <strong>No verificar linderos:</strong> Sin plano catastral
                  aprobado, los linderos pueden ser ambiguos y generar conflictos
                  con vecinos.
                </li>
                <li>
                  <strong>Omitir el paz y salvo de valorización:</strong> Si el
                  predio tiene deudas de valorización, estas pasan al nuevo
                  propietario.
                </li>
              </ul>
            </section>

            {/* Sección 7 — CTA */}
            <section className="bg-surface-container-low rounded-2xl p-8 md:p-12 my-12">
              <h2 className="text-headline-md font-headline-md text-primary mb-4">
                Escrituración Incluida en La Holanda
              </h2>
              <p className="mb-4">
                En{" "}
                <Link to="/projects" className="text-deep-forest underline hover:text-heritage-gold">
                  La Holanda
                </Link>
                , la escrituración pública individual está{" "}
                <strong>incluida en el precio del lote</strong>. No necesitas
                preocuparte por trámites complejos: gestionamos todo el proceso
                desde la verificación de documentos hasta el registro final en
                Instrumentos Públicos.
              </p>
              <p className="mb-6">
                Cada lote incluye: escritura pública con libertad de cargos,
                plano catastral aprobado, proceso de legalización completo, y
                asesoría legal durante todo el proceso. Con más de 20 años de
                experiencia, {project.developer} te garantiza una compra segura y
                sin sorpresas.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/projects"
                  className="inline-block bg-deep-forest text-on-primary px-8 py-4 rounded-lg font-label-bold hover:brightness-110 transition-[filter] text-center"
                >
                  Ver Lotes con Escritura Incluida
                </Link>
                <Link
                  to="/contact"
                  className="inline-block border-2 border-deep-forest text-deep-forest px-8 py-4 rounded-lg font-label-bold hover:bg-deep-forest hover:text-on-primary transition-colors text-center"
                >
                  Asesoría Legal Gratuita
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
                  <Link to="/investment" className="text-deep-forest underline hover:text-heritage-gold">
                    Invertir en Quindío — Plusvalía y Crecimiento en el Eje Cafetero
                  </Link>
                </li>
                <li>
                  <Link to="/projects" className="text-deep-forest underline hover:text-heritage-gold">
                    Ver Lotes Disponibles con Escritura Pública Incluida
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

import { Link } from "react-router";
import PageSEO from "@/components/seo/PageSEO";
import BreadcrumbSchema from "@/components/seo/BreadcrumbSchema";
import FAQSchema from "@/components/seo/FAQSchema";
import { project } from "@/constants/project";
import { cldUrl } from "@/lib/cloudinary";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const ARTICLE_FAQS = [
  {
    question: "¿Qué es la libertad de cargos y cómo la obtengo?",
    answer:
      "La libertad de cargos es un certificado emitido por la Oficina de Registro de Instrumentos Públicos que verifica que un predio no tiene embargos, hipotecas, limitaciones al dominio ni otros gravámenes. Se obtiene solicitando un certificado de tradición del predio, que cuesta aproximadamente $50.000 - $100.000 COP y se entrega en 1-3 días hábiles.",
  },
  {
    question: "¿Cómo sé si un lote tiene escritura pública?",
    answer:
      "Puedes verificar si un lote tiene escritura pública de dos formas: (1) Solicitar el certificado de tradición y libertad de gravámenes en la Oficina de Registro de Instrumentos Públicos del municipio, o (2) Pedir al vendedor una copia de la escritura registrada. Si el vendedor no puede mostrar la escritura, es una señal de alerta importante.",
  },
  {
    question: "¿Qué diferencia hay entre escritura pública y promesa de compraventa?",
    answer:
      "La promesa de compraventa es un contrato privado donde las partes se comprometen a realizar la compraventa en el futuro. La escritura pública es el documento final otorgado ante notario que formaliza la transferencia de propiedad. La promesa no te convierte en propietario; solo la escritura pública registrada lo hace.",
  },
  {
    question: "¿Puedo verificar la documentación de un lote yo mismo?",
    answer:
      "Sí, puedes verificar varios aspectos por tu cuenta: solicitar el certificado de tradición en la Oficina de Registro, revisar el plano catastral en la Oficina de Catastro del municipio, y verificar el paz y salvo de valorización en la Secretaría de Hacienda municipal. Sin embargo, se recomienda contar con asesoría legal para revisar la documentación completa.",
  },
  {
    question: "¿Qué pasa si compro un lote sin verificar la escritura?",
    answer:
      "Los riesgos son graves: (1) El lote puede tener embargos o hipotecas que pasan a ti como comprador. (2) Puede haber una doble venta registrada. (3) Los linderos pueden ser ambiguos sin plano catastral. (4) No puedes construir legalmente sin escritura. (5) No puedes vender el lote formalmente. Siempre verifica antes de comprar.",
  },
];

export default function LotesEscrituraPublica() {
  const scrollRevealRef = useScrollReveal({
    childSelector: "section",
    variant: "fade-up",
    staggerDelay: 100,
    rootMargin: "0px 0px -60px 0px",
  });

  return (
    <>
      <PageSEO
        title="Lotes con Escritura Pública: Qué Verificar Antes de Comprar"
        description="Guía completa para verificar la documentación legal de un lote antes de comprar: escritura pública, libertad de cargos, plano catastral y más. Evita errores costosos."
        ogUrl="https://laholanda.ingesocc.com/blog/lotes-con-escritura-publica-verificar"
        ogImage={cldUrl("https://res.cloudinary.com/j5a9xyaq/image/upload/v1784303937/laholanda/landscapes/DJI_0131.webp")}
        ogType="article"
        keywords="lotes con escritura pública, verificar lote antes de comprar, libertad de cargos, certificado tradición lote, documento legal lote rural, escritura pública Colombia"
      />
      <BreadcrumbSchema
        items={[
          { name: "Blog", url: "https://laholanda.ingesocc.com/blog" },
          { name: "Lotes con Escritura Pública", url: "https://laholanda.ingesocc.com/blog/lotes-con-escritura-publica-verificar" },
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
              Lotes con Escritura Pública: Qué Verificar Antes de Comprar
            </h1>
            <p className="text-body-md sm:text-body-lg font-body-lg text-surface-container-high max-w-2xl">
              Antes de invertir tu dinero en un lote rural, necesitas saber
              exactamente qué documentos verificar. Esta guía te enseña a
              proteger tu inversión con la debida diligencia legal.
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
              Comprar un lote rural sin verificar su documentación legal es el
              error más costoso que puede cometer un comprador. Un lote sin
              escritura pública, con embargos pendientes, o con linderos
              ambiguos puede convertir tu inversión en una pesadilla legal que
              toma años resolver.
            </p>
            <p>
              Esta guía te enseña exactamente qué documentos verificar, dónde
              obtenerlos, y qué señales de alerta debes buscar antes de firmar
              cualquier contrato de compraventa. Ya sea que compres en una
              parcelación establecida o directamente con un propietario
              particular, estos pasos son indispensables.
            </p>

            {/* Sección 1 */}
            <section>
              <h2 className="text-headline-md font-headline-md text-primary mb-4 mt-12">
                1. Documentos Indispensables para Verificar
              </h2>
              <p className="mb-4">
                Antes de comprar cualquier lote, verifica que existan estos
                documentos. Sin alguno de ellos, la compra es de alto riesgo:
              </p>
              <ol className="list-decimal pl-6 space-y-3 mb-6">
                <li>
                  <strong>Certificado de Tradición y Libertad de Gravámenes:</strong>{" "}
                  El documento más importante. Verifica que no haya embargos,
                  hipotecas, limitaciones al dominio ni otros gravámenes.
                  Emitido por la Oficina de Registro de Instrumentos Públicos.
                </li>
                <li>
                  <strong>Escritura Pública Registrada:</strong> El documento
                  que prueba quién es el propietario legal del predio. Debe
                  estar registrado (no solo firmado) en la Oficina de Registro.
                </li>
                <li>
                  <strong>Plano Catastral Aprobado:</strong> Define los linderos
                  exactos del predio. Sin él, los límites entre propiedades
                  pueden ser ambiguos y generar conflictos.
                </li>
                <li>
                  <strong>Paz y Salvo de Valorización:</strong> Certificado del
                  municipio que confirma que no hay deudas pendientes por
                  valorización. Si las hay, pasan al nuevo propietario.
                </li>
                <li>
                  <strong>Avalúo Catastral:</strong> Determina el valor del
                  predio para efectos tributarios y de impuesto de registro.
                </li>
                <li>
                  <strong>Certificado de Libertad de Uso del Suelo:</strong>{" "}
                  Verifica que el predio puede ser utilizado para el fin
                  deseado (construcción, agricultura, etc.).
                </li>
              </ol>
              <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg my-6">
                <p className="text-red-700 font-label-bold mb-1">
                  ⚠️ Señal de alerta:
                </p>
                <p className="text-red-600">
                  Si el vendedor no puede mostrar el certificado de tradición
                  o la escritura registrada, <strong>no compres ese lote</strong>.
                  Un vendedor legítimo siempre tendrá estos documentos
                  disponibles.
                </p>
              </div>
            </section>

            {/* Sección 2 */}
            <section>
              <h2 className="text-headline-md font-headline-md text-primary mb-4 mt-12">
                2. El Certificado de Tradición: Tu Principal Herramienta
              </h2>
              <p className="mb-4">
                El certificado de tradición y libertad de gravámenes es el
                documento que te dice todo sobre la historia legal de un predio.
                Aquí te explicamos cómo leerlo:
              </p>
              <h3 className="text-headline-sm font-headline-sm text-primary mb-3 mt-6">
                Secciones clave del certificado:
              </h3>
              <ul className="list-disc pl-6 space-y-2 mb-6">
                <li>
                  <strong>Matrícula inmobiliaria:</strong> Número único de
                  identificación del predio. Verifica que coincida con la
                  matrícula en la escritura.
                </li>
                <li>
                  <strong>Propietario actual:</strong> Debe coincidir con la
                  persona que te está vendiendo.
                </li>
                <li>
                  <strong>Cédula catastral:</strong> Número de identificación
                  ante la administración de impuestos.
                </li>
                <li>
                  <strong>Linderos:</strong> Descripción de los límites del
                  predio. Deben coincidir con el plano catastral.
                </li>
                <li>
                  <strong>Gravámenes:</strong> Esta es la sección crítica. Si
                  aparece algún gravamen (embargo, hipoteca, limitación), la
                  compra es de alto riesgo.
                </li>
              </ul>
              <div className="bg-heritage-gold/10 border-l-4 border-heritage-gold p-4 rounded-r-lg my-6">
                <p className="text-primary font-label-bold mb-1">
                  💡 Consejo práctico:
                </p>
                <p>
                  Solicita un certificado de tradición <strong>reciente</strong>{" "}
                  (no mayor a 30 días). Los gravámenes pueden cambiar rápido.
                  En{" "}
                  <Link to="/projects" className="text-deep-forest underline hover:text-heritage-gold">
                    La Holanda
                  </Link>
                  , todos los lotes tienen certificado de tradición actualizado
                  y libre de gravámenes.
                </p>
              </div>
            </section>

            {/* Sección 3 */}
            <section>
              <h2 className="text-headline-md font-headline-md text-primary mb-4 mt-12">
                3. El Plano Catastral: Protege Tus Linderos
              </h2>
              <p className="mb-4">
                El plano catastral define los límites exactos de tu propiedad.
                Sin él, no sabes dónde empieza y termina tu lote. Esto puede
                generar conflictos costosos con vecinos.
              </p>
              <h3 className="text-headline-sm font-headline-sm text-primary mb-3 mt-6">
                Qué verificar en el plano catastral:
              </h3>
              <ol className="list-decimal pl-6 space-y-2 mb-6">
                <li>
                  <strong>Que esté aprobado por el municipio:</strong> Un plano
                  no aprobado no tiene validez legal.
                </li>
                <li>
                  <strong>Que los linderos coincidan con el certificado de
                  tradición:</strong> La descripción en el certificado debe
                  coincidir con las coordenadas del plano.
                </li>
                <li>
                  <strong>Que el área coincida:</strong> El área en metros
                  cuadrados del plano debe coincidir con lo que el vendedor te
                  está ofreciendo.
                </li>
                <li>
                  <strong>Que no haya superposiciones:</strong> El plano debe
                  mostrar claramente los límites sin superponerse con predios
                  vecinos.
                </li>
              </ol>
              <p>
                <strong>Dato importante:</strong> Si el predio no tiene plano
                catastral aprobado, debes solicitarlo antes de la compraventa.
                El costo varía entre $500.000 y $2.000.000 COP dependiendo de
                la complejidad, y toma 15-30 días en elaborarse.
              </p>
            </section>

            {/* Sección 4 */}
            <section>
              <h2 className="text-headline-md font-headline-md text-primary mb-4 mt-12">
                4. Escritura Pública vs Promesa de Compraventa
              </h2>
              <p className="mb-4">
                Muchos compradores confunden estos dos documentos. La diferencia
                es crítica:
              </p>
              <div className="overflow-x-auto my-6">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b-2 border-outline-variant/20">
                      <th className="py-3 px-4 font-label-bold text-primary">Aspecto</th>
                      <th className="py-3 px-4 font-label-bold text-primary">Promesa</th>
                      <th className="py-3 px-4 font-label-bold text-primary">Escritura Pública</th>
                    </tr>
                  </thead>
                  <tbody className="text-on-surface-variant">
                    <tr className="border-b border-outline-variant/10">
                      <td className="py-3 px-4 font-medium">Qué es</td>
                      <td className="py-3 px-4">Compromiso de vender/comprar</td>
                      <td className="py-3 px-4 text-deep-forest font-label-bold">Transferencia de propiedad</td>
                    </tr>
                    <tr className="border-b border-outline-variant/10">
                      <td className="py-3 px-4 font-medium">Otorgado ante</td>
                      <td className="py-3 px-4">Privado (entre las partes)</td>
                      <td className="py-3 px-4">Notario público</td>
                    </tr>
                    <tr className="border-b border-outline-variant/10">
                      <td className="py-3 px-4 font-medium">Efecto legal</td>
                      <td className="py-3 px-4">Obligación de买卖</td>
                      <td className="py-3 px-4 text-deep-forest font-label-bold">Propiedad legal</td>
                    </tr>
                    <tr className="border-b border-outline-variant/10">
                      <td className="py-3 px-4 font-medium">Frente a terceros</td>
                      <td className="py-3 px-4">Limitado</td>
                      <td className="py-3 px-4 text-deep-forest font-label-bold">Pleno (después de registrar)</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-medium">Registro</td>
                      <td className="py-3 px-4">No requiere</td>
                      <td className="py-3 px-4 text-deep-forest font-label-bold">Obligatorio en Instrumentos Públicos</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg my-6">
                <p className="text-red-700 font-label-bold mb-1">
                  ⚠️ Error común:
                </p>
                <p className="text-red-600">
                  Muchos compradores firman una promesa de compraventa y creen
                  que ya son propietarios. <strong>No lo son.</strong> Solo la
                  escritura pública registrada te convierte en propietario
                  legal. La promesa es solo un compromiso de que la compraventa
                  se realizará.
                </p>
              </div>
            </section>

            {/* Sección 5 */}
            <section>
              <h2 className="text-headline-md font-headline-md text-primary mb-4 mt-12">
                5. Checklist de Verificación Antes de Comprar
              </h2>
              <p className="mb-4">
                Usa esta lista de verificación antes de firmar cualquier
                contrato:
              </p>
              <div className="bg-surface-container-low rounded-xl p-6 my-6 space-y-3">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" className="mt-1 accent-deep-forest" readOnly />
                  <span>Certificado de tradición actualizado (menos de 30 días)</span>
                </label>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" className="mt-1 accent-deep-forest" readOnly />
                  <span>Escritura pública registrada del propietario actual</span>
                </label>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" className="mt-1 accent-deep-forest" readOnly />
                  <span>Plano catastral aprobado por el municipio</span>
                </label>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" className="mt-1 accent-deep-forest" readOnly />
                  <span>Paz y salvo de valorización municipal</span>
                </label>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" className="mt-1 accent-deep-forest" readOnly />
                  <span>Verificación de linderos en sitio (visita física)</span>
                </label>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" className="mt-1 accent-deep-forest" readOnly />
                  <span>Confirmación de servicios públicos disponibles</span>
                </label>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" className="mt-1 accent-deep-forest" readOnly />
                  <span>No hay gravámenes en el certificado de tradición</span>
                </label>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" className="mt-1 accent-deep-forest" readOnly />
                  <span>El vendedor coincide con el propietario registrado</span>
                </label>
              </div>
            </section>

            {/* Sección 6 */}
            <section>
              <h2 className="text-headline-md font-headline-md text-primary mb-4 mt-12">
                6. Errores Fatales al Verificar Documentación
              </h2>
              <ul className="list-disc pl-6 space-y-3 mb-6">
                <li>
                  <strong>Confiar solo en la palabra del vendedor:</strong> Siempre
                  verifica directamente en las oficinas de registro. No confíes
                  en copias que el vendedor te entregue sin verificar.
                </li>
                <li>
                  <strong>No visitar el predio:</strong> Un certificado puede
                  estar limpio, pero el predio puede tener invasiones, basura
                  acumulada, o problemas físicos que solo se ven en persona.
                </li>
                <li>
                  <strong>No verificar servicios públicos:</strong> Un lote con
                  escritura pero sin acceso a energía eléctrica puede ser
                  inutilizable para construcción.
                </li>
                <li>
                  <strong>No preguntar por el origen del predio:</strong> Si el
                  vendedor heredó el lote, verifica que todos los herederos
                  estén de acuerdo con la venta.
                </li>
                <li>
                  <strong>No contratar abogado:</strong> Aunque no es obligatorio,
                  un abogado puede detectar problemas que un comprador promedio
                  no vería.
                </li>
              </ul>
            </section>

            {/* Sección 7 — CTA */}
            <section className="bg-surface-container-low rounded-2xl p-8 md:p-12 my-12">
              <h2 className="text-headline-md font-headline-md text-primary mb-4">
                Lotes con Escritura Verificada en La Holanda
              </h2>
              <p className="mb-4">
                En La Holanda, no necesitas preocuparte por la verificación
                documental. Todos nuestros lotes incluyen:
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-6 text-on-surface-variant">
                <li>Escritura pública individual con libertad de cargos</li>
                <li>Plano catastral aprobado y registrado</li>
                <li>Certificado de tradición actualizado</li>
                <li>Paz y salvo de valorización</li>
                <li>Proceso de legalización completo</li>
              </ul>
              <p className="mb-6">
                Con más de 30 años de experiencia, {project.developer} te
                garantiza una compra 100% legal y segura. No arriesgues tu
                inversión: elige un proyecto donde la documentación ya está
                verificada.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/projects"
                  className="inline-block bg-deep-forest text-on-primary px-8 py-4 rounded-lg font-label-bold hover:brightness-110 transition-[filter] text-center"
                >
                  Ver Lotes con Escritura Verificada
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
                  <Link to="/blog/escrituracion-lotes-colombia" className="text-deep-forest underline hover:text-heritage-gold">
                    Escrituración de Lotes en Colombia: Guía Paso a Paso
                  </Link>
                </li>
                <li>
                  <Link to="/blog/guia-compra-lote-rural-quindio" className="text-deep-forest underline hover:text-heritage-gold">
                    Guía Completa para Comprar un Lote Rural en Quindío 2026
                  </Link>
                </li>
                <li>
                  <Link to="/blog/financiacion-compra-lotes-rurales" className="text-deep-forest underline hover:text-heritage-gold">
                    Financiación para Comprar Lotes Rurales en Colombia
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

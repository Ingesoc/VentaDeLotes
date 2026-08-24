import { Link } from "react-router";
import PageSEO from "@/components/seo/PageSEO";
import BreadcrumbSchema from "@/components/seo/BreadcrumbSchema";
import FAQSchema from "@/components/seo/FAQSchema";
import { project } from "@/constants/project";
import { cldUrl } from "@/lib/cloudinary";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const ARTICLE_FAQS = [
  {
    question: "¿Se puede comprar un lote rural con crédito hipotecario?",
    answer:
      "Sí, algunos bancos en Colombia ofrecen créditos hipotecarios para lotes rurales, pero las condiciones son más restrictivas que para vivienda urbana. Generalmente requieren: lote con escritura pública, avalúo reciente, y un pie del 30-40%. Las tasas de interés son 2-3 puntos más altas que para apartamentos. Bancos como Bancolombia, Davivienda y BBVA tienen productos específicos para lotes.",
  },
  {
    question: "¿Cuánto necesito de inicial para comprar un lote?",
    answer:
      "Depende del método de compra. Para pago directo con el desarrollador (como en La Holanda), generalmente se requiere un anticipo del 10-30% para reservar, y el saldo se puede financiar en cuotas. Para crédito bancario, necesitas entre el 20-40% de inicial más los gastos de escrituración (aproximadamente el 3% del valor). Para un lote de $200 millones COP, necesitarías entre $40M y $80M de inicial.",
  },
  {
    question: "¿Cuánto tarda en aprobarse un crédito para lote rural?",
    answer:
      "La aprobación de un crédito hipotecario para lote rural toma entre 15 y 30 días. El proceso incluye: análisis de crédito del comprador (5-10 días), avalúo del predio (5-10 días), y verificación de documentación legal del lote (5-10 días). En pago directo con el desarrollador, no hay proceso de aprobación bancaria: el reserva se confirma inmediatamente con el anticipo.",
  },
  {
    question: "¿Qué es mejor: crédito bancario o pago directo con el desarrollador?",
    answer:
      "Pago directo con el desarrollador es más rápido, tiene menos trámites, y generalmente ofrece mejores condiciones de financiación (sin intereses bancarios). Crédito bancario es necesario si no tienes el anticipo completo, pero implica tasas de interés del 12-18% anual y gastos adicionales de avalúo y estudio de crédito. En La Holanda, el pago directo con cuotas es la opción más popular.",
  },
  {
    question: "¿Los lotes rurales se pueden financiar a través de Bancóldex?",
    answer:
      "Sí, Bancóldex (Banco de Desarrollo Empresarial) tiene líneas de crédito para adquisición de predios rurales con condiciones preferenciales. Estas líneas están diseñadas para agricultores y ganaderos, pero también aplican para compra de lotes en zonas rurales. Las tasas son más bajas que el mercado comercial (8-12% anual). Requiere plan de uso del predio y cumplir con criterios de elegibilidad.",
  },
];

export default function FinanciacionLotesRurales() {
  const scrollRevealRef = useScrollReveal({
    childSelector: "section",
    variant: "fade-up",
    staggerDelay: 100,
    rootMargin: "0px 0px -60px 0px",
  });

  return (
    <>
      <PageSEO
        title="Financiación para Comprar Lotes Rurales en Colombia"
        description="Guía completa de opciones de financiación para compra de lotes rurales en Colombia: crédito hipotecario, pago directo con desarrollador, Bancóldex y planes de cuotas. Actualizada 2026."
        ogUrl="https://laholanda.ingesocc.com/blog/financiacion-compra-lotes-rurales"
        ogImage={cldUrl("https://res.cloudinary.com/j5a9xyaq/image/upload/v1784303937/laholanda/landscapes/DJI_0131.webp")}
        ogType="article"
        keywords="financiación lote rural Colombia, crédito hipotecario lote, comprar lote a cuotas, Bancóldex lotes, inicial compra lote, cómo pagar lote rural"
      />
      <BreadcrumbSchema
        items={[
          { name: "Blog", url: "https://laholanda.ingesocc.com/blog" },
          { name: "Financiación Lotes Rurales", url: "https://laholanda.ingesocc.com/blog/financiacion-compra-lotes-rurales" },
        ]}
      />
      <FAQSchema items={ARTICLE_FAQS} />

      <div ref={scrollRevealRef} className="page-enter">
        {/* Hero del artículo */}
        <section className="pt-28 pb-16 px-margin-mobile md:px-margin-desktop bg-deep-forest relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(197,165,114,0.08),transparent_60%)]" />
          <div className="max-w-4xl mx-auto relative z-10">
            <span className="inline-block text-heritage-gold font-label-bold uppercase tracking-widest text-sm mb-4">
              Guía Financiera 2026
            </span>
            <h1 className="font-display-lg text-3xl sm:text-4xl md:text-display-lg text-warm-white drop-shadow-lg leading-tight text-balance mb-6">
              Financiación para Comprar un Lote Rural en Colombia
            </h1>
            <p className="text-body-md sm:text-body-lg font-body-lg text-surface-container-high max-w-2xl">
              Todas las opciones de pago para adquirir un lote rural:
              crédito hipotecario, pago directo con desarrollador, líneas
              de Bancóldex y planes de cuotas flexibles.
            </p>
            <p className="text-caption font-caption text-warm-white/60 mt-4">
              Por {project.developer} · Actualizado agosto 2026 · 8 min de lectura
            </p>
          </div>
        </section>

        {/* Contenido del artículo */}
        <article className="py-16 md:py-24 px-margin-mobile md:px-margin-desktop">
          <div className="max-w-3xl mx-auto space-y-8 text-body-md font-body-md text-on-surface-variant leading-relaxed">
            {/* Introducción */}
            <p className="text-body-lg font-body-lg">
              Comprar un lote rural en Colombia no siempre requiere tener el
              dinero completo decontado. Existen varias opciones de financiación
              que te permiten adquirir tu terreno con un anticipo y pagar el
              saldo en cuotas. La clave es elegir la opción que mejor se adapte
              a tu perfil financiero y al tipo de propiedad que estás
              comprando.
            </p>
            <p>
              Esta guía analiza cada opción de financiación disponible en 2026,
              con ventajas, desventajas y requisitos concretos. Ya sea que
              compres en una parcelación como La Holanda o directamente con un
              propietario particular, aquí encontrarás la mejor ruta financiera.
            </p>

            {/* Sección 1 */}
            <section>
              <h2 className="text-headline-md font-headline-md text-primary mb-4 mt-12">
                1. Opciones de Financiación para Lotes Rurales
              </h2>
              <p className="mb-4">
                En Colombia existen cuatro vías principales para financiar la
                compra de un lote rural:
              </p>
              <div className="space-y-4 my-6">
                <div className="bg-surface-container-low rounded-xl p-6">
                  <h3 className="text-headline-sm font-headline-sm text-primary mb-2">
                    Opción A: Pago directo con el desarrollador
                  </h3>
                  <p className="mb-2">
                    <strong>La más popular y accesible.</strong> Pagas un anticipo
                    (10-30%) y financias el saldo en cuotas directamente con la
                    inmobiliaria o desarrollador, sin intermediación bancaria.
                  </p>
                  <ul className="list-disc pl-6 space-y-1 text-sm">
                    <li>Sin trámites bancarios</li>
                    <li>Aprobación inmediata</li>
                    <li>Planes de pago flexibles (12-36 meses)</li>
                    <li>Sin intereses bancarios</li>
                  </ul>
                </div>
                <div className="bg-surface-container-low rounded-xl p-6">
                  <h3 className="text-headline-sm font-headline-sm text-primary mb-2">
                    Opción B: Crédito hipotecario bancario
                  </h3>
                  <p className="mb-2">
                    <strong>Para quienes necesitan financiación bancaria.</strong> Los
                    bancos ofrecen créditos para lotes, pero con condiciones más
                    restrictivas que para vivienda urbana.
                  </p>
                  <ul className="list-disc pl-6 space-y-1 text-sm">
                    <li>Financiación hasta el 70-80% del valor</li>
                    <li>Tasas del 12-18% anual</li>
                    <li>Plazo hasta 15-20 años</li>
                    <li>Requiere avalúo y estudio de crédito</li>
                  </ul>
                </div>
                <div className="bg-surface-container-low rounded-xl p-6">
                  <h3 className="text-headline-sm font-headline-sm text-primary mb-2">
                    Opción C: Líneas Bancóldex
                  </h3>
                  <p className="mb-2">
                    <strong>Crédito subsidiado para uso rural.</strong> Bancóldex
                    (Banco de Desarrollo Empresarial) ofrece líneas con tasas
                    preferenciales para adquisición de predios rurales.
                  </p>
                  <ul className="list-disc pl-6 space-y-1 text-sm">
                    <li>Tasas del 8-12% anual</li>
                    <li>Plazo hasta 10 años</li>
                    <li>Requiere plan de uso del predio</li>
                    <li>Criterios de elegibilidad específicos</li>
                  </ul>
                </div>
                <div className="bg-surface-container-low rounded-xl p-6">
                  <h3 className="text-headline-sm font-headline-sm text-primary mb-2">
                    Opción D: Crédito de libranza
                  </h3>
                  <p className="mb-2">
                    <strong>Para empleados formales.</strong> Si trabajas en una
                    empresa que tiene convenio con un banco, puedes acceder a un
                    crédito de libranza con condiciones preferenciales.
                  </p>
                  <ul className="list-disc pl-6 space-y-1 text-sm">
                    <li>Tasas del 10-14% anual</li>
                    <li>Descuento automático de nómina</li>
                    <li>Requiere contrato laboral vigente</li>
                    <li>No todos los bancos lo ofrecen para lotes</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Sección 2 */}
            <section>
              <h2 className="text-headline-md font-headline-md text-primary mb-4 mt-12">
                2. Comparativa Detallada de Opciones
              </h2>
              <div className="overflow-x-auto my-6">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b-2 border-outline-variant/20">
                      <th className="py-3 px-4 font-label-bold text-primary">Concepto</th>
                      <th className="py-3 px-4 font-label-bold text-primary">Desarrollador</th>
                      <th className="py-3 px-4 font-label-bold text-primary">Banco</th>
                      <th className="py-3 px-4 font-label-bold text-primary">Bancóldex</th>
                    </tr>
                  </thead>
                  <tbody className="text-on-surface-variant">
                    <tr className="border-b border-outline-variant/10">
                      <td className="py-3 px-4 font-medium">Inicial mínima</td>
                      <td className="py-3 px-4 text-deep-forest font-label-bold">10-30%</td>
                      <td className="py-3 px-4">20-40%</td>
                      <td className="py-3 px-4">20-30%</td>
                    </tr>
                    <tr className="border-b border-outline-variant/10">
                      <td className="py-3 px-4 font-medium">Tasa de interés</td>
                      <td className="py-3 px-4 text-deep-forest font-label-bold">0-5% E.A.</td>
                      <td className="py-3 px-4">12-18% E.A.</td>
                      <td className="py-3 px-4">8-12% E.A.</td>
                    </tr>
                    <tr className="border-b border-outline-variant/10">
                      <td className="py-3 px-4 font-medium">Plazo máximo</td>
                      <td className="py-3 px-4">12-36 meses</td>
                      <td className="py-3 px-4 text-deep-forest font-label-bold">15-20 años</td>
                      <td className="py-3 px-4">10 años</td>
                    </tr>
                    <tr className="border-b border-outline-variant/10">
                      <td className="py-3 px-4 font-medium">Tiempo de aprobación</td>
                      <td className="py-3 px-4 text-deep-forest font-label-bold">Inmediato</td>
                      <td className="py-3 px-4">15-30 días</td>
                      <td className="py-3 px-4">30-60 días</td>
                    </tr>
                    <tr className="border-b border-outline-variant/10">
                      <td className="py-3 px-4 font-medium">Gastos adicionales</td>
                      <td className="py-3 px-4 text-deep-forest font-label-bold">Ninguno</td>
                      <td className="py-3 px-4">$2M - $5M COP</td>
                      <td className="py-3 px-4">$1M - $3M COP</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-medium">Documentación</td>
                      <td className="py-3 px-4">Cédula + anticipo</td>
                      <td className="py-3 px-4">Estudio de crédito completo</td>
                      <td className="py-3 px-4">Plan de uso + elegibilidad</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* Sección 3 */}
            <section>
              <h2 className="text-headline-md font-headline-md text-primary mb-4 mt-12">
                3. Ejemplo Real: Compra de Lote en La Holanda
              </h2>
              <p className="mb-4">
                Veamos un ejemplo concreto con el Lote 06 de La Holanda,
                Quimbaya:
              </p>
              <div className="bg-surface-container-low rounded-xl p-6 my-6 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-on-surface-variant">Precio del lote:</span>
                  <span className="text-primary font-label-bold">$158.822.900 COP</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-on-surface-variant">Área:</span>
                  <span className="text-primary font-label-bold">2.005 m²</span>
                </div>
                <div className="border-t border-outline-variant/20 pt-3">
                  <p className="text-on-surface-variant font-label-bold mb-2">Plan de pago directo:</p>
                  <div className="flex justify-between items-center ml-4">
                    <span className="text-on-surface-variant">Anticipo (reserva):</span>
                    <span className="text-primary">$15.882.290 (10%)</span>
                  </div>
                  <div className="flex justify-between items-center ml-4">
                    <span className="text-on-surface-variant">Saldo a financiar:</span>
                    <span className="text-primary">$142.940.610</span>
                  </div>
                  <div className="flex justify-between items-center ml-4">
                    <span className="text-on-surface-variant">Cuotas (24 meses):</span>
                    <span className="text-primary">$5.955.859/mes</span>
                  </div>
                  <div className="flex justify-between items-center ml-4">
                    <span className="text-on-surface-variant">Tasa de interés:</span>
                    <span className="text-deep-forest font-label-bold">0% E.A. (pago directo)</span>
                  </div>
                </div>
              </div>
              <p>
                Con el plan de pago directo, necesitas solo <strong>$15.8 millones
                COP de anticipo</strong> para reservar, y pagas el resto en cuotas
                mensuales de $5.9 millones sin interés bancario. Esto hace la
                inversión accesible para más compradores.
              </p>
            </section>

            {/* Sección 4 */}
            <section>
              <h2 className="text-headline-md font-headline-md text-primary mb-4 mt-12">
                4. Requisitos para Cada Opción
              </h2>

              <h3 className="text-headline-sm font-headline-sm text-primary mb-3 mt-8">
                Pago directo con desarrollador
              </h3>
              <ul className="list-disc pl-6 space-y-2 mb-6">
                <li>Cédula de ciudadanía vigente</li>
                <li>Comprobante de ingresos (opcional en algunos casos)</li>
                <li>Anticipo según el plan de pago acordado</li>
                <li>Firma del contrato de promesa de compraventa</li>
              </ul>

              <h3 className="text-headline-sm font-headline-sm text-primary mb-3 mt-8">
                Crédito hipotecario bancario
              </h3>
              <ul className="list-disc pl-6 space-y-2 mb-6">
                <li>Cédula de ciudadanía vigente</li>
                <li>Últimos 3 recibos de nómina o declaración de renta</li>
                <li>Extractos bancarios de los últimos 3 meses</li>
                <li>Certificado laboral con antigüedad y salario</li>
                <li>Avalúo del predio (lo realiza el banco)</li>
                <li>Documentación legal del lote (escritura, tradición)</li>
              </ul>

              <h3 className="text-headline-sm font-headline-sm text-primary mb-3 mt-8">
                Línea Bancóldex
              </h3>
              <ul className="list-disc pl-6 space-y-2 mb-6">
                <li>Todos los requisitos del crédito bancario</li>
                <li>Plan de uso del predio (agricultura, ganadería, turismo)</li>
                <li>Cumplir criterios de elegibilidad del programa</li>
                <li>No tener deudas activas con Bancóldex</li>
              </ul>
            </section>

            {/* Sección 5 */}
            <section>
              <h2 className="text-headline-md font-headline-md text-primary mb-4 mt-12">
                5. Errores Comunes al Financiar un Lote
              </h2>
              <ul className="list-disc pl-6 space-y-3 mb-6">
                <li>
                  <strong>No comparar tasas:</strong> La diferencia entre el 12%
                  y el 18% de interés puede significar decenas de millones de
                  pesos de diferencia en el costo total. Siempre compara al
                  menos 3 opciones.
                </li>
                <li>
                  <strong>No considerar gastos adicionales:</strong> Además de la
                  cuota mensual, hay gastos de escrituración (3% del valor),
                  avalúo, y seguros. Presupuesta entre el 3-5% extra del valor
                  del lote.
                </li>
                <li>
                  <strong>Aceptar la primera oferta:</strong> Los desarrolladores
                  y bancos generalmente tienen margen de negociación. No aceptes
                  la primera condición sin preguntar por alternativas.
                </li>
                <li>
                  <strong>No verificar el plazo:</strong> Un crédito a 20 años
                  puede parecer accesible en cuota mensual, pero el costo total
                  de intereses es significativamente mayor que a 10 años.
                </li>
                <li>
                  <strong>Omitir el seguro:</strong> Algunos créditos bancarios
                  incluyen seguros obligatorios que aumentan el costo mensual.
                  Verifica qué cubre y si es realmente necesario.
                </li>
              </ul>
            </section>

            {/* Sección 6 — CTA */}
            <section className="bg-surface-container-low rounded-2xl p-8 md:p-12 my-12">
              <h2 className="text-headline-md font-headline-md text-primary mb-4">
                Financiación Directa en La Holanda
              </h2>
              <p className="mb-4">
                En La Holanda ofrecemos planes de pago directo sin
                intermediación bancaria. Reserva con un anticipo del 10% y
                financia el saldo en cuotas mensuales con interés mínimo.
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-6 text-on-surface-variant">
                <li>Anticipo desde $15 millones COP</li>
                <li>Cuotas fijas en pesos colombianos</li>
                <li>Sin trámites bancarios complicados</li>
                <li>Aprobación inmediata al pagar el anticipo</li>
                <li>Escrituración pública incluida al finalizar el pago</li>
              </ul>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/projects"
                  className="inline-block bg-deep-forest text-on-primary px-8 py-4 rounded-lg font-label-bold hover:brightness-110 transition-[filter] text-center"
                >
                  Ver Lotes y Planes de Pago
                </Link>
                <Link
                  to="/contact"
                  className="inline-block border-2 border-deep-forest text-deep-forest px-8 py-4 rounded-lg font-label-bold hover:bg-deep-forest hover:text-on-primary transition-colors text-center"
                >
                  Consultar Financiación
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
                  <Link to="/blog/inversion-eje-cafetero-finca-raiz" className="text-deep-forest underline hover:text-heritage-gold">
                    Por Qué el Eje Cafetero es la Mejor Inversión en Finca Raíz
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

import { Link } from "react-router";
import PageSEO from "@/components/seo/PageSEO";
import BreadcrumbSchema from "@/components/seo/BreadcrumbSchema";
import FAQSchema from "@/components/seo/FAQSchema";
import { project } from "@/constants/project";
import { cldUrl } from "@/lib/cloudinary";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const ARTICLE_FAQS = [
  {
    question: "¿Cómo es el clima en Quimbaya, Quindío?",
    answer:
      "Quimbaya tiene un clima templado húmedo de montaña con una temperatura promedio de 22°C todo el año. Las temperaturas oscilan entre 16°C en las noches frescas y 28°C en las horas más calurosas. La precipitación anual es de aproximadamente 1.800 mm, con dos temporadas de lluvia (abril-mayo y octubre-noviembre). Es uno de los climas más agradables de Colombia.",
  },
  {
    question: "¿Cuántos habitantes tiene Quimbaya?",
    answer:
      "Quimbaya tiene aproximadamente 35.000 habitantes según el censo más reciente. Es un municipio pequeño pero en crecimiento, impulsado por el turismo y la llegada de nuevos residentes de ciudades grandes como Bogotá y Medellín que buscan mejor calidad de vida.",
  },
  {
    question: "¿Quimbaya es seguro para vivir?",
    answer:
      "Sí, Quimbaya es uno de los municipios más seguros del Quindío. La tasa de criminalidad es baja comparada con ciudades principales, y la comunidad es pequeña y cohesionada. Los residentes reportan una sensación de seguridad alta, especialmente en las zonas rurales y parcelaciones como La Holanda.",
  },
  {
    question: "¿Hay hospitales y colegios en Quimbaya?",
    answer:
      "Sí, Quimbaya cuenta con el Hospital Municipal, varios centros de salud, y múltiples colegios públicos y privados. Para servicios especializados, los residentes acuden a Armenia (40 minutos), que tiene hospitales de tercer nivel, universidades, y centros comerciales.",
  },
  {
    question: "¿Se puede trabajar remotamente desde Quimbaya?",
    answer:
      "Sí, cada vez más personas trabajan remotamente desde Quimbaya. La conectividad de internet ha mejorado significativamente con 4G/5G y fibra óptica en algunas zonas. Para trabajo remoto, se recomienda verificar la cobertura de internet en la zona específica antes de comprar un lote. En La Holanda, la cobertura 4G está disponible.",
  },
];

export default function VivirEnQuimbaya() {
  const scrollRevealRef = useScrollReveal({
    childSelector: "section",
    variant: "fade-up",
    staggerDelay: 100,
    rootMargin: "0px 0px -60px 0px",
  });

  return (
    <>
      <PageSEO
        title="Vivir en Quimbaya: Clima, Servicios y Calidad de Vida"
        description="Descubre todo sobre vivir en Quimbaya, Quindío: clima perfecto de 22°C, servicios públicos, colegios, hospitales, seguridad, conectividad y por qué es ideal para mudarse del Eje Cafetero."
        ogUrl="https://laholanda.ingesocc.com/blog/vivir-en-quimbaya"
        ogImage={cldUrl("https://res.cloudinary.com/j5a9xyaq/image/upload/v1784303937/laholanda/landscapes/DJI_0131.webp")}
        ogType="article"
        keywords="vivir en Quimbaya, clima Quimbaya Quindío, servicios Quimbaya, calidad de vida Quindío, mudarse a Quimbaya, trabajo remoto Quindío, Quimbaya seguridad"
      />
      <BreadcrumbSchema
        items={[
          { name: "Blog", url: "https://laholanda.ingesocc.com/blog" },
          { name: "Vivir en Quimbaya", url: "https://laholanda.ingesocc.com/blog/vivir-en-quimbaya" },
        ]}
      />
      <FAQSchema items={ARTICLE_FAQS} />

      <div ref={scrollRevealRef} className="page-enter">
        {/* Hero del artículo */}
        <section className="pt-28 pb-16 px-margin-mobile md:px-margin-desktop bg-deep-forest relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(197,165,114,0.08),transparent_60%)]" />
          <div className="max-w-4xl mx-auto relative z-10">
            <span className="inline-block text-heritage-gold font-label-bold uppercase tracking-widest text-sm mb-4">
              Guía de Vida 2026
            </span>
            <h1 className="font-display-lg text-3xl sm:text-4xl md:text-display-lg text-warm-white drop-shadow-lg leading-tight text-balance mb-6">
              Vivir en Quimbaya: Todo lo que Necesitas Saber
            </h1>
            <p className="text-body-md sm:text-body-lg font-body-lg text-surface-container-high max-w-2xl">
              Clima perfecto, servicios disponibles, seguridad y una calidad
              de vida que están atrayendo a cientos de familias de Bogotá,
              Medellín y del exterior. Conoce Quimbaya a fondo.
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
              Quimbaya no es solo un municipio del Quindío: es una de las
              zonas con mayor crecimiento de calidad de vida en Colombia. Con
              un clima templado de 22°C todo el año, paisajes del Patrimonio
              UNESCO, y una comunidad acogedora, cientos de familias están
              descubriendo que se puede vivir mejor, gastar menos, y disfrutar
              más.
            </p>
            <p>
              Ya sea que estés buscando una segunda residencia, planificando tu
              retiro, o considerando mudanza definitiva, esta guía te explica
              todo lo que necesitas saber sobre vivir en Quimbaya: clima,
              servicios, seguridad, conectividad, educación, y por qué tantas
              personas están eligiendo este municipio.
            </p>

            {/* Sección 1 */}
            <section>
              <h2 className="text-headline-md font-headline-md text-primary mb-4 mt-12">
                1. Clima: 22°C Todo el Año
              </h2>
              <p className="mb-4">
                El clima es, sin duda, la principal razón por la que la gente
                se muda a Quimbaya. Estas son las características concretas:
              </p>
              <div className="overflow-x-auto my-6">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b-2 border-outline-variant/20">
                      <th className="py-3 px-4 font-label-bold text-primary">Mes</th>
                      <th className="py-3 px-4 font-label-bold text-primary">Temp. mínima</th>
                      <th className="py-3 px-4 font-label-bold text-primary">Temp. máxima</th>
                      <th className="py-3 px-4 font-label-bold text-primary">Lluvia</th>
                    </tr>
                  </thead>
                  <tbody className="text-on-surface-variant">
                    <tr className="border-b border-outline-variant/10">
                      <td className="py-3 px-4">Enero</td>
                      <td className="py-3 px-4">17°C</td>
                      <td className="py-3 px-4">27°C</td>
                      <td className="py-3 px-4">Seca</td>
                    </tr>
                    <tr className="border-b border-outline-variant/10">
                      <td className="py-3 px-4">Abril</td>
                      <td className="py-3 px-4">18°C</td>
                      <td className="py-3 px-4">26°C</td>
                      <td className="py-3 px-4 text-deep-forest font-label-bold">Lluviosa</td>
                    </tr>
                    <tr className="border-b border-outline-variant/10">
                      <td className="py-3 px-4">Julio</td>
                      <td className="py-3 px-4">16°C</td>
                      <td className="py-3 px-4">28°C</td>
                      <td className="py-3 px-4">Seca</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4">Octubre</td>
                      <td className="py-3 px-4">17°C</td>
                      <td className="py-3 px-4">26°C</td>
                      <td className="py-3 px-4 text-deep-forest font-label-bold">Lluviosa</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <ul className="list-disc pl-6 space-y-2 mb-6">
                <li>
                  <strong>Temperatura promedio:</strong> 22°C — no necesitas
                  aire acondicionado ni calefacción.
                </li>
                <li>
                  <strong>Humedad relativa:</strong> 70-80% — agradable, no
                  sofocante.
                </li>
                <li>
                  <strong>Viento:</strong> Suave, brisa constante de montaña.
                </li>
                <li>
                  <strong>Horas de sol:</strong> 5-6 horas diarias — suficiente
                  para paneles solares y jardines.
                </li>
              </ul>
              <div className="bg-heritage-gold/10 border-l-4 border-heritage-gold p-4 rounded-r-lg my-6">
                <p className="text-primary font-label-bold mb-1">
                  💡 Comparativa rápida:
                </p>
                <p>
                  Bogotá: 14°C con frío constante. Medellín: 22°C pero con
                  calor húmedo en el Valle de Aburrá. Cali: 26°C con calor
                  intenso. <strong>Quimbaya: 22°C con brisa de montaña.</strong>{" "}
                  El clima ideal de Colombia.
                </p>
              </div>
            </section>

            {/* Sección 2 */}
            <section>
              <h2 className="text-headline-md font-headline-md text-primary mb-4 mt-12">
                2. Servicios Públicos Disponibles
              </h2>
              <p className="mb-4">
                Quimbaya cuenta con los servicios esenciales para una vida
                cómoda:
              </p>
              <ul className="list-disc pl-6 space-y-3 mb-6">
                <li>
                  <strong>Energía eléctrica:</strong> Red pública estable, con
                  cobertura en la zona urbana y las principales vías rurales.
                  Los cortes son infrecuentes.
                </li>
                <li>
                  <strong>Agua potable:</strong> Acueducto municipal con cobertura
                  en zona urbana. En zonas rurales como La Holanda, algunos
                  proyectos están en proceso de dotación de agua.
                </li>
                <li>
                  <strong>Alcantarillado:</strong> Disponible en zona urbana.
                  En zona rural, se usa sistema de pozos sépticos.
                </li>
                <li>
                  <strong>Internet:</strong> Cobertura 4G/5G de los principales
                  operadores (Claro, Movistar, Tigo). Fibra óptica disponible
                  en algunas zonas. Para trabajo remoto, se recomienda verificar
                  cobertura específica.
                </li>
                <li>
                  <strong>Gas:</strong> Gas natural en zona urbana. En zona
                  rural, se usa gas efectivo (cilindros).
                </li>
              </ul>
            </section>

            {/* Sección 3 */}
            <section>
              <h2 className="text-headline-md font-headline-md text-primary mb-4 mt-12">
                3. Salud y Educación
              </h2>
              <h3 className="text-headline-sm font-headline-sm text-primary mb-3 mt-6">
                Centros de salud
              </h3>
              <ul className="list-disc pl-6 space-y-2 mb-6">
                <li>
                  <strong>Hospital Municipal de Quimbaya:</strong> Atención de
                  urgencias, consultas externas, y servicios básicos.
                </li>
                <li>
                  <strong>Centros de atención primaria:</strong> Múltiples
                  puestos de salud en la zona urbana y rural.
                </li>
                <li>
                  <strong>Armenia (40 min):</strong> Hospitales de tercer nivel,
                  clínicas privadas, laboratorios, y especialistas médicos.
                </li>
              </ul>
              <h3 className="text-headline-sm font-headline-sm text-primary mb-3 mt-6">
                Instituciones educativas
              </h3>
              <ul className="list-disc pl-6 space-y-2 mb-6">
                <li>
                  <strong>Colegios públicos:</strong> Múltiples opciones con
                  jornada mañana y tarde.
                </li>
                <li>
                  <strong>Colegios privados:</strong> Instituciones con enfoque
                  bilingüe y pedagogías innovadoras.
                </li>
                <li>
                  <strong>Universidades:</strong> En Armenia (40 min) se
                  encuentran la Universidad del Quindío, la UNISARC, y otras
                  instituciones de educación superior.
                </li>
              </ul>
            </section>

            {/* Sección 4 */}
            <section>
              <h2 className="text-headline-md font-headline-md text-primary mb-4 mt-12">
                4. Seguridad
              </h2>
              <p className="mb-4">
                Quimbaya es uno de los municipios más seguros del Quindío y de
                Colombia. Las razones:
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-6">
                <li>
                  <strong>Comunidad pequeña:</strong> Con ~35.000 habitantes,
                  todos se conocen. La vigilancia comunitaria es natural.
                </li>
                <li>
                  <strong>Baja criminalidad:</strong> Los índices de hurtos y
                  delitos son significativamente más bajos que en ciudades
                  principales.
                </li>
                <li>
                  <strong>Policía Municipal:</strong> Presencia permanente en
                  zona urbana y rutas principales.
                </li>
                <li>
                  <strong>Zonas rurales seguras:</strong> Las parcelaciones como
                  La Holanda suelen tener portería y vigilancia las 24 horas.
                </li>
              </ul>
            </section>

            {/* Sección 5 */}
            <section>
              <h2 className="text-headline-md font-headline-md text-primary mb-4 mt-12">
                5. Trabajo Remoto desde Quimbaya
              </h2>
              <p className="mb-4">
                La pandemia aceleró un趋势 que ya existía: cada vez más
                profesionales trabajan remotamente desde municipios como
                Quimbaya. Estas son las consideraciones clave:
              </p>
              <h3 className="text-headline-sm font-headline-sm text-primary mb-3 mt-6">
                Conectividad
              </h3>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>
                  <strong>4G/5G:</strong> Cobertura de los principales
                  operadores en zona urbana y vías principales.
                </li>
                <li>
                  <strong>Fibra óptica:</strong> Disponible en algunas zonas.
                  Verificar disponibilidad antes de comprar.
                </li>
                <li>
                  <strong>Starlink:</strong> Opción viable para zonas rurales
                  sin fibra. Velocidades de 50-200 Mbps.
                </li>
              </ul>
              <h3 className="text-headline-sm font-headline-sm text-primary mb-3 mt-6">
                Espacios de coworking
              </h3>
              <p className="mb-4">
                Aunque Quimbaya no tiene coworkings formales como las grandes
                ciudades, varios cafés y restaurantes ofrecen espacios cómodos
                para trabajar con internet. La tendencia está creciendo.
              </p>
              <div className="bg-surface-container-low rounded-xl p-6 my-6">
                <p className="text-primary font-label-bold mb-2">
                  📊 Dato del mercado laboral:
                </p>
                <p>
                  Profesionales de Bogotá y Medellín que se mudan a Quimbaya
                  para trabajar remoto reportan un{" "}
                  <strong>ahorro del 30-40%</strong> en costos de vida
                  (arriendo, alimentación, transporte) manteniendo el mismo
                  salario. Esto convierte a Quimbaya en una opción financieramente
                  inteligente.
                </p>
              </div>
            </section>

            {/* Sección 6 */}
            <section>
              <h2 className="text-headline-md font-headline-md text-primary mb-4 mt-12">
                6. Gastronomía y Cultura
              </h2>
              <p className="mb-4">
                Quimbaya tiene una escena gastronómica vibrante que mezcla
                tradición cafetera con innovación:
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-6">
                <li>
                  <strong>Café de especialidad:</strong> La región produce algunos
                  de los mejores cafés del mundo. Múltiples fincas cafeteras
                  ofrecen tours y degustaciones.
                </li>
                <li>
                  <strong>Gastronomía regional:</strong> Bandeja paisa, sancocho
                  de gallina, trucha arcoíris, plátano hartón, y.maní confitado.
                </li>
                <li>
                  <strong>Fiestas patronales:</strong> La Feria del Café en
                  julio es el evento más importante del año, con desfile de
                  carrozas, conciertos y competencias de tueste.
                </li>
                <li>
                  <strong>Cultura arriera:</strong> La tradición de los arrieros
                  que cruzaban las montañas con café es parte de la identidad
                  del municipio.
                </li>
              </ul>
            </section>

            {/* Sección 7 — CTA */}
            <section className="bg-surface-container-low rounded-2xl p-8 md:p-12 my-12">
              <h2 className="text-headline-md font-headline-md text-primary mb-4">
                Vive en Quimbaya con La Holanda
              </h2>
              <p className="mb-4">
                Si estás buscando construir tu hogar en Quimbaya, La Holanda
                ofrece lotes campestres con escritura pública, acceso por vía
                principal, y un entorno natural privilegiado. Es la forma
                ideal de empezar tu nueva vida en el Eje Cafetero.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/projects"
                  className="inline-block bg-deep-forest text-on-primary px-8 py-4 rounded-lg font-label-bold hover:brightness-110 transition-[filter] text-center"
                >
                  Ver Lotes para Vivir en Quimbaya
                </Link>
                <Link
                  to="/descubre-quindio"
                  className="inline-block border-2 border-deep-forest text-deep-forest px-8 py-4 rounded-lg font-label-bold hover:bg-deep-forest hover:text-on-primary transition-colors text-center"
                >
                  Conoce Quindío
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
                  <Link to="/blog/quimbaya-vs-filandia-vs-salento" className="text-deep-forest underline hover:text-heritage-gold">
                    Quimbaya vs Filandia vs Salento: Dónde Comprar Lote
                  </Link>
                </li>
                <li>
                  <Link to="/blog/guia-compra-lote-rural-quindio" className="text-deep-forest underline hover:text-heritage-gold">
                    Guía Completa para Comprar un Lote Rural en Quindío 2026
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

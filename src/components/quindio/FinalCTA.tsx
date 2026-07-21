import { Link } from "react-router-dom";

export default function FinalCTA() {
  return (
    <section className="py-section-gap px-margin-desktop max-w-container-max mx-auto text-center">
      <div className="bg-earth-beige rounded-3xl p-16 border border-outline-variant/30 relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="font-headline-lg text-primary mb-6">Sé parte de este paraíso.</h2>
          <p className="font-body-lg text-on-surface-variant mb-10 max-w-2xl mx-auto">
            Invierte en tu futuro hogar hoy y asegura un pedazo del paisaje cafetero más hermoso del mundo.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/projects"
              className="bg-primary text-white px-10 py-4 rounded-lg font-label-bold hover:bg-deep-forest transition-colors duration-300 inline-block"
            >
              Ver Proyectos
            </Link>
            <a
              href="/#contacto"
              className="bg-transparent border border-primary text-primary px-10 py-4 rounded-lg font-label-bold hover:bg-primary hover:text-white transition-colors duration-300 inline-block"
            >
              Hablar con un Agente
            </a>
          </div>
        </div>
        {/* Elemento decorativo */}
        <div className="absolute bottom-0 left-0 opacity-10 pointer-events-none select-none">
          <span className="material-symbols-outlined text-[300px] rotate-12">park</span>
        </div>
      </div>
    </section>
  );
}

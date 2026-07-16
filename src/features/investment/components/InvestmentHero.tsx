import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export function InvestmentHero() {
  return (
    <section className="relative w-full min-h-[80vh] flex items-center bg-texture-hero">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop w-full relative z-10 grid grid-cols-1 md:grid-cols-12 gap-gutter">
        <div className="md:col-span-8 flex flex-col justify-center py-20">
          <span className="text-heritage-gold font-label-bold uppercase tracking-widest mb-4 block">
            Riqueza Estratégica
          </span>
          <h1 className="text-display-lg-mobile md:text-display-lg font-display-lg-mobile md:font-display-lg text-white mb-6 leading-tight">
            Cultive Su Legado en el Eje Cafetero de Colombia
          </h1>
          <p className="text-body-lg font-body-lg text-surface-container-high mb-10 max-w-2xl">
            Descubra un potencial de crecimiento sin precedentes en el Quindío. Una rara convergencia de turismo en auge, desarrollo de infraestructura y preservación ecológica hace que la tierra aquí sea un activo de primera clase.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/investment#roi"
              className="bg-heritage-gold text-white font-label-bold px-8 py-4 rounded-lg hover:opacity-90 transition-all duration-300 shadow-lg text-center flex items-center justify-center gap-2"
            >
              Explorar Potencial de ROI <ArrowRight className="w-4 h-4" />
            </Link>
            <button type="button" className="bg-transparent border border-white text-white font-label-bold px-8 py-4 rounded-lg hover:bg-white/10 transition-all duration-300 text-center">
              Descargar Presentación de Inversión
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

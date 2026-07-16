import { Link } from "react-router-dom";

export function InvestmentCTA() {
  return (
    <section className="py-section-gap px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
      <div className="bg-deep-forest rounded-2xl overflow-hidden relative">
        {/* Textura de fondo */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuDAM-wQh3ZE6o3MO7mXzaHartzz2oGfk_kl3Y2Wu4x_r6IJmnyxn5lZdn7wqyAZ7RcoTH3BVqp7HOOeGhG3SLoU6Q3aTpvGdMaQL_O26EF14pgLXFSiBrzvgmKoLvaG6dKP40qt80ybxl9DOfu97DeBb5M1SnLdw-etM6I94e4b36BpMIiBztXM2lpCBHGyRCR4-KXkhSvT43-BInQq0rTRXnpUulcFEHTJTcA73hG3DYRGWBtBgOK5IF3XhQo-Y3Rwn9o7P6UhWxzq')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="relative z-10 p-12 md:p-20 text-center flex flex-col items-center">
          <h2 className="text-headline-lg md:text-display-lg font-headline-lg md:font-display-lg text-white mb-6">
            Comience su Viaje de Inversión
          </h2>
          <p className="text-body-lg font-body-lg text-surface-container-highest max-w-2xl mb-10">
            Explore nuestro portafolio seleccionado de lotes premium. Cada propiedad es evaluada por sus vistas excepcionales, integración ecológica y alto potencial de ROI.
          </p>
          <Link
            to="/projects"
            className="bg-heritage-gold text-white font-label-bold px-10 py-4 rounded-lg hover:opacity-90 transition-all duration-300 shadow-lg text-lg"
          >
            Ver Proyectos Disponibles
          </Link>
        </div>
      </div>
    </section>
  );
}

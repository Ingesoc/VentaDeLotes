import { Link } from "react-router-dom";

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Imagen de Fondo */}
      <div className="absolute inset-0 z-0">
        <img
          className="w-full h-full object-cover"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuAm34ExVYXJI6Yew3li1eJTrQmYAlwFN-QHHYorlhN-p35LiKal84WwmzFBTt7g-rs9FGfZHF13nxbWoAxAS-rs6BN1lWjLyiXnHCoNgVVlDcc6ET4E15NZd1md6MYuikG5ZZ4YJQt9znRh7ue8BXp9ZTDZdKpR1D2AbBVZEFKExgucJ5CjzcYCIPzNGTWc7HijOFCKLIDN7Tsq761RHT_E4_PZcFBNymimhL_-1-SogoCntM3RFiobZHFeP6bLhcLhFC-DPWGJoX7f"
          alt="Exuberantes paisajes verdes del Quindío, Colombia con colinas onduladas y plantaciones de café"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/40 to-transparent mix-blend-multiply" />
      </div>

      {/* Contenido */}
      <div className="relative z-10 max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop w-full mt-20 md:mt-0">
        <div className="max-w-3xl glass-panel p-8 md:p-12 rounded-xl border border-surface-container-highest/50 shadow-[0_8px_32px_rgba(27,67,50,0.15)]">
          <h1 className="text-display-lg-mobile md:text-display-lg font-display-lg-mobile md:font-display-lg text-primary mb-6">
            Sea Dueño de su Lote Rural en el Quindío
          </h1>
          <p className="text-body-lg font-body-lg text-on-surface-variant mb-8 max-w-2xl">
            Invierta en naturaleza, disfrute un estilo de vida más saludable y benefíciese de la apreciación a largo plazo en el paisaje más vibrante de Colombia.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/projects"
              className="bg-primary text-on-primary font-label-bold px-8 py-4 rounded-lg hover:bg-tertiary-container transition-all duration-300 text-center shadow-lg"
            >
              Ver Proyectos
            </Link>
            <Link
              to="/contact"
              className="bg-transparent text-primary border-2 border-primary font-label-bold px-8 py-4 rounded-lg hover:bg-primary/5 transition-all duration-300 text-center"
            >
              Programar Visita
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

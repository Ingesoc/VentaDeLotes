import { useState } from "react";
import { Link } from "react-router";
import { Menu, X } from "lucide-react";
import { cldUrl, CLD_WIDTHS } from "@/lib/cloudinary";

export function TopNavBar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleMenu = () => setMobileOpen(!mobileOpen);

  return (
    <>
      <nav className="fixed top-0 w-full z-50 bg-warm-white/90 dark:bg-deep-forest/90 backdrop-blur-md transition-colors duration-300 border-b border-forest-green/10 dark:border-warm-white/10" id="navbar">
        <div className="flex justify-between items-center px-margin-mobile md:px-margin-desktop py-4 max-w-container-max mx-auto">
          <Link to="/" className="flex items-center gap-3">
            <img
              src={cldUrl("https://res.cloudinary.com/j5a9xyaq/image/upload/v1784226214/laHolandaIsotipo_dme9sp.png", CLD_WIDTHS.LOGO)}
              alt="La Holanda"
              className="h-8 md:h-10 w-auto"
            />
            <span className="font-display-lg text-xl md:text-2xl text-forest-green dark:text-soft-gold tracking-tight">
              La Holanda
            </span>
          </Link>
          <div className="hidden md:flex gap-8 items-center font-body-md text-body-md">
            <a className="text-forest-green dark:text-warm-white hover:text-soft-gold dark:hover:text-soft-gold transition-colors" href="/#proceso">Proceso</a>
            <Link className="text-forest-green dark:text-warm-white hover:text-soft-gold dark:hover:text-soft-gold transition-colors" to="/descubre-quindio">Quindío</Link>
            <Link className="text-forest-green dark:text-warm-white hover:text-soft-gold dark:hover:text-soft-gold transition-colors" to="/projects">Lotes</Link>
            <Link className="text-forest-green dark:text-warm-white hover:text-soft-gold dark:hover:text-soft-gold transition-colors" to="/contact">Contacto</Link>
            <div className="flex items-center gap-4 ml-4">
              <a className="bg-soft-gold text-deep-forest px-6 py-2 rounded-lg font-medium hover:brightness-110 transition-[filter]" href="/#contacto">
                Reservar
              </a>
            </div>
          </div>
          {/* Toggle móvil */}
          <div className="flex items-center md:hidden">
            <button onClick={toggleMenu} type="button" className="p-3 tap-target text-forest-green dark:text-warm-white" aria-label="Abrir menú">
              <Menu className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
        </div>
      </nav>

      {/* Menú móvil */}
      <div className={`fixed inset-0 z-[60] bg-deep-forest transition-transform duration-300 md:hidden flex flex-col items-center justify-center gap-8 ${mobileOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <button onClick={toggleMenu} type="button" className="absolute top-4 right-4 p-3 tap-target text-warm-white hover:text-soft-gold transition-colors" aria-label="Cerrar menú">
          <X className="h-7 w-7" aria-hidden="true" />
        </button>
        <a className="text-xl sm:text-2xl text-warm-white hover:text-soft-gold transition-colors tap-target py-3" href="/#proceso" onClick={toggleMenu}>Proceso</a>
        <Link className="text-xl sm:text-2xl text-warm-white hover:text-soft-gold transition-colors tap-target py-3" to="/descubre-quindio" onClick={toggleMenu}>Quindío</Link>
        <Link className="text-xl sm:text-2xl text-warm-white hover:text-soft-gold transition-colors tap-target py-3" to="/projects" onClick={toggleMenu}>Lotes</Link>
        <Link className="text-xl sm:text-2xl text-warm-white hover:text-soft-gold transition-colors tap-target py-3" to="/contact" onClick={toggleMenu}>Contacto</Link>
        <a className="bg-soft-gold text-deep-forest px-10 py-4 rounded-lg text-xl font-medium tap-target" href="/#contacto" onClick={toggleMenu}>
          Reservar
        </a>
      </div>
    </>
  );
}

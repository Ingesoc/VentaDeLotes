import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export function TopNavBar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'));
  }, []);

  const toggleDarkMode = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    }
  };

  const toggleMenu = () => setMobileOpen(!mobileOpen);

  return (
    <>
      <nav className="fixed top-0 w-full z-50 bg-warm-white/90 dark:bg-deep-forest/90 backdrop-blur-md transition-all duration-300 border-b border-forest-green/10 dark:border-warm-white/10" id="navbar">
        <div className="flex justify-between items-center px-margin-mobile md:px-margin-desktop py-4 max-w-container-max mx-auto">
          <Link to="/" className="font-display-lg text-2xl md:text-3xl text-forest-green dark:text-soft-gold tracking-tight">Verdant Horizon</Link>
          <div className="hidden md:flex gap-8 items-center font-body-md text-body-md">
            <a className="text-forest-green dark:text-warm-white hover:text-soft-gold dark:hover:text-soft-gold transition-colors" href="/#proceso">Proceso</a>
            <Link className="text-forest-green dark:text-warm-white hover:text-soft-gold dark:hover:text-soft-gold transition-colors" to="/projects">Lotes</Link>
            <a className="text-forest-green dark:text-warm-white hover:text-soft-gold dark:hover:text-soft-gold transition-colors" href="/#contacto">Contacto</a>
            <div className="flex items-center gap-4 ml-4">
              <button onClick={toggleDarkMode} className="p-2 rounded-full hover:bg-forest-green/10 dark:hover:bg-warm-white/10 transition-colors text-forest-green dark:text-warm-white" aria-label="Toggle Dark Mode">
                {isDark ? <i className="fa-solid fa-sun text-xl"></i> : <i className="fa-solid fa-moon text-xl"></i>}
              </button>
              <a className="bg-soft-gold text-deep-forest px-6 py-2 rounded-lg font-medium hover:brightness-110 transition-all" href="/#contacto">
                Reservar
              </a>
            </div>
          </div>
          {/* Mobile Toggle */}
          <div className="flex items-center gap-4 md:hidden">
            <button onClick={toggleDarkMode} className="p-2 text-forest-green dark:text-warm-white" aria-label="Toggle Dark Mode">
              {isDark ? <i className="fa-solid fa-sun text-xl"></i> : <i className="fa-solid fa-moon text-xl"></i>}
            </button>
            <button onClick={toggleMenu} className="text-forest-green dark:text-warm-white" aria-label="Open Menu">
              <i className="fa-solid fa-bars text-3xl"></i>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 z-[60] bg-deep-forest transition-transform duration-300 md:hidden flex flex-col items-center justify-center gap-8 ${mobileOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <button onClick={toggleMenu} className="absolute top-6 right-6 text-warm-white" aria-label="Close Menu">
          <i className="fa-solid fa-xmark text-4xl"></i>
        </button>
        <a className="text-2xl text-warm-white hover:text-soft-gold transition-colors" href="/#proceso" onClick={toggleMenu}>Proceso</a>
        <Link className="text-2xl text-warm-white hover:text-soft-gold transition-colors" to="/projects" onClick={toggleMenu}>Lotes</Link>
        <a className="text-2xl text-warm-white hover:text-soft-gold transition-colors" href="/#contacto" onClick={toggleMenu}>Contacto</a>
        <a className="bg-soft-gold text-deep-forest px-10 py-4 rounded-lg text-xl font-medium" href="/#contacto" onClick={toggleMenu}>
          Reservar
        </a>
      </div>
    </>
  );
}

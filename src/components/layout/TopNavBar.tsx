import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { desktopNavLinks } from "@/constants/navLinks";
import { AnimatePresence, motion } from "framer-motion";

export function TopNavBar() {
  const { pathname } = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Cerrar el menú móvil al cambiar de ruta
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <header className="bg-surface/70 backdrop-blur-md border-b border-outline-variant/20 sticky top-0 z-50">
      <div className="flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop py-4 max-w-container-max mx-auto">
        {/* Logo */}
        <Link
          to="/"
          className="text-headline-md font-headline-md tracking-tighter text-primary"
        >
          LOTES QUINDÍO
        </Link>

        {/* Navegación de Escritorio */}
        <nav className="hidden md:flex items-center gap-8">
          {desktopNavLinks.map((link) => {
            const isActive = pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={
                  isActive
                    ? "text-heritage-gold font-label-bold border-b-2 border-heritage-gold pb-1 transition-all duration-300"
                    : "text-on-surface-variant font-label-bold hover:text-primary hover:opacity-80 transition-all duration-300"
                }
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Botones de Acción Escritorio */}
        <div className="hidden md:flex items-center gap-4">
          <button className="text-primary font-label-bold hover:opacity-80 transition-all duration-300 bg-transparent border-[1.5px] border-deep-forest px-4 py-2 rounded-lg">
            Portal de Inversión
          </button>
          <button className="bg-deep-forest text-on-primary font-label-bold px-4 py-2 rounded-lg hover:opacity-90 transition-all duration-300 shadow-md">
            Programar Visita
          </button>
        </div>

        {/* Botón de Menú Móvil */}
        <button
          className="md:hidden text-primary"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
        >
          {mobileOpen ? (
            <X className="w-7 h-7" />
          ) : (
            <Menu className="w-7 h-7" />
          )}
        </button>
      </div>

      {/* Menú Móvil (Drawer) */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="md:hidden overflow-hidden bg-surface border-b border-outline-variant/20"
          >
            <nav className="flex flex-col gap-4 px-margin-mobile py-6">
              {desktopNavLinks.map((link) => {
                const isActive = pathname === link.to;
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setMobileOpen(false)}
                    className={
                      isActive
                        ? "text-heritage-gold font-label-bold text-body-lg"
                        : "text-on-surface-variant font-label-bold text-body-lg hover:text-primary transition-colors"
                    }
                  >
                    {link.label}
                  </Link>
                );
              })}
              <div className="flex flex-col gap-3 pt-4 border-t border-outline-variant/20">
                <button className="text-primary font-label-bold bg-transparent border-[1.5px] border-deep-forest px-4 py-3 rounded-lg">
                  Portal de Inversión
                </button>
                <button className="bg-deep-forest text-on-primary font-label-bold px-4 py-3 rounded-lg shadow-md">
                  Programar Visita
                </button>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

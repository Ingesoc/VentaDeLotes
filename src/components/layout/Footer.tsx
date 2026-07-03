import { Link } from "react-router-dom";
import { MessageCircle } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-primary border-t border-coffee-leaf/30">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter px-margin-mobile md:px-margin-desktop py-section-gap max-w-container-max mx-auto">
        {/* Marca */}
        <div className="col-span-1 flex flex-col space-y-4">
          <Link
            to="/"
            className="text-headline-md font-headline-md text-heritage-gold"
          >
            LOTES QUINDÍO
          </Link>
          <p className="text-caption font-caption text-surface-variant/80">
            © {new Date().getFullYear()} Lotes Quindío. Inversión Inmobiliaria de Lujo. Todos los derechos reservados.
          </p>
        </div>

        {/* Columnas de Enlaces */}
        <div className="col-span-1 md:col-span-3 grid grid-cols-2 md:grid-cols-3 gap-8">
          {/* Legal */}
          <div className="flex flex-col space-y-3">
            <h4 className="text-on-primary font-label-bold text-sm uppercase tracking-wider mb-2">
              Legal
            </h4>
            <Link
              to="/terms"
              className="text-body-md font-body-md text-surface-variant/80 hover:text-heritage-gold transition-colors duration-200"
            >
              Términos de Servicio
            </Link>
            <Link
              to="/privacy"
              className="text-body-md font-body-md text-surface-variant/80 hover:text-heritage-gold transition-colors duration-200"
            >
              Política de Privacidad
            </Link>
          </div>

          {/* Explorar */}
          <div className="flex flex-col space-y-3">
            <h4 className="text-on-primary font-label-bold text-sm uppercase tracking-wider mb-2">
              Explorar
            </h4>
            <Link
              to="/projects"
              className="text-body-md font-body-md text-surface-variant/80 hover:text-heritage-gold transition-colors duration-200"
            >
              Mapa de Proyectos
            </Link>
            <Link
              to="/dashboard"
              className="text-body-md font-body-md text-surface-variant/80 hover:text-heritage-gold transition-colors duration-200"
            >
              Acceso Admin
            </Link>
          </div>

          {/* Contacto */}
          <div className="flex flex-col space-y-3 col-span-2 md:col-span-1">
            <h4 className="text-on-primary font-label-bold text-sm uppercase tracking-wider mb-2">
              Contacto
            </h4>
            <a
              href="https://wa.me/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-body-md font-body-md text-surface-variant/80 hover:text-heritage-gold transition-colors duration-200 flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4" /> Soporte WhatsApp
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

import { Phone, Mail, MapPin, Send, Compass } from "lucide-react";
import { Link } from "react-router";
import { project } from "@/constants/project";
import { cldUrl, CLD_WIDTHS } from "@/lib/cloudinary";

export function Footer() {
  return (
    <footer className="w-full bg-deep-forest dark:bg-black border-t border-warm-white/5">
      <div className="px-margin-mobile md:px-margin-desktop py-16 max-w-container-max mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Marca */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img
                src={cldUrl("https://res.cloudinary.com/j5a9xyaq/image/upload/v1784226214/laHolandaIsotipo_dme9sp.png", CLD_WIDTHS.LOGO)}
                alt="La Holanda"
                width={96}
                height={90}
                className="h-10 w-auto brightness-0 invert opacity-80"
                loading="lazy"
                decoding="async"
              />
              <span className="font-display-lg text-3xl text-warm-white">
                {project.name}
              </span>
            </div>
            <p className="text-body-md font-body-md text-warm-white/60 mb-2">
              {project.tagline}
            </p>
            <p className="text-caption font-caption text-warm-white/60">
              {project.type} · {project.developer}
            </p>
            <Link
              to="/descubre-quindio"
              className="inline-flex items-center gap-2 text-body-md font-body-md text-soft-gold hover:text-warm-white transition-colors mt-6 group"
            >
              <Compass className="w-4 h-4 transition-transform group-hover:rotate-12" />
              Descubre Quindío
            </Link>
          </div>

          {/* Ubicación */}
          <div>
            <h2 className="font-label-bold text-soft-gold mb-4 uppercase tracking-wider text-sm">
              Ubicación
            </h2>
            <p className="text-body-md font-body-md text-warm-white/70">
              {project.location.address}
            </p>
            <p className="text-body-md font-body-md text-warm-white/70">
              {project.location.municipality}, {project.location.department}
            </p>
            <p className="text-caption font-caption text-warm-white/50 mt-2">
              A {project.location.distanceToTown}
            </p>
          </div>

          {/* Contacto */}
          <div>
            <h2 className="font-label-bold text-soft-gold mb-4 uppercase tracking-wider text-sm">
              Contacto
            </h2>
            <p className="text-body-md font-body-md text-warm-white/70 mb-2">
              {project.contact.company}
            </p>
            <a
              href={`tel:${project.contact.phone}`}
              className="flex items-center gap-2 text-body-md font-body-md text-warm-white/70 hover:text-soft-gold transition-colors"
            >
              <Phone className="w-4 h-4 text-soft-gold shrink-0" />
              {project.contact.phone}
            </a>
            <a
              href={`mailto:${project.contact.email}`}
              className="flex items-center gap-2 text-body-md font-body-md text-warm-white/70 hover:text-soft-gold transition-colors mt-2"
            >
              <Mail className="w-4 h-4 text-soft-gold shrink-0" />
              {project.contact.email}
            </a>
            <p className="flex items-center gap-2 text-caption font-caption text-warm-white/50 mt-2">
              <MapPin className="w-3.5 h-3.5 text-soft-gold shrink-0" />
              {project.contact.office}
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 text-body-md font-body-md text-soft-gold hover:text-warm-white transition-colors mt-6 group"
            >
              <Send className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              Formulario de contacto
            </Link>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-warm-white/5 text-center text-warm-white/60 text-sm">
          © {new Date().getFullYear()} {project.name}. Una propiedad de {project.developer}. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}

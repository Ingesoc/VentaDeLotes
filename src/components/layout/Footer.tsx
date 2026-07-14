export function Footer() {
  return (
    <footer className="w-full bg-deep-forest dark:bg-black border-t border-warm-white/5">
      <div className="px-margin-mobile md:px-margin-desktop py-16 max-w-container-max mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="font-display-lg text-3xl text-warm-white">Verdant Horizon</div>
          <div className="flex flex-wrap justify-center gap-8 font-body-md">
            <a className="text-warm-white/70 hover:text-soft-gold transition-colors" href="/#">Privacidad</a>
            <a className="text-warm-white/70 hover:text-soft-gold transition-colors" href="/#">Términos</a>
            <a className="text-warm-white/70 hover:text-soft-gold transition-colors" href="/#contacto">Contacto</a>
            <a className="text-warm-white/70 hover:text-soft-gold transition-colors" href="/#">Brochure</a>
          </div>
          <div className="flex gap-4">
            <a className="w-10 h-10 rounded-full border border-warm-white/20 flex items-center justify-center text-warm-white hover:border-soft-gold hover:text-soft-gold transition-all" href="/#">
              <i className="fa-solid fa-globe text-xl"></i>
            </a>
            <a className="w-10 h-10 rounded-full border border-warm-white/20 flex items-center justify-center text-warm-white hover:border-soft-gold hover:text-soft-gold transition-all" href="/#">
              <i className="fa-solid fa-envelope text-xl"></i>
            </a>
          </div>
        </div>
        <div className="mt-16 pt-8 border-t border-warm-white/5 text-center text-warm-white/40 text-sm">
          © {new Date().getFullYear()} Verdant Horizon. Una propiedad de ingesocc S.A.S. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}

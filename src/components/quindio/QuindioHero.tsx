export default function QuindioHero() {
  return (
    <section className="relative h-[90vh] min-h-[600px] flex items-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div
          className="w-full h-full bg-cover bg-center"
          style={{ backgroundImage: "url('https://res.cloudinary.com/j5a9xyaq/image/upload/v1784304240/laholanda/events/cafetales.jpg')" }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 via-primary/40 to-transparent"></div>
      </div>
      <div className="relative z-10 w-full px-margin-desktop max-w-container-max mx-auto">
        <div className="max-w-2xl text-white stagger-reveal" style={{ animationDelay: "0.2s" }}>
          <span className="text-heritage-gold font-label-bold tracking-widest uppercase mb-4 block">
            Destino: Quindío
          </span>
          <h1 className="font-display-lg text-display-lg mb-6 leading-tight">
            El Corazón del Paisaje Cafetero
          </h1>
          <p className="font-body-lg text-body-lg text-surface-variant/90 mb-10 leading-relaxed">
            Descubre un santuario donde la arquitectura se encuentra con la preservación ecológica.
            Sumérgete en la cultura cafetera de renombre mundial y asegura tu legado en la región más vibrante de Colombia.
          </p>
          <div className="flex flex-wrap gap-4">
            <a
              className="bg-heritage-gold text-primary px-8 py-4 rounded-lg font-label-bold hover:bg-white transition-all duration-300 flex items-center gap-2"
              href="#explore"
            >
              Explorar Regiones
              <span className="material-symbols-outlined">arrow_downward</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

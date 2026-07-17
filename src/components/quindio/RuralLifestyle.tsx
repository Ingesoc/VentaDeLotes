export default function RuralLifestyle() {
  return (
    <section className="py-section-gap">
      <div className="px-margin-desktop max-w-container-max mx-auto">
        <div className="flex flex-col md:flex-row gap-gutter items-center">
          <div className="w-full md:w-1/2">
            <div className="relative">
              <img
                alt="Hacienda aerial view"
                className="rounded-2xl shadow-2xl relative z-10 w-full object-cover h-[350px]"
                src="https://res.cloudinary.com/j5a9xyaq/image/upload/v1784304281/laholanda/events/haciendaCafetera.jpg"
              />
              <div className="absolute -top-6 -left-6 w-32 h-32 bg-heritage-gold/20 rounded-full z-0"></div>
            </div>
          </div>
          <div className="w-full md:w-1/2 md:pl-12">
            <h2 className="font-headline-lg text-primary mb-6">Serenidad y Conectividad</h2>
            <p className="font-body-lg text-on-surface-variant mb-6 leading-relaxed">
              Experimenta el verdadero significado de "Campo Lindo". Nuestros proyectos están conectados por pintorescos caminos rurales que ofrecen una transición perfecta entre la comodidad del pueblo y la tranquilidad de tu finca privada.
            </p>
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-heritage-gold">unpaved_road</span>
                <span className="font-label-bold text-primary">Acceso Fluido</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-heritage-gold">nature_people</span>
                <span className="font-label-bold text-primary">Seguridad Privada</span>
              </div>
            </div>
            <img
              alt="Rural roads"
              className="rounded-xl h-48 w-full object-cover shadow-md"
              src="https://res.cloudinary.com/j5a9xyaq/image/upload/v1784304335/laholanda/events/viasRurales.jpg"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

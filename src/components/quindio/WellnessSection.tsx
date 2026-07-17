export default function WellnessSection() {
  return (
    <section className="relative py-section-gap bg-deep-forest text-white overflow-hidden">
      <div className="absolute top-0 right-0 w-1/2 h-full opacity-30">
        {/* Placeholder decorativo */}
      </div>
      <div className="px-margin-desktop max-w-container-max mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="font-display-lg text-display-lg-mobile mb-8">
              Bienestar y Recreación
            </h2>
            <p className="font-body-lg text-surface-variant/80 mb-10">
              Nuestras comodidades de estilo de vida están diseñadas para armonizar con el medio ambiente. Desde piscinas de borde infinito que miran al valle hasta espacios contemplativos diseñados para la relajación, cada elemento te invita a ir más despacio.
            </p>
            <div className="space-y-6">
              <div className="flex gap-4 p-4 rounded-xl border border-white/10 hover:bg-white/5 transition-colors card-border-glow">
                <span className="material-symbols-outlined text-heritage-gold text-3xl">pool</span>
                <div>
                  <p className="font-label-bold">Piscinas de Nivel Olímpico</p>
                  <p className="text-caption text-surface-variant">Aguas cristalinas rodeadas de jardines nativos.</p>
                </div>
              </div>
              <div className="flex gap-4 p-4 rounded-xl border border-white/10 hover:bg-white/5 transition-colors card-border-glow">
                <span className="material-symbols-outlined text-heritage-gold text-3xl">park</span>
                <div>
                  <p className="font-label-bold">Senderos Ecológicos</p>
                  <p className="text-caption text-surface-variant">Millas de senderos privados a través del bosque cafetero.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="rounded-2xl overflow-hidden shadow-2xl h-[600px]">
              <img
                alt="Luxury pool area"
                className="w-full h-full object-cover"
                src="https://res.cloudinary.com/j5a9xyaq/image/upload/v1784304319/laholanda/events/piscinas.jpg"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 glass-panel p-8 rounded-2xl text-primary max-w-xs shadow-xl border border-white/20">
              <p className="font-headline-md mb-2">Lujo Moderno</p>
              <p className="text-caption font-body-md opacity-80">Arquitectura que celebra el exterior.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

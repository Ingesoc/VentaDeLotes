export default function NaturalWonders() {
  return (
    <section className="bg-surface-container-low py-section-gap">
      <div className="px-margin-desktop max-w-container-max mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-headline-lg text-display-lg-mobile text-primary mb-4">
            Maravillas Naturales
          </h2>
          <p className="font-body-md text-on-surface-variant max-w-xl mx-auto">
            Estratégicamente ubicado cerca de los parques ecológicos y temáticos más famosos de Colombia.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="md:col-span-2 relative h-[500px] rounded-2xl overflow-hidden group">
            <img
              alt="Local viewpoint"
              className="w-full h-full object-cover img-zoom-lg"
              src="https://res.cloudinary.com/j5a9xyaq/image/upload/v1784304306/laholanda/events/miradorQuindio.png"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-8">
              <h3 className="text-white font-headline-md mb-2">Vistas Icónicas</h3>
              <p className="text-white/80 font-body-md">
                Vistas panorámicas de la Cordillera Central y las plantaciones de café.
              </p>
            </div>
          </div>
          {/* Card 2 */}
          <div className="relative h-[500px] rounded-2xl overflow-hidden group">
            <img
              alt="I Love Quimbaya square"
              className="w-full h-full object-cover img-zoom-lg"
              src="https://res.cloudinary.com/j5a9xyaq/image/upload/v1784304292/laholanda/events/lovequimbaya.jpg"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-8">
              <h3 className="text-white font-headline-md mb-2">Vida Local</h3>
              <p className="text-white/80 font-body-md">
                El corazón vibrante de la plaza principal de Quimbaya.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

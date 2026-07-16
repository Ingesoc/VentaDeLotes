import farolesImage from "@/assets/Events/festival de Faroles Quimbaya 1.jpg";
import arrierosImage from "@/assets/Events/arrieros.jpg";

export default function CulturalHeritage() {
  return (
    <section className="py-section-gap px-margin-desktop max-w-container-max mx-auto" id="explore">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-center mb-20">
        <div className="lg:col-span-5">
          <h2 className="font-headline-lg text-display-lg-mobile text-primary mb-6">
            Herencia Cultural
          </h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant mb-8">
            Quimbaya es más que un lugar; es una tradición viva. Desde las calles iluminadas del Festival de Velas y Faroles hasta la elegancia atemporal de la cultura Arriera, cada rincón cuenta una historia de hospitalidad y herencia.
          </p>
          <div className="flex items-center gap-4 text-heritage-gold">
            <span className="w-12 h-[1px] bg-heritage-gold"></span>
            <span className="font-label-bold uppercase tracking-widest">Vive Quimbaya</span>
          </div>
        </div>
        <div className="lg:col-span-7 grid grid-cols-2 gap-4">
          <div className="rounded-xl overflow-hidden shadow-lg transform translate-y-8 group">
            <img
              alt="Festival de Faroles"
              className="w-full h-[400px] object-cover img-zoom"
              src={farolesImage}
            />
            <div className="p-4 bg-white">
              <p className="font-label-bold text-primary">Festival de Velas y Faroles</p>
              <p className="text-caption text-on-surface-variant">Noche Anual de Luces</p>
            </div>
          </div>
          <div className="rounded-xl overflow-hidden shadow-lg group">
            <img
              alt="Arrieros traditions"
              className="w-full h-[400px] object-cover img-zoom"
              src={arrierosImage}
            />
            <div className="p-4 bg-white">
              <p className="font-label-bold text-primary">Legado Arriero</p>
              <p className="text-caption text-on-surface-variant">Vida Local Tradicional</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

import { ArrowRight, Leaf } from "lucide-react";
import { Link } from "react-router-dom";

export function BenefitsBentoGrid() {
  return (
    <section className="py-section-gap bg-background">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
        {/* Encabezado de Sección */}
        <div className="mb-12 md:mb-16">
          <h2 className="text-headline-lg font-headline-lg text-primary mb-4">
            ¿Por qué Invertir en el Quindío?
          </h2>
          <p className="text-body-lg font-body-lg text-on-surface-variant max-w-2xl">
            Descubra un estilo de vida que equilibra el confort moderno con la
            belleza natural intacta.
          </p>
        </div>

        {/* Cuadrícula Bento */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
          {/* Elemento Grande — Ingresos Airbnb */}
          <div className="md:col-span-2 relative rounded-xl overflow-hidden group cursor-pointer border border-surface-container-highest">
            <img
              loading="lazy"
              decoding="async"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuC8xoMaDmkw40ziRIbgUsJkrYOZashu9dFzOiYxJY5dqOsNXF2crQQ79nWIF5g_MaWs675JArrE3fV0Og43McRlnKEmGZPSc35MVZBnPByHt1O1Fgj2oBxVjIR39s8GLnGDZ29cz-Exy09dOD4JhDuAcxYLlotqodtCxfGJJxRDnydqgknN7j5Mr5bzJ0CUYSwUPlHrYIbJe557V27rTJ8n49SOKkKZBqH2LvPqyMwu8fQxc5IG9_k10OpNFOs0lvxmwolMEy-mpKsZ"
              alt="Lujosa cabaña moderna con vistas a un valle verde en el Quindío"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/30 to-transparent" />
            <div className="absolute bottom-0 left-0 p-8">
              <span className="inline-block px-3 py-1 bg-heritage-gold text-primary text-caption font-label-bold rounded-full mb-3">
                Alto ROI
              </span>
              <h3 className="text-headline-md font-headline-md text-on-primary mb-2">
                Potencial de Ingresos Airbnb
              </h3>
              <p className="text-body-md font-body-md text-surface-container-low max-w-md">
                Capitalice el creciente mercado de eco-turismo con rentas a
                corto plazo de alta demanda.
              </p>
            </div>
          </div>

          {/* Elemento Pequeño 1 — Retiro de Bienestar */}
          <div className="relative rounded-xl overflow-hidden group cursor-pointer border border-surface-container-highest bg-surface-container flex flex-col justify-end p-8 transition-all duration-300 hover:shadow-[0_8px_30px_rgba(27,67,50,0.12)]">
            <div className="absolute top-8 right-8 text-primary opacity-20 group-hover:opacity-100 transition-opacity">
              <Leaf className="w-10 h-10" />
            </div>
            <h3 className="text-headline-md font-headline-md text-primary mb-2 relative z-10">
              Retiro de Bienestar
            </h3>
            <p className="text-body-md font-body-md text-on-surface-variant relative z-10">
              Escape del ruido de la ciudad y reconecte con usted mismo en
              absoluta tranquilidad.
            </p>
          </div>

          {/* Elemento Pequeño 2 — Naturaleza Inmersiva */}
          <div className="relative rounded-xl overflow-hidden group cursor-pointer border border-surface-container-highest">
            <img
              loading="lazy"
              decoding="async"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBXfU11fu_BkmG3ZF10UOS7hrCV4GVdyBvc-CudSe3MWfpSA9FUNA6LgvP8JrRkwFV2DaL9AdLELC_hKItp5tqxxhkEskZ8czNCmOlNvc-aLkD3IF0c72-Sxzpu3lFxd16GN5rx20RwrxZE6Pi_JI1l9UD9WboqoMvkQJ5XrdZwjXdEhcu-1-E-ZfUG5q9YOAfHs7mq5wtd-U6OO3P0QyXq2b-bw4r9P7HDuB7YlTqOLvgjtaAm-Tx3sWTjgtlOrx6WIR-SSZpyO4i6"
              alt="Exuberantes hojas de monstera tropical y plantas de café con rocío matutino"
            />
            <div className="absolute inset-0 bg-primary/40 group-hover:bg-primary/20 transition-colors duration-500" />
            <div className="absolute bottom-0 left-0 p-8">
              <h3 className="text-headline-md font-headline-md text-on-primary mb-2">
                Naturaleza Inmersiva
              </h3>
              <p className="text-body-md font-body-md text-surface-container-low">
                Rodéese de biodiversidad.
              </p>
            </div>
          </div>

          {/* Elemento Mediano — Arquitectura Sostenible */}
          <div className="md:col-span-2 relative rounded-xl overflow-hidden group cursor-pointer border border-surface-container-highest bg-earth-beige flex flex-col md:flex-row items-center p-8 transition-all duration-300 hover:shadow-[0_8px_30px_rgba(27,67,50,0.12)]">
            <div className="w-full md:w-1/2 md:pr-8 mb-6 md:mb-0">
              <h3 className="text-headline-md font-headline-md text-primary mb-4">
                Arquitectura Sostenible
              </h3>
              <p className="text-body-md font-body-md text-on-surface-variant mb-6">
                Construya la casa de sus sueños utilizando principios de diseño
                bioclimático que respetan el medio ambiente mientras maximizan
                el lujo.
              </p>
              <Link
                to="/projects"
                className="text-heritage-gold font-label-bold flex items-center gap-2 group-hover:gap-4 transition-all"
              >
                Conocer Más <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="w-full md:w-1/2 h-48 md:h-full rounded-lg overflow-hidden">
              <img
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDJO0FJzRxj7_VsF0623qAaPns4CeXj6vxq_sVHXKsncpE7BCkiBjnb3xg218FG5OLOMrtGXX4iDmBWspKJpDlNH5TBrw0HPdRuffG65PyopgZJBBxbMVvFdBc96JO0PSyffPk0EjNBUg8Dc5CnX9sfTrWc2E6WarmS2h03U4dW0Xfne1KuIeN-ij4J5wiIvDpRusnt4Slb6K8cnhhrn7w4D68uHl1FBL18aTH1gz94AjlOkhxw7Wq7tS3lib39PxlBibVOsi2Y961s"
                alt="Diseño arquitectónico ecológico integrado con elementos de la naturaleza"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

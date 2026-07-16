import { Mountain, KeyRound, TrendingUp, Building } from "lucide-react";
import {
  tourismGrowthStat,
  infraInvestmentStat,
  marketFeatures,
} from "@/constants/marketStats";

/** Mapa de id → iconos */
const featureIcons = {
  "land-scarcity": Mountain,
  "airbnb-yields": KeyRound,
} as const;

/** Iconos decorativos de fondo */
const bgIcons = {
  "land-scarcity": TrendingUp,
  "airbnb-yields": Building,
} as const;

export function MarketGrowthBento() {
  return (
    <section className="py-section-gap px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
      {/* Encabezado */}
      <div className="mb-16 text-center md:text-left">
        <h2 className="text-headline-lg font-headline-lg text-primary mb-4">
          El Renacimiento del Quindío
        </h2>
        <p className="text-body-lg font-body-lg text-on-surface-variant max-w-3xl">
          Impulsada por un aumento en el eco-turismo y el nomadismo digital, la
          región está experimentando una demanda sin precedentes de espacios de
          vida premium integrados en la naturaleza.
        </p>
      </div>

      {/* Cuadrícula */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter auto-rows-[300px]">
        {/* Tarjeta grande (8 col, 2 filas) */}
        <div className="md:col-span-8 md:row-span-2 rounded-xl overflow-hidden relative group">
          <img
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover img-zoom"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuA5X1zd3U8l7BxogrGjnh4sPfrm22AiUUzhthQdKQIKfMedACZgxoopACQc2ZbI6eO2tt4_OcGyEgUF5d5mDnfG9Jm78dktwmkAKdPXUArZLxmP7v7paODm4nY42fLRCzJFX7ANi4G-uV62_vCKwmipQmL2ipHmGz1pBfx1ggiBlYFNx47bT1ak_oltkXOOxOAj_0D4tTYq7lp6IYhgyE6qxmrayn3uqMhLkWsGehBxFjJWvLxMAN9mEWtHqZ1wVuj-mnNnZMm-mF2V"
            alt="Vista aérea de los exuberantes paisajes verdes del Quindío con plantaciones de café y casas modernas integradas en la naturaleza"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/30 to-transparent" />
          <div className="absolute bottom-0 left-0 p-8 w-full">
            <div className="glass-card p-6 rounded-xl">
              <h3 className="text-headline-md font-headline-md text-primary mb-2">
                Auge del Turismo e Infraestructura
              </h3>
              <p className="text-body-md font-body-md text-on-surface-variant mb-4">
                Con la expansión del Aeropuerto Internacional El Edén y la
                finalización del túnel de La Línea, la accesibilidad ha
                revolucionado los valores de los bienes raíces.
              </p>
              <div className="flex items-center gap-6">
                <div>
                  <span className="block text-display-lg-mobile font-display-lg-mobile text-primary">
                    {tourismGrowthStat.value}
                  </span>
                  <span className="text-caption font-caption text-on-surface-variant uppercase tracking-wider">
                    {tourismGrowthStat.label}
                  </span>
                </div>
                <div className="h-12 w-[1px] bg-outline-variant" />
                <div>
                  <span className="block text-display-lg-mobile font-display-lg-mobile text-primary">
                    {infraInvestmentStat.value}
                  </span>
                  <span className="text-caption font-caption text-on-surface-variant uppercase tracking-wider">
                    {infraInvestmentStat.label}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tarjetas pequeñas */}
        {marketFeatures.map((feature, index) => {
          const Icon = featureIcons[feature.id as keyof typeof featureIcons];
          const BgIcon = bgIcons[feature.id as keyof typeof bgIcons];

          return (
            <div
              key={feature.id}
              className={`md:col-span-4 rounded-xl ${
                index === 0 ? "bg-earth-beige" : "bg-surface-container"
              } p-8 border border-surface-dim flex flex-col justify-center relative overflow-hidden group hover:shadow-[0_4px_20px_rgba(27,67,50,0.08)] transition-all duration-300`}
            >
              {/* Icono decorativo */}
              <div
                className={`absolute opacity-5 ${
                  index === 0 ? "-right-10 -top-10" : "-right-10 -bottom-10"
                }`}
              >
                <BgIcon className="w-[150px] h-[150px]" />
              </div>

              <Icon className="w-8 h-8 text-heritage-gold mb-4" />
              <h4 className="text-headline-md font-headline-md text-primary mb-2">
                {feature.title}
              </h4>
              <p className="text-body-md font-body-md text-on-surface-variant">
                {feature.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

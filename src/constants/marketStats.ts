export interface MarketStat {
  value: string;
  label: string;
}

/** Métricas principales para MarketGrowthBento */
export const tourismGrowthStat: MarketStat = {
  value: "35%",
  label: "Crecimiento Anual de Turismo",
};

export const infraInvestmentStat: MarketStat = {
  value: "+$2B",
  label: "Inversión en Infraestructura",
};

/** Tarjetas de características del mercado */
export const marketFeatures = [
  {
    id: "land-scarcity",
    title: "Escasez de Tierra",
    description:
      "Leyes de zonificación estrictas aseguran la preservación ecológica, limitando los nuevos desarrollos y aumentando el valor de los lotes aprobados.",
  },
  {
    id: "airbnb-yields",
    title: "Rendimientos de Airbnb",
    description:
      "Las eco-villas de lujo en la región exigen consistentemente tarifas nocturnas premium, generando flujos sólidos de ingresos pasivos.",
  },
] as const;

/** Tarjetas de características de ROI */
export const roiFeatures = [
  {
    id: "inflation-hedge",
    icon: "Shield" as const,
    title: "Cobertura contra la Inflación",
    description:
      "Activos tangibles como la tierra mantienen históricamente su valor y se aprecian durante periodos inflacionarios, protegiendo su patrimonio.",
  },
  {
    id: "capital-appreciation",
    icon: "Landmark" as const,
    title: "Apreciación de Capital",
    description:
      "Con la maduración de las inversiones en infraestructura, el valor de la tierra en el Quindío ha tenido una trayectoria ascendente en la última década.",
  },
  {
    id: "development-optionality",
    icon: "Building2" as const,
    title: "Opciones de Desarrollo",
    description:
      "Conserve la tierra para apreciación, o desarrolle un eco-retiro de lujo para entrar al lucrativo mercado de rentas a corto plazo.",
  },
] as const;


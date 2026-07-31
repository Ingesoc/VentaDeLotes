import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { InvestmentHero } from "../InvestmentHero";
import { MarketGrowthBento } from "../MarketGrowthBento";
import { RoiAnalysis } from "../RoiAnalysis";
import { InvestmentCTA } from "../InvestmentCTA";

// ─── Mocks ────────────────────────────────────────
vi.mock("@/lib/cloudinary", () => ({
  cldUrl: (url: string) => url,
  CLD_WIDTHS: {
    HERO: 1920, CAROUSEL: 1200, MASTERPLAN: 1280,
    LARGE: 1000, CARD: 800, THUMB: 400, LOGO: 200,
  },
}));

vi.mock("@/constants/marketStats", () => ({
  tourismGrowthStat: { value: "+47%", label: "CRECIMIENTO TURÍSTICO ANUAL" },
  infraInvestmentStat: { value: "$2.5B", label: "INVERSIÓN EN INFRAESTRUCTURA" },
  marketFeatures: [
    {
      id: "land-scarcity",
      title: "Escasez de Tierra Premium",
      description: "La oferta limitada de lotes con vistas panorámicas y acceso a servicios impulsa una apreciación constante.",
    },
    {
      id: "airbnb-yields",
      title: "Rendimientos Airbnb",
      description: "La demanda de alojamientos de lujo en el campo cafetero genera rentabilidades superiores al 12% anual.",
    },
  ],
  roiFeatures: [
    {
      id: "plusvalia",
      icon: "Shield",
      title: "Plusvalía Garantizada",
      description: "La tierra en el Eje Cafetero se ha apreciado consistentemente por encima de la inflación.",
    },
    {
      id: "escritura",
      icon: "Landmark",
      title: "Seguridad Jurídica",
      description: "Todos los lotes cuentan con escritura pública y matrícula inmobiliaria independiente.",
    },
    {
      id: "dolar",
      icon: "Building2",
      title: "Refugio de Valor",
      description: "La tierra es un activo tangible que preserva su valor frente a la volatilidad económica.",
    },
  ],
}));

function renderInRouter(component: React.ReactElement) {
  return render(<MemoryRouter>{component}</MemoryRouter>);
}

/* ─── InvestmentHero ─────────────────────────────── */
describe("InvestmentHero", () => {
  it("renders the badge", () => {
    renderInRouter(<InvestmentHero />);
    expect(screen.getByText("Riqueza Estratégica")).toBeInTheDocument();
  });

  it("renders the main heading", () => {
    renderInRouter(<InvestmentHero />);
    expect(
      screen.getByRole("heading", { level: 1 }),
    ).toHaveTextContent("Cultive Su Legado en el Eje Cafetero de Colombia");
  });

  it("renders the description paragraph", () => {
    renderInRouter(<InvestmentHero />);
    expect(
      screen.getByText(/Descubra un potencial de crecimiento sin precedentes/),
    ).toBeInTheDocument();
  });

  it("renders the 'Explorar ROI' link pointing to /investment#roi", () => {
    renderInRouter(<InvestmentHero />);
    const link = screen.getByText("Explorar ROI");
    expect(link).toBeInTheDocument();
    expect(link.closest("a")?.getAttribute("href")).toBe("/investment#roi");
  });

  it("renders the 'Descargar Presentación' button", () => {
    renderInRouter(<InvestmentHero />);
    expect(
      screen.getByText("Descargar Presentación"),
    ).toBeInTheDocument();
  });
});

/* ─── MarketGrowthBento ──────────────────────────── */
describe("MarketGrowthBento", () => {
  it("renders the main heading", () => {
    renderInRouter(<MarketGrowthBento />);
    expect(
      screen.getByRole("heading", { name: /El Renacimiento del Quindío/i }),
    ).toBeInTheDocument();
  });

  it("renders the description", () => {
    renderInRouter(<MarketGrowthBento />);
    expect(
      screen.getByText(/Impulsada por un aumento en el eco-turismo/),
    ).toBeInTheDocument();
  });

  it("renders the tourism growth stat value", () => {
    renderInRouter(<MarketGrowthBento />);
    expect(screen.getByText("+47%")).toBeInTheDocument();
  });

  it("renders the infrastructure investment stat value", () => {
    renderInRouter(<MarketGrowthBento />);
    expect(screen.getByText("$2.5B")).toBeInTheDocument();
  });

  it("renders the stat labels", () => {
    renderInRouter(<MarketGrowthBento />);
    expect(screen.getByText("CRECIMIENTO TURÍSTICO ANUAL")).toBeInTheDocument();
    expect(screen.getByText("INVERSIÓN EN INFRAESTRUCTURA")).toBeInTheDocument();
  });

  it("renders the market feature cards", () => {
    renderInRouter(<MarketGrowthBento />);
    expect(screen.getByText("Escasez de Tierra Premium")).toBeInTheDocument();
    expect(screen.getByText("Rendimientos Airbnb")).toBeInTheDocument();
  });

  it("renders the main image with descriptive alt text", () => {
    renderInRouter(<MarketGrowthBento />);
    const img = screen.getByAltText(/Vista aérea de los exuberantes paisajes/);
    expect(img).toBeInTheDocument();
  });
});

/* ─── RoiAnalysis ────────────────────────────────── */
describe("RoiAnalysis", () => {
  it("renders the section with id='roi'", () => {
    const { container } = renderInRouter(<RoiAnalysis />);
    const section = container.querySelector("#roi");
    expect(section).toBeTruthy();
  });

  it("renders the main heading", () => {
    renderInRouter(<RoiAnalysis />);
    expect(
      screen.getByRole("heading", { name: /Por qué la Tierra es el Mejor Activo/i }),
    ).toBeInTheDocument();
  });

  it("renders the description", () => {
    renderInRouter(<RoiAnalysis />);
    expect(
      screen.getByText(/Más allá de la apreciación del estilo de vida/),
    ).toBeInTheDocument();
  });

  it("renders all 3 ROI feature cards", () => {
    renderInRouter(<RoiAnalysis />);
    expect(screen.getByText("Plusvalía Garantizada")).toBeInTheDocument();
    expect(screen.getByText("Seguridad Jurídica")).toBeInTheDocument();
    expect(screen.getByText("Refugio de Valor")).toBeInTheDocument();
  });

  it("renders each ROI feature description", () => {
    renderInRouter(<RoiAnalysis />);
    expect(
      screen.getByText(/La tierra en el Eje Cafetero se ha apreciado/),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Todos los lotes cuentan con escritura pública/),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/La tierra es un activo tangible/),
    ).toBeInTheDocument();
  });
});

/* ─── InvestmentCTA ──────────────────────────────── */
describe("InvestmentCTA", () => {
  it("renders the main heading", () => {
    renderInRouter(<InvestmentCTA />);
    expect(
      screen.getByRole("heading", { name: /Comience su Viaje de Inversión/i }),
    ).toBeInTheDocument();
  });

  it("renders the description", () => {
    renderInRouter(<InvestmentCTA />);
    expect(
      screen.getByText(/Explore nuestro portafolio seleccionado/),
    ).toBeInTheDocument();
  });

  it("renders the 'Ver Proyectos Disponibles' link to /projects", () => {
    renderInRouter(<InvestmentCTA />);
    const link = screen.getByText("Ver Proyectos Disponibles");
    expect(link).toBeInTheDocument();
    expect(link.closest("a")?.getAttribute("href")).toBe("/projects");
  });
});
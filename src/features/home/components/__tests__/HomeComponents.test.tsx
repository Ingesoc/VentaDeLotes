import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { HeroSection } from "../HeroSection";
import { ProcessSteps } from "../ProcessSteps";
import { ProjectBenefits } from "../ProjectBenefits";
import { MasterPlanSection } from "../MasterPlanSection";
import { InvestmentComparison } from "../InvestmentComparison";

// ─── Mocks ────────────────────────────────────────
vi.mock("@/lib/cloudinary", () => ({
  cldUrl: (url: string) => url,
  CLD_WIDTHS: {
    HERO: 1920,
    CAROUSEL: 1200,
    MASTERPLAN: 1280,
    LARGE: 1000,
    CARD: 800,
    THUMB: 400,
    LOGO: 200,
  },
}));

vi.mock("@/constants/lots", () => ({
  lots: [
    {
      id: "01",
      areaM2: 8910.37,
      price: 189242850,
      status: "disponible",
      aerialImage: "https://res.cloudinary.com/test/aerial.jpg",
      perspectiveImage: "https://res.cloudinary.com/test/perspective.jpg",
    },
    {
      id: "02",
      areaM2: 2008,
      price: 189242850,
      status: "disponible",
      aerialImage: "https://res.cloudinary.com/test/aerial.jpg",
      perspectiveImage: "https://res.cloudinary.com/test/perspective.jpg",
    },
    {
      id: "99",
      areaM2: 3000,
      price: 100000000,
      status: "vendido",
      aerialImage: "https://res.cloudinary.com/test/aerial.jpg",
      perspectiveImage: "https://res.cloudinary.com/test/perspective.jpg",
    },
  ],
  getLotById: vi.fn(),
  getRelatedLots: vi.fn(() => []),
}));

vi.mock("./lotMarkers", () => ({
  lotMarkers: [
    { id: 1, y: 2999, x: 1038, top: "46.13%", left: "74.98%" },
    { id: 2, y: 2491, x: 1252, top: "55.64%", left: "62.28%" },
  ],
}));

function renderInRouter(component: React.ReactElement) {
  return render(<MemoryRouter>{component}</MemoryRouter>);
}

/* ─── HeroSection ────────────────────────────────── */
describe("HeroSection", () => {
  it("renders the project name in heading", () => {
    renderInRouter(<HeroSection />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("La Holanda");
  });

  it("renders the project type and developer", () => {
    renderInRouter(<HeroSection />);
    expect(screen.getByText(/Parcelación Campestre/)).toBeInTheDocument();
    expect(screen.getByText(/INGESOCC SAS/)).toBeInTheDocument();
  });

  it("renders the tagline", () => {
    renderInRouter(<HeroSection />);
    expect(
      screen.getByText("Donde la naturaleza se convierte en tu hogar"),
    ).toBeInTheDocument();
  });

  it("renders the location info", () => {
    renderInRouter(<HeroSection />);
    expect(screen.getByText(/Vía Quimbaya/)).toBeInTheDocument();
    expect(screen.getByText(/Quimbaya/)).toBeInTheDocument();
  });

  it("renders the CTA button linking to #lotes", () => {
    renderInRouter(<HeroSection />);
    const cta = screen.getByText("Conoce los lotes disponibles");
    expect(cta).toBeInTheDocument();
    expect(cta.closest("a")?.getAttribute("href")).toBe("#lotes");
  });

  it("renders the hero image with descriptive alt text", () => {
    renderInRouter(<HeroSection />);
    const img = screen.getByAltText(/Vista aérea espectacular/);
    expect(img).toBeInTheDocument();
    expect(img.getAttribute("src")).toContain("res.cloudinary.com");
  });
});

/* ─── ProcessSteps ───────────────────────────────── */
describe("ProcessSteps", () => {
  it("renders the section heading", () => {
    renderInRouter(<ProcessSteps />);
    expect(
      screen.getByRole("heading", { name: /Cómo funciona/i }),
    ).toBeInTheDocument();
  });

  it("renders the section description", () => {
    renderInRouter(<ProcessSteps />);
    expect(
      screen.getByText("Un proceso simple y transparente para construir tu santuario."),
    ).toBeInTheDocument();
  });

  it("renders all 3 steps", () => {
    renderInRouter(<ProcessSteps />);
    expect(screen.getByText("1. Compra tu lote")).toBeInTheDocument();
    expect(screen.getByText("2. Diseño")).toBeInTheDocument();
    expect(screen.getByText("3. Construcción")).toBeInTheDocument();
  });

  it("renders each step description", () => {
    renderInRouter(<ProcessSteps />);
    expect(
      screen.getByText(/precio especial por pago de contado/),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/diseño personalizado acorde a tus necesidades/),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/construye con nosotros/),
    ).toBeInTheDocument();
  });

  it("renders each step title as a heading level 3", () => {
    renderInRouter(<ProcessSteps />);
    const headings = screen.getAllByRole("heading", { level: 3 });
    expect(headings).toHaveLength(3);
  });
});

/* ─── ProjectBenefits ────────────────────────────── */
describe("ProjectBenefits", () => {
  it("renders the section with id='lotes'", () => {
    const { container } = renderInRouter(<ProjectBenefits />);
    const section = container.querySelector("#lotes");
    expect(section).toBeTruthy();
  });

  it("renders the main heading", () => {
    renderInRouter(<ProjectBenefits />);
    expect(
      screen.getByRole("heading", { name: /Todo incluido en tu inversión/i }),
    ).toBeInTheDocument();
  });

  it("renders the 'Incluye' card with heading", () => {
    renderInRouter(<ProjectBenefits />);
    expect(screen.getByText("Incluye")).toBeInTheDocument();
  });

  it("renders the 'Servicios adicionales' card", () => {
    renderInRouter(<ProjectBenefits />);
    expect(screen.getByText("Servicios adicionales")).toBeInTheDocument();
  });

  it("renders purchase includes items from project constants", () => {
    renderInRouter(<ProjectBenefits />);
    expect(screen.getByText("Escritura pública individual")).toBeInTheDocument();
    expect(screen.getByText("Diseño arquitectónico tipo incluido")).toBeInTheDocument();
  });

  it("renders construction services items", () => {
    renderInRouter(<ProjectBenefits />);
    expect(screen.getByText("Diseño arquitectónico personalizado")).toBeInTheDocument();
    expect(screen.getByText("Estudios, trámites y licencias de construcción")).toBeInTheDocument();
    expect(screen.getByText("Presupuesto y programación")).toBeInTheDocument();
    expect(screen.getByText("Construcción")).toBeInTheDocument();
    expect(screen.getByText("Entrega de la vivienda")).toBeInTheDocument();
  });
});

/* ─── MasterPlanSection ──────────────────────────── */
describe("MasterPlanSection", () => {
  it("renders the section heading", () => {
    renderInRouter(<MasterPlanSection />);
    expect(
      screen.getByRole("heading", { name: /Plano General/i }),
    ).toBeInTheDocument();
  });

  it("renders the description", () => {
    renderInRouter(<MasterPlanSection />);
    expect(
      screen.getByText("Explora la distribución de nuestro proyecto y encuentra tu lote ideal."),
    ).toBeInTheDocument();
  });

  it("renders the master plan image with descriptive alt text", () => {
    renderInRouter(<MasterPlanSection />);
    const img = screen.getByAltText(
      /Vista aérea del plano general de la parcelación/,
    );
    expect(img).toBeInTheDocument();
  });

  it("renders lot markers as links to /projects/:id", () => {
    renderInRouter(<MasterPlanSection />);
    const lot01 = screen.getByRole("link", { name: /Lote 01/i });
    expect(lot01).toBeInTheDocument();
    expect(lot01).toHaveAttribute("href", "/projects/01");

    const lot02 = screen.getByRole("link", { name: /Lote 02/i });
    expect(lot02).toBeInTheDocument();
    expect(lot02).toHaveAttribute("href", "/projects/02");
  });

  it("renders the 'Límite de lote' legend", () => {
    renderInRouter(<MasterPlanSection />);
    expect(screen.getByText("Límite de lote")).toBeInTheDocument();
  });

  it("skips lots without markers (no marker found = no link rendered)", () => {
    renderInRouter(<MasterPlanSection />);
    // Lote 99 is in the mock but has no marker in lotMarkers mock
    // It should not render a link
    expect(screen.queryByRole("link", { name: /Lote 99/i })).toBeNull();
    // Lots 01 and 02 with markers should still render
    expect(screen.getByRole("link", { name: /Lote 01/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Lote 02/i })).toBeInTheDocument();
  });
});

/* ─── InvestmentComparison ───────────────────────── */
describe("InvestmentComparison", () => {
  it("renders the main heading", () => {
    renderInRouter(<InvestmentComparison />);
    expect(
      screen.getByRole("heading", { name: /Comparación de Inversión Inteligente/i }),
    ).toBeInTheDocument();
  });

  it("renders the subheading", () => {
    renderInRouter(<InvestmentComparison />);
    expect(
      screen.getByText("Vea por qué la tierra rural supera la densidad urbana."),
    ).toBeInTheDocument();
  });

  it("renders the urban property card", () => {
    renderInRouter(<InvestmentComparison />);
    expect(
      screen.getByText("Propiedad en Zona Urbana"),
    ).toBeInTheDocument();
  });

  it("renders the rural lot card", () => {
    renderInRouter(<InvestmentComparison />);
    expect(
      screen.getByText("Lote Rural en el Quindío"),
    ).toBeInTheDocument();
  });

  it("renders the 'Recomendado' badge", () => {
    renderInRouter(<InvestmentComparison />);
    expect(screen.getByText("Recomendado")).toBeInTheDocument();
  });

  it("renders city downsides", () => {
    renderInRouter(<InvestmentComparison />);
    expect(screen.getByText("Alto Costo por m²")).toBeInTheDocument();
    expect(screen.getByText("Altos Costos de Administración")).toBeInTheDocument();
    expect(screen.getByText("Apreciación Moderada")).toBeInTheDocument();
  });

  it("renders rural benefits", () => {
    renderInRouter(<InvestmentComparison />);
    expect(screen.getByText("Punto de Entrada Accesible")).toBeInTheDocument();
    expect(screen.getByText("Cero Administración / Mantenimiento")).toBeInTheDocument();
    expect(screen.getByText("Alto Potencial de Apreciación")).toBeInTheDocument();
    expect(screen.getByText("Listo para Ingresos Pasivos")).toBeInTheDocument();
  });
});
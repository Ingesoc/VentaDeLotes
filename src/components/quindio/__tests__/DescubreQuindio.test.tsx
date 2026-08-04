import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import QuindioHero from "../QuindioHero";
import CulturalHeritage from "../CulturalHeritage";
import NaturalWonders from "../NaturalWonders";
import RuralLifestyle from "../RuralLifestyle";
import QuindioParks from "../QuindioParks";
import FinalCTA from "../FinalCTA";

// Mock cloudinary
vi.mock("@/lib/cloudinary", () => ({
  cldUrl: (url: string) => url,
  CLD_WIDTHS: { HERO: 1920, CAROUSEL: 1200, MASTERPLAN: 1280, LARGE: 1000, CARD: 800, THUMB: 400, LOGO: 200 },
}));

function renderInRouter(component: React.ReactElement) {
  return render(<MemoryRouter>{component}</MemoryRouter>);
}

/* ─── QuindioHero ─────────────────────────────── */
describe("QuindioHero", () => {
  it("renders the destination badge", () => {
    renderInRouter(<QuindioHero />);
    expect(screen.getByText("Destino: Quindío")).toBeInTheDocument();
  });

  it("renders the main heading", () => {
    renderInRouter(<QuindioHero />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "El Corazón del Paisaje Cafetero",
    );
  });

  it("renders the description text", () => {
    renderInRouter(<QuindioHero />);
    expect(
      screen.getByText(/Descubre un santuario donde la arquitectura/),
    ).toBeInTheDocument();
  });

  it("renders the CTA link with correct href", () => {
    renderInRouter(<QuindioHero />);
    const cta = screen.getByText("Explorar Regiones");
    expect(cta).toBeInTheDocument();
    expect(cta.closest("a")?.getAttribute("href")).toBe("#explore");
  });

  it("has aria-accessible structure", () => {
    renderInRouter(<QuindioHero />);
    const headings = screen.getAllByRole("heading");
    expect(headings.length).toBeGreaterThanOrEqual(1);
  });
});

/* ─── CulturalHeritage ─────────────────────────── */
describe("CulturalHeritage", () => {
  it("renders the section with id='explore'", () => {
    const { container } = renderInRouter(<CulturalHeritage />);
    const section = container.querySelector("#explore");
    expect(section).toBeTruthy();
  });

  it("renders the main heading", () => {
    renderInRouter(<CulturalHeritage />);
    expect(
      screen.getByRole("heading", { name: /Herencia Cultural/i }),
    ).toBeInTheDocument();
  });

  it("renders the description paragraph", () => {
    renderInRouter(<CulturalHeritage />);
    expect(
      screen.getByText(/Quimbaya es más que un lugar/),
    ).toBeInTheDocument();
  });

  it("renders the 'Vive Quimbaya' tagline", () => {
    renderInRouter(<CulturalHeritage />);
    expect(screen.getByText("Vive Quimbaya")).toBeInTheDocument();
  });

  it("renders two image captions", () => {
    renderInRouter(<CulturalHeritage />);
    expect(
      screen.getByText("Festival de Velas y Faroles"),
    ).toBeInTheDocument();
    expect(screen.getByText("Legado Arriero")).toBeInTheDocument();
  });

  it("renders images with correct alt text", () => {
    renderInRouter(<CulturalHeritage />);
    const farolesImg = screen.getByAltText("Festival de Faroles");
    expect(farolesImg).toBeInTheDocument();
    const arrierosImg = screen.getByAltText("Arrieros traditions");
    expect(arrierosImg).toBeInTheDocument();
  });
});

/* ─── NaturalWonders ───────────────────────────── */
describe("NaturalWonders", () => {
  it("renders the main heading", () => {
    renderInRouter(<NaturalWonders />);
    expect(
      screen.getByRole("heading", { name: /Maravillas Naturales/i }),
    ).toBeInTheDocument();
  });

  it("renders the subheading", () => {
    renderInRouter(<NaturalWonders />);
    expect(
      screen.getByText(/Estratégicamente ubicado/),
    ).toBeInTheDocument();
  });

  it("renders both location cards", () => {
    renderInRouter(<NaturalWonders />);
    expect(screen.getByText("Vistas Icónicas")).toBeInTheDocument();
    expect(screen.getByText("Vida Local")).toBeInTheDocument();
  });

  it("renders images with correct alt text", () => {
    renderInRouter(<NaturalWonders />);
    expect(screen.getByAltText("Local viewpoint")).toBeInTheDocument();
    expect(screen.getByAltText("I Love Quimbaya square")).toBeInTheDocument();
  });
});

/* ─── RuralLifestyle ───────────────────────────── */
describe("RuralLifestyle", () => {
  it("renders the main heading", () => {
    renderInRouter(<RuralLifestyle />);
    expect(
      screen.getByRole("heading", { name: /Serenidad y Conectividad/i }),
    ).toBeInTheDocument();
  });

  it("renders the description text", () => {
    renderInRouter(<RuralLifestyle />);
    expect(
      screen.getByText(/Experimenta el verdadero significado/),
    ).toBeInTheDocument();
  });

  it("renders the feature badges", () => {
    renderInRouter(<RuralLifestyle />);
    expect(screen.getByText("Acceso Fluido")).toBeInTheDocument();
    expect(screen.getByText("Seguridad Privada")).toBeInTheDocument();
  });

  it("renders images with correct alt text", () => {
    renderInRouter(<RuralLifestyle />);
    expect(screen.getByAltText("Hacienda aerial view")).toBeInTheDocument();
    expect(screen.getByAltText("Rural roads")).toBeInTheDocument();
  });
});

/* ─── QuindioParks ─────────────────────────────── */
describe("QuindioParks", () => {
  beforeAll(() => {
    // Embla requiere ResizeObserver y matchMedia, que no existen en jsdom
    vi.stubGlobal(
      "ResizeObserver",
      class {
        observe() {}
        unobserve() {}
        disconnect() {}
      },
    );
    vi.stubGlobal(
      "matchMedia",
      (query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => false,
      }),
    );
    vi.stubGlobal(
      "IntersectionObserver",
      class {
        observe() {}
        unobserve() {}
        disconnect() {}
        takeRecords() {
          return [];
        }
      },
    );
  });

  afterAll(() => {
    vi.unstubAllGlobals();
  });

  it("renders the main heading", () => {
    renderInRouter(<QuindioParks />);
    expect(
      screen.getByRole("heading", { name: /Parques y Atractivos del Quindío/i }),
    ).toBeInTheDocument();
  });

  it("renders the description", () => {
    renderInRouter(<QuindioParks />);
    expect(
      screen.getByText(/A minutos de tu lote/),
    ).toBeInTheDocument();
  });

  it("renders the park slides", () => {
    renderInRouter(<QuindioParks />);
    expect(screen.getByText("Parque Nacional del Café")).toBeInTheDocument();
    expect(screen.getByText("Valle del Cocora")).toBeInTheDocument();
    expect(screen.getByText("Panaca")).toBeInTheDocument();
    expect(screen.getByText("RECUCA")).toBeInTheDocument();
    expect(screen.getByText("Parque de los Arrieros")).toBeInTheDocument();
  });

  it("renders the navigation arrows", () => {
    renderInRouter(<QuindioParks />);
    expect(
      screen.getByRole("button", { name: /anterior/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /siguiente/i }),
    ).toBeInTheDocument();
  });
});

/* ─── FinalCTA ─────────────────────────────────── */
describe("FinalCTA", () => {
  it("renders the main heading", () => {
    renderInRouter(<FinalCTA />);
    expect(
      screen.getByRole("heading", { name: /Sé parte de este paraíso/i }),
    ).toBeInTheDocument();
  });

  it("renders the description text", () => {
    renderInRouter(<FinalCTA />);
    expect(
      screen.getByText(/Invierte en tu futuro hogar/),
    ).toBeInTheDocument();
  });

  it("renders the 'Ver Lotes' link to /projects", () => {
    renderInRouter(<FinalCTA />);
    const link = screen.getByText("Ver Lotes");
    expect(link).toBeInTheDocument();
    expect(link.closest("a")?.getAttribute("href")).toBe("/projects");
  });

  it("renders the 'Hablar con un Agente' link to WhatsApp", () => {
    renderInRouter(<FinalCTA />);
    const link = screen.getByText("Hablar con un Agente");
    expect(link).toBeInTheDocument();
    expect(link.closest("a")?.getAttribute("href")).toBe(
      "https://wa.me/573127370811",
    );
    expect(link.closest("a")?.getAttribute("target")).toBe("_blank");
  });
});

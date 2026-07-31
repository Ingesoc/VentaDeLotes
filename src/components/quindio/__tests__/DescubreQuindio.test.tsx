import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import QuindioHero from "../QuindioHero";
import CulturalHeritage from "../CulturalHeritage";
import NaturalWonders from "../NaturalWonders";
import RuralLifestyle from "../RuralLifestyle";
import WellnessSection from "../WellnessSection";
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

/* ─── WellnessSection ──────────────────────────── */
describe("WellnessSection", () => {
  it("renders the main heading", () => {
    renderInRouter(<WellnessSection />);
    expect(
      screen.getByRole("heading", { name: /Bienestar y Recreación/i }),
    ).toBeInTheDocument();
  });

  it("renders the description", () => {
    renderInRouter(<WellnessSection />);
    expect(
      screen.getByText(/Nuestras comodidades de estilo de vida/),
    ).toBeInTheDocument();
  });

  it("renders amenity cards", () => {
    renderInRouter(<WellnessSection />);
    expect(
      screen.getByText("Piscinas de Nivel Olímpico"),
    ).toBeInTheDocument();
    expect(screen.getByText("Senderos Ecológicos")).toBeInTheDocument();
  });

  it("renders amenity descriptions", () => {
    renderInRouter(<WellnessSection />);
    expect(
      screen.getByText("Aguas cristalinas rodeadas de jardines nativos."),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Millas de senderos privados a través del bosque cafetero.",
      ),
    ).toBeInTheDocument();
  });

  it("renders the floating card with 'Lujo Moderno'", () => {
    renderInRouter(<WellnessSection />);
    expect(screen.getByText("Lujo Moderno")).toBeInTheDocument();
  });

  it("renders the pool image with correct alt text", () => {
    renderInRouter(<WellnessSection />);
    expect(screen.getByAltText("Luxury pool area")).toBeInTheDocument();
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

  it("renders the 'Ver Proyectos' link to /projects", () => {
    renderInRouter(<FinalCTA />);
    const link = screen.getByText("Ver Proyectos");
    expect(link).toBeInTheDocument();
    expect(link.closest("a")?.getAttribute("href")).toBe("/projects");
  });

  it("renders the 'Hablar con un Agente' link to /#contacto", () => {
    renderInRouter(<FinalCTA />);
    const link = screen.getByText("Hablar con un Agente");
    expect(link).toBeInTheDocument();
    expect(link.closest("a")?.getAttribute("href")).toBe("/#contacto");
  });
});

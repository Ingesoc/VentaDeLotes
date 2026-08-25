import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { LotGallery } from "../LotGallery";
import type { Lot } from "@/constants/lots";

function createMockLot(overrides: Partial<Lot> = {}): Lot {
  return {
    id: "02",
    areaM2: 2008,
    price: 189242850,
    status: "disponible",
    aerialImage: "https://res.cloudinary.com/test/aerial.jpg",
    perspectiveImage: "https://res.cloudinary.com/test/perspective.jpg",
    ...overrides,
  };
}

function renderWithRouter(ui: React.ReactElement) {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
}

describe("LotGallery", () => {
  describe("empty state (lot sin imágenes)", () => {
    it("muestra placeholder cuando no hay ninguna imagen", () => {
      const lot = createMockLot({
        aerialImage: "",
        perspectiveImage: "",
      });
      renderWithRouter(<LotGallery lot={lot} />);
      expect(
        screen.getByText(/Fotos del Lote 02 próximamente/),
      ).toBeInTheDocument();
    });

    it("muestra CTA de contacto en el empty state", () => {
      const lot = createMockLot({
        aerialImage: "",
        perspectiveImage: "",
      });
      renderWithRouter(<LotGallery lot={lot} />);
      const cta = screen.getByRole("link", { name: /Contactar al equipo/ });
      expect(cta).toBeInTheDocument();
      expect(cta).toHaveAttribute("href", "/contact");
    });

    it("no muestra imágenes cuando el lote no tiene ninguna", () => {
      const lot = createMockLot({
        aerialImage: "",
        perspectiveImage: "",
      });
      renderWithRouter(<LotGallery lot={lot} />);
      expect(screen.queryAllByRole("img")).toHaveLength(0);
    });
  });

  describe("con imágenes", () => {
    it("muestra la vista aérea como imagen principal", () => {
      renderWithRouter(<LotGallery lot={createMockLot()} />);
      const img = screen.getByAltText(/Vista Aérea del Lote 02/);
      expect(img).toBeInTheDocument();
    });

    it("muestra la vista en perspectiva como segunda vista", () => {
      renderWithRouter(<LotGallery lot={createMockLot()} />);
      const img = screen.getByAltText(/Vista en Perspectiva del Lote 02/);
      expect(img).toBeInTheDocument();
    });

    it("muestra las fotos adicionales del lote", () => {
      const lot = createMockLot({
        images: [
          "https://res.cloudinary.com/test/extra-1.jpg",
          "https://res.cloudinary.com/test/extra-2.jpg",
        ],
      });
      renderWithRouter(<LotGallery lot={lot} />);
      expect(screen.getByAltText(/Foto 1 del Lote 02/)).toBeInTheDocument();
      expect(screen.getByAltText(/Foto 2 del Lote 02/)).toBeInTheDocument();
    });

    it("renderiza botones de selección para cada vista", () => {
      renderWithRouter(<LotGallery lot={createMockLot()} />);
      expect(
        screen.getByRole("button", { name: /Ver vista aérea/i }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /Ver vista en perspectiva/i }),
      ).toBeInTheDocument();
    });

    it("cambia la vista activa al hacer clic en un botón de thumbnail", () => {
      renderWithRouter(<LotGallery lot={createMockLot()} />);
      const perspectivaBtn = screen.getByRole("button", {
        name: /Ver vista en perspectiva/i,
      });
      fireEvent.click(perspectivaBtn);
      expect(perspectivaBtn).toHaveAttribute("aria-pressed", "true");
    });

    it("no duplica vistas con la misma URL", () => {
      const lot = createMockLot({
        aerialImage: "https://res.cloudinary.com/test/same.jpg",
        perspectiveImage: "https://res.cloudinary.com/test/same.jpg",
      });
      renderWithRouter(<LotGallery lot={lot} />);
      // Solo debe haber un botón de thumbnail (deduplicado)
      const thumbnails = screen.getAllByRole("button", {
        name: /Ver vista/i,
      });
      expect(thumbnails).toHaveLength(1);
    });
  });

  describe("lote sin imágenes personalizadas (solo base)", () => {
    it("muestra solo las vistas base (aérea y perspectiva)", () => {
      renderWithRouter(<LotGallery lot={createMockLot()} />);
      const thumbnails = screen.getAllByRole("button", {
        name: /Ver vista/i,
      });
      expect(thumbnails).toHaveLength(2);
    });
  });
});

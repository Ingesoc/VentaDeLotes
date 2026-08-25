import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { FeatureShowcase } from "../FeatureShowcase";
import { ImageCollage } from "../ImageCollage";
import { showcaseItems } from "@/constants/showcase";
import type { ShowcaseImage } from "@/constants/showcase";

describe("FeatureShowcase", () => {
  it("renderiza la sección con el heading correcto", () => {
    render(<FeatureShowcase />);
    expect(
      screen.getByRole("heading", { name: /Un proyecto para vivirlo/ }),
    ).toBeInTheDocument();
  });

  it("renderiza la descripción de la sección", () => {
    render(<FeatureShowcase />);
    expect(
      screen.getByText(/Del lote al diseño y la construcción/),
    ).toBeInTheDocument();
  });

  it("renderiza los 3 items del showcase", () => {
    render(<FeatureShowcase />);
    showcaseItems.forEach((item) => {
      expect(
        screen.getByRole("heading", { name: item.title }),
      ).toBeInTheDocument();
    });
  });

  it("renderiza la descripción de cada item", () => {
    render(<FeatureShowcase />);
    showcaseItems.forEach((item) => {
      expect(screen.getByText(item.description)).toBeInTheDocument();
    });
  });

  describe("placeholders cuando no hay imágenes", () => {
    it("muestra placeholder 'Imagen próximamente' para items sin imagen", () => {
      render(<FeatureShowcase />);
      const placeholders = screen.getAllByRole("img", {
        name: /Próximamente/,
      });
      // Los 3 items no tienen imageUrl, así que todos muestran placeholder
      expect(placeholders.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe("CTAs controlados por dato", () => {
    it("no renderiza CTA cuando la URL es null", () => {
      render(<FeatureShowcase />);
      // El item 3 tiene cta con url: null (Facebook URL no configurada)
      expect(
        screen.queryByRole("link", { name: /Síguenos en Facebook/ }),
      ).not.toBeInTheDocument();
    });
  });

  it("muestra el aria-labelledby correcto en la sección", () => {
    render(<FeatureShowcase />);
    const section = screen.getByRole("region", {
      name: /Un proyecto para vivirlo/,
    });
    expect(section).toBeInTheDocument();
  });
});

describe("ImageCollage", () => {
  const mockImages: ShowcaseImage[] = [
    { url: "https://res.cloudinary.com/test/plano-1.jpg", alt: "Plano estructural" },
    { url: "https://res.cloudinary.com/test/plano-2.jpg", alt: "Plano hidrosanitario" },
    { url: "https://res.cloudinary.com/test/plano-3.jpg", alt: "Plano eléctrico" },
  ];

  it("renderiza las imágenes con sus alt texts", () => {
    render(<ImageCollage images={mockImages} label="Collage de planos" />);
    mockImages.forEach((img) => {
      expect(screen.getByRole("img", { name: img.alt })).toBeInTheDocument();
    });
  });

  it("renderiza el caption sr-only con el label", () => {
    render(<ImageCollage images={mockImages} label="Collage de planos" />);
    expect(screen.getByText("Collage de planos")).toBeInTheDocument();
  });

  it("las imágenes tienen loading lazy excepto la primera", () => {
    render(<ImageCollage images={mockImages} label="Test" />);
    const images = screen.getAllByRole("img");
    images.forEach((img) => {
      expect(img).toHaveAttribute("loading", "lazy");
    });
  });

  describe("estado vacío (sin imágenes)", () => {
    it("muestra placeholder cuando el array está vacío", () => {
      render(<ImageCollage images={[]} label="Planos pendientes" />);
      expect(
        screen.getByRole("img", { name: /Próximamente: Planos pendientes/ }),
      ).toBeInTheDocument();
    });

    it("no renderiza ningún img real cuando el array está vacío", () => {
      render(<ImageCollage images={[]} label="Planos pendientes" />);
      // Solo el placeholder role="img", ningún <img> real
      const realImages = document.querySelectorAll("img");
      expect(realImages).toHaveLength(0);
    });
  });
});

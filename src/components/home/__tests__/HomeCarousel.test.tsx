import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import HomeCarousel from "../HomeCarousel";

// Mocks de Embla: el carrusel real requiere ResizeObserver/matchMedia que no
// existen en jsdom. Con el mock, el render de los slides es determinista y sin
// timers de autoplay (que harían el test flaky).
type AutoplayMock = { stop: ReturnType<typeof vi.fn>; play: ReturnType<typeof vi.fn> };

const { autoplayInstances } = vi.hoisted(() => ({
  autoplayInstances: [] as AutoplayMock[],
}));

vi.mock("embla-carousel-react", () => ({
  __esModule: true,
  default: () => [() => {}, { on: vi.fn(), off: vi.fn() }],
}));

vi.mock("embla-carousel-autoplay", () => ({
  __esModule: true,
  default: () => {
    const instance: AutoplayMock = { stop: vi.fn(), play: vi.fn() };
    autoplayInstances.push(instance);
    return instance;
  },
}));

vi.mock("@/lib/cloudinary", () => ({
  cldUrl: (url: string) => url,
  CLD_WIDTHS: { CAROUSEL: 1200 },
}));

function renderCarousel() {
  return render(
    <MemoryRouter>
      <HomeCarousel />
    </MemoryRouter>,
  );
}

describe("HomeCarousel", () => {
  it("no incluye el video aéreo (vive en AerialVideoSection)", () => {
    renderCarousel();
    expect(
      screen.queryByRole("button", { name: /Reproducir video/i }),
    ).not.toBeInTheDocument();
    expect(document.querySelector("iframe")).not.toBeInTheDocument();
  });

  it("mantiene las diapositivas turísticas originales", () => {
    renderCarousel();
    expect(screen.getByText("Festival de Velas y Faroles")).toBeInTheDocument();
    expect(screen.getByText("Legado y Tradición Arriera")).toBeInTheDocument();
    expect(screen.getByText("Paisaje Cultural Cafetero")).toBeInTheDocument();
    expect(screen.getByText("Bienestar en el Paraíso")).toBeInTheDocument();
  });

  it("configura autoplay con reanudación tras interacción", () => {
    renderCarousel();
    const autoplay = autoplayInstances.at(-1);
    // stopOnInteraction: false → el carrusel se reanuda solo tras un arrastre.
    expect(autoplay).toBeDefined();
  });

  it("cada diapositiva enlaza a Descubre Quindío", () => {
    renderCarousel();
    const links = screen.getAllByRole("link", { name: /Conocer Más/i });
    links.forEach((link) => {
      expect(link).toHaveAttribute("href", "/descubre-quindio");
    });
  });

  it("las imágenes de las diapositivas cargan de forma perezosa con alt descriptivo", () => {
    renderCarousel();
    const images = screen.getAllByRole("img");
    expect(images.length).toBeGreaterThanOrEqual(4);
    images.forEach((img) => {
      expect(img.getAttribute("loading")).toBe("lazy");
      expect(img.getAttribute("alt")).not.toBe("");
    });
  });
});

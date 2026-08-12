import { afterEach, describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import HomeCarousel from "../HomeCarousel";

const RESUME_DELAY_MS = 15000;

afterEach(() => {
  // Los tests del timeout usan fake timers; restaurar siempre por seguridad.
  vi.useRealTimers();
});

// Mocks de Embla: el carrusel real requiere ResizeObserver/matchMedia que no
// existen en jsdom. Con el mock, el render de los slides es determinista y sin
// timers de autoplay (que harían el test flaky).
type AutoplayMock = { stop: ReturnType<typeof vi.fn>; play: ReturnType<typeof vi.fn> };
type EmblaApiMock = {
  on: ReturnType<typeof vi.fn<(event: string, cb: () => void) => void>>;
  off: ReturnType<typeof vi.fn>;
  selectedScrollSnap: ReturnType<typeof vi.fn<() => number>>;
};

const { autoplayInstances, emblaApis } = vi.hoisted(() => {
  const autoplayInstances: AutoplayMock[] = [];
  const emblaApis: EmblaApiMock[] = [];
  return { autoplayInstances, emblaApis };
});

vi.mock("embla-carousel-react", () => ({
  __esModule: true,
  default: () => {
    const api: EmblaApiMock = {
      on: vi.fn(),
      off: vi.fn(),
      selectedScrollSnap: vi.fn(() => 0),
    };
    emblaApis.push(api);
    return [() => {}, api];
  },
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

/** Devuelve el handler registrado para un evento del mock de Embla. */
function getHandler(api: EmblaApiMock, event: string) {
  return api.on.mock.calls.find(([e]) => e === event)?.[1];
}

describe("HomeCarousel", () => {
  it("muestra el video de YouTube como primera diapositiva", () => {
    renderCarousel();
    expect(
      screen.getByRole("button", { name: /Reproducir video/i }),
    ).toBeInTheDocument();
    // La primera imagen del DOM es la miniatura del video
    const firstImg = document.querySelector("img");
    expect(firstImg?.getAttribute("src")).toContain("N7LYM3pt_hg");
  });

  it("no carga el iframe hasta hacer clic en play (carga perezosa)", () => {
    renderCarousel();
    expect(document.querySelector("iframe")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /Reproducir video/i }));
    expect(document.querySelector("iframe")).toBeInTheDocument();
  });

  it("monta el video con autoplay silenciado (autoplay=1&mute=1)", () => {
    renderCarousel();

    fireEvent.click(screen.getByRole("button", { name: /Reproducir video/i }));
    const src = document.querySelector("iframe")?.getAttribute("src");
    expect(src).toContain("autoplay=1");
    expect(src).toContain("mute=1");
    expect(src).toContain("youtube-nocookie.com/embed/N7LYM3pt_hg");
  });

  it("ofrece el botón de activar sonido en el video silenciado", () => {
    renderCarousel();

    fireEvent.click(screen.getByRole("button", { name: /Reproducir video/i }));
    expect(
      screen.getByRole("button", { name: "Activar sonido" }),
    ).toBeInTheDocument();
  });

  it("pausa el autoplay mientras el slide del video está visible", () => {
    renderCarousel();
    const autoplay = autoplayInstances.at(-1);
    // Al abrir la Home (slide 0 = video) el autoplay queda detenido
    expect(autoplay?.stop).toHaveBeenCalled();
    expect(autoplay?.play).not.toHaveBeenCalled();
  });

  it("reanuda el autoplay al pasar a otro slide", () => {
    renderCarousel();
    const autoplay = autoplayInstances.at(-1);
    const api = emblaApis.at(-1)!;

    // Simula que el usuario se mueve al slide 1 (imagen) → autoplay se reanuda
    api.selectedScrollSnap.mockReturnValue(1);
    getHandler(api, "select")?.();
    expect(autoplay?.play).toHaveBeenCalled();

    // Y se vuelve a pausar cuando regresa al slide del video
    api.selectedScrollSnap.mockReturnValue(0);
    getHandler(api, "select")?.();
    expect(autoplay?.play).toHaveBeenCalledTimes(1);
  });

  it("reanuda el autoplay tras una interacción (pointerUp) en un slide de imagen", () => {
    renderCarousel();
    const autoplay = autoplayInstances.at(-1);
    const api = emblaApis.at(-1)!;

    api.selectedScrollSnap.mockReturnValue(1);
    getHandler(api, "pointerUp")?.();
    expect(autoplay?.play).toHaveBeenCalled();
  });

  it("detiene el autoplay al reproducir el video", () => {
    renderCarousel();
    const autoplay = autoplayInstances.at(-1);
    autoplay?.stop.mockClear(); // limpiar la llamada de pausa inicial

    fireEvent.click(screen.getByRole("button", { name: /Reproducir video/i }));
    expect(autoplay?.stop).toHaveBeenCalledTimes(1);
  });

  it("reanuda el autoplay tras 15s sin interacción en el slide del video", () => {
    vi.useFakeTimers();
    renderCarousel();
    const autoplay = autoplayInstances.at(-1);
    autoplay?.play.mockClear();

    // Aún no ha pasado el tiempo suficiente
    vi.advanceTimersByTime(RESUME_DELAY_MS - 1000);
    expect(autoplay?.play).not.toHaveBeenCalled();

    // Pasados los 15s se reanuda el autoplay
    vi.advanceTimersByTime(1000);
    expect(autoplay?.play).toHaveBeenCalledTimes(1);
  });

  it("no reanuda el autoplay si el video está reproduciéndose", () => {
    vi.useFakeTimers();
    renderCarousel();
    const autoplay = autoplayInstances.at(-1);

    // Reproducir el video cancela el temporizador
    fireEvent.click(screen.getByRole("button", { name: /Reproducir video/i }));
    vi.advanceTimersByTime(RESUME_DELAY_MS * 2);
    expect(autoplay?.play).not.toHaveBeenCalled();
  });

  it("no reanuda el autoplay si el carrusel ya no está en el slide del video", () => {
    vi.useFakeTimers();
    renderCarousel();
    const autoplay = autoplayInstances.at(-1);
    const api = emblaApis.at(-1)!;

    // El usuario se mueve al slide 1 antes de que pase el tiempo
    api.selectedScrollSnap.mockReturnValue(1);
    getHandler(api, "select")?.();
    vi.advanceTimersByTime(RESUME_DELAY_MS * 2);
    expect(autoplay?.play).toHaveBeenCalledTimes(1); // solo la reanudación al cambiar de slide
  });

  it("mantiene las diapositivas turísticas originales", () => {
    renderCarousel();
    expect(screen.getByText("Festival de Velas y Faroles")).toBeInTheDocument();
    expect(screen.getByText("Legado y Tradición Arriera")).toBeInTheDocument();
    expect(screen.getByText("Paisaje Cultural Cafetero")).toBeInTheDocument();
    expect(screen.getByText("Bienestar en el Paraíso")).toBeInTheDocument();
  });
});

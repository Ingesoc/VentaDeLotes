import { afterEach, describe, it, expect, vi } from "vitest";
import { act, render, screen, fireEvent } from "@testing-library/react";
import { YouTubeVideo } from "../YouTubeVideo";

const VIDEO_ID = "hT4bLxh-8uo";
const TITLE = "Video promocional de La Holanda";

function renderVideo(props: Partial<React.ComponentProps<typeof YouTubeVideo>> = {}) {
  return render(
    <YouTubeVideo videoId={props.videoId ?? VIDEO_ID} title={props.title ?? TITLE} {...props} />,
  );
}

function clickPlay() {
  fireEvent.click(screen.getByRole("button", { name: `Reproducir video: ${TITLE}` }));
}

describe("YouTubeVideo", () => {
  it("renders the play button with an accessible label", () => {
    renderVideo();
    expect(
      screen.getByRole("button", { name: `Reproducir video: ${TITLE}` }),
    ).toBeInTheDocument();
  });

  it("does not load the iframe initially (lazy click-to-load)", () => {
    renderVideo();
    expect(document.querySelector("iframe")).not.toBeInTheDocument();
  });

  it("renders the thumbnail image with lazy loading", () => {
    renderVideo();
    const img = document.querySelector("img");
    expect(img).toBeInTheDocument();
    expect(img?.getAttribute("src")).toContain(`/vi/${VIDEO_ID}/maxresdefault.jpg`);
    expect(img?.getAttribute("loading")).toBe("lazy");
  });

  it("falls back to hqdefault thumbnail when maxresdefault fails", () => {
    renderVideo();
    const img = document.querySelector("img")!;
    fireEvent.error(img);
    expect(img.getAttribute("src")).toContain(`/vi/${VIDEO_ID}/hqdefault.jpg`);
  });

  it("loads the iframe with nocookie domain and autoplay when clicked", () => {
    renderVideo();
    clickPlay();

    const iframe = document.querySelector("iframe");
    expect(iframe).toBeInTheDocument();
    expect(iframe?.getAttribute("src")).toContain(
      "https://www.youtube-nocookie.com/embed/hT4bLxh-8uo?autoplay=1",
    );
    expect(iframe?.getAttribute("allowfullscreen")).not.toBeNull();
    expect(iframe?.getAttribute("title")).toBe(TITLE);
  });

  it("does not mute the embed by default (autoplay prop off)", () => {
    renderVideo();
    clickPlay();

    const src = document.querySelector("iframe")?.getAttribute("src");
    expect(src).toContain("autoplay=1");
    expect(src).not.toContain("mute=");
    expect(src).toContain("rel=0");
    expect(src).toContain("playsinline=1");
  });

  it("adds autoplay=1&mute=1 to the embed URL when the autoplay prop is on", () => {
    renderVideo({ autoplay: true });
    clickPlay();

    const src = document.querySelector("iframe")?.getAttribute("src");
    expect(src).toContain("autoplay=1");
    expect(src).toContain("mute=1");
    expect(src).toContain("rel=0");
    expect(src).toContain("playsinline=1");
  });

  it("includes autoplay in the iframe allow policy", () => {
    renderVideo({ autoplay: true });
    clickPlay();

    const iframe = document.querySelector("iframe");
    expect(iframe?.getAttribute("allow")).toContain("autoplay");
  });

  it("shows the unmute button when autoplay is on", () => {
    renderVideo({ autoplay: true });
    clickPlay();
    expect(
      screen.getByRole("button", { name: "Activar sonido" }),
    ).toBeInTheDocument();
  });

  it("does not show the unmute button when autoplay is off", () => {
    renderVideo();
    clickPlay();
    expect(
      screen.queryByRole("button", { name: "Activar sonido" }),
    ).not.toBeInTheDocument();
  });

  it("unmutes the player via postMessage and toggles the label", () => {
    renderVideo({ autoplay: true });
    clickPlay();

    const iframe = document.querySelector("iframe") as HTMLIFrameElement;
    const postMessageSpy = vi.spyOn(iframe.contentWindow!, "postMessage");

    fireEvent.click(screen.getByRole("button", { name: "Activar sonido" }));

    expect(postMessageSpy).toHaveBeenCalledWith(
      JSON.stringify({ event: "command", func: "unMute", args: [] }),
      "https://www.youtube-nocookie.com",
    );
    // El botón ahora permite volver a silenciar
    expect(
      screen.getByRole("button", { name: "Silenciar" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Silenciar" }).getAttribute("aria-pressed"),
    ).toBe("true");
  });

  it("mutes the player again via postMessage", () => {
    renderVideo({ autoplay: true });
    clickPlay();

    const iframe = document.querySelector("iframe") as HTMLIFrameElement;
    const postMessageSpy = vi.spyOn(iframe.contentWindow!, "postMessage");

    fireEvent.click(screen.getByRole("button", { name: "Activar sonido" }));
    fireEvent.click(screen.getByRole("button", { name: "Silenciar" }));

    expect(postMessageSpy).toHaveBeenLastCalledWith(
      JSON.stringify({ event: "command", func: "mute", args: [] }),
      "https://www.youtube-nocookie.com",
    );
    expect(
      screen.getByRole("button", { name: "Activar sonido" }),
    ).toBeInTheDocument();
  });

  it("avisa onPlay al activar el sonido (pausa el carrusel) y no al silenciar", () => {
    const onPlay = vi.fn();
    renderVideo({ autoplay: true, onPlay });
    clickPlay();
    onPlay.mockClear(); // el clic en play ya avisó; medimos solo el desmutear

    fireEvent.click(screen.getByRole("button", { name: "Activar sonido" }));
    expect(onPlay).toHaveBeenCalledTimes(1);

    // Silenciar de nuevo no vuelve a avisar al contenedor
    fireEvent.click(screen.getByRole("button", { name: "Silenciar" }));
    expect(onPlay).toHaveBeenCalledTimes(1);
  });

  it("calls onPlay when the play button is clicked", () => {
    const onPlay = vi.fn();
    renderVideo({ onPlay });
    clickPlay();
    expect(onPlay).toHaveBeenCalledTimes(1);
  });

  it("has a 16:9 aspect ratio container", () => {
    const { container } = renderVideo();
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.className).toContain("aspect-video");
  });
});

// jsdom no implementa IntersectionObserver; este mock permite simular cuándo
// el video entra (o sale) del viewport para probar el autoplay automático.
class MockIntersectionObserver {
  static instances: MockIntersectionObserver[] = [];
  callback: IntersectionObserverCallback;

  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback;
    MockIntersectionObserver.instances.push(this);
  }

  observe() {}
  unobserve() {}
  disconnect() {}

  trigger(isIntersecting: boolean) {
    this.callback(
      [{ isIntersecting } as IntersectionObserverEntry],
      this as unknown as IntersectionObserver,
    );
  }
}

describe("YouTubeVideo autoplay automático", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    MockIntersectionObserver.instances.length = 0;
  });

  it("monta el iframe y arranca silenciado al entrar al viewport con autoplay", () => {
    vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);
    renderVideo({ autoplay: true });

    // Sin clic y antes de entrar al viewport: aún no se monta
    expect(document.querySelector("iframe")).not.toBeInTheDocument();

    act(() => {
      MockIntersectionObserver.instances[0].trigger(true);
    });

    const iframe = document.querySelector("iframe");
    expect(iframe).toBeInTheDocument();
    expect(iframe?.getAttribute("src")).toContain("autoplay=1&mute=1");
    expect(
      screen.getByRole("button", { name: "Activar sonido" }),
    ).toBeInTheDocument();
  });

  it("no registra el observador ni monta el iframe cuando autoplay está apagado", () => {
    vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);
    renderVideo();

    // Sin autoplay el componente no debe observar el viewport en absoluto
    expect(MockIntersectionObserver.instances).toHaveLength(0);
    expect(document.querySelector("iframe")).not.toBeInTheDocument();
  });

  it("no monta el iframe mientras el video no esté en el viewport", () => {
    vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);
    renderVideo({ autoplay: true });

    act(() => {
      MockIntersectionObserver.instances[0].trigger(false);
    });

    expect(document.querySelector("iframe")).not.toBeInTheDocument();
  });

  it("no invoca onPlay cuando el autoplay automático monta el reproductor", () => {
    vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);
    const onPlay = vi.fn();
    renderVideo({ autoplay: true, onPlay });

    act(() => {
      MockIntersectionObserver.instances[0].trigger(true);
    });

    expect(document.querySelector("iframe")).toBeInTheDocument();
    expect(onPlay).not.toHaveBeenCalled();
  });

  it("mantiene click-to-load si el navegador no soporta IntersectionObserver", () => {
    // Sin stubbing: jsdom no define IntersectionObserver → el guard del
    // componente conserva el flujo por clic sin romper el render.
    renderVideo({ autoplay: true });
    expect(document.querySelector("iframe")).not.toBeInTheDocument();

    clickPlay();
    expect(document.querySelector("iframe")).toBeInTheDocument();
  });
});

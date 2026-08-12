import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
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

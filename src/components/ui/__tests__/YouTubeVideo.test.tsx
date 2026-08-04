import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { YouTubeVideo } from "../YouTubeVideo";

const VIDEO_ID = "hT4bLxh-8uo";
const TITLE = "Video promocional de La Holanda";

function renderVideo(props: Partial<React.ComponentProps<typeof YouTubeVideo>> = {}) {
  return render(
    <YouTubeVideo videoId={props.videoId ?? VIDEO_ID} title={props.title ?? TITLE} {...props} />,
  );
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
    fireEvent.click(screen.getByRole("button", { name: `Reproducir video: ${TITLE}` }));

    const iframe = document.querySelector("iframe");
    expect(iframe).toBeInTheDocument();
    expect(iframe?.getAttribute("src")).toContain(
      "https://www.youtube-nocookie.com/embed/hT4bLxh-8uo?autoplay=1",
    );
    expect(iframe?.getAttribute("allowfullscreen")).not.toBeNull();
    expect(iframe?.getAttribute("title")).toBe(TITLE);
  });

  it("has a 16:9 aspect ratio container", () => {
    const { container } = renderVideo();
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.className).toContain("aspect-video");
  });
});

import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { LazyImage } from "../LazyImage";

const TEST_IMG = "https://example.com/image.jpg";
const TEST_ALT = "Descripción de la imagen";

function renderLazyImage(props: Partial<React.ComponentProps<typeof LazyImage>> = {}) {
  return render(
    <LazyImage src={props.src ?? TEST_IMG} alt={props.alt ?? TEST_ALT} {...props} />,
  );
}

describe("LazyImage", () => {
  it("renders the image with the provided src", () => {
    renderLazyImage();
    const img = screen.getByAltText(TEST_ALT);
    expect(img).toBeInTheDocument();
    expect(img.getAttribute("src")).toBe(TEST_IMG);
  });

  it("renders the image with the provided alt text", () => {
    renderLazyImage({ alt: "Alt personalizado" });
    expect(screen.getByAltText("Alt personalizado")).toBeInTheDocument();
  });

  it("adds a placeholder skeleton when image is not loaded", () => {
    const { container } = renderLazyImage();
    // The skeleton is the div with animate-pulse
    const skeleton = container.querySelector(".animate-pulse");
    expect(skeleton).toBeInTheDocument();
  });

  it("removes the skeleton after the image loads", () => {
    const { container } = renderLazyImage();
    const img = screen.getByAltText(TEST_ALT);

    // Simulate image load
    fireEvent.load(img);

    const skeleton = container.querySelector(".animate-pulse");
    expect(skeleton).not.toBeInTheDocument();
  });

  it("sets opacity to 0 before image loads", () => {
    renderLazyImage();
    const img = screen.getByAltText(TEST_ALT);
    expect(img.className).toContain("opacity-0");
  });

  it("sets opacity to 100 after image loads", () => {
    renderLazyImage();
    const img = screen.getByAltText(TEST_ALT);

    fireEvent.load(img);

    expect(img.className).toContain("opacity-100");
    expect(img.className).not.toContain("opacity-0");
  });

  it("applies custom className to the wrapper", () => {
    const { container } = renderLazyImage({ className: "custom-wrapper" });
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.className).toContain("custom-wrapper");
  });

  it("applies custom aspectClassName to the wrapper", () => {
    const { container } = renderLazyImage({ aspectClassName: "aspect-video" });
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.className).toContain("aspect-video");
  });

  it("uses default aspect-[4/3] when no aspectClassName provided", () => {
    const { container } = renderLazyImage();
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.className).toContain("aspect-[4/3]");
  });

  it("sets loading='lazy' by default (non-priority)", () => {
    renderLazyImage();
    const img = screen.getByAltText(TEST_ALT);
    expect(img.getAttribute("loading")).toBe("lazy");
  });

  it("sets loading='eager' when priority=true", () => {
    renderLazyImage({ priority: true });
    const img = screen.getByAltText(TEST_ALT);
    expect(img.getAttribute("loading")).toBe("eager");
  });

  it("sets fetchPriority='high' when priority=true", () => {
    renderLazyImage({ priority: true });
    const img = screen.getByAltText(TEST_ALT);
    expect(img.getAttribute("fetchpriority")).toBe("high");
  });

  it("sets fetchPriority='auto' by default (non-priority)", () => {
    renderLazyImage();
    const img = screen.getByAltText(TEST_ALT);
    expect(img.getAttribute("fetchpriority")).toBe("auto");
  });

  it("sets decoding='async'", () => {
    renderLazyImage();
    const img = screen.getByAltText(TEST_ALT);
    expect(img.getAttribute("decoding")).toBe("async");
  });

  it("has overflow-hidden on the wrapper", () => {
    const { container } = renderLazyImage();
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.className).toContain("overflow-hidden");
  });

  it("has object-cover on the image", () => {
    renderLazyImage();
    const img = screen.getByAltText(TEST_ALT);
    expect(img.className).toContain("object-cover");
  });

  it("transitions opacity with duration-500", () => {
    renderLazyImage();
    const img = screen.getByAltText(TEST_ALT);
    expect(img.className).toContain("duration-500");
  });
});
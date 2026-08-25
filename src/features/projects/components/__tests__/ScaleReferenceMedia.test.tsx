import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ScaleReferenceMedia, getYouTubeId } from "../ScaleReferenceMedia";
import type { ScaleReferenceMedia as ScaleReferenceMediaType } from "@/constants/lots";

describe("getYouTubeId", () => {
  it("extrae el ID de una URL de YouTube estándar", () => {
    expect(getYouTubeId("https://www.youtube.com/watch?v=N7LYM3pt_hg")).toBe(
      "N7LYM3pt_hg",
    );
  });

  it("extrae el ID de una URL youtu.be corta", () => {
    expect(getYouTubeId("https://youtu.be/djCWm-dv5Gg")).toBe(
      "djCWm-dv5Gg",
    );
  });

  it("extrae el ID de una URL de embed", () => {
    expect(
      getYouTubeId("https://www.youtube.com/embed/BZQVeSE1xSs"),
    ).toBe("BZQVeSE1xSs");
  });

  it("devuelve null para URLs que no son de YouTube", () => {
    expect(getYouTubeId("https://vimeo.com/123456")).toBeNull();
    expect(getYouTubeId("https://example.com/video.mp4")).toBeNull();
  });
});

describe("ScaleReferenceMedia", () => {
  const imageMedia: ScaleReferenceMediaType = {
    type: "image",
    url: "https://res.cloudinary.com/test/scale-reference.jpg",
    alt: "Persona de pie en el lote como referencia de escala",
  };

  const videoMedia: ScaleReferenceMediaType = {
    type: "video",
    url: "https://res.cloudinary.com/test/scale-reference.mp4",
    alt: "Video con persona de pie en el lote",
  };

  const youtubeMedia: ScaleReferenceMediaType = {
    type: "video",
    url: "https://www.youtube.com/watch?v=N7LYM3pt_hg",
    alt: "Video aéreo con referencia de escala",
  };

  it("renderiza la sección con el heading 'Dimensiona el lote'", () => {
    render(<ScaleReferenceMedia media={imageMedia} />);
    expect(
      screen.getByRole("heading", { name: /Dimensiona el lote/ }),
    ).toBeInTheDocument();
  });

  it("renderiza la descripción de la sección", () => {
    render(<ScaleReferenceMedia media={imageMedia} />);
    expect(
      screen.getByText(/así se ve el tamaño del terreno/),
    ).toBeInTheDocument();
  });

  describe("tipo imagen", () => {
    it("renderiza la imagen con el alt text correcto", () => {
      render(<ScaleReferenceMedia media={imageMedia} />);
      const img = screen.getByRole("img", { name: imageMedia.alt });
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute("src", imageMedia.url);
    });

    it("la imagen tiene loading lazy", () => {
      render(<ScaleReferenceMedia media={imageMedia} />);
      const img = screen.getByRole("img", { name: imageMedia.alt });
      expect(img).toHaveAttribute("loading", "lazy");
    });
  });

  describe("tipo video (no YouTube)", () => {
    it("renderiza un elemento de video con controles y aria-label", () => {
      render(<ScaleReferenceMedia media={videoMedia} />);
      const video = screen.getByLabelText(videoMedia.alt);
      expect(video).toBeInTheDocument();
      expect(video.tagName).toBe("VIDEO");
      expect(video).toHaveAttribute("controls");
    });
  });

  describe("tipo video (YouTube)", () => {
    it("no monta iframe en render inicial (click-to-load)", () => {
      render(<ScaleReferenceMedia media={youtubeMedia} />);
      expect(document.querySelectorAll("iframe")).toHaveLength(0);
    });

    it("muestra el botón de play de YouTube", () => {
      render(<ScaleReferenceMedia media={youtubeMedia} />);
      expect(
        screen.getByRole("button", {
          name: `Reproducir video: ${youtubeMedia.alt}`,
        }),
      ).toBeInTheDocument();
    });
  });

  it("muestra el caption con el alt text", () => {
    render(<ScaleReferenceMedia media={imageMedia} />);
    expect(
      screen.getByText(new RegExp(imageMedia.alt)),
    ).toBeInTheDocument();
  });
});

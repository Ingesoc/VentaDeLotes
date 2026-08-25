import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { AerialVideoSection } from "../AerialVideoSection";
import { aerialVideoClips } from "@/constants/aerialVideos";

describe("AerialVideoSection", () => {
  it("renderiza la sección con su encabezado accesible", () => {
    render(<AerialVideoSection />);
    expect(
      screen.getByRole("heading", { name: /La Holanda desde el aire/i }),
    ).toBeInTheDocument();
  });

  it("muestra el primer clip como video destacado (click-to-load)", () => {
    render(<AerialVideoSection />);
    const first = aerialVideoClips[0];
    expect(
      screen.getByRole("button", {
        name: `Reproducir video: Video aéreo: ${first.title}`,
      }),
    ).toBeInTheDocument();
  });

  it("no monta ningún iframe hasta que el usuario hace clic (lazy)", () => {
    render(<AerialVideoSection />);
    expect(document.querySelectorAll("iframe")).toHaveLength(0);
  });

  it("lista todos los clips aéreos como botones de selección", () => {
    render(<AerialVideoSection />);
    aerialVideoClips.forEach((clip) => {
      expect(screen.getByRole("button", { name: clip.title })).toBeInTheDocument();
    });
  });

  it("cambia al clip seleccionado al hacer clic en su botón", () => {
    render(<AerialVideoSection />);
    const third = aerialVideoClips[2];

    fireEvent.click(screen.getByRole("button", { name: third.title }));

    // El reproductor ahora corresponde al clip 3
    expect(
      screen.getByRole("button", {
        name: `Reproducir video: Video aéreo: ${third.title}`,
      }),
    ).toBeInTheDocument();
    // Y el botón del clip activo queda marcado con aria-pressed
    expect(
      screen.getByRole("button", { name: third.title }),
    ).toHaveAttribute("aria-pressed", "true");
  });

  it("el clip activo inicial tiene aria-pressed=true", () => {
    render(<AerialVideoSection />);
    expect(
      screen.getByRole("button", { name: aerialVideoClips[0].title }),
    ).toHaveAttribute("aria-pressed", "true");
  });
});

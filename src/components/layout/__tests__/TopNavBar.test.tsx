import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { TopNavBar } from "../TopNavBar";

// Mock cloudinary
vi.mock("@/lib/cloudinary", () => ({
  cldUrl: (url: string) => url,
  CLD_WIDTHS: { LOGO: 200, HERO: 1920, CAROUSEL: 1200, MASTERPLAN: 1280, LARGE: 1000, CARD: 800, THUMB: 400 },
}));

function renderNav() {
  return render(
    <MemoryRouter initialEntries={["/"]}>
      <TopNavBar />
    </MemoryRouter>,
  );
}

describe("TopNavBar", () => {
  it("renders the logo and brand name", () => {
    renderNav();
    expect(screen.getByText("La Holanda")).toBeInTheDocument();
    const logo = screen.getByAltText("La Holanda");
    expect(logo).toBeInTheDocument();
    // Kill StringLiteral mutant: Cloudinary URL → ""
    expect(logo.getAttribute("src")).toContain("res.cloudinary.com");
  });

  it("renders desktop navigation links", () => {
    renderNav();
    // Each link appears in both desktop navbar + hidden mobile menu
    const procesoLinks = screen.getAllByText("Proceso");
    expect(procesoLinks.length).toBe(2);
    const quindioLinks = screen.getAllByText("Quindío");
    expect(quindioLinks.length).toBe(2);
    const lotesLinks = screen.getAllByText("Lotes");
    expect(lotesLinks.length).toBe(2);
    const contactoLinks = screen.getAllByText("Contacto");
    expect(contactoLinks.length).toBe(2);
  });

  it("renders the 'Reservar' CTA button", () => {
    renderNav();
    const reservarButtons = screen.getAllByText("Reservar");
    expect(reservarButtons.length).toBe(2);
  });

  it("has correct link destinations", () => {
    renderNav();

    // Use getAllByText + first() since each link appears twice (desktop + mobile)
    const quindioLinks = screen.getAllByText("Quindío");
    expect(quindioLinks[0].closest("a")?.getAttribute("href")).toBe("/descubre-quindio");

    const lotesLinks = screen.getAllByText("Lotes");
    expect(lotesLinks[0].closest("a")?.getAttribute("href")).toBe("/projects");

    const contactoLinks = screen.getAllByText("Contacto");
    expect(contactoLinks[0].closest("a")?.getAttribute("href")).toBe("/contact");

    const logoLink = screen.getByAltText("La Holanda").closest("a");
    expect(logoLink?.getAttribute("href")).toBe("/");
  });

  it("has a mobile menu toggle button", () => {
    renderNav();
    const menuButton = screen.getByLabelText("Abrir menú");
    expect(menuButton).toBeInTheDocument();
  });

  it("toggles mobile menu open and closed", () => {
    renderNav();

    // Find the mobile menu container via the close button's parent
    const mobileMenu = screen.getByLabelText("Cerrar menú").parentElement!;
    const openButton = screen.getByLabelText("Abrir menú");

    // Initially closed
    expect(mobileMenu.className).toContain("translate-x-full");
    expect(mobileMenu.className).not.toContain("translate-x-0");

    // Click hamburger to open
    fireEvent.click(openButton);
    expect(mobileMenu.className).toContain("translate-x-0");
    expect(mobileMenu.className).not.toContain("translate-x-full");

    // Click close button to close
    fireEvent.click(screen.getByLabelText("Cerrar menú"));
    expect(mobileMenu.className).toContain("translate-x-full");
    expect(mobileMenu.className).not.toContain("translate-x-0");
  });

  it("closes mobile menu when a navigation link is clicked", () => {
    renderNav();
    const mobileMenu = screen.getByLabelText("Cerrar menú").parentElement!;

    // Open menu first
    fireEvent.click(screen.getByLabelText("Abrir menú"));
    expect(mobileMenu.className).toContain("translate-x-0");

    // Click a nav link inside the mobile menu
    const quindioLink = screen.getAllByText("Quindío")[1];
    fireEvent.click(quindioLink);
    expect(mobileMenu.className).toContain("translate-x-full");
  });

  it("mobile menu has same navigation links", () => {
    renderNav();
    // Open menu
    fireEvent.click(screen.getByLabelText("Abrir menú"));
    
    // Mobile menu links should be present
    const mobileProceso = screen.getAllByText("Proceso");
    const mobileQuindio = screen.getAllByText("Quindío");
    const mobileLotes = screen.getAllByText("Lotes");
    const mobileContacto = screen.getAllByText("Contacto");
    
    // At least one of each should exist (desktop + mobile)
    expect(mobileProceso.length).toBeGreaterThanOrEqual(1);
    expect(mobileQuindio.length).toBeGreaterThanOrEqual(1);
    expect(mobileLotes.length).toBeGreaterThanOrEqual(1);
    expect(mobileContacto.length).toBeGreaterThanOrEqual(1);
  });
});

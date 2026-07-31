import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { Footer } from "../Footer";

// Mock cloudinary to avoid import.meta.env issues in tests
vi.mock("@/lib/cloudinary", () => ({
  cldUrl: (url: string) => url,
  CLD_WIDTHS: { LOGO: 200, HERO: 1920, CAROUSEL: 1200, MASTERPLAN: 1280, LARGE: 1000, CARD: 800, THUMB: 400 },
}));

function renderFooter() {
  return render(
    <MemoryRouter>
      <Footer />
    </MemoryRouter>,
  );
}

describe("Footer", () => {
  it("renders the project name", () => {
    renderFooter();
    expect(screen.getByText("La Holanda")).toBeInTheDocument();
  });

  it("renders the tagline", () => {
    renderFooter();
    expect(screen.getByText("Donde la naturaleza se convierte en tu hogar")).toBeInTheDocument();
  });

  it("renders developer info", () => {
    renderFooter();
    const matches = screen.getAllByText(/INGESOCC SAS/);
    expect(matches.length).toBeGreaterThanOrEqual(1);
    expect(matches[0]).toBeInTheDocument();
  });

  it("renders the location section with address", () => {
    renderFooter();
    expect(screen.getByText("Ubicación")).toBeInTheDocument();
    expect(screen.getByText(/Vía Quimbaya/)).toBeInTheDocument();
    const quimbayaMatches = screen.getAllByText(/Quimbaya/);
    expect(quimbayaMatches.length).toBeGreaterThanOrEqual(1);
  });

  it("renders the Contacto section", () => {
    renderFooter();
    expect(screen.getByText("Contacto")).toBeInTheDocument();
    const ingesoccMatches = screen.getAllByText("INGESOCC SAS");
    expect(ingesoccMatches.length).toBeGreaterThanOrEqual(1);
  });

  it("renders a phone link", () => {
    renderFooter();
    const phoneLink = screen.getByText("3217151831");
    expect(phoneLink).toBeInTheDocument();
    expect(phoneLink.closest("a")?.getAttribute("href")).toBe("tel:3217151831");
  });

  it("renders an email link", () => {
    renderFooter();
    const emailLink = screen.getByText("gerencia.ingesocc@gmail.com");
    expect(emailLink).toBeInTheDocument();
    expect(emailLink.closest("a")?.getAttribute("href")).toBe("mailto:gerencia.ingesocc@gmail.com");
  });

  it("renders the office address", () => {
    renderFooter();
    expect(screen.getByText(/Armenia/)).toBeInTheDocument();
  });

  it("renders the link to /descubre-quindio", () => {
    renderFooter();
    const quindioLink = screen.getByText("Descubre Quindío");
    expect(quindioLink).toBeInTheDocument();
    expect(quindioLink.closest("a")?.getAttribute("href")).toBe("/descubre-quindio");
  });

  it("renders the link to /contact", () => {
    renderFooter();
    const contactLink = screen.getByText("Formulario de contacto");
    expect(contactLink).toBeInTheDocument();
    expect(contactLink.closest("a")?.getAttribute("href")).toBe("/contact");
  });

  it("renders the copyright notice with current year", () => {
    renderFooter();
    const year = new Date().getFullYear().toString();
    expect(screen.getByText(new RegExp(year))).toBeInTheDocument();
    expect(screen.getByText(/Todos los derechos reservados/)).toBeInTheDocument();
  });

  it("has the correct number of linkable sections", () => {
    renderFooter();
    const links = screen.getAllByRole("link");
    // 4 links: Descubre Quindío, Formulario de contacto, tel, email
    expect(links.length).toBeGreaterThanOrEqual(4);
  });
});

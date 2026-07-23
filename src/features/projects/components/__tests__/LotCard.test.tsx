import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { LotCard } from "../LotCard";
import type { Lot } from "@/constants/lots";

function createMockLot(overrides: Partial<Lot> = {}): Lot {
  return {
    id: "01",
    areaM2: 8910.37,
    price: 189242850,
    status: "disponible",
    aerialImage: "https://res.cloudinary.com/test/image.jpg",
    perspectiveImage: "https://res.cloudinary.com/test/perspective.jpg",
    ...overrides,
  };
}

function renderWithRouter(ui: React.ReactElement) {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
}

describe("LotCard", () => {
  it("renders lot ID and area", () => {
    renderWithRouter(<LotCard lot={createMockLot()} />);
    expect(screen.getByText("Lote 01")).toBeInTheDocument();
    expect(screen.getByText(/8\.910,37 m²/)).toBeInTheDocument();
  });

  it("renders the price in millions", () => {
    renderWithRouter(<LotCard lot={createMockLot({ price: 189242850 })} />);
    expect(screen.getByText("$189M")).toBeInTheDocument();
  });

  it("renders price with one decimal when under 100M", () => {
    renderWithRouter(
      <LotCard lot={createMockLot({ price: 85_500_000 })} />,
    );
    expect(screen.getByText("$85,5M")).toBeInTheDocument();
  });

  it('shows "Disponible" status badge', () => {
    renderWithRouter(
      <LotCard lot={createMockLot({ status: "disponible" })} />,
    );
    expect(screen.getByText("Disponible")).toBeInTheDocument();
  });

  it('shows "Reservado" status badge', () => {
    renderWithRouter(
      <LotCard lot={createMockLot({ status: "reservado" })} />,
    );
    expect(screen.getByText("Reservado")).toBeInTheDocument();
  });

  it('shows "Vendido" status badge and disabled button', () => {
    renderWithRouter(<LotCard lot={createMockLot({ status: "vendido" })} />);
    expect(screen.getByText("Vendido")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /no disponible/i }),
    ).toBeDisabled();
  });

  it('renders "Ver detalle" link for available lots', () => {
    renderWithRouter(<LotCard lot={createMockLot({ status: "disponible" })} />);
    const link = screen.getByRole("link", { name: /ver detalle/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/projects/01");
  });

  it("applies opacity styles when lot is sold", () => {
    const { container } = renderWithRouter(
      <LotCard lot={createMockLot({ status: "vendido" })} />,
    );
    const card = container.firstElementChild;
    expect(card).toHaveClass("opacity-70");
  });

  it('shows "Área por confirmar" when area is 0', () => {
    renderWithRouter(
      <LotCard lot={createMockLot({ areaM2: 0 })} />,
    );
    expect(screen.getByText("Área por confirmar")).toBeInTheDocument();
  });

  it("renders LazyImage with correct alt text", () => {
    renderWithRouter(<LotCard lot={createMockLot({ id: "05", areaM2: 2005 })} />);
    const img = screen.getByAltText(/lote 05/i);
    expect(img).toBeInTheDocument();
  });
});

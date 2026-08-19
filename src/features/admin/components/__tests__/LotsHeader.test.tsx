import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LotsHeader } from "../LotsHeader";

describe("LotsHeader", () => {
  const defaultProps = {
    search: "",
    onSearchChange: vi.fn(),
    onNewLot: vi.fn(),
    creating: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // -----------------------------------------------------------------------
  // Rendering
  // -----------------------------------------------------------------------
  it("renders the title and subtitle", () => {
    render(<LotsHeader {...defaultProps} />);

    expect(screen.getByText("Gestión de Lotes")).toBeInTheDocument();
    expect(screen.getByText("Crea, edita y elimina los lotes de la parcelación")).toBeInTheDocument();
  });

  it("renders search input", () => {
    render(<LotsHeader {...defaultProps} />);

    expect(screen.getByPlaceholderText("Buscar lote...")).toBeInTheDocument();
  });

  it("renders 'Nuevo Lote' button", () => {
    render(<LotsHeader {...defaultProps} />);

    expect(screen.getByText("Nuevo Lote")).toBeInTheDocument();
  });

  // -----------------------------------------------------------------------
  // Search
  // -----------------------------------------------------------------------
  it("calls onSearchChange when user types in search", async () => {
    const user = userEvent.setup();
    render(<LotsHeader {...defaultProps} />);

    const input = screen.getByPlaceholderText("Buscar lote...");
    await user.type(input, "01");

    // userEvent.type fires onChange for each character typed
    // With controlled input where the mock doesn't update state,
    // each keystroke produces a single character relative to the current value
    expect(defaultProps.onSearchChange).toHaveBeenCalledTimes(2);
    expect(defaultProps.onSearchChange).toHaveBeenCalledWith("0");
    expect(defaultProps.onSearchChange).toHaveBeenCalledWith("1");
  });

  it("displays the current search value", () => {
    render(<LotsHeader {...defaultProps} search="02" />);

    expect(screen.getByPlaceholderText("Buscar lote...")).toHaveValue("02");
  });

  // -----------------------------------------------------------------------
  // New lot button
  // -----------------------------------------------------------------------
  it("calls onNewLot when 'Nuevo Lote' button is clicked", async () => {
    const user = userEvent.setup();
    render(<LotsHeader {...defaultProps} />);

    await user.click(screen.getByText("Nuevo Lote"));

    expect(defaultProps.onNewLot).toHaveBeenCalledOnce();
  });

  it("disables the button when creating is true", () => {
    render(<LotsHeader {...defaultProps} creating={true} />);

    const button = screen.getByRole("button", { name: /Nuevo Lote/ });
    expect(button).toBeDisabled();
  });

  it("enables the button when creating is false", () => {
    render(<LotsHeader {...defaultProps} creating={false} />);

    const button = screen.getByRole("button", { name: /Nuevo Lote/ });
    expect(button).toBeEnabled();
  });

  it("renders search input with accessible label", () => {
    render(<LotsHeader {...defaultProps} />);

    expect(screen.getByLabelText("Buscar lote por ID o estado")).toBeInTheDocument();
  });
});

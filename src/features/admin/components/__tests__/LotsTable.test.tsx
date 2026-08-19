import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LotsTable } from "../LotsTable";
import type { Lot } from "../useLots";

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const MOCK_LOTS: Lot[] = [
  {
    id: "01",
    area_m2: 8910,
    price: 189242850,
    status: "disponible",
    aerial_image: "https://res.cloudinary.com/test/image1.jpg",
  },
  {
    id: "02",
    area_m2: 2008,
    price: 189242850,
    status: "reservado",
    aerial_image: "",
  },
  {
    id: "03",
    area_m2: null,
    price: null,
    status: "vendido",
    aerial_image: "https://res.cloudinary.com/test/image3.jpg",
  },
];

const defaultProps = {
  lots: MOCK_LOTS,
  saving: false,
  uploading: null as string | null,
  onSave: vi.fn().mockResolvedValue(true),
  onUploadImage: vi.fn(),
  onDelete: vi.fn().mockResolvedValue(true),
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getRowLots(): HTMLTableRowElement[] {
  const rows = screen.getAllByRole("row");
  // Skip header row (index 0)
  return rows.slice(1) as unknown as HTMLTableRowElement[];
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("LotsTable", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // -----------------------------------------------------------------------
  // Rendering
  // -----------------------------------------------------------------------
  it("renders all lots in the table", () => {
    render(<LotsTable {...defaultProps} />);

    expect(screen.getByText("Lote 01")).toBeInTheDocument();
    expect(screen.getByText("Lote 02")).toBeInTheDocument();
    expect(screen.getByText("Lote 03")).toBeInTheDocument();
  });

  it("renders empty state when no lots", () => {
    render(<LotsTable {...defaultProps} lots={[]} />);

    expect(screen.getByText("No se encontraron lotes")).toBeInTheDocument();
  });

  it("displays lot area in m²", () => {
    render(<LotsTable {...defaultProps} />);

    // toLocaleString("es-CO") may format differently in jsdom; just check the number is present
    expect(screen.getAllByText(/8.{0,2}910.*m²/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/2.{0,2}008.*m²/).length).toBeGreaterThan(0);
  });

  it("displays dash for null area in lot 03", () => {
    render(<LotsTable {...defaultProps} />);

    const rows = getRowLots();
    const row3 = rows[2]; // lot 03 has null area AND null price — both show "—"
    const dashes = within(row3).getAllByText("—");
    expect(dashes.length).toBeGreaterThanOrEqual(1);
  });

  it("displays lot price formatted in millions", () => {
    render(<LotsTable {...defaultProps} />);

    // Both lots 01 and 02 have the same price ($189M)
    const priceElements = screen.getAllByText(/\$1[89]\d/);
    expect(priceElements.length).toBeGreaterThanOrEqual(1);
  });

  it("displays dash for null price in lot 03", () => {
    render(<LotsTable {...defaultProps} />);

    const rows = getRowLots();
    const row3 = rows[2]; // lot 03 has null price
    const dashes = within(row3).getAllByText("—");
    // Lot 03 has both null area AND null price, so two dashes
    expect(dashes.length).toBe(2);
  });

  it("displays lot status badges", () => {
    render(<LotsTable {...defaultProps} />);

    expect(screen.getByText("disponible")).toBeInTheDocument();
    expect(screen.getByText("reservado")).toBeInTheDocument();
    expect(screen.getByText("vendido")).toBeInTheDocument();
  });

  // -----------------------------------------------------------------------
  // Upload button — Cloudinary
  // -----------------------------------------------------------------------
  describe("Image upload button", () => {
    it("shows 'Cloudinary' when lot has a Cloudinary image URL", () => {
      render(<LotsTable {...defaultProps} />);

      const rows = getRowLots();
      expect(within(rows[0]).getByText("Cloudinary")).toBeInTheDocument();
    });

    it("shows 'Subir imagen' when lot has no image", () => {
      render(<LotsTable {...defaultProps} />);

      const rows = getRowLots();
      expect(within(rows[1]).getByText("Subir imagen")).toBeInTheDocument();
    });

    it("calls onUploadImage with lot id when upload button is clicked", async () => {
      const user = userEvent.setup();
      render(<LotsTable {...defaultProps} />);

      const rows = getRowLots();
      const uploadBtn = within(rows[1]).getByText("Subir imagen").closest("button")!;

      await user.click(uploadBtn);

      expect(defaultProps.onUploadImage).toHaveBeenCalledWith("02");
    });

    it("shows spinner when uploading this lot", () => {
      render(<LotsTable {...defaultProps} uploading="01" />);

      const rows = getRowLots();
      // The Loader2 icon renders as SVG with class animate-spin
      const spinner = rows[0].querySelector(".animate-spin");
      expect(spinner).toBeInTheDocument();
    });

    it("disables upload button for the lot being uploaded", () => {
      render(<LotsTable {...defaultProps} uploading="02" />);

      const rows = getRowLots();
      const uploadBtn = within(rows[1]).getByText("Subir imagen").closest("button")!;
      expect(uploadBtn).toBeDisabled();
    });

    it("enables upload button for non-uploading lots", () => {
      render(<LotsTable {...defaultProps} uploading="01" />);

      const rows = getRowLots();
      const uploadBtn = within(rows[1]).getByText("Subir imagen").closest("button")!;
      expect(uploadBtn).toBeEnabled();
    });

    it("shows 'Cloudinary' label for lot with Cloudinary URL during upload of different lot", () => {
      render(<LotsTable {...defaultProps} uploading="02" />);

      const rows = getRowLots();
      expect(within(rows[0]).getByText("Cloudinary")).toBeInTheDocument();
    });
  });

  // -----------------------------------------------------------------------
  // Edit mode
  // -----------------------------------------------------------------------
  describe("Edit mode", () => {
    it("enters edit mode when pencil button is clicked", async () => {
      const user = userEvent.setup();
      render(<LotsTable {...defaultProps} />);

      const rows = getRowLots();
      const editBtn = within(rows[0]).getByRole("button", { name: "Editar lote" });

      await user.click(editBtn);

      expect(within(rows[0]).getByRole("button", { name: "Guardar cambios" })).toBeInTheDocument();
      expect(within(rows[0]).getByRole("button", { name: "Cancelar edición" })).toBeInTheDocument();
    });

    it("shows status select in edit mode", async () => {
      const user = userEvent.setup();
      render(<LotsTable {...defaultProps} />);

      const rows = getRowLots();
      await user.click(within(rows[0]).getByRole("button", { name: "Editar lote" }));

      expect(within(rows[0]).getByRole("combobox", { name: "Estado del lote" })).toBeInTheDocument();
    });

    it("shows price input in edit mode", async () => {
      const user = userEvent.setup();
      render(<LotsTable {...defaultProps} />);

      const rows = getRowLots();
      await user.click(within(rows[0]).getByRole("button", { name: "Editar lote" }));

      expect(within(rows[0]).getByLabelText("Precio del lote 01 en COP")).toBeInTheDocument();
    });

    it("calls onSave with updated values when save button is clicked", async () => {
      const user = userEvent.setup();
      render(<LotsTable {...defaultProps} />);

      const rows = getRowLots();
      await user.click(within(rows[0]).getByRole("button", { name: "Editar lote" }));

      const select = within(rows[0]).getByRole("combobox", { name: "Estado del lote" });
      await user.selectOptions(select, "vendido");

      await user.click(within(rows[0]).getByRole("button", { name: "Guardar cambios" }));

      expect(defaultProps.onSave).toHaveBeenCalledWith("01", {
        status: "vendido",
        price: 189242850,
      });
    });

    it("exits edit mode after successful save", async () => {
      const user = userEvent.setup();
      render(<LotsTable {...defaultProps} />);

      const rows = getRowLots();
      await user.click(within(rows[0]).getByRole("button", { name: "Editar lote" }));
      await user.click(within(rows[0]).getByRole("button", { name: "Guardar cambios" }));

      expect(within(rows[0]).queryByRole("button", { name: "Guardar cambios" })).not.toBeInTheDocument();
    });

    it("cancels edit mode without saving", async () => {
      const user = userEvent.setup();
      render(<LotsTable {...defaultProps} />);

      const rows = getRowLots();
      await user.click(within(rows[0]).getByRole("button", { name: "Editar lote" }));
      await user.click(within(rows[0]).getByRole("button", { name: "Cancelar edición" }));

      expect(defaultProps.onSave).not.toHaveBeenCalled();
      expect(within(rows[0]).queryByRole("button", { name: "Guardar cambios" })).not.toBeInTheDocument();
    });

    it("shows spinner on save button while saving", async () => {
      const user = userEvent.setup();
      render(<LotsTable {...defaultProps} saving={true} />);

      const rows = getRowLots();
      await user.click(within(rows[0]).getByRole("button", { name: "Editar lote" }));

      const saveBtn = within(rows[0]).getByRole("button", { name: "Guardar cambios" });
      expect(saveBtn).toBeDisabled();
    });
  });

  // -----------------------------------------------------------------------
  // Delete with confirmation
  // -----------------------------------------------------------------------
  describe("Delete with confirmation", () => {
    it("shows confirmation prompt on first delete click", async () => {
      const user = userEvent.setup();
      render(<LotsTable {...defaultProps} />);

      const rows = getRowLots();
      await user.click(within(rows[0]).getByRole("button", { name: "Eliminar lote 01" }));

      expect(within(rows[0]).getByText("¿Eliminar?")).toBeInTheDocument();
      expect(
        within(rows[0]).getByRole("button", { name: "Confirmar eliminación del lote 01" })
      ).toBeInTheDocument();
    });

    it("calls onDelete on second delete click", async () => {
      const user = userEvent.setup();
      render(<LotsTable {...defaultProps} />);

      const rows = getRowLots();
      await user.click(within(rows[0]).getByRole("button", { name: "Eliminar lote 01" }));
      await user.click(
        within(rows[0]).getByRole("button", { name: "Confirmar eliminación del lote 01" })
      );

      expect(defaultProps.onDelete).toHaveBeenCalledWith("01");
    });

    it("cancels delete confirmation", async () => {
      const user = userEvent.setup();
      render(<LotsTable {...defaultProps} />);

      const rows = getRowLots();
      await user.click(within(rows[0]).getByRole("button", { name: "Eliminar lote 01" }));
      await user.click(
        within(rows[0]).getByRole("button", { name: "Cancelar eliminación" })
      );

      expect(defaultProps.onDelete).not.toHaveBeenCalled();
      expect(within(rows[0]).queryByText("¿Eliminar?")).not.toBeInTheDocument();
    });
  });

  // -----------------------------------------------------------------------
  // Column headers
  // -----------------------------------------------------------------------
  it("renders correct column headers", () => {
    render(<LotsTable {...defaultProps} />);

    expect(screen.getByText("Lote")).toBeInTheDocument();
    expect(screen.getByText("Área")).toBeInTheDocument();
    expect(screen.getByText("Precio")).toBeInTheDocument();
    expect(screen.getByText("Estado")).toBeInTheDocument();
    expect(screen.getByText("Imagen")).toBeInTheDocument();
    expect(screen.getByText("Acciones")).toBeInTheDocument();
  });
});

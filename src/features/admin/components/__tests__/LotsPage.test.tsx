import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, within, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { Lot } from "../useLots";

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

const MOCK_LOTS: Lot[] = [
  {
    id: "01",
    area_m2: 8910,
    price: 189242850,
    status: "disponible",
    aerial_image: "https://res.cloudinary.com/test/image1.jpg",
    scale_reference_media: null,
  },
  {
    id: "02",
    area_m2: 2008,
    price: 189242850,
    status: "reservado",
    aerial_image: "",
    scale_reference_media: null,
  },
  {
    id: "03",
    area_m2: 2013,
    price: 185619550,
    status: "vendido",
    aerial_image: "https://res.cloudinary.com/test/image3.jpg",
    scale_reference_media: null,
  },
];

const mockSaveLot = vi.fn().mockResolvedValue(true);
const mockCreateLot = vi.fn().mockResolvedValue({ ok: true });
const mockDeleteLot = vi.fn().mockResolvedValue(true);
const mockHandleUploadImage = vi.fn();

let currentUseLotsReturn = {
  lots: MOCK_LOTS,
  loading: false,
  saving: false,
  uploading: null as string | null,
  saveLot: mockSaveLot,
  createLot: mockCreateLot,
  deleteLot: mockDeleteLot,
  handleUploadImage: mockHandleUploadImage,
};

vi.mock("../useLots", () => ({
  useLots: () => currentUseLotsReturn,
}));

// Mock dialog showModal/close since jsdom doesn't support <dialog>.
// showModal sets the `open` attribute; close removes it.
HTMLDialogElement.prototype.showModal = vi.fn(function (this: HTMLDialogElement) {
  this.setAttribute("open", "");
});
HTMLDialogElement.prototype.close = vi.fn(function (this: HTMLDialogElement) {
  this.removeAttribute("open");
});

import { LotsPage } from "../../LotsPage";

// ---------------------------------------------------------------------------
// Helper
// ---------------------------------------------------------------------------

/** Get the <dialog> element and wait for it to be open */
async function openModal(): Promise<HTMLDialogElement> {
  const user = userEvent.setup();
  render(<LotsPage />);
  await user.click(screen.getByText("Nuevo Lote"));
  const dialog = screen.getByRole("dialog") as HTMLDialogElement;
  return dialog;
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("LotsPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSaveLot.mockResolvedValue(true);
    mockCreateLot.mockResolvedValue({ ok: true });
    mockDeleteLot.mockResolvedValue(true);
    mockHandleUploadImage.mockReset();
    currentUseLotsReturn = {
      lots: MOCK_LOTS,
      loading: false,
      saving: false,
      uploading: null,
      saveLot: mockSaveLot,
      createLot: mockCreateLot,
      deleteLot: mockDeleteLot,
      handleUploadImage: mockHandleUploadImage,
    };
  });

  // -----------------------------------------------------------------------
  // Loading state
  // -----------------------------------------------------------------------
  it("shows loading spinner when loading", () => {
    currentUseLotsReturn = { ...currentUseLotsReturn, lots: [], loading: true };
    render(<LotsPage />);
    expect(document.querySelector(".animate-spin")).toBeInTheDocument();
  });

  // -----------------------------------------------------------------------
  // Rendering
  // -----------------------------------------------------------------------
  it("renders the LotsHeader with search", () => {
    render(<LotsPage />);
    expect(screen.getByPlaceholderText("Buscar lote...")).toBeInTheDocument();
    expect(screen.getByText("Gestión de Lotes")).toBeInTheDocument();
  });

  it("renders the LotsTable with lots", () => {
    render(<LotsPage />);
    expect(screen.getByText("Lote 01")).toBeInTheDocument();
    expect(screen.getByText("Lote 02")).toBeInTheDocument();
    expect(screen.getByText("Lote 03")).toBeInTheDocument();
  });

  it("shows lot count", () => {
    render(<LotsPage />);
    expect(screen.getByText(/Mostrando 3 de 3 lotes/)).toBeInTheDocument();
  });

  // -----------------------------------------------------------------------
  // Search filtering
  // -----------------------------------------------------------------------
  describe("Search filtering", () => {
    it("filters lots by ID", async () => {
      const user = userEvent.setup();
      render(<LotsPage />);
      await user.type(screen.getByPlaceholderText("Buscar lote..."), "01");

      expect(screen.getByText("Lote 01")).toBeInTheDocument();
      expect(screen.queryByText("Lote 02")).not.toBeInTheDocument();
      expect(screen.queryByText("Lote 03")).not.toBeInTheDocument();
      expect(screen.getByText(/Mostrando 1 de 3 lotes/)).toBeInTheDocument();
    });

    it("filters lots by status", async () => {
      const user = userEvent.setup();
      render(<LotsPage />);
      await user.type(screen.getByPlaceholderText("Buscar lote..."), "vendido");

      expect(screen.queryByText("Lote 01")).not.toBeInTheDocument();
      expect(screen.queryByText("Lote 02")).not.toBeInTheDocument();
      expect(screen.getByText("Lote 03")).toBeInTheDocument();
      expect(screen.getByText(/Mostrando 1 de 3 lotes/)).toBeInTheDocument();
    });

    it("shows all lots when search is cleared", async () => {
      const user = userEvent.setup();
      render(<LotsPage />);
      const input = screen.getByPlaceholderText("Buscar lote...");
      await user.type(input, "01");
      await user.clear(input);

      expect(screen.getByText("Lote 01")).toBeInTheDocument();
      expect(screen.getByText("Lote 02")).toBeInTheDocument();
      expect(screen.getByText("Lote 03")).toBeInTheDocument();
      expect(screen.getByText(/Mostrando 3 de 3 lotes/)).toBeInTheDocument();
    });
  });

  // -----------------------------------------------------------------------
  // Create lot modal
  // -----------------------------------------------------------------------
  describe("Create lot modal", () => {
    it("opens the create modal when 'Nuevo Lote' is clicked", async () => {
      const dialog = await openModal();

      // showDialog was called and the dialog has the open attribute
      expect(HTMLDialogElement.prototype.showModal).toHaveBeenCalled();
      // The dialog title and form elements should be in the DOM
      expect(within(dialog).getByRole("heading", { name: "Crear lote" })).toBeInTheDocument();
      expect(within(dialog).getByLabelText("ID del lote *")).toBeInTheDocument();
    });

    it("closes modal when close button is clicked", async () => {
      const user = userEvent.setup();
      render(<LotsPage />);
      await user.click(screen.getByText("Nuevo Lote"));

      const dialog = screen.getByRole("dialog");
      const closeBtn = within(dialog).getByRole("button", { name: "Cerrar" });
      await user.click(closeBtn);

      // dialog.close() should have been called
      expect(HTMLDialogElement.prototype.close).toHaveBeenCalled();
    });

    it("validates that lot ID is required", async () => {
      const user = userEvent.setup();
      const { container } = render(<LotsPage />);
      await user.click(screen.getByText("Nuevo Lote"));

      // Use fireEvent.submit to trigger React's onSubmit handler
      // (requestSubmit doesn't work reliably in jsdom for dialog forms)
      const form = container.querySelector("form")!;
      fireEvent.submit(form);

      await waitFor(() => {
        expect(screen.getByText("El ID del lote es obligatorio (ej: 17).")).toBeInTheDocument();
      });
      expect(mockCreateLot).not.toHaveBeenCalled();
    });

    it("calls createLot with correct data on submit", async () => {
      const user = userEvent.setup();
      render(<LotsPage />);
      await user.click(screen.getByText("Nuevo Lote"));

      const dialog = screen.getByRole("dialog");
      await user.type(within(dialog).getByLabelText("ID del lote *"), "17");
      await user.type(within(dialog).getByLabelText("Área (m²)"), "3000");
      await user.type(within(dialog).getByLabelText("Precio (COP)"), "250000000");

      await user.click(within(dialog).getByRole("button", { name: "Crear lote" }));

      await waitFor(() => {
        expect(mockCreateLot).toHaveBeenCalledWith({
          id: "17",
          areaM2: 3000,
          price: 250000000,
          status: "disponible",
        });
      });
    });

    it("closes modal after successful creation", async () => {
      const user = userEvent.setup();
      render(<LotsPage />);
      await user.click(screen.getByText("Nuevo Lote"));

      const dialog = screen.getByRole("dialog");
      await user.type(within(dialog).getByLabelText("ID del lote *"), "17");
      await user.click(within(dialog).getByRole("button", { name: "Crear lote" }));

      await waitFor(() => {
        expect(HTMLDialogElement.prototype.close).toHaveBeenCalled();
      });
    });

    it("shows error when createLot fails", async () => {
      const user = userEvent.setup();
      mockCreateLot.mockResolvedValue({ ok: false, error: "duplicate key" });
      render(<LotsPage />);
      await user.click(screen.getByText("Nuevo Lote"));

      const dialog = screen.getByRole("dialog");
      await user.type(within(dialog).getByLabelText("ID del lote *"), "01");
      await user.click(within(dialog).getByRole("button", { name: "Crear lote" }));

      await waitFor(() => {
        expect(screen.getByText("duplicate key")).toBeInTheDocument();
      });
    });

    it("allows changing the lot status in the create form", async () => {
      const user = userEvent.setup();
      render(<LotsPage />);
      await user.click(screen.getByText("Nuevo Lote"));

      const dialog = screen.getByRole("dialog");
      const select = within(dialog).getByLabelText("Estado");
      await user.selectOptions(select, "vendido");

      expect(select).toHaveValue("vendido");
    });
  });

  // -----------------------------------------------------------------------
  // Upload flow integration
  // -----------------------------------------------------------------------
  describe("Upload flow integration", () => {
    it("renders Subir imagen button for lots without images", () => {
      render(<LotsPage />);
      expect(screen.getByText("Subir imagen")).toBeInTheDocument();
    });

    it("shows uploading state when uploading is in progress", () => {
      currentUseLotsReturn = { ...currentUseLotsReturn, uploading: "02" };
      render(<LotsPage />);

      const rows = screen.getAllByRole("row");
      const row2 = rows[2];
      expect(within(row2).getByText("Subir imagen")).toBeInTheDocument();
      const spinner = within(row2).getByText("Subir imagen").closest("button")!.querySelector(".animate-spin");
      expect(spinner).toBeInTheDocument();
    });
  });
});

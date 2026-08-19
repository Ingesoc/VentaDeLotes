import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ContactForm } from "../ContactForm";
import type { SubmitLeadFn } from "../../hooks/useContactForm";
import type { SubmitLeadResult } from "@/lib/leads";

// El componente recibe la función de envío inyectada (DIP): no depende del
// cliente de Supabase, así que los tests no necesitan mockear ningún módulo.
function renderForm(submitLead?: SubmitLeadFn) {
  return render(<ContactForm submitLead={submitLead} />);
}

async function fillValidForm(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByPlaceholderText(/nombre completo/i), "Juan Pérez");
  await user.type(
    screen.getByPlaceholderText(/correo electrónico/i),
    "juan@example.com",
  );
  await user.type(
    screen.getByPlaceholderText(/número de teléfono/i),
    "3001234567",
  );
}

describe("ContactForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the form with all fields", () => {
    renderForm();

    expect(
      screen.getByRole("heading", { name: /inicia tu historia/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/nombre completo/i),
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/correo electrónico/i),
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/número de teléfono/i),
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/¿en qué lote estás interesado/i),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /enviar solicitud/i }),
    ).toBeInTheDocument();
  });

  it("shows validation errors for empty required fields", async () => {
    const user = userEvent.setup();
    renderForm();

    await user.click(screen.getByRole("button", { name: /enviar solicitud/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/ingresa tu nombre completo/i),
      ).toBeInTheDocument();
      expect(
        screen.getByText(/correo electrónico inválido/i),
      ).toBeInTheDocument();
      expect(
        screen.getByText(/ingresa un número de teléfono válido/i),
      ).toBeInTheDocument();
    });
  });

  it("does not call submitLead when validation fails", async () => {
    const submitLead = vi.fn();
    const user = userEvent.setup();
    renderForm(submitLead);

    await user.click(screen.getByRole("button", { name: /enviar solicitud/i }));

    expect(submitLead).not.toHaveBeenCalled();
  });

  it("validates email format", async () => {
    const user = userEvent.setup();
    renderForm();

    await user.type(screen.getByPlaceholderText(/nombre completo/i), "Juan Pérez");
    await user.type(
      screen.getByPlaceholderText(/correo electrónico/i),
      "email-invalido",
    );
    await user.type(
      screen.getByPlaceholderText(/número de teléfono/i),
      "3001234567",
    );

    await user.click(screen.getByRole("button", { name: /enviar solicitud/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/correo electrónico inválido/i),
      ).toBeInTheDocument();
    });
  });

  it("submits the form successfully", async () => {
    const submitLead = vi.fn().mockResolvedValue({ ok: true });
    const user = userEvent.setup();
    renderForm(submitLead);

    await fillValidForm(user);
    await user.click(screen.getByRole("button", { name: /enviar solicitud/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/tu mensaje ha sido enviado con éxito/i),
      ).toBeInTheDocument();
    });

    expect(submitLead).toHaveBeenCalledWith({
      name: "Juan Pérez",
      email: "juan@example.com",
      phone: "3001234567",
      message: "",
    });
  });

  it("shows error message when submission fails", async () => {
    const submitLead = vi
      .fn()
      .mockResolvedValue({ ok: false, error: new Error("Database error") });
    const user = userEvent.setup();
    renderForm(submitLead);

    await fillValidForm(user);
    await user.click(screen.getByRole("button", { name: /enviar solicitud/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/hubo un error al enviar el formulario/i),
      ).toBeInTheDocument();
    });
  });

  it("disables the submit button while submitting", async () => {
    let resolvePromise!: (value: SubmitLeadResult) => void;
    const submitLead = vi.fn<SubmitLeadFn>(
      () =>
        new Promise<SubmitLeadResult>((resolve) => {
          resolvePromise = resolve;
        }),
    );
    const user = userEvent.setup();
    renderForm(submitLead);

    await fillValidForm(user);
    await user.click(screen.getByRole("button", { name: /enviar solicitud/i }));

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /enviando/i }),
      ).toBeDisabled();
    });

    // Clean up: resolve the pending promise
    resolvePromise({ ok: true });
  });
});

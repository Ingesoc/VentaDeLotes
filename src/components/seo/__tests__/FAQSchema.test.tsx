import { describe, it, expect, beforeEach } from "vitest";
import { render, waitFor, cleanup } from "@testing-library/react";
import { HelmetProvider } from "react-helmet-async";
import FAQSchema from "../FAQSchema";
import type { FAQItem } from "../FAQSchema";

const SAMPLE_FAQS: FAQItem[] = [
  {
    question: "¿Cuánto cuesta un lote?",
    answer: "Desde $158 millones COP.",
  },
  {
    question: "¿Cómo compro?",
    answer: "Contacta por WhatsApp.",
  },
];

function renderFAQ(items: FAQItem[]) {
  return render(
    <HelmetProvider>
      <FAQSchema items={items} />
    </HelmetProvider>,
  );
}

interface JsonLdFAQ {
  "@context": string;
  "@type": string;
  mainEntity: Array<{
    "@type": string;
    name: string;
    acceptedAnswer: {
      "@type": string;
      text: string;
    };
  }>;
}

function getJsonLd(): JsonLdFAQ | null {
  const script = document.querySelector('script[type="application/ld+json"]');
  if (!script?.textContent) return null;
  return JSON.parse(script.textContent) as JsonLdFAQ;
}

async function waitForHelmet() {
  await waitFor(() => {});
}

describe("FAQSchema", () => {
  beforeEach(() => {
    cleanup();
  });

  it("renders FAQPage type with correct context", async () => {
    renderFAQ(SAMPLE_FAQS);
    await waitForHelmet();
    const schema = getJsonLd();
    expect(schema?.["@context"]).toBe("https://schema.org");
    expect(schema?.["@type"]).toBe("FAQPage");
  });

  it("creates one mainEntity per FAQ item", async () => {
    renderFAQ(SAMPLE_FAQS);
    await waitForHelmet();
    const schema = getJsonLd();
    const entities = schema!.mainEntity;
    expect(entities).toHaveLength(2);
  });

  it("maps question to Question type with name field", async () => {
    renderFAQ(SAMPLE_FAQS);
    await waitForHelmet();
    const schema = getJsonLd();
    const entities = schema!.mainEntity;
    expect(entities[0]["@type"]).toBe("Question");
    expect(entities[0].name).toBe("¿Cuánto cuesta un lote?");
  });

  it("maps answer to acceptedAnswer with Answer type", async () => {
    renderFAQ(SAMPLE_FAQS);
    await waitForHelmet();
    const schema = getJsonLd();
    const entities = schema!.mainEntity;
    expect(entities[0].acceptedAnswer).toEqual({
      "@type": "Answer",
      text: "Desde $158 millones COP.",
    });
  });

  it("handles empty FAQ array", async () => {
    renderFAQ([]);
    await waitForHelmet();
    const schema = getJsonLd();
    expect(schema).not.toBeNull();
    const entities = schema!.mainEntity;
    expect(entities).toEqual([]);
  });

  it("renders all items in order", async () => {
    renderFAQ(SAMPLE_FAQS);
    await waitForHelmet();
    const schema = getJsonLd();
    const entities = schema!.mainEntity;
    expect(entities[1].name).toBe("¿Cómo compro?");
    expect(entities[1].acceptedAnswer.text).toBe("Contacta por WhatsApp.");
  });

  it("does not render visible content (schema-only)", async () => {
    const { container } = renderFAQ(SAMPLE_FAQS);
    await waitForHelmet();
    // FAQSchema should only render a script tag, no visible DOM elements
    expect(container.querySelector("script[type=\"application/ld+json\"]")).not.toBeNull();
    expect(container.querySelector("div")).toBeNull();
  });
});

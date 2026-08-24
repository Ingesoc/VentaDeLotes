import { describe, it, expect, beforeEach } from "vitest";
import { render, waitFor, cleanup } from "@testing-library/react";
import { HelmetProvider } from "react-helmet-async";
import BreadcrumbSchema from "../BreadcrumbSchema";
import type { BreadcrumbItem } from "../BreadcrumbSchema";

function renderBreadcrumb(items: BreadcrumbItem[]) {
  return render(
    <HelmetProvider>
      <BreadcrumbSchema items={items} />
    </HelmetProvider>,
  );
}

interface JsonLdBreadcrumb {
  "@context": string;
  "@type": string;
  itemListElement: Array<{
    "@type": string;
    position: number;
    name: string;
    item: string;
  }>;
}

function getJsonLd(): JsonLdBreadcrumb | null {
  const script = document.querySelector('script[type="application/ld+json"]');
  if (!script?.textContent) return null;
  return JSON.parse(script.textContent) as JsonLdBreadcrumb;
}

async function waitForHelmet() {
  await waitFor(() => {});
}

describe("BreadcrumbSchema", () => {
  beforeEach(() => {
    cleanup();
  });

  it("always prepends 'Inicio' as the first item", async () => {
    renderBreadcrumb([{ name: "Lotes", url: "https://laholanda.ingesocc.com/projects" }]);
    await waitForHelmet();
    const schema = getJsonLd();
    expect(schema).not.toBeNull();
    const items = schema!.itemListElement;
    expect(items[0]).toEqual({
      "@type": "ListItem",
      position: 1,
      name: "Inicio",
      item: "https://laholanda.ingesocc.com/",
    });
  });

  it("renders correct BreadcrumbList type and context", async () => {
    renderBreadcrumb([]);
    await waitForHelmet();
    const schema = getJsonLd();
    expect(schema?.["@context"]).toBe("https://schema.org");
    expect(schema?.["@type"]).toBe("BreadcrumbList");
  });

  it("renders only 'Inicio' when items array is empty", async () => {
    renderBreadcrumb([]);
    await waitForHelmet();
    const schema = getJsonLd();
    const items = schema!.itemListElement;
    expect(items).toHaveLength(1);
    expect(items[0].name).toBe("Inicio");
  });

  it("renders Inicio + provided items with correct positions", async () => {
    renderBreadcrumb([
      { name: "Lotes", url: "https://laholanda.ingesocc.com/projects" },
      { name: "Lote 03", url: "https://laholanda.ingesocc.com/projects/03" },
    ]);
    await waitForHelmet();
    const schema = getJsonLd();
    const items = schema!.itemListElement;

    expect(items).toHaveLength(3);
    expect(items[0]).toEqual({
      "@type": "ListItem",
      position: 1,
      name: "Inicio",
      item: "https://laholanda.ingesocc.com/",
    });
    expect(items[1]).toEqual({
      "@type": "ListItem",
      position: 2,
      name: "Lotes",
      item: "https://laholanda.ingesocc.com/projects",
    });
    expect(items[2]).toEqual({
      "@type": "ListItem",
      position: 3,
      name: "Lote 03",
      item: "https://laholanda.ingesocc.com/projects/03",
    });
  });

  it("assigns sequential position numbers starting from 1", async () => {
    renderBreadcrumb([
      { name: "A", url: "https://laholanda.ingesocc.com/a" },
      { name: "B", url: "https://laholanda.ingesocc.com/b" },
      { name: "C", url: "https://laholanda.ingesocc.com/c" },
    ]);
    await waitForHelmet();
    const schema = getJsonLd();
    const items = schema!.itemListElement;
    expect(items.map((i) => i.position)).toEqual([1, 2, 3, 4]);
  });

  it("uses laholanda.ingesocc.com as the domain for Inicio", async () => {
    renderBreadcrumb([]);
    await waitForHelmet();
    const schema = getJsonLd();
    const items = schema!.itemListElement;
    expect(items[0].item).toMatch(/^https:\/\/laholanda\.ingesocc\.com/);
  });
});

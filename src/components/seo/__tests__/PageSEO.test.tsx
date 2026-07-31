import { describe, it, expect, beforeEach } from "vitest";
import { render, waitFor, cleanup } from "@testing-library/react";
import { HelmetProvider } from "react-helmet-async";
import PageSEO from "../PageSEO";

function renderSEO(props: React.ComponentProps<typeof PageSEO>) {
  return render(
    <HelmetProvider>
      <PageSEO {...props} />
    </HelmetProvider>,
  );
}

async function waitForHelmet() {
  // Helmet actualiza el <head> de forma asíncrona; esperamos a que actualice
  await waitFor(() => {
    // El microtask de Helmet ya se ejecutó
  });
}

describe("PageSEO", () => {
  // Desmonta el árbol anterior + limpia meta tags de Helmet entre tests
  beforeEach(() => {
    cleanup();
  });

  it("appends '| La Holanda' suffix to the provided title", async () => {
    renderSEO({ title: "Lote 01" });
    await waitForHelmet();
    expect(document.title).toBe("Lote 01 | La Holanda");
  });

  it("uses default description when none provided", async () => {
    renderSEO({ title: "Test" });
    await waitForHelmet();
    const metaDesc = document.querySelector('meta[name="description"]');
    expect(metaDesc).toBeTruthy();
    expect(metaDesc?.getAttribute("content")).toContain("Lotes campestres desde 500 m²");
  });

  it("uses custom description when provided", async () => {
    const customDesc = "Descripción personalizada para testing";
    renderSEO({ title: "Test", description: customDesc });
    await waitForHelmet();
    const metaDesc = document.querySelector('meta[name="description"]');
    expect(metaDesc?.getAttribute("content")).toBe(customDesc);
  });

  it("sets og:type to 'website' by default", async () => {
    renderSEO({ title: "Test" });
    await waitForHelmet();
    const ogType = document.querySelector('meta[property="og:type"]');
    expect(ogType?.getAttribute("content")).toBe("website");
  });

  it("allows overriding og:type", async () => {
    renderSEO({ title: "Test", ogType: "article" });
    await waitForHelmet();
    const ogType = document.querySelector('meta[property="og:type"]');
    expect(ogType?.getAttribute("content")).toBe("article");
  });

  it("sets og:url to default when not provided", async () => {
    renderSEO({ title: "Test" });
    await waitForHelmet();
    const ogUrl = document.querySelector('meta[property="og:url"]');
    expect(ogUrl?.getAttribute("content")).toBe("https://www.laholanda.com/");
  });

  it("uses custom og:url when provided", async () => {
    renderSEO({ title: "Test", ogUrl: "https://www.laholanda.com/projects/01" });
    await waitForHelmet();
    const ogUrl = document.querySelector('meta[property="og:url"]');
    expect(ogUrl?.getAttribute("content")).toBe("https://www.laholanda.com/projects/01");
  });

  it("sets og:locale to es_CO", async () => {
    renderSEO({ title: "Test" });
    await waitForHelmet();
    const locale = document.querySelector('meta[property="og:locale"]');
    expect(locale?.getAttribute("content")).toBe("es_CO");
  });

  it("sets twitter:card to summary_large_image", async () => {
    renderSEO({ title: "Test" });
    await waitForHelmet();
    const twitterCard = document.querySelector('meta[name="twitter:card"]');
    expect(twitterCard?.getAttribute("content")).toBe("summary_large_image");
  });

  it("adds noindex when noindex=true", async () => {
    renderSEO({ title: "Test", noindex: true });
    await waitForHelmet();
    const robots = document.querySelector('meta[name="robots"]');
    expect(robots?.getAttribute("content")).toBe("noindex, nofollow");
  });

  it("does not add noindex when noindex=false", async () => {
    renderSEO({ title: "Test", noindex: false });
    await waitForHelmet();
    const robots = document.querySelector('meta[name="robots"]');
    expect(robots).toBeNull();
  });

  it("does not add noindex by default (noindex prop not set)", async () => {
    renderSEO({ title: "Test" });
    await waitForHelmet();
    const robots = document.querySelector('meta[name="robots"]');
    expect(robots).toBeNull();
  });

  it("uses custom og:image when provided", async () => {
    const customImage = "https://example.com/image.jpg";
    renderSEO({ title: "Test", ogImage: customImage });
    await waitForHelmet();
    const ogImage = document.querySelector('meta[property="og:image"]');
    expect(ogImage?.getAttribute("content")).toBe(customImage);
  });

  it("sets og:image:width and og:image:height", async () => {
    renderSEO({ title: "Test" });
    await waitForHelmet();
    const ogWidth = document.querySelector('meta[property="og:image:width"]');
    const ogHeight = document.querySelector('meta[property="og:image:height"]');
    expect(ogWidth?.getAttribute("content")).toBe("1200");
    expect(ogHeight?.getAttribute("content")).toBe("630");
  });

  it("uses custom keywords when provided", async () => {
    const customKeywords = "test, keywords, custom";
    renderSEO({ title: "Test", keywords: customKeywords });
    await waitForHelmet();
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    expect(metaKeywords?.getAttribute("content")).toBe(customKeywords);
  });

  it("sets og:site_name correctly", async () => {
    renderSEO({ title: "Test" });
    await waitForHelmet();
    const siteName = document.querySelector('meta[property="og:site_name"]');
    expect(siteName?.getAttribute("content")).toBe("La Holanda — Parcelación Campestre");
  });
});

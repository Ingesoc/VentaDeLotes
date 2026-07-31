import { describe, it, expect } from "vitest";
import { bottomNavItems } from "@/constants/navLinks";

describe("bottomNavItems", () => {
  it("has exactly 4 items", () => {
    expect(bottomNavItems).toHaveLength(4);
  });

  it("each item has required fields", () => {
    for (const item of bottomNavItems) {
      expect(item.label).toBeTruthy();
      expect(item.to).toBeTruthy();
      expect(item.icon).toBeTruthy();
    }
  });

  it("each item routes to a valid path starting with /", () => {
    for (const item of bottomNavItems) {
      expect(item.to).toMatch(/^\//);
    }
  });

  it("has an 'Explorar' item pointing to /projects", () => {
    const explorar = bottomNavItems.find((i) => i.label === "Explorar");
    expect(explorar).toBeDefined();
    expect(explorar!.to).toBe("/projects");
    expect(explorar!.icon).toBe("Compass");
  });

  it("has an 'Invertir' item pointing to /investment", () => {
    const invertir = bottomNavItems.find((i) => i.label === "Invertir");
    expect(invertir).toBeDefined();
    expect(invertir!.to).toBe("/investment");
    expect(invertir!.icon).toBe("TrendingUp");
  });

  it("has a 'Guardados' item pointing to /saved", () => {
    const guardados = bottomNavItems.find((i) => i.label === "Guardados");
    expect(guardados).toBeDefined();
    expect(guardados!.to).toBe("/saved");
    expect(guardados!.icon).toBe("Heart");
  });

  it("has a 'Contacto' item pointing to /contact", () => {
    const contacto = bottomNavItems.find((i) => i.label === "Contacto");
    expect(contacto).toBeDefined();
    expect(contacto!.to).toBe("/contact");
    expect(contacto!.icon).toBe("Phone");
  });
});

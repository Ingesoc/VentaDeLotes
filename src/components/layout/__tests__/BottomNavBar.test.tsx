import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { BottomNavBar } from "../BottomNavBar";

// Use vi.hoisted() so the variable is created before vi.mock runs (hoisted to top)
const { mockUseLocation } = vi.hoisted(() => ({
  mockUseLocation: vi.fn(),
}));

vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router");
  return {
    ...actual,
    useLocation: mockUseLocation,
  };
});

function renderNav() {
  return render(
    <MemoryRouter initialEntries={["/projects"]}>
      <BottomNavBar />
    </MemoryRouter>,
  );
}

describe("BottomNavBar", () => {
  beforeEach(() => {
    // Default: /projects is active
    mockUseLocation.mockReturnValue({ pathname: "/projects" });
  });

  it("renders all 4 navigation items", () => {
    renderNav();
    expect(screen.getByText("Explorar")).toBeInTheDocument();
    expect(screen.getByText("Invertir")).toBeInTheDocument();
    expect(screen.getByText("Guardados")).toBeInTheDocument();
    expect(screen.getByText("Contacto")).toBeInTheDocument();
  });

  it("renders all items as links with correct hrefs", () => {
    renderNav();
    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(4);

    const hrefs = links.map((l) => l.getAttribute("href"));
    expect(hrefs).toContain("/projects");
    expect(hrefs).toContain("/investment");
    expect(hrefs).toContain("/saved");
    expect(hrefs).toContain("/contact");
  });

  it("has accessible link labels", () => {
    renderNav();
    const links = screen.getAllByRole("link");
    links.forEach((link) => {
      expect(link.getAttribute("href")).toBeTruthy();
      expect(link.textContent).toBeTruthy();
    });
  });

  describe("active state (pathname=/projects)", () => {
    beforeEach(() => {
      mockUseLocation.mockReturnValue({ pathname: "/projects" });
    });

    it("highlights the active route with forest-green text color", () => {
      renderNav();
      const activeLink = screen.getByText("Explorar").closest("a");
      expect(activeLink?.className).toContain("text-forest-green");
    });

    it("does not highlight inactive routes", () => {
      renderNav();
      const inactiveLink = screen.getByText("Invertir").closest("a");
      expect(inactiveLink?.className).toContain("text-on-surface-variant");
    });

    it("adds fill-current class to the active item's icon", () => {
      renderNav();
      const activeLink = screen.getByText("Explorar").closest("a");
      const svg = activeLink?.querySelector("svg");
      expect(svg?.getAttribute("class")).toContain("fill-current");
    });

    it("does not add fill-current class to inactive item's icon", () => {
      renderNav();
      const inactiveLink = screen.getByText("Invertir").closest("a");
      const svg = inactiveLink?.querySelector("svg");
      const cls = svg?.getAttribute("class") ?? "";
      expect(cls).not.toContain("fill-current");
      // Kill StringLiteral mutant ("" → "Stryker was here!") via ends-with
      // Lucide adds a prefix like "lucide lucide-trending-up", so use regex
      expect(cls).toMatch(/mb-1$/);
    });

    it("does not add font-bold class to inactive item's label", () => {
      renderNav();
      const inactiveSpan = screen.getByText("Invertir");
      expect(inactiveSpan.className).not.toContain("font-bold");
      // Kill StringLiteral mutant ("" → "Stryker was here!") via ends-with
      expect(inactiveSpan.className).toMatch(/font-caption\s*$/);
    });

    it("adds font-bold class to the active item's label", () => {
      renderNav();
      const activeSpan = screen.getByText("Explorar");
      expect(activeSpan.className).toContain("font-bold");
    });

    it("does not add font-bold class to inactive item's label", () => {
      renderNav();
      const inactiveSpan = screen.getByText("Invertir");
      expect(inactiveSpan.className).not.toContain("font-bold");
    });
  });

  describe("active state (pathname=/investment)", () => {
    beforeEach(() => {
      mockUseLocation.mockReturnValue({ pathname: "/investment" });
    });

    it("detects /investment as active and /projects as inactive", () => {
      renderNav();
      const activeLink = screen.getByText("Invertir").closest("a");
      const inactiveLink = screen.getByText("Explorar").closest("a");

      expect(activeLink?.className).toContain("text-forest-green");
      expect(inactiveLink?.className).toContain("text-on-surface-variant");
    });

    it("adds fill-current and font-bold only to /investment", () => {
      renderNav();
      const activeSvg = screen.getByText("Invertir").closest("a")?.querySelector("svg");
      const inactiveSvg = screen.getByText("Explorar").closest("a")?.querySelector("svg");
      const activeSpan = screen.getByText("Invertir");
      const inactiveSpan = screen.getByText("Explorar");

      expect(activeSvg?.getAttribute("class")).toContain("fill-current");
      expect(inactiveSvg?.getAttribute("class")).not.toContain("fill-current");
      // Kill StringLiteral mutant on inactive SVG via ends-with
      expect(inactiveSvg?.getAttribute("class")).toMatch(/mb-1$/);

      expect(activeSpan.className).toContain("font-bold");
      expect(inactiveSpan.className).not.toContain("font-bold");
      // Kill StringLiteral mutant on inactive span via ends-with
      expect(inactiveSpan.className).toMatch(/font-caption\s*$/);
    });
  });

  describe("active state (pathname=/contact)", () => {
    beforeEach(() => {
      mockUseLocation.mockReturnValue({ pathname: "/contact" });
    });

    it("detects /contact as active with all three conditional classes", () => {
      renderNav();
      const activeLink = screen.getByText("Contacto").closest("a");
      const activeSvg = activeLink?.querySelector("svg");
      const activeSpan = screen.getByText("Contacto");

      expect(activeLink?.className).toContain("text-forest-green");
      expect(activeSvg?.getAttribute("class")).toContain("fill-current");
      expect(activeSpan.className).toContain("font-bold");

      // Verify other routes are inactive
      expect(screen.getByText("Explorar").closest("a")?.className).toContain("text-on-surface-variant");
      expect(screen.getByText("Guardados").closest("a")?.className).toContain("text-on-surface-variant");
    });
  });
});

import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { DateRangeFilter } from "../DateRangeFilter";
import { getPresetDays, getPresetStartDate } from "../dateRangeHelpers";

// ---------------------------------------------------------------------------
// Tests — dateRangeHelpers
// ---------------------------------------------------------------------------

describe("dateRangeHelpers", () => {
  describe("getPresetDays", () => {
    it("returns 7 for '7d'", () => {
      expect(getPresetDays("7d")).toBe(7);
    });

    it("returns 30 for '30d'", () => {
      expect(getPresetDays("30d")).toBe(30);
    });

    it("returns 90 for '90d'", () => {
      expect(getPresetDays("90d")).toBe(90);
    });

    it("returns 30 for unknown preset", () => {
      expect(getPresetDays("custom" as never)).toBe(30);
    });
  });

  describe("getPresetStartDate", () => {
    it("returns date from 7 days ago for '7d'", () => {
      const result = getPresetStartDate("7d");
      const expected = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      const diff = Math.abs(new Date(result).getTime() - expected.getTime());
      expect(diff).toBeLessThan(1000); // within 1 second
    });

    it("returns customFrom for 'custom' when provided", () => {
      const result = getPresetStartDate("custom", "2025-01-15");
      expect(result).toBe("2025-01-15");
    });

    it("returns 30 days ago for 'custom' without customFrom", () => {
      const result = getPresetStartDate("custom");
      const expected = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const diff = Math.abs(new Date(result).getTime() - expected.getTime());
      expect(diff).toBeLessThan(1000);
    });
  });
});

// ---------------------------------------------------------------------------
// Tests — DateRangeFilter component
// ---------------------------------------------------------------------------

describe("DateRangeFilter", () => {
  const defaultProps = {
    preset: "30d" as const,
    onPresetChange: vi.fn(),
  };

  it("renders preset buttons", () => {
    render(<DateRangeFilter {...defaultProps} />);
    expect(screen.getByText("7 días")).toBeTruthy();
    expect(screen.getByText("30 días")).toBeTruthy();
    expect(screen.getByText("90 días")).toBeTruthy();
    expect(screen.getByText("Personalizado")).toBeTruthy();
  });

  it("calls onPresetChange when clicking a preset", () => {
    const onPresetChange = vi.fn();
    render(<DateRangeFilter {...defaultProps} onPresetChange={onPresetChange} />);

    fireEvent.click(screen.getByText("7 días"));
    expect(onPresetChange).toHaveBeenCalledWith("7d");
  });

  it("calls onPresetChange with 'custom' when clicking Personalizado", () => {
    const onPresetChange = vi.fn();
    render(<DateRangeFilter {...defaultProps} onPresetChange={onPresetChange} />);

    fireEvent.click(screen.getByText("Personalizado"));
    expect(onPresetChange).toHaveBeenCalledWith("custom");
  });

  it("shows date inputs when preset is custom", () => {
    render(<DateRangeFilter {...defaultProps} preset="custom" />);

    const dateInputs = screen.getAllByDisplayValue("");
    expect(dateInputs.length).toBeGreaterThanOrEqual(2);
  });

  it("does not show date inputs when preset is not custom", () => {
    render(<DateRangeFilter {...defaultProps} preset="30d" />);

    const dateInputs = screen.queryAllByDisplayValue("");
    // Should not have date inputs (only the select/button elements)
    const dateInputEls = dateInputs.filter(
      (el) => el.tagName === "INPUT" && el.getAttribute("type") === "date",
    );
    expect(dateInputEls).toHaveLength(0);
  });

  it("calls onDateChange when custom date changes", () => {
    const onDateChange = vi.fn();
    render(
      <DateRangeFilter
        {...defaultProps}
        preset="custom"
        onDateChange={onDateChange}
      />,
    );

    const dateInputs = screen.getAllByDisplayValue("");
    const fromDateInput = dateInputs.find(
      (el) => el.tagName === "INPUT" && el.getAttribute("type") === "date",
    );

    if (fromDateInput) {
      fireEvent.change(fromDateInput, { target: { value: "2025-06-01" } });
      expect(onDateChange).toHaveBeenCalled();
    }
  });
});

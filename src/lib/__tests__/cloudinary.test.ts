import { describe, it, expect } from "vitest";
import { cldUrl, CLD_WIDTHS } from "@/lib/cloudinary";

const CLOUDINARY_URL =
  "https://res.cloudinary.com/j5a9xyaq/image/upload/v1784303937/laholanda/landscapes/DJI_0131.webp";

describe("cldUrl", () => {
  it("returns the URL unchanged if it is not a Cloudinary URL", () => {
    const externalUrl = "https://example.com/image.jpg";
    expect(cldUrl(externalUrl)).toBe(externalUrl);
  });

  it("returns the URL unchanged for a relative path", () => {
    const relative = "/images/photo.jpg";
    expect(cldUrl(relative)).toBe(relative);
  });

  it("returns the URL unchanged for a data URI", () => {
    const dataUri = "data:image/png;base64,iVBORw0KGgo=";
    expect(cldUrl(dataUri)).toBe(dataUri);
  });

  it("adds f_auto and q_auto when called without width", () => {
    const result = cldUrl(CLOUDINARY_URL);
    expect(result).toContain("f_auto");
    expect(result).toContain("q_auto");
    expect(result).not.toContain("dpr_auto");
    expect(result).not.toContain("w_");
  });

  it("adds f_auto,q_auto with correct format", () => {
    const result = cldUrl(CLOUDINARY_URL);
    expect(result).toContain("/image/upload/f_auto,q_auto/");
  });

  it("adds width and dpr_auto when a positive width is provided", () => {
    const result = cldUrl(CLOUDINARY_URL, 800);
    expect(result).toContain("f_auto");
    expect(result).toContain("q_auto");
    expect(result).toContain("dpr_auto");
    expect(result).toContain("w_800");
  });

  it("adds transforms in the correct order: f_auto,q_auto,dpr_auto,w_WIDTH", () => {
    const result = cldUrl(CLOUDINARY_URL, 600);
    expect(result).toContain("/image/upload/f_auto,q_auto,dpr_auto,w_600/");
  });

  it("does not add dpr_auto or width when width is 0", () => {
    const result = cldUrl(CLOUDINARY_URL, 0);
    expect(result).toContain("f_auto,q_auto");
    expect(result).not.toContain("dpr_auto");
    expect(result).not.toContain("w_0");
  });

  it("does not add dpr_auto or width when width is undefined", () => {
    const result = cldUrl(CLOUDINARY_URL, undefined);
    expect(result).not.toContain("dpr_auto");
    expect(result).not.toContain("w_");
  });

  it("does not add dpr_auto or width when width is negative", () => {
    const result = cldUrl(CLOUDINARY_URL, -1);
    expect(result).toContain("f_auto,q_auto");
    expect(result).not.toContain("dpr_auto");
    expect(result).not.toContain("w_");
  });

  it("works with CLD_WIDTHS.HERO constant", () => {
    const result = cldUrl(CLOUDINARY_URL, CLD_WIDTHS.HERO);
    expect(result).toContain("w_1920");
  });

  it("works with CLD_WIDTHS.CAROUSEL constant", () => {
    const result = cldUrl(CLOUDINARY_URL, CLD_WIDTHS.CAROUSEL);
    expect(result).toContain("w_1200");
  });

  it("works with CLD_WIDTHS.MASTERPLAN constant", () => {
    const result = cldUrl(CLOUDINARY_URL, CLD_WIDTHS.MASTERPLAN);
    expect(result).toContain("w_1280");
  });

  it("works with CLD_WIDTHS.LARGE constant", () => {
    const result = cldUrl(CLOUDINARY_URL, CLD_WIDTHS.LARGE);
    expect(result).toContain("w_1000");
  });

  it("works with CLD_WIDTHS.CARD constant", () => {
    const result = cldUrl(CLOUDINARY_URL, CLD_WIDTHS.CARD);
    expect(result).toContain("w_800");
  });

  it("works with CLD_WIDTHS.THUMB constant", () => {
    const result = cldUrl(CLOUDINARY_URL, CLD_WIDTHS.THUMB);
    expect(result).toContain("w_400");
  });

  it("works with CLD_WIDTHS.LOGO constant", () => {
    const result = cldUrl(CLOUDINARY_URL, CLD_WIDTHS.LOGO);
    expect(result).toContain("w_200");
  });

  it("preserves the rest of the URL after the upload segment", () => {
    const result = cldUrl(CLOUDINARY_URL, 500);
    expect(result).toContain("v1784303937/laholanda/landscapes/DJI_0131.webp");
  });

  it("preserves the protocol and host", () => {
    const result = cldUrl(CLOUDINARY_URL, 500);
    expect(result.startsWith("https://res.cloudinary.com/")).toBe(true);
  });

  it("inserts transforms after /image/upload/", () => {
    const result = cldUrl(CLOUDINARY_URL, 300);
    // The original URL has /image/upload/v178...
    // After transform: /image/upload/f_auto,q_auto,dpr_auto,w_300/v178...
    const uploadIndex = result.indexOf("/image/upload/");
    const afterUpload = result.slice(uploadIndex + "/image/upload/".length);
    expect(afterUpload).toMatch(/^f_auto,q_auto,dpr_auto,w_300\//);
  });

  it("handles URLs with existing transforms gracefully", () => {
    const urlWithTransform =
      "https://res.cloudinary.com/j5a9xyaq/image/upload/f_auto/v1784303937/image.jpg";
    const result = cldUrl(urlWithTransform, 400);
    // The replace will replace /image/upload/ with /image/upload/f_auto,q_auto,dpr_auto,w_400/
    // So the original /image/upload/f_auto/ becomes /image/upload/f_auto,q_auto,dpr_auto,w_400/f_auto/
    expect(result).toContain("f_auto,q_auto,dpr_auto,w_400");
  });

  it("does not modify empty string URLs", () => {
    expect(cldUrl("")).toBe("");
  });

  it("does not modify URLs with query parameters that are not Cloudinary", () => {
    const url = "https://example.com/image.jpg?w=800&q=80";
    expect(cldUrl(url)).toBe(url);
  });
});

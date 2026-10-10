import { describe, expect, it } from "vitest";
import { formatGrams, formatNutrient, formatPrice, roundNutrient } from "@/lib/format";

describe("formatPrice", () => {
  it("renders GEL with the ₾ sign in both locales", () => {
    expect(formatPrice(4.5, "ka")).toBe("4,50 ₾");
    expect(formatPrice(13, "ka")).toBe("13 ₾");
    expect(formatPrice(4.5, "en")).toBe("₾4.50");
    expect(formatPrice(13, "en")).toBe("₾13");
  });
});

describe("nutrient rounding (EU guidance)", () => {
  it("keeps one decimal below 10 g and whole grams above", () => {
    expect(formatNutrient("carbohydrateG", 4, "en")).toBe("4.0");
    expect(formatNutrient("carbohydrateG", 6, "en")).toBe("6.0");
    expect(formatNutrient("proteinG", 18, "en")).toBe("18");
  });

  it("rounds salt to 0.01 g below 1 g", () => {
    expect(formatNutrient("saltG", 0.18, "en")).toBe("0.18");
    expect(formatNutrient("saltG", 0.12, "ka")).toBe("0,12");
  });

  it("shows 0 for trace fat and saturates", () => {
    expect(roundNutrient("fatG", 0.4)).toEqual({ value: 0, digits: 0 });
    expect(roundNutrient("saturatesG", 0.05)).toEqual({ value: 0, digits: 0 });
  });

  it("formats grams with the local unit", () => {
    expect(formatGrams(150, "en")).toBe("150 g");
    expect(formatGrams(150, "ka")).toBe("150 გ");
  });
});

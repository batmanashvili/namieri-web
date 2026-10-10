import { describe, expect, it } from "vitest";
import {
  availableSizes,
  isAvailable,
  nutritionFor,
  pricePer100g,
  proteinPerPack,
  servings,
  sizes,
} from "@/content/product";

const bySize = (grams: number) => availableSizes.find((s) => s.weightGrams === grams)!;

describe("content/product", () => {
  it("seeds 150 g and 500 g as available and one coming-soon size without a price", () => {
    expect(availableSizes.map((s) => [s.weightGrams, s.fallbackPriceGel])).toEqual([
      [150, 4.5],
      [500, 13],
    ]);
    const comingSoon = sizes.filter((s) => !isAvailable(s));
    expect(comingSoon).toHaveLength(1);
    expect(comingSoon[0]?.fallbackPriceGel).toBeUndefined();
  });

  it("derives protein per pack as weight × 0.12", () => {
    expect(proteinPerPack(bySize(150))).toBe(18);
    expect(proteinPerPack(bySize(500))).toBe(60);
  });

  it("derives servings of 150 g", () => {
    expect(servings(bySize(150))).toBe(1);
    expect(servings(bySize(500))).toBeCloseTo(3.33, 2);
  });

  it("derives price per 100 g", () => {
    expect(pricePer100g(bySize(150))).toBe(3);
    expect(pricePer100g(bySize(500))).toBe(2.6);
  });

  it("scales nutrition to a 150 g serving", () => {
    const serving = nutritionFor(150);
    expect(serving.energyKcal).toBe(96);
    expect(serving.energyKj).toBe(402);
    expect(serving.proteinG).toBe(18);
    expect(serving.saltG).toBeCloseTo(0.18, 5);
  });
});

import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { contrastRatio, rate } from "@/lib/contrast";

const css = readFileSync(new URL("../../styles/tokens.css", import.meta.url), "utf8");
const hex = (token: string) => {
  const match = new RegExp(`--${token}:\\s*(#[0-9a-f]{6})`, "i").exec(css);
  if (!match?.[1]) throw new Error(`missing token ${token}`);
  return match[1];
};

// Ratios from the Website Brief; tokens.css must keep meeting them.
const briefPairs: [string, string, number][] = [
  ["white", "navy-900", 17],
  ["gold-500", "navy-900", 7.1],
  ["gold-300", "navy-900", 10.5],
  ["gold-700", "cream-50", 5.5],
  ["ink-900", "cream-50", 14.5],
  ["stone-600", "cream-50", 5.6],
  ["glacier-300", "navy-900", 9.9],
  ["success", "cream-50", 5.7],
  ["error", "cream-50", 5.0],
  ["error-300", "navy-900", 4.5],
  ["success-300", "navy-900", 4.5],
];

describe("palette contrast", () => {
  it.each(briefPairs)("%s on %s is at least %d:1", (fg, bg, min) => {
    expect(contrastRatio(hex(fg), hex(bg))).toBeGreaterThanOrEqual(min);
  });

  it("flags gold-500 on cream as failing, as the Brief warns", () => {
    expect(rate(contrastRatio(hex("gold-500"), hex("cream-50")))).toBe("Fail");
  });
});

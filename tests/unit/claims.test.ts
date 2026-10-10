import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

/*
 * Health wording (Website Brief, "Gaps and risks"; Prompt 2, "Why Namieri"):
 * factual nutrition claims only. These words must not appear in any copy, in
 * either language. Wholesale prices must never appear either.
 */
const BANNED: Record<string, RegExp> = {
  probiotic: /probiotic|პრობიოტიკ/i,
  immunity: /immun|იმუნიტეტ/i,
  detox: /detox|დეტოქს/i,
  cure: /\bcure|განკურნ/i,
  treat: /\btreat|მკურნალ/i,
};

// The B2B deck's wholesale prices (2.10 ₾ / 5.60 ₾) must never be published.
const WHOLESALE = /\b2[.,]10\b|\b5[.,]60\b/;

const files = [
  "messages/en.json",
  "messages/ka.json",
  "content/product.ts",
  "content/faq.ts",
  "content/home.ts",
  "content/media.ts",
  "content/recipes.ts",
  "content/testimonials.ts",
  "content/stores.ts",
  "content/legal/en/terms.md",
  "content/legal/en/privacy.md",
  "content/legal/ka/terms.md",
  "content/legal/ka/privacy.md",
];

const read = (path: string) => readFileSync(new URL(`../../${path}`, import.meta.url), "utf8");

describe("published copy", () => {
  it.each(files)("%s has no disallowed health claims", (path) => {
    const text = read(path);
    const found = Object.entries(BANNED)
      .filter(([, pattern]) => pattern.test(text))
      .map(([word]) => word);
    expect(found).toEqual([]);
  });

  it.each(files)("%s has no wholesale prices", (path) => {
    expect(read(path)).not.toMatch(WHOLESALE);
  });

  it("uses the approved protein claim wording", () => {
    const en = JSON.parse(read("messages/en.json"));
    expect(en.Home.why.protein.text).toMatch(
      /^Protein contributes to the maintenance of muscle mass\./,
    );
  });
});

import { describe, expect, it } from "vitest";
import { faq } from "@/content/faq";
import { announcement, HOME_FAQ_COUNT, moments } from "@/content/home";
import { media } from "@/content/media";
import {
  findSize,
  instagramDmUrl,
  isAvailable,
  lowestPriceGel,
  messengerUrl,
  sizes,
  type ProductSize,
} from "@/content/product";
import { recipes } from "@/content/recipes";
import { stores, storeMapUrl } from "@/content/stores";
import { testimonials } from "@/content/testimonials";
import { renderLegalMarkdown, parseFrontMatter, getLegalDocument, legalSlugs } from "@/lib/legal";
import { locales } from "@/lib/i18n/routing";

const ratio = (r: string) =>
  r
    .split("/")
    .map(Number)
    .reduce((a, b) => a / b);

describe("landing content", () => {
  it("has at least six FAQ entries in both languages, with unique ids", () => {
    expect(faq.length).toBeGreaterThanOrEqual(HOME_FAQ_COUNT);
    expect(new Set(faq.map((e) => e.id)).size).toBe(faq.length);
    for (const entry of faq)
      for (const l of locales) {
        expect(entry.question[l].length).toBeGreaterThan(0);
        expect(entry.answer[l].length).toBeGreaterThan(0);
      }
  });

  it("states storage facts from content/product.ts", () => {
    expect(faq[0]?.answer.en).toBe(
      "Keep it in the fridge at +2…+6 °C. It keeps 28 days unopened; eat it within 5 days of opening.",
    );
  });

  it("links moments and recipes to sizes that exist", () => {
    for (const m of moments) if (m.sizeId) expect(findSize(m.sizeId)).toBeDefined();
    for (const r of recipes) expect(findSize(r.sizeId)).toBeDefined();
  });

  it("gives every media slot an exact aspect ratio and bilingual alt text", () => {
    for (const item of Object.values(media)) {
      if (!("ratio" in item)) continue;
      expect(item.width / item.height).toBeCloseTo(ratio(item.ratio), 3);
      expect(item.alt.ka && item.alt.en).toBeTruthy();
      expect(item.src).toMatch(/^\/media\//);
    }
    expect(media.heroVideo.enabled).toBe(false);
  });

  it("ships no testimonials until permitted quotes are supplied, and no stores yet", () => {
    expect(testimonials).toEqual([]);
    expect(stores).toEqual([]);
    expect(announcement?.id).toBeTruthy();
  });
});

describe("product helpers for the landing page", () => {
  it("prices 'from' the cheapest available size, ignoring coming-soon sizes", () => {
    expect(lowestPriceGel()).toBe(4.5);
    const launched: ProductSize[] = sizes.map((s) =>
      isAvailable(s) ? s : { ...s, status: "available", weightGrams: 1000, fallbackPriceGel: 3 },
    );
    expect(lowestPriceGel(launched)).toBe(3);
  });

  it("builds direct-message links", () => {
    expect(instagramDmUrl("https://www.instagram.com/namieri.ge/")).toBe(
      "https://ig.me/m/namieri.ge",
    );
    expect(messengerUrl("https://www.facebook.com/namieri.ge")).toBe("https://m.me/namieri.ge");
    expect(messengerUrl("https://www.facebook.com/profile.php?id=1")).toBe(
      "https://www.facebook.com/profile.php?id=1",
    );
    expect(messengerUrl(undefined)).toBeUndefined();
  });

  it("builds a Google Maps search link for a store", () => {
    expect(
      storeMapUrl({
        id: "x",
        name: { ka: "ა", en: "Shop" },
        district: "vake",
        address: { ka: "ბ", en: "1 Main St" },
        hours: { ka: "", en: "" },
      }),
    ).toBe("https://www.google.com/maps/search/?api=1&query=Shop%2C%201%20Main%20St");
  });
});

describe("legal markdown", () => {
  it("parses front matter and treats documents as drafts unless marked otherwise", () => {
    expect(parseFrontMatter("---\ntitle: Terms\ndraft: false\n---\n# Hi").data).toEqual({
      title: "Terms",
      draft: "false",
    });
    expect(renderLegalMarkdown("No front matter").draft).toBe(true);
    expect(renderLegalMarkdown("---\ndraft: false\n---\n## A").html).toContain("<h2>A</h2>");
  });

  it("has a titled draft of each page in both languages", async () => {
    for (const locale of locales)
      for (const slug of legalSlugs) {
        const doc = await getLegalDocument(locale, slug);
        expect(doc.title).not.toBe("");
        expect(doc.draft).toBe(true);
      }
  });
});

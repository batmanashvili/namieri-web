import type { MetadataRoute } from "next";
import { locales } from "@/lib/i18n/routing";
import { getLegalDocument, legalSlugs } from "@/lib/legal";
import { siteUrl } from "@/lib/site";

/** Indexable pages in both languages, with hreflang alternates. Draft legal pages are left out. */
const PAGES = ["/", "/about", "/where-to-buy", "/contact", "/faq"];

const url = (locale: string, path: string) => `${siteUrl}/${locale}${path === "/" ? "" : path}`;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const legal = await Promise.all(
    legalSlugs.map(async (slug) => ({
      path: `/${slug}`,
      draft: (await getLegalDocument("ka", slug)).draft,
    })),
  );
  const paths = [...PAGES, ...legal.filter((doc) => !doc.draft).map((doc) => doc.path)];

  return paths.flatMap((path) =>
    locales.map((locale) => ({
      url: url(locale, path),
      changeFrequency: "monthly" as const,
      priority: path === "/" ? 1 : 0.7,
      alternates: {
        languages: {
          ...Object.fromEntries(locales.map((l) => [l, url(l, path)])),
          "x-default": url("ka", path),
        },
      },
    })),
  );
}

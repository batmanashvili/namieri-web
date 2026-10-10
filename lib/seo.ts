import type { Metadata } from "next";
import { product } from "@/content/product";
import { locales, ogLocale, type Locale } from "@/lib/i18n/routing";
import { ogSize } from "@/lib/og/size";

type PageMetadataInput = {
  locale: Locale;
  /** Path without the locale prefix, e.g. "/" or "/styleguide". */
  path: string;
  title?: string;
  description?: string;
  /** Keep the page out of search results (styleguide, placeholders). */
  noindex?: boolean;
  /** The page has its own opengraph-image.tsx; otherwise the locale's default is used. */
  ownOgImage?: boolean;
};

const localized = (locale: Locale, path: string) => `/${locale}${path === "/" ? "" : path}`;

/**
 * Per-page metadata: canonical URL, hreflang alternates for ka/en (+ x-default),
 * Open Graph URL and locale, and robots. Merged over the layout defaults.
 */
export function pageMetadata({
  locale,
  path,
  title,
  description,
  noindex = false,
  ownOgImage = false,
}: PageMetadataInput): Metadata {
  const ogImage = ownOgImage
    ? `${localized(locale, path)}/opengraph-image`
    : `/${locale}/opengraph-image`;
  const languages = Object.fromEntries(locales.map((l) => [l, localized(l, path)]));
  return {
    // Omitted keys keep the layout's defaults; an explicit undefined would clear them.
    ...(title ? { title } : {}),
    ...(description ? { description } : {}),
    alternates: {
      canonical: localized(locale, path),
      languages: { ...languages, "x-default": localized("ka", path) },
    },
    // Next replaces (not merges) the parent's openGraph, so every field is restated here.
    openGraph: {
      type: "website",
      siteName: product.brand[locale],
      url: localized(locale, path),
      images: [{ url: ogImage, ...ogSize, alt: product.brand[locale] }],
      locale: ogLocale[locale],
      alternateLocale: locales.filter((l) => l !== locale).map((l) => ogLocale[l]),
      ...(title ? { title } : {}),
      ...(description ? { description } : {}),
    },
    robots: noindex ? { index: false, follow: false } : { index: true, follow: true },
  };
}

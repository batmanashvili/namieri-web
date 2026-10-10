import { defineRouting } from "next-intl/routing";

export const locales = ["ka", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "ka";

export const routing = defineRouting({
  locales,
  defaultLocale,
  // Every route lives under /ka/… or /en/…; "/" redirects using the NEXT_LOCALE
  // cookie, then Accept-Language, then falls back to ka.
  localePrefix: "always",
});

/** BCP 47 tags used for Intl formatting (prices in GEL render with ₾). */
export const intlLocale: Record<Locale, string> = {
  ka: "ka-GE",
  en: "en-GE",
};

/** Open Graph locale codes. */
export const ogLocale: Record<Locale, string> = {
  ka: "ka_GE",
  en: "en_GB",
};

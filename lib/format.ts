import { intlLocale, type Locale } from "@/lib/i18n/routing";
import type { Nutrition } from "@/content/product";

const cache = new Map<string, Intl.NumberFormat>();

function formatter(locale: Locale, options: Intl.NumberFormatOptions) {
  const key = locale + JSON.stringify(options);
  let nf = cache.get(key);
  if (!nf) {
    nf = new Intl.NumberFormat(intlLocale[locale], options);
    cache.set(key, nf);
  }
  return nf;
}

/** GEL price with the ₾ sign: "4,50 ₾" (ka), "₾4.50" (en); whole amounts drop ",00". */
export function formatPrice(amountGel: number, locale: Locale) {
  return formatter(locale, {
    style: "currency",
    currency: "GEL",
    currencyDisplay: "narrowSymbol",
    trailingZeroDisplay: "stripIfInteger",
  }).format(amountGel);
}

export function formatNumber(
  value: number,
  locale: Locale,
  options: Intl.NumberFormatOptions = {},
) {
  return formatter(locale, options).format(value);
}

/** "150 g" / "150 გ". */
export function formatGrams(value: number, locale: Locale, maximumFractionDigits = 0) {
  return formatter(locale, {
    style: "unit",
    unit: "gram",
    maximumFractionDigits,
    minimumFractionDigits: 0,
  }).format(value);
}

export type NutrientKey = keyof Nutrition;

/**
 * Rounds a nutrient for display following the EU labelling guidance
 * (Regulation 1169/2011 rounding guidelines). Returns a number and the
 * fraction digits to show, so "4.0 g" keeps its trailing zero like the label.
 */
export function roundNutrient(key: NutrientKey, value: number): { value: number; digits: number } {
  if (key === "energyKj" || key === "energyKcal") return { value: Math.round(value), digits: 0 };

  if (key === "saltG") {
    if (value >= 1) return { value: Math.round(value * 10) / 10, digits: 1 };
    if (value > 0.0125) return { value: Math.round(value * 100) / 100, digits: 2 };
    return { value: 0, digits: 0 };
  }

  const zeroBelow = key === "saturatesG" ? 0.1 : 0.5;
  if (value >= 10) return { value: Math.round(value), digits: 0 };
  if (value > zeroBelow) return { value: Math.round(value * 10) / 10, digits: 1 };
  return { value: 0, digits: 0 };
}

export function formatNutrient(key: NutrientKey, value: number, locale: Locale) {
  const rounded = roundNutrient(key, value);
  return formatter(locale, {
    minimumFractionDigits: rounded.digits,
    maximumFractionDigits: rounded.digits,
  }).format(rounded.value);
}

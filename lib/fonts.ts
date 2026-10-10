import localFont from "next/font/local";

/*
 * Self-hosted, subset fonts (Latin + Georgian). Placeholders until the designer
 * confirms the brand fonts: to swap, replace the files in styles/fonts/ and
 * update the paths and weights below. Components only use the CSS variables
 * (--nf-* here, --type-* in styles/tokens.css), never the family names.
 *
 * Preloaded: the two display faces and FiraGO Regular. FiraGO Medium shares
 * the "FiraGO" family name so `font-weight: 500` picks it up, but it is not
 * preloaded.
 */

export const firago = localFont({
  src: "../styles/fonts/firago-regular.woff2",
  weight: "400",
  style: "normal",
  display: "swap",
  preload: true,
  variable: "--nf-firago",
  declarations: [{ prop: "font-family", value: "firago" }],
  adjustFontFallback: "Arial",
});

export const firagoMedium = localFont({
  src: "../styles/fonts/firago-medium.woff2",
  weight: "500",
  style: "normal",
  display: "swap",
  preload: false,
  variable: "--nf-firago-medium",
  declarations: [{ prop: "font-family", value: "firago" }],
  adjustFontFallback: false,
});

export const notoSerifGeorgian = localFont({
  src: "../styles/fonts/noto-serif-georgian-600.woff2",
  weight: "600",
  style: "normal",
  display: "swap",
  preload: true,
  variable: "--nf-noto-serif-georgian",
  adjustFontFallback: "Times New Roman",
});

export const cormorantGaramond = localFont({
  src: "../styles/fonts/cormorant-garamond-600.woff2",
  weight: "600",
  style: "normal",
  display: "swap",
  preload: true,
  variable: "--nf-cormorant-garamond",
  adjustFontFallback: "Times New Roman",
});

export const fontVariables = [firago, firagoMedium, notoSerifGeorgian, cormorantGaramond]
  .map((font) => font.variable)
  .join(" ");

import "server-only";
import { readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * Reads the palette straight from styles/tokens.css, so the styleguide always
 * shows the values the site actually uses.
 */
export function readPalette(): Record<string, string> {
  const css = readFileSync(join(process.cwd(), "styles/tokens.css"), "utf8");
  const root = css.slice(css.indexOf(":root {"), css.indexOf("}", css.indexOf(":root {")));
  const palette: Record<string, string> = {};
  for (const match of root.matchAll(/--([a-z]+(?:-\d+)?):\s*(#[0-9a-f]{6})\b/gi)) {
    const [, name, hex] = match;
    if (name && hex) palette[name] = hex.toUpperCase();
  }
  return palette;
}

export type PaletteEntry = {
  token: string;
  name: string;
  /** Foreground/background pairs checked for contrast. */
  pairs: { fg: string; bg: string }[];
  derived?: boolean;
};

// Display names are the Brief's; pairs are the ones the Brief rates.
export const paletteEntries: PaletteEntry[] = [
  { token: "navy-900", name: "Midnight Navy", pairs: [{ fg: "white", bg: "navy-900" }] },
  { token: "navy-950", name: "Deep Ink", pairs: [{ fg: "white", bg: "navy-950" }] },
  {
    token: "gold-500",
    name: "Aegean Gold",
    pairs: [
      { fg: "gold-500", bg: "navy-900" },
      { fg: "navy-900", bg: "gold-500" },
      { fg: "gold-500", bg: "cream-50" },
    ],
  },
  { token: "gold-300", name: "Pale Gold", pairs: [{ fg: "gold-300", bg: "navy-900" }] },
  { token: "gold-700", name: "Deep Gold", pairs: [{ fg: "gold-700", bg: "cream-50" }] },
  { token: "cream-50", name: "Yogurt Cream", pairs: [{ fg: "ink-900", bg: "cream-50" }] },
  { token: "white", name: "Pure White", pairs: [{ fg: "ink-900", bg: "white" }] },
  { token: "ink-900", name: "Ink", pairs: [{ fg: "ink-900", bg: "cream-50" }] },
  { token: "stone-600", name: "Stone", pairs: [{ fg: "stone-600", bg: "cream-50" }] },
  { token: "glacier-300", name: "Glacier Blue", pairs: [{ fg: "glacier-300", bg: "navy-900" }] },
  { token: "success", name: "Success", pairs: [{ fg: "success", bg: "cream-50" }] },
  { token: "error", name: "Error", pairs: [{ fg: "error", bg: "cream-50" }] },
  {
    token: "error-300",
    name: "Error on navy",
    pairs: [{ fg: "error-300", bg: "navy-900" }],
    derived: true,
  },
  {
    token: "success-300",
    name: "Success on navy",
    pairs: [{ fg: "success-300", bg: "navy-900" }],
    derived: true,
  },
];

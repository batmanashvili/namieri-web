import "server-only";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { marked } from "marked";
import type { Locale } from "@/lib/i18n/routing";

/*
 * Legal pages render Markdown from content/legal/{locale}/{slug}.md, read at
 * build time. Front matter (between --- lines) sets the title, the
 * "updated" date and `draft: true`, which shows the Draft banner and keeps
 * the page out of search results. Files are trusted repository content.
 */

export const legalSlugs = ["terms", "privacy"] as const;
export type LegalSlug = (typeof legalSlugs)[number];

export type LegalDocument = {
  title: string;
  updated?: string;
  draft: boolean;
  html: string;
};

export function parseFrontMatter(source: string): { data: Record<string, string>; body: string } {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!match) return { data: {}, body: source };
  const data: Record<string, string> = {};
  for (const line of match[1]!.split(/\r?\n/)) {
    const separator = line.indexOf(":");
    if (separator > 0) data[line.slice(0, separator).trim()] = line.slice(separator + 1).trim();
  }
  return { data, body: source.slice(match[0].length) };
}

export function renderLegalMarkdown(source: string): LegalDocument {
  const { data, body } = parseFrontMatter(source);
  return {
    title: data.title ?? "",
    updated: data.updated || undefined,
    draft: data.draft !== "false",
    html: marked.parse(body, { async: false, gfm: true }),
  };
}

export async function getLegalDocument(locale: Locale, slug: LegalSlug): Promise<LegalDocument> {
  const file = join(process.cwd(), "content/legal", locale, `${slug}.md`);
  return renderLegalMarkdown(await readFile(file, "utf8"));
}

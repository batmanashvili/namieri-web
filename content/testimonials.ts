/**
 * "What people say". Only quotes Namieri has permission to publish, with the
 * person's first name (Website Brief, open question 7). The landing-page
 * section is hidden while this list is empty; show 3–6 entries.
 *
 * Example entry:
 *   {
 *     id: "nino-2026-09",
 *     quote: { ka: "…", en: "…" },
 *     name: { ka: "ნინო", en: "Nino" },
 *     source: { ka: "Instagram-ის შეფასება", en: "Instagram review" },
 *   },
 */
import type { Localized } from "./product";

export type Testimonial = {
  id: string;
  quote: Localized;
  name: Localized;
  source?: Localized;
};

export const testimonials: readonly Testimonial[] = [];

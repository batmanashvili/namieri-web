# Blockers and open items

Things the site needs from Namieri, or decisions still to make, before Phase 2 goes live. Each
one is a content or configuration change unless noted. Items marked `[CONFIRM]` in the code
point here.

## Needed before launch

| #   | Item                           | Where it goes                                                     | What happens until then                                                                                                                                                            |
| --- | ------------------------------ | ----------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | **Wholesale lead endpoint**    | `LEAD_WEBHOOK_URL` (+ optional `LEAD_WEBHOOK_SECRET`)             | No contact/lead endpoint is documented for the stenley.ge backend. Enquiries are logged in development and previews; **in production the form shows the phone and email instead**. |
| 2   | Wolt venue link                | `NEXT_PUBLIC_WOLT_URL`                                            | "Order on Wolt" buttons are replaced by "Where to buy", and the Wolt card says to search for "Namieri Saburtalo" in the app.                                                       |
| 3   | Facebook page link             | `NEXT_PUBLIC_FACEBOOK_URL` (or `NEXT_PUBLIC_MESSENGER_URL`)       | The Facebook icon and "Message on Facebook" button are hidden.                                                                                                                     |
| 4   | About text from the info sheet | `messages/*.json` → `About.story1`, `About.story2`                | The Prompt asks for the info sheet's About text (Georgian and English); it was not attached. The current text is written from the Brief's facts and the founder story.             |
| 5   | Legal texts                    | `content/legal/{ka,en}/{terms,privacy}.md`; set `draft: false`    | Draft outlines with a visible "Draft" banner; pages are `noindex` and left out of the sitemap.                                                                                     |
| 6   | Real photos and renders        | `content/media.ts`, `content/product.ts` (`image.src`)            | On-brand SVG placeholders at each slot's exact aspect ratio.                                                                                                                       |
| 7   | Hero video loop                | `content/media.ts` → `heroVideo` (`enabled: true`, real mp4/webm) | Off. The slot behind the product renders nothing.                                                                                                                                  |
| 8   | Production site URL            | `NEXT_PUBLIC_SITE_URL` once a custom domain exists                | Canonical URLs, sitemap and share images use the Vercel production domain.                                                                                                         |

## Content to confirm (`[CONFIRM]`)

- **Milk wording**: "fresh Georgian milk" is used everywhere until Namieri confirms raw vs
  pasteurized (Brief, inconsistency 2).
- **Recognition code**: GE 01.10.51.0.3050 vs N 09/8527 on the label (`content/product.ts`).
- **"How it's made" steps**: wording in `messages/*.json` → `Home.process.steps`.
- **Recipes**: the three recipes in `content/recipes.ts` are seeded placeholders for the
  Instagram recipe series. Confirm titles, times and sizes, and link each to its post.
- **Testimonials**: `content/testimonials.ts` is empty, so "What people say" is hidden. Add 3–6
  quotes Namieri has permission to publish, with first names. Reviews are never invented.
- **Stores**: `content/stores.ts` is empty, so `/where-to-buy` shows "Stores coming soon" and the
  landing page hides its stores teaser.
- **Announcement**: `content/home.ts` → `announcement` ("Delivery across Tbilisi · Also on Wolt").
  Set it to `null` to hide the bar.
- **Health wording**: only the Prompt's approved claims are used. `tests/unit/claims.test.ts`
  fails if "probiotic", "immunity", "detox", "cure" or "treat" (or the Georgian equivalents),
  or the wholesale prices, appear in any copy. Confirm with the food-safety adviser.
- **Georgian copy**: all new strings are drafts for Namieri to proof.

## Known gaps (by design in this phase)

- Every "Order now" links to `/[locale]/product`, which arrives in Phase 3. Until then it shows
  the on-brand 404 page.
- `/recipes` doesn't exist yet, so it was removed from the navigation; recipe cards link to
  Instagram.
- There is no returns or refund page; cancellations are covered in the FAQ.

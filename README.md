# Namieri web

Website for **Namieri (ნამიერი)**, Greek yogurt made in Tbilisi, in Georgian and English.

- **Phase 1** (foundation): project setup, routing, design tokens, fonts, motion primitives and
  the component library, all shown on `/ka/styleguide` and `/en/styleguide`.
- **Phase 2** (this release): the landing page and the information pages: About, Where to buy,
  Contact with the wholesale form, FAQ, and draft Terms and Privacy pages.
- Phases 3–4: product page, cart, sign-in and checkout.

What Namieri still needs to supply before launch is listed in [BLOCKERS.md](BLOCKERS.md).

## Stack

- Next.js 16 (App Router, Turbopack), React 19, TypeScript (strict)
- Tailwind CSS 4, with tokens defined in CSS (`styles/`)
- next-intl 4 for `ka` (default) and `en`
- Motion (`motion/react`) for scroll-driven motion
- pnpm, ESLint, Prettier, Vitest, Playwright

## Setup

```bash
corepack enable        # provides the pinned pnpm version
pnpm install
cp .env.example .env.local
pnpm dev               # http://localhost:3000 → redirects to /ka or /en
```

Requires Node 20.9 or later.

| Command                             | What it does                                                              |
| ----------------------------------- | ------------------------------------------------------------------------- |
| `pnpm dev`                          | Development server                                                        |
| `pnpm build` / `pnpm start`         | Production build and server                                               |
| `pnpm lint`                         | ESLint (Next core-web-vitals + TypeScript rules)                          |
| `pnpm typecheck`                    | Generates route and message types, then runs `tsc`                        |
| `pnpm format` / `pnpm format:check` | Prettier, with Tailwind class sorting                                     |
| `pnpm test`                         | Unit tests (content helpers, formatting, phone, contrast, message parity) |
| `pnpm test:e2e`                     | Playwright against the production server. Run `pnpm build` first          |
| `pnpm check`                        | Lint, typecheck, format check and unit tests                              |

`pnpm test:e2e` starts `pnpm start` on port 3100 itself. It runs desktop and 360 px
mobile projects. To test a deployed preview, set `E2E_BASE_URL`. To use a preinstalled
Chromium, set `PLAYWRIGHT_CHROMIUM_EXECUTABLE`.

### Deploying

Import the repository into Vercel (framework: Next.js) and set the environment variables
below for Preview and Production.

Branches:

- **`dev`** is the only branch Vercel deploys. Every push to `dev` goes live on the
  Vercel production domain. Work in a feature branch and merge it into `dev` to deploy.
- **`main`** holds tested, working code only, and only the repo owner updates it. AI agents
  open a pull request from `dev` into `main`; the owner merges it after checking the deployed
  site. Pushes to `main` (and to any other branch) never deploy.

AI agents are blocked from changing `main` by a Claude Code hook
(`.claude/hooks/protect-main.mjs`, registered in `.claude/settings.json`). It stops pushes to
`main`, commits, merges and rebases while on `main`, and merging pull requests. Agent rules
are in `CLAUDE.md`. A GitHub ruleset on `main` additionally blocks force-pushes and deletion,
and requires a pull request from anyone who isn't a repo admin.

This is set in `vercel.json` (`git.deploymentEnabled`) and by the project's production
branch in Vercel (Settings → Environments → Production → Branch Tracking = `dev`).

## Environment variables

| Variable                    | Used for                                                                                                         |
| --------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`      | Absolute origin for canonical URLs, `hreflang` and Open Graph. On Vercel it falls back to the production domain. |
| `NEXT_PUBLIC_API_BASE_URL`  | The existing Namieri backend. Not called in Phase 1.                                                             |
| `NEXT_PUBLIC_WOLT_URL`      | Wolt venue ("Namieri Saburtalo"). When empty, "Order on Wolt" becomes "Where to buy".                            |
| `NEXT_PUBLIC_INSTAGRAM_URL` | Instagram profile. Defaults to instagram.com/namieri.ge. The DM button uses `ig.me/m/<handle>`.                  |
| `NEXT_PUBLIC_FACEBOOK_URL`  | Facebook page. The footer icon and "Message on Facebook" hide when empty.                                        |
| `NEXT_PUBLIC_MESSENGER_URL` | Optional Messenger link; otherwise derived from the Facebook page (`m.me/<page>`).                               |
| `LEAD_WEBHOOK_URL`          | Server-side. Where wholesale enquiries are POSTed as JSON. See "Wholesale enquiries" below.                      |
| `LEAD_WEBHOOK_SECRET`       | Server-side, optional. Sent as a bearer token with each enquiry.                                                 |

These are read in `content/product.ts` (`links`), `lib/site.ts` and `lib/leads/submit.ts`.
`NEXT_PUBLIC_*` values are inlined at build time, so rebuild after changing them.

## Project layout

```
app/
  [locale]/              ka/en root layout, pages, localized 404 (not-found) and 500 (error)
    page.tsx             the landing page (sections in components/home/)
    about/, where-to-buy/, contact/, faq/, terms/, privacy/
    contact/actions.ts   wholesale form server action
    styleguide/          the design-system page (noindex)
    opengraph-image.tsx  default share image; information pages have their own
  sitemap.ts, robots.ts  sitemap with hreflang alternates (draft legal pages left out)
  icon.tsx, apple-icon.tsx  favicons rendered from public/brand/badge.svg
  not-found.tsx, global-error.tsx  bilingual fallbacks outside a locale
components/
  ui/                    primitives, content blocks, forms, feedback
  sections/              site chrome (Header, Footer, …) and shared page sections (PageHero,
                         BuyChannels, FaqList, LeadForm, MapEmbed, LegalPage)
  home/                  the landing page's sections, one file each
  motion/                Reveal, Parallax, CountUp, PinnedScene, MotionProvider
  seo/                   JsonLd
content/                 product.ts (single source of truth), home.ts, media.ts, faq.ts,
                         recipes.ts, testimonials.ts, stores.ts, districts.ts, navigation.ts
  legal/{ka,en}/         terms.md, privacy.md
lib/                     i18n, formatting, fonts, SEO, structured data, analytics, leads,
                         legal Markdown, contrast, phone helpers
messages/                ka.json, en.json: every visible string
styles/                  tokens.css (palette, type, spacing), globals.css (Tailwind theme), fonts/
public/brand/            logo-ka.svg, logo-en.svg, badge.svg (placeholders)
public/images/products/  placeholder product renders
public/media/            photo and video placeholders (placeholder-*), one per slot
proxy.ts                 locale detection and redirects (Next 16 renamed middleware to proxy)
```

## Routing and languages

- Every route lives under `/ka/…` or `/en/…`. `/` redirects using the `NEXT_LOCALE` cookie
  first, then `Accept-Language`, and falls back to `ka`.
- The language switcher keeps the current path (`/ka/styleguide` ↔ `/en/styleguide`).
- `<html lang>`, `hreflang` alternates (`ka`, `en`, `x-default`) and localized titles and
  descriptions are set per page through `pageMetadata()` in `lib/seo.ts`.
- Prices use `formatPrice()` (`Intl.NumberFormat`, `ka-GE` / `en-GE`, GEL with the ₾ sign):
  `4,50 ₾` in Georgian and `₾4.50` in English.

### Adding or changing a string

1. Add the key to **both** `messages/ka.json` and `messages/en.json`. A unit test fails if
   the two files have different keys.
2. Use it in a component:

   ```tsx
   import { useTranslations } from "next-intl";

   const t = useTranslations("Product");
   t("addToCart");
   t("pricePer100g", { price: formatPrice(3, locale) });
   ```

   Server components can use `useTranslations` too, or `getTranslations` when they are async.

3. Keys and ICU arguments are type-checked against `messages/en.json`. Numeric arguments are
   declared as `{days, number}`.
4. A **client** component can only read namespaces listed in `CLIENT_NAMESPACES` in
   `app/[locale]/layout.tsx`. The rest stay on the server, which keeps page weight down. Add
   the namespace there if a new client component needs it.

Facts that come with copy, like size labels, packaging and ingredient names, live in
`content/product.ts` as `{ ka, en }` instead.

## Content model

`content/product.ts` is the single source of truth:

- `sizes[]`: 150 g (4.50 ₾, single cup) and 500 g (13 ₾, resealable tub) are available. The
  third entry is `coming_soon`, with no price and a placeholder label and image. To launch it,
  set `status: "available"`, `weightGrams`, `fallbackPriceGel` and the image.
- Helpers: `proteinPerPack()` (weight × 0.12), `servings()` (weight / 150) and
  `pricePer100g()`.
- `nutritionPer100g`, `ingredients`, `storage`, `company` and `links`.
- `fallbackPriceGel` is the **retail** price, used until prices come from the backend.
  Wholesale prices must never go here.

Items marked `[CONFIRM]` are still unverified: the milk wording and the recognition code.

### Landing and page content

Everything Namieri changes often is a content edit, not a code change:

| File                      | Holds                                                                                                    |
| ------------------------- | -------------------------------------------------------------------------------------------------------- |
| `content/home.ts`         | The announcement bar (`null` hides it), the hero sizes, and which size each "moment" links to.           |
| `content/media.ts`        | Every photo and video slot: `src`, size, aspect ratio and alt text in both languages.                    |
| `content/faq.ts`          | FAQ entries. The first six appear on the landing page; all of them on `/faq`. Both get FAQPage data.     |
| `content/recipes.ts`      | "In the kitchen" recipes (links go to Instagram).                                                        |
| `content/testimonials.ts` | Reviews. The section is hidden while the list is empty. Publish only permitted quotes.                   |
| `content/stores.ts`       | Retail partners (name, district, address, hours, optional map link). Empty shows "Stores coming soon".   |
| `content/legal/`          | Terms and Privacy in Markdown, per language. `draft: true` shows the Draft banner and sets `noindex`.    |
| `messages/*.json`         | Interface copy and the landing-page text (namespaces `Home`, `Buy`, `About`, `Contact`, `Faq`, `Legal`). |

- **Swapping a placeholder for a photo**: put the file in `public/media/` and change `src`
  (and `width`/`height`) in `content/media.ts`. Keep the slot's aspect ratio, which the
  layout reserves.
- **Turning on the hero video**: set `heroVideo.enabled: true` in `content/media.ts`, with
  the real `mp4`, `webm` and `poster`.
- **Launching the third size**: change its entry in `content/product.ts` (see above). Its
  Coming soon card becomes a full size card, with price and link, on the landing page.
- **Health wording**: only the approved, factual claims are used. `pnpm test` fails if
  "probiotic", "immunity", "detox", "cure" or "treat" (in either language), or the
  wholesale prices, appear in any copy.

## Design tokens

- **Palette**: `styles/tokens.css` defines the Brief's tokens as CSS variables on `:root`,
  using the Brief's names (`--navy-900`, `--gold-500`, `--cream-50`, …). `styles/globals.css`
  maps them into the Tailwind theme, so `bg-navy-900` and `text-gold-700` work. Tailwind's
  default palette is switched off, so only brand colours exist.
- **Surfaces**: `<Section tone="navy|cream|white|ink">` (or any `data-surface` attribute) sets
  semantic colours: `fg`, `fg-muted`, `accent`, `hairline`, `focus`, `danger`, and others.
  Components use those, so they adapt to navy, cream and white backgrounds automatically.
- **Derived tokens** (not in the Brief): `error-300` and `success-300`, because `error` and
  `success` fail contrast on navy. The muted text on navy is 75% white.
- **Type**: fluid `clamp()` scale with `text-display`, `text-h1`, `text-h2`, `text-h3`,
  `text-body` and `text-small`, from 360 px to 1440 px. Georgian (`:lang(ka)`) gets +0.1
  line-height. The `.eyebrow` style is uppercase only in Latin, because FiraGO has no Mtavruli
  glyphs. Georgian eyebrows also use lighter tracking (0.04em instead of 0.08em).
- **Spacing** is Tailwind's 4 px scale. Section padding is `--section-pad-sm` (64→96 px) and
  `--section-pad-lg` (96→160 px).
- **Radii**: `rounded-control` (6 px) and `rounded-card` (12 px). There are no shadows.

### Swapping colours

Edit the hex values in `styles/tokens.css` and keep the names. The styleguide reads
`tokens.css` directly, so its hex values and contrast ratios update on the next build.
`pnpm test` checks the ratios the Brief requires.

### Swapping fonts

Fonts are self-hosted via `next/font/local` in `lib/fonts.ts`. They are subset to Latin and
Georgian (≈ 92 KB total). The two display faces and FiraGO Regular are preloaded; FiraGO
Medium is not.

1. Put the new `.woff2` files in `styles/fonts/`. To subset new source TTFs the same way, run
   `scripts/subset-fonts.sh <dir>` (needs `pip install fonttools brotli`).
2. Update the `src`, `weight` and constant names in `lib/fonts.ts`.
3. If a family name changes, update the `--type-*` stacks in `styles/tokens.css`. Components
   only use those variables.
4. If the new Georgian font has Mtavruli (U+1C90–U+1CBF), uppercase eyebrows can be enabled
   by removing the `.eyebrow:lang(ka)` override in `styles/globals.css`.

The Open Graph image uses WOFF copies in `lib/og/`, because Satori cannot read WOFF2.

### Swapping logos and brand art

Replace `public/brand/logo-ka.svg`, `logo-en.svg` and `badge.svg` with the designer's files.

- If a logo's aspect ratio changes, update the sizes in `components/ui/Logo.tsx`.
- Favicons and the apple touch icon are rendered from `badge.svg` at build time.
- Product renders are paths in `content/product.ts` (`image.src`), so swapping a render for
  a photo is a content change.

## Motion

`Reveal` fades in with a 16 px rise over 600 ms, ease-out, once. The other primitives are
`Parallax`, `CountUp` and `PinnedScene` (pinned for at most 1.5 screens). The `YogurtWave`
drift is CSS.

With `prefers-reduced-motion`, CSS shows every primitive in its final state from the first
paint, and the JavaScript never starts. Elements already on screen at load are never hidden,
so motion doesn't delay LCP or cause layout shift.

The landing page's "two ingredients" scene uses `PinnedScene` for one screen of scroll. With
reduced motion it isn't pinned and shows a static "milk + cultures = cup" illustration
instead, and the counters show their final values.

## Analytics and consent

`lib/analytics` exposes `track(event, params)` for the Brief's events (`view_item`,
`add_to_cart`, `click_wolt`, …). Until the visitor accepts analytics cookies, nothing is
sent, queued or loaded. After consent, events go to `window.dataLayer`. To connect GA4 or
GTM, load the vendor script in `loadVendor()`.

Phase 2 fires `cta_order_click` (with the section id), `click_wolt` (with its location),
`select_size_from_landing` and `b2b_form_submit`. Server components place tracked buttons
with `TrackedButton`.

The Contact page map is a Google Maps embed. It loads only after the visitor clicks "Show
map" or has accepted analytics cookies.

## Wholesale enquiries

The Contact page's wholesale form validates each field on blur and everything again on
submit, then once more on the server (`lib/leads/schema.ts`). It posts through a server
action to `submitLead()` in `lib/leads/submit.ts`, which picks a destination:

- `LEAD_WEBHOOK_URL` set: the enquiry is POSTed there as JSON.
- Not set, in development or a Vercel preview: it is logged to the server console and the
  form shows its success state.
- Not set, in production: it is refused, and the form shows Namieri's phone and email instead.
  This way a real enquiry is never silently lost.

No lead endpoint is documented for the existing backend yet. When one exists, add an adapter
in `lib/leads/submit.ts`. The form never shows prices of any kind.

## Codebase knowledge graph (Graphify)

[Graphify](https://github.com/Graphify-Labs/graphify) maps the repo into a knowledge graph,
so AI coding assistants can query structure instead of grepping files. Code is parsed
locally with tree-sitter: no LLM, no API key, about 3 seconds for this repo.

```bash
uv tool install graphifyy==0.9.84   # or: pipx install graphifyy==0.9.84
pnpm graph                          # = graphify update . → graphify-out/
graphify query "where are prices formatted?"
graphify path "SizeCard" "formatPrice"
graphify explain "LanguageSwitcher"
open graphify-out/graph.html        # interactive map
```

- `graphify-out/` is generated and gitignored. Rebuild it after pulling or changing code.
  For a local rebuild on every commit, run `graphify hook install` once.
- **Claude Code**:
  - The project-scoped `/graphify` skill lives in `.claude/skills/graphify/`.
  - `CLAUDE.md` tells Claude to query the graph first.
  - The PreToolUse hooks in `.claude/settings.json` nudge it towards `graphify query` before
    grepping or reading files. They do nothing if Graphify isn't installed.
- **Claude Code cloud sessions**: `.claude/hooks/session-start.sh` runs `pnpm install`,
  installs the pinned Graphify version and builds the graph when a session starts.
- **Other agents** (Codex, Cursor, …) get the same rules from `AGENTS.md`.
- **Upgrading Graphify**:
  1. Install the new version.
  2. Run `graphify install --project` and `graphify claude install` to refresh the skill.
  3. In `.claude/settings.json`, restore the portable hook commands (`command -v graphify … || true`).
     Graphify writes absolute paths there.
- `.graphifyignore` keeps lockfiles, fonts and media out of the graph.

## Quality checks

Measured on the production build (`pnpm build && pnpm start`), Lighthouse 13, mobile:

| Page         | Performance | Accessibility | Best Practices | SEO | LCP (simulated 4G) | LCP (applied 4G) | CLS   | Weight  |
| ------------ | ----------- | ------------- | -------------- | --- | ------------------ | ---------------- | ----- | ------- |
| `/en` (home) | 97–98       | 100           | 100            | 100 | 2.4–2.5 s          | 1.5 s            | 0.001 | ~400 KB |
| `/ka` (home) | 92–95       | 100           | 100            | 100 | 2.9–3.3 s          | 1.6 s            | 0.003 | ~430 KB |
| `/en/about`  | 97          | 100           | 100            | 100 | 2.5 s              | 1.5 s            | 0     | ~375 KB |
| `/ka/about`  | 96–97       | 100           | 100            | 100 | 2.2–2.6 s          | 1.4 s            | 0.043 | ~380 KB |

- The LCP element is the hero heading, which paints about 0.2 s after the response. Lighthouse's
  default simulation ("simulated 4G") also charges every request that starts before that paint
  (framework JS and the fonts), which is why it reads higher than applied 4G throttling
  (`--throttling-method=devtools`). The Georgian home page is the slowest because its four-line
  heading waits on more font bytes.
- To keep LCP down, fonts are not preloaded, Motion's animation features load after
  hydration, and next-intl precompiles messages so the browser doesn't download an ICU parser.
- `/ka/about`'s CLS of 0.043 is the Georgian display font swapping in on the long hero heading.
- Results vary by ±0.3 s between runs; use PageSpeed Insights on the deployed site for field-like
  numbers.

**Playwright** (`pnpm test:e2e`, desktop and 360 px phone) checks:

- every landing section renders in order in both languages;
- every page in both languages at 360, 768, 1280 and 1920 px has no horizontal overflow and no
  orphaned heading words;
- the size cards: two orderable sizes and a Coming soon card without price or link;
- every "Order now" goes to the product page, and the analytics events fire after consent;
- Organization and FAQPage structured data, and a unique title, description and share image per
  page;
- the sticky mobile CTA appears after the hero, with the lowest price;
- reduced motion: the pinned scene is static and the counters show their final values;
- the map loads only after a click or consent;
- the wholesale form validates on blur and on submit, and a valid enquiry shows the success state;
- the legal drafts show the Draft banner and are `noindex`, and there is no returns page;
- the Phase 1 checks: styleguide states, language switching, consent, dialogs.

**Unit tests** (`pnpm test`) also check:

- the health-claim and wholesale-price bans across all copy;
- lead validation and the choice of adapter;
- that the FAQ uses the product facts;
- the media aspect ratios;
- the legal Markdown parsing.

The styleguide chapters use `content-visibility: auto` because the page is very long. If
axe reports contrast on text inside a chapter, give that text an explicit `bg-surface`. The
`Specimen` titles already have one.

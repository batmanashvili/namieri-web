# Namieri web

Website for **Namieri (ნამიერი)**, Greek yogurt made in Tbilisi. This is Phase 1: the
foundation every later page builds on. It contains project setup, Georgian/English routing,
design tokens, fonts, motion primitives and the component library, all shown on
`/ka/styleguide` and `/en/styleguide`.

Real pages, product, cart, auth and backend calls come in Phases 2–4.

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

Import the repository into Vercel (framework: Next.js; no extra config) and set the
environment variables below for Preview and Production. Every pull request then gets a
preview URL. Vercel marks preview deployments `noindex` automatically.

## Environment variables

| Variable                    | Used for                                                                                                         |
| --------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`      | Absolute origin for canonical URLs, `hreflang` and Open Graph. On Vercel it falls back to the production domain. |
| `NEXT_PUBLIC_API_BASE_URL`  | The existing Namieri backend. Not called in Phase 1.                                                             |
| `NEXT_PUBLIC_WOLT_URL`      | Wolt venue ("Namieri Saburtalo"). "Order on Wolt" buttons hide or disable when empty.                            |
| `NEXT_PUBLIC_INSTAGRAM_URL` | Instagram profile. Defaults to instagram.com/namieri.ge.                                                         |
| `NEXT_PUBLIC_FACEBOOK_URL`  | Facebook page. The footer icon hides when empty.                                                                 |

These are read in `content/product.ts` (`links`) and `lib/site.ts`. `NEXT_PUBLIC_*` values
are inlined at build time, so rebuild after changing them.

## Project layout

```
app/
  [locale]/              ka/en root layout, pages, localized 404 (not-found) and 500 (error)
    styleguide/          the design-system page (noindex)
    opengraph-image.tsx  default share image, from lib/og/template.tsx
  icon.tsx, apple-icon.tsx  favicons rendered from public/brand/badge.svg
  not-found.tsx, global-error.tsx  bilingual fallbacks outside a locale
components/
  ui/                    primitives, content blocks, forms, feedback
  sections/              site chrome: Header, Footer, AnnouncementBar, StickyMobileCTA, ConsentBanner
  motion/                Reveal, Parallax, CountUp, PinnedScene, MotionProvider
content/                 product.ts (single source of truth), navigation.ts
lib/                     i18n, formatting, fonts, SEO, analytics, contrast, phone helpers
messages/                ka.json, en.json: every visible string
styles/                  tokens.css (palette, type, spacing), globals.css (Tailwind theme), fonts/
public/brand/            logo-ka.svg, logo-en.svg, badge.svg (placeholders)
public/images/           placeholder product renders and lifestyle image
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

## Analytics and consent

`lib/analytics` exposes `track(event, params)` for the Brief's events (`view_item`,
`add_to_cart`, `click_wolt`, …). Until the visitor accepts analytics cookies, nothing is
sent, queued or loaded. After consent, events go to `window.dataLayer`. To connect GA4 or
GTM, load the vendor script in `loadVendor()`.

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

Measured on the production build:

- **Lighthouse (mobile)** on `/ka/styleguide` and `/en/styleguide`:
  - Performance 92–94, Accessibility 100, Best Practices 100, CLS 0.
  - SEO is 69. The page must be `noindex`, and Lighthouse's "Page is blocked from indexing"
    audit fails on any `noindex` page. Every other SEO audit passes.
- **Playwright** checks these acceptance criteria:
  - every token, type style and component state renders, including the Coming soon card;
  - language switching keeps the path;
  - pages are no wider than 360 px, and long Georgian headings don't overflow;
  - reduced motion leaves no running animations;
  - consent gating works;
  - dialogs close on Esc and return focus.

The styleguide chapters use `content-visibility: auto` because the page is very long. If
axe reports contrast on text inside a chapter, give that text an explicit `bg-surface`. The
`Specimen` titles already have one.

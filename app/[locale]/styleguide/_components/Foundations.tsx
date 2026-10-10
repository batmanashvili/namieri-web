import { useTranslations } from "next-intl";
import { contrastRatio, rate } from "@/lib/contrast";
import { paletteEntries, readPalette } from "@/lib/tokens";
import { cn } from "@/lib/cn";
import { SgSection, Specimen } from "./Layout";

/* ---- Colour ---------------------------------------------------------------- */

export function ColourSection({ index }: { index: number }) {
  const t = useTranslations("Styleguide.colour");
  const palette = readPalette();

  return (
    <SgSection id="colour" index={index} lead={t("lead")} tone="cream">
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {paletteEntries.map((entry) => {
          const hex = palette[entry.token];
          if (!hex) return null;
          return (
            <li
              key={entry.token}
              className="overflow-hidden rounded-card border border-hairline bg-white"
            >
              <div className="h-24 border-b border-hairline" style={{ backgroundColor: hex }} />
              <div className="grid gap-3 p-5" data-surface="white">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <p className="font-medium">
                    <code className="font-body">{entry.token}</code>
                    <span className="text-fg-muted"> · {entry.name}</span>
                  </p>
                  <code className="text-small text-fg-muted tabular">{hex}</code>
                </div>
                <p className="text-small text-fg-muted">
                  {t(`roles.${entry.token}` as "roles.navy-900")}
                </p>
                {entry.derived && (
                  <p className="text-small font-medium text-accent">{t("derived")}</p>
                )}
                <ul className="grid gap-2 border-t border-hairline pt-3">
                  {entry.pairs.map(({ fg, bg }) => {
                    const fgHex = palette[fg] ?? "#000000";
                    const bgHex = palette[bg] ?? "#FFFFFF";
                    const ratio = contrastRatio(fgHex, bgHex);
                    const rating = rate(ratio);
                    return (
                      <li key={`${fg}-${bg}`} className="flex items-center gap-3 text-small">
                        {/* Sample drawn with CSS content: it is a swatch, not text to read. */}
                        <span
                          aria-hidden="true"
                          className="grid size-9 shrink-0 place-items-center rounded-control border border-hairline font-display-latin text-body font-semibold before:content-['Aa']"
                          style={{ color: fgHex, backgroundColor: bgHex }}
                        />
                        <span className="flex-1">
                          {t("against", { token: fg, background: bg })}
                        </span>
                        <span className="font-medium tabular">{ratio.toFixed(2)}:1</span>
                        <span
                          className={cn(
                            "rounded-pill border px-2 py-0.5 text-[0.75rem] leading-4 font-medium",
                            rating === "Fail"
                              ? "border-error text-error"
                              : "border-success text-success",
                          )}
                        >
                          {rating}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </li>
          );
        })}
      </ul>

      <div className="grid gap-4">
        <div
          aria-hidden="true"
          className="flex h-12 overflow-hidden rounded-card border border-hairline"
        >
          <span className="bg-navy-900" style={{ flexBasis: "60%" }} />
          <span className="bg-cream-50" style={{ flexBasis: "18%" }} />
          <span className="bg-white" style={{ flexBasis: "12%" }} />
          <span className="bg-gold-500" style={{ flexBasis: "8%" }} />
          <span className="bg-glacier-300" style={{ flexBasis: "2%" }} />
        </div>
        <p className="text-small text-fg-muted">{t("proportion")}</p>
        <p className="text-small font-medium">{t("rule")}</p>
      </div>
    </SgSection>
  );
}

/* ---- Typography ------------------------------------------------------------- */

const typeStyles = [
  {
    key: "display",
    className: "font-display text-display font-semibold",
    min: 48,
    max: 104,
    lh: [1.05, 1.15],
  },
  { key: "h1", className: "font-display text-h1 font-semibold", min: 40, max: 64, lh: [1.1, 1.2] },
  {
    key: "h2",
    className: "font-display text-h2 font-semibold",
    min: 32,
    max: 48,
    lh: [1.15, 1.25],
  },
  {
    key: "h3",
    className: "font-display text-h3 font-semibold",
    min: 24,
    max: 30,
    lh: [1.25, 1.35],
  },
  { key: "body", className: "text-body", min: 17, max: 18, lh: [1.6, 1.7] },
  { key: "small", className: "text-small", min: 14, max: 14, lh: [1.5, 1.6] },
  { key: "eyebrow", className: "eyebrow text-accent", min: 14, max: 14, lh: [1.5, 1.6] },
] as const;

export function TypeSection({ index }: { index: number }) {
  const t = useTranslations("Styleguide.type");

  return (
    <SgSection id="type" index={index} lead={t("lead")}>
      <div className="grid gap-12">
        {typeStyles.map((style) => {
          const isText = style.key === "body" || style.key === "small";
          const ka =
            style.key === "eyebrow" ? t("eyebrowKa") : isText ? t("bodyKa") : t("sampleKa");
          const en =
            style.key === "eyebrow" ? t("eyebrowEn") : isText ? t("bodyEn") : t("sampleEn");
          return (
            <Specimen
              key={style.key}
              title={style.key}
              note={t("spec", {
                min: style.min,
                max: style.max,
                lineLatin: style.lh[0],
                lineGeorgian: style.lh[1],
              })}
            >
              <div
                className={cn(
                  "grid gap-6",
                  // Long Georgian words at display/h1 size need the full width.
                  style.key !== "display" && style.key !== "h1" && "lg:grid-cols-2",
                )}
              >
                <p lang="ka" className={cn(style.className, isText && "max-w-[60ch]")}>
                  {ka}
                </p>
                <p lang="en" className={cn(style.className, isText && "max-w-[60ch]")}>
                  {en}
                </p>
              </div>
            </Specimen>
          );
        })}

        <Specimen title={t("numbers")}>
          <p className="font-body text-h2 font-medium text-accent tabular">
            18 · 0% · 64 · 2 · 4,50 ₾ · ₾13
          </p>
        </Specimen>

        <Specimen title={t("longHeading")}>
          <div className="w-full max-w-[360px] overflow-hidden rounded-card border border-dashed border-fg/30 p-4">
            <p
              lang="ka"
              className="font-display font-semibold"
              style={{ fontSize: 48, lineHeight: 1.15 }}
            >
              {t("longHeadingSample")}
            </p>
            <p
              lang="ka"
              className="mt-6 font-display font-semibold"
              style={{ fontSize: 40, lineHeight: 1.2 }}
            >
              {t("longHeadingSample")}
            </p>
          </div>
        </Specimen>
      </div>
    </SgSection>
  );
}

/* ---- Spacing, radii, hairlines ------------------------------------------------ */

const spacing = [4, 8, 12, 16, 24, 32, 48, 64, 96, 128, 160];

export function SpaceSection({ index }: { index: number }) {
  const t = useTranslations("Styleguide.space");

  return (
    <SgSection id="space" index={index} lead={t("lead")} tone="cream">
      <div className="grid gap-12 lg:grid-cols-2">
        <Specimen title={t("scale")}>
          <ul className="grid gap-2">
            {spacing.map((px) => (
              <li key={px} className="flex items-center gap-4 text-small">
                <span className="w-12 text-right text-fg-muted tabular">{px}</span>
                <span className="h-3 rounded-[2px] bg-gold-500" style={{ width: px }} />
              </li>
            ))}
          </ul>
        </Specimen>

        <div className="grid content-start gap-12">
          <Specimen title={t("sectionPadding")}>
            <div className="grid grid-cols-2 gap-4 text-small">
              <div className="rounded-card border border-hairline bg-white p-4">
                <p className="font-medium">sm</p>
                <p className="text-fg-muted tabular">64 → 96 px</p>
              </div>
              <div className="rounded-card border border-hairline bg-white p-4">
                <p className="font-medium">lg</p>
                <p className="text-fg-muted tabular">96 → 160 px</p>
              </div>
            </div>
          </Specimen>

          <Specimen title={t("radii")}>
            <div className="flex flex-wrap gap-6 text-small">
              <div className="grid gap-2">
                <span className="block h-12 w-32 rounded-control border border-ink-900 bg-white" />
                <span className="text-fg-muted">{t("control")}</span>
              </div>
              <div className="grid gap-2">
                <span className="block h-20 w-32 rounded-card border border-ink-900 bg-white" />
                <span className="text-fg-muted">{t("card")}</span>
              </div>
            </div>
          </Specimen>

          <Specimen title={t("hairlines")} note={t("shadows")}>
            <div className="grid gap-4 sm:grid-cols-2">
              <div
                data-surface="navy"
                className="grid h-24 place-items-center rounded-card bg-surface text-small text-fg"
              >
                <span className="border-b border-gold-500 pb-2">{t("hairlineGold")}</span>
              </div>
              <div className="grid h-24 place-items-center rounded-card border border-ink-900/12 bg-white text-small">
                {t("hairlineInk")}
              </div>
            </div>
          </Specimen>
        </div>
      </div>
    </SgSection>
  );
}

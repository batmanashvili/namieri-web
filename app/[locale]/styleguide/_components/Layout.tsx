import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { Section, type SectionTone } from "@/components/ui/Section";
import { Eyebrow, Heading, Text } from "@/components/ui/Typography";
import { cn } from "@/lib/cn";

export const SECTION_IDS = [
  "colour",
  "type",
  "space",
  "motifs",
  "buttons",
  "content",
  "forms",
  "navigation",
  "feedback",
  "motion",
] as const;
export type SectionId = (typeof SECTION_IDS)[number];

type SgSectionProps = {
  id: SectionId;
  index: number;
  lead: string;
  tone?: SectionTone;
  children: ReactNode;
};

/** A styleguide chapter. Off-screen chapters skip rendering work until scrolled to. */
export function SgSection({ id, index, lead, tone = "white", children }: SgSectionProps) {
  const t = useTranslations("Styleguide.sections");
  return (
    <Section
      id={id}
      tone={tone}
      spacing="sm"
      aria-labelledby={`${id}-title`}
      className="scroll-mt-(--header-height) [contain-intrinsic-size:auto_1600px] [content-visibility:auto]"
    >
      <div className="container-page grid gap-12">
        <header className="grid max-w-3xl gap-4">
          <Eyebrow className="tabular">{String(index + 1).padStart(2, "0")}</Eyebrow>
          <Heading id={`${id}-title`} size="h1">
            {t(id)}
          </Heading>
          <Text tone="muted">{lead}</Text>
        </header>
        {children}
      </div>
    </Section>
  );
}

/** A labelled specimen inside a chapter. */
export function Specimen({
  title,
  note,
  children,
  className,
}: {
  title: string;
  note?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("grid gap-5", className)}>
      {/* bg-surface on the text itself: chapters use content-visibility, and without
          an own background axe can mis-read the colour behind them. */}
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-hairline pb-3">
        <h3 className="bg-surface font-body text-body font-medium">{title}</h3>
        {note && <p className="bg-surface text-small text-fg-muted">{note}</p>}
      </div>
      {children}
    </div>
  );
}

const SURFACES: { tone: SectionTone; key: "onNavy" | "onCream" | "onWhite" }[] = [
  { tone: "navy", key: "onNavy" },
  { tone: "cream", key: "onCream" },
  { tone: "white", key: "onWhite" },
];

/** Renders the same specimen on navy, cream and white. */
export function Triptych({
  children,
  className,
  panelClassName,
  stack = false,
}: {
  children: (tone: SectionTone) => ReactNode;
  className?: string;
  panelClassName?: string;
  /** Stack vertically on desktop too (for wide specimens). */
  stack?: boolean;
}) {
  const t = useTranslations("Styleguide");
  return (
    <div className={cn("grid gap-4", !stack && "lg:grid-cols-3", className)}>
      {SURFACES.map(({ tone, key }) => (
        <div
          key={tone}
          data-surface={tone}
          className={cn(
            "grid content-start gap-5 rounded-card border border-hairline bg-surface p-5 text-fg sm:p-6",
            panelClassName,
          )}
        >
          <p className="eyebrow text-fg-muted">{t(key)}</p>
          {children(tone)}
        </div>
      ))}
    </div>
  );
}

/** Small caption under a state preview. */
export function StateLabel({ children }: { children: ReactNode }) {
  return <span className="text-small text-fg-muted">{children}</span>;
}

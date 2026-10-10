import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";
import { YogurtWave, type WaveFill } from "./YogurtWave";

export type SectionTone = "navy" | "ink" | "cream" | "white";

type SectionProps = ComponentProps<"section"> & {
  tone?: SectionTone;
  /** Vertical padding: lg 96→160px, sm 64→96px, none for custom layouts. */
  spacing?: "lg" | "sm" | "none";
  /** Wave at the top edge, in the colour of the section above. */
  waveTop?: WaveFill;
  /** Wave at the bottom edge, in the colour of the section below. */
  waveBottom?: WaveFill;
  waveDrift?: boolean;
};

/**
 * A full-width band. Sets `data-surface`, so every component inside picks the
 * right text, accent, hairline and focus colours for navy, cream or white.
 */
export function Section({
  tone = "white",
  spacing = "lg",
  waveTop,
  waveBottom,
  waveDrift = false,
  className,
  children,
  ...rest
}: SectionProps) {
  return (
    <section
      data-surface={tone}
      className={cn("relative isolate bg-surface text-fg", className)}
      {...rest}
    >
      {waveTop && <YogurtWave fill={waveTop} position="top" drift={waveDrift} className="-mb-px" />}
      <div
        className={cn(
          spacing === "lg" && "py-(--section-pad-lg)",
          spacing === "sm" && "py-(--section-pad-sm)",
        )}
      >
        {children}
      </div>
      {waveBottom && <YogurtWave fill={waveBottom} drift={waveDrift} className="-mt-px" />}
    </section>
  );
}

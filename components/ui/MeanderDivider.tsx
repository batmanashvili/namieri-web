import { useId } from "react";
import { cn } from "@/lib/cn";

/*
 * Greek meander (running key) on a 14.4 × 12 tile: each unit's spiral rises
 * from the baseline, so tiles join into one continuous fret.
 */
const TILE_W = 14.4;
const TILE_H = 12;
const STROKE = 1.2;
export const MEANDER_PATH = "M0 11.4H3.6V.6h9.6v7.8h-6V4.2h3M3.6 11.4h10.8";

type MeanderDividerProps = {
  /** border: full-width band. divider: short centred motif between hairlines. */
  variant?: "border" | "divider";
  /** Height of the motif in px; the stroke scales with it. */
  height?: number;
  className?: string;
};

export function MeanderDivider({
  variant = "border",
  height = 12,
  className,
}: MeanderDividerProps) {
  const id = useId().replace(/:/g, "");
  const scale = height / TILE_H;

  if (variant === "divider") {
    const units = 5;
    return (
      <div aria-hidden="true" className={cn("flex items-center gap-4 text-accent-fill", className)}>
        <span className="h-px flex-1 bg-current opacity-60" />
        <svg
          width={units * TILE_W * scale}
          height={height}
          viewBox={`0 0 ${units * TILE_W} ${TILE_H}`}
          fill="none"
        >
          {Array.from({ length: units }, (_, i) => (
            <path
              key={i}
              d={MEANDER_PATH}
              transform={`translate(${i * TILE_W} 0)`}
              stroke="currentColor"
              strokeWidth={STROKE}
              strokeLinecap="square"
            />
          ))}
        </svg>
        <span className="h-px flex-1 bg-current opacity-60" />
      </div>
    );
  }

  return (
    <svg
      aria-hidden="true"
      width="100%"
      height={height}
      className={cn("block text-accent-fill", className)}
      fill="none"
    >
      <defs>
        <pattern
          id={`meander-${id}`}
          width={TILE_W * scale}
          height={height}
          patternUnits="userSpaceOnUse"
        >
          <path
            d={MEANDER_PATH}
            transform={`scale(${scale})`}
            stroke="currentColor"
            strokeWidth={STROKE}
            strokeLinecap="square"
          />
        </pattern>
      </defs>
      <rect width="100%" height={height} fill={`url(#meander-${id})`} />
    </svg>
  );
}

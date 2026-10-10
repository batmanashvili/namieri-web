import { cn } from "@/lib/cn";

/*
 * The white yogurt wave from the label, used as the transition between a
 * navy section and a light one. The path is periodic over 1440 units and
 * drawn twice, so a -50% translate loops seamlessly for the slow drift.
 */
const PERIOD = 1440;
const HEIGHT = 140;

/** Smooth periodic path (Catmull-Rom → cubic Bézier) filled to the bottom edge. */
function wavePath(y: (x: number) => number, step = 60) {
  const r = (n: number) => Math.round(n * 10) / 10;
  let d = `M0 ${r(y(0))}`;
  for (let x = 0; x < PERIOD * 2; x += step) {
    const c1y = y(x) + (y(x + step) - y(x - step)) / 6;
    const c2y = y(x + step) - (y(x + 2 * step) - y(x)) / 6;
    d += `C${r(x + step / 3)} ${r(c1y)} ${r(x + (2 * step) / 3)} ${r(c2y)} ${x + step} ${r(y(x + step))}`;
  }
  return `${d}V${HEIGHT}H0Z`;
}

const k = (2 * Math.PI) / PERIOD;
const FRONT = wavePath((x) => 66 + 22 * Math.sin(k * x) + 8 * Math.sin(2 * k * x + 1.1));
const BACK = wavePath((x) => 52 + 18 * Math.sin(k * x + 2.1) + 7 * Math.sin(2 * k * x + 0.3));

export type WaveFill = "white" | "cream" | "navy" | "ink";

const fills: Record<WaveFill, string> = {
  white: "text-white",
  cream: "text-cream-50",
  navy: "text-navy-900",
  ink: "text-navy-950",
};

type YogurtWaveProps = {
  /** Colour of the section the wave flows into. */
  fill?: WaveFill;
  /** Place at the top of a section (flipped) or at the bottom. */
  position?: "top" | "bottom";
  /** Slow horizontal drift. Off under reduced motion. */
  drift?: boolean;
  className?: string;
};

export function YogurtWave({
  fill = "cream",
  position = "bottom",
  drift = false,
  className,
}: YogurtWaveProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none relative h-[clamp(2.5rem,6vw,5.5rem)] w-full overflow-hidden",
        position === "top" && "-scale-y-100",
        fills[fill],
        className,
      )}
    >
      <svg
        viewBox="0 0 2880 140"
        preserveAspectRatio="none"
        className={cn(
          "absolute top-0 left-0 h-[calc(100%+1px)] w-[200%] opacity-25",
          drift && "animate-[wave-drift_38s_linear_infinite]",
        )}
      >
        <path d={BACK} fill="currentColor" />
      </svg>
      <svg
        viewBox="0 0 2880 140"
        preserveAspectRatio="none"
        className={cn(
          "absolute top-0 left-0 h-[calc(100%+1px)] w-[200%]",
          drift && "animate-[wave-drift_26s_linear_infinite]",
        )}
      >
        <path d={FRONT} fill="currentColor" />
      </svg>
    </div>
  );
}

import { cn } from "@/lib/cn";

/*
 * Fine line-art pedestal and Ionic column, in the manner of the pitch deck's
 * pen sketches: hairline strokes that slightly overshoot their corners, with
 * light hatching for shade. Strokes stay 1 px at any size. Colour comes from
 * `currentColor`; keep it gold or white at low opacity.
 */

type PlinthProps = {
  /** pedestal: low plinth to stand a product on. column: tall decoration. */
  variant?: "pedestal" | "column";
  className?: string;
  strokeWidth?: number;
};

const line = (x1: number, y1: number, x2: number, y2: number) => `M${x1} ${y1}L${x2} ${y2}`;

// Box drawn as four lines overshooting each corner by `o`, like a pen sketch.
function sketchBox(x1: number, y1: number, x2: number, y2: number, o = 3) {
  return [
    line(x1 - o, y1, x2 + o, y1),
    line(x1 - o, y2, x2 + o, y2),
    line(x1, y1 - o, x1, y2 + o),
    line(x2, y1 - o, x2, y2 + o),
  ].join("");
}

function hatch(x: number, y1: number, y2: number, count: number, length: number) {
  const gap = (y2 - y1) / count;
  return Array.from({ length: count }, (_, i) =>
    line(x, y1 + i * gap + length, x + length, y1 + i * gap),
  ).join("");
}

const PEDESTAL = [
  sketchBox(28, 12, 212, 26),
  sketchBox(40, 26, 200, 34, 2),
  sketchBox(54, 34, 186, 118, 2),
  sketchBox(42, 118, 198, 126, 2),
  sketchBox(26, 126, 214, 142),
  // inner panel
  sketchBox(70, 50, 170, 102, 1.5),
  // shade hatching on the right face and under the slab
  hatch(174, 40, 114, 12, 8),
  hatch(196, 128, 140, 3, 8),
  // ground
  line(6, 146, 104, 146),
  line(112, 146, 234, 146),
  line(20, 150, 60, 150),
  line(170, 150, 222, 150),
].join("");

function volute(cx: number, cy: number, dir: 1 | -1) {
  return [
    `M${cx} ${cy - 15}a15 15 0 1 ${dir === 1 ? 1 : 0} 0.01 0`,
    `M${cx + dir * 4} ${cy - 2}a9 9 0 1 ${dir === 1 ? 0 : 1} ${-dir * 8} -6`,
    `M${cx} ${cy - 3}a3 3 0 1 0 0.01 0`,
  ].join("");
}

const flutes = [76, 88, 100, 112, 124]
  .map((x) => `M${x} 84C${x - 2} 200 ${x - 2} 330 ${x + (x < 100 ? 1 : x > 100 ? -1 : 0)} 448`)
  .join("");

const COLUMN = [
  sketchBox(30, 16, 170, 30),
  `M34 36Q100 46 166 36M38 60Q100 70 162 60`,
  volute(50, 50, -1),
  volute(150, 50, 1),
  line(60, 74, 140, 74),
  line(62, 80, 138, 80),
  // shaft with entasis
  `M64 80C59 210 59 330 66 450M136 80C141 210 141 330 134 450`,
  flutes,
  hatch(128, 120, 420, 18, 6),
  // base: torus, scotia, plinth
  line(58, 450, 142, 450),
  `M54 456Q100 468 146 456`,
  line(50, 466, 150, 466),
  sketchBox(38, 472, 162, 494),
  line(10, 500, 96, 500),
  line(104, 500, 190, 500),
].join("");

export function Plinth({ variant = "pedestal", className, strokeWidth = 1 }: PlinthProps) {
  const isColumn = variant === "column";
  return (
    <svg
      aria-hidden="true"
      viewBox={isColumn ? "0 0 200 504" : "0 0 240 152"}
      fill="none"
      className={cn("block text-accent-fill", className)}
    >
      <path
        d={isColumn ? COLUMN : PEDESTAL}
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

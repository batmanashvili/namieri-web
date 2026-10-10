import { CountUp } from "@/components/motion/CountUp";
import { cn } from "@/lib/cn";

type StatCounterProps = {
  value: number;
  unit?: string;
  label: string;
  decimals?: number;
  className?: string;
};

/** A key number (18 g, 0%, 64 kcal, 2) that counts up once when in view. */
export function StatCounter({ value, unit, label, decimals = 0, className }: StatCounterProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <p className="flex items-baseline gap-1.5 font-body leading-none font-medium text-accent">
        <CountUp
          value={value}
          decimals={decimals}
          className="text-[clamp(3rem,2.33rem+2.96vw,5rem)]"
        />
        {unit && <span className="text-h3">{unit}</span>}
      </p>
      <p className="text-small text-fg-muted">{label}</p>
    </div>
  );
}

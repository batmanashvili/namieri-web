import { cn } from "@/lib/cn";

type SkeletonProps = {
  className?: string;
  /** Shape helpers; size it with className (h-*, w-*). */
  shape?: "line" | "block" | "circle";
};

/** Placeholder block with a slow shimmer (static under reduced motion). */
export function Skeleton({ className, shape = "line" }: SkeletonProps) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "block animate-[shimmer_1.6s_linear_infinite] bg-[length:200%_100%]",
        "bg-[linear-gradient(90deg,color-mix(in_srgb,var(--fg)_8%,transparent)_30%,color-mix(in_srgb,var(--fg)_14%,transparent)_50%,color-mix(in_srgb,var(--fg)_8%,transparent)_70%)]",
        shape === "line" && "h-4 rounded-control",
        shape === "block" && "rounded-card",
        shape === "circle" && "rounded-full",
        className,
      )}
    />
  );
}

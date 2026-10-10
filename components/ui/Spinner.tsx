import { cn } from "@/lib/cn";

type SpinnerProps = {
  /** Accessible label. Omit when the spinner sits inside a labelled, busy control. */
  label?: string;
  size?: number;
  className?: string;
};

/** Rotating arc; under reduced motion the global CSS stops it on a static arc. */
export function Spinner({ label, size = 20, className }: SpinnerProps) {
  return (
    <span
      role={label ? "status" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={cn("inline-flex", className)}
    >
      <svg
        viewBox="0 0 24 24"
        width={size}
        height={size}
        fill="none"
        className="animate-[spin_900ms_linear_infinite]"
      >
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.25" strokeWidth="2" />
        <path
          d="M21 12a9 9 0 0 0-9-9"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
}

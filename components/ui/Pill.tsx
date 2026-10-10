import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Icon, type IconName } from "./Icon";

type PillProps = {
  children: ReactNode;
  tone?: "accent" | "neutral" | "ok" | "danger";
  icon?: IconName;
  className?: string;
};

const tones = {
  accent: "border-accent-fill text-accent",
  neutral: "border-hairline text-fg-muted",
  ok: "border-ok text-ok",
  danger: "border-danger text-danger",
};

/** Small outlined status label, e.g. "Coming soon". */
export function Pill({ children, tone = "accent", icon, className }: PillProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-pill border px-3 py-1 text-small leading-none font-medium",
        tones[tone],
        className,
      )}
    >
      {icon && <Icon name={icon} size={14} />}
      {children}
    </span>
  );
}

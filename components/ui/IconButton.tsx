import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";
import { Icon, type IconName } from "./Icon";

type IconButtonProps = Omit<ComponentProps<"button">, "children" | "aria-label"> & {
  icon: IconName;
  /** Required accessible name. */
  label: string;
  variant?: "ghost" | "secondary" | "primary";
  size?: "md" | "lg";
  /** Small count badge, e.g. cart items. */
  badge?: number;
  badgeLabel?: string;
};

const variants = {
  ghost: "text-fg hover:bg-fg/8 active:bg-fg/12",
  secondary: "border border-outline text-fg hover:bg-fg/8 active:bg-fg/12",
  primary: "bg-accent-fill text-on-accent hover:bg-accent-fill-hover",
};

export function IconButton({
  icon,
  label,
  variant = "ghost",
  size = "md",
  badge,
  badgeLabel,
  className,
  type = "button",
  ...rest
}: IconButtonProps) {
  return (
    <button
      type={type}
      aria-label={badgeLabel ?? label}
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center rounded-control transition-colors duration-200",
        "active:translate-y-px disabled:cursor-not-allowed disabled:opacity-45",
        size === "md" ? "size-11" : "size-12",
        variants[variant],
        className,
      )}
      {...rest}
    >
      <Icon name={icon} size={size === "md" ? 22 : 24} />
      {badge !== undefined && (
        <span
          aria-hidden="true"
          className="absolute top-1 right-1 grid min-w-4.5 place-items-center rounded-pill bg-accent-fill px-1 text-[0.6875rem] leading-4.5 font-medium text-on-accent tabular"
        >
          {badge > 99 ? "99+" : badge}
        </span>
      )}
    </button>
  );
}

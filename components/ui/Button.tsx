import type { ComponentProps, ReactNode } from "react";
import { Link } from "@/lib/i18n/navigation";
import { cn } from "@/lib/cn";
import { Icon, type IconName } from "./Icon";
import { Spinner } from "./Spinner";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "link";
export type ButtonSize = "sm" | "md" | "lg";

const base =
  "relative inline-flex max-w-full items-center justify-center gap-2 rounded-control text-center font-body font-medium " +
  "transition-[background-color,border-color,color,translate,text-decoration-color] duration-200 ease-out " +
  "select-none [-webkit-tap-highlight-color:transparent] " +
  "disabled:cursor-not-allowed disabled:opacity-45 aria-disabled:cursor-not-allowed aria-disabled:opacity-45";

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-accent-fill text-on-accent hover:bg-accent-fill-hover active:translate-y-px " +
    "active:bg-[color-mix(in_srgb,var(--accent-fill)_85%,var(--navy-900))] " +
    "disabled:hover:bg-accent-fill",
  secondary:
    "border border-outline bg-transparent text-fg hover:bg-fg/8 active:translate-y-px active:bg-fg/12 " +
    "disabled:hover:bg-transparent",
  ghost: "bg-transparent text-fg hover:bg-fg/8 active:translate-y-px active:bg-fg/12",
  link:
    "rounded-none px-0! text-link underline decoration-1 underline-offset-[0.3em] hover:decoration-2 " +
    "active:opacity-80",
};

const sizes: Record<ButtonSize, string> = {
  sm: "min-h-11 px-4 py-2 text-small",
  md: "min-h-12 px-6 py-2.5 text-body leading-tight",
  lg: "min-h-14 px-8 py-3 text-body leading-tight",
};

type OwnProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  iconStart?: IconName;
  iconEnd?: IconName;
  loading?: boolean;
  /** Visually hidden text read while loading, e.g. "Sending…". */
  loadingLabel?: string;
  fullWidth?: boolean;
  className?: string;
  children: ReactNode;
};

type AsButton = OwnProps &
  Omit<ComponentProps<"button">, keyof OwnProps> & { href?: undefined; external?: undefined };
type AsLink = OwnProps &
  Omit<ComponentProps<"a">, keyof OwnProps | "href"> & {
    href: string;
    /** Opens in a new tab with rel="noopener"; pass the "(opens in a new tab)" text as newTabLabel. */
    external?: boolean;
    newTabLabel?: string;
    disabled?: boolean;
  };

export type ButtonProps = AsButton | AsLink;

export function buttonClasses({
  variant = "primary",
  size = "md",
  fullWidth,
  className,
}: Pick<OwnProps, "variant" | "size" | "fullWidth" | "className">) {
  return cn(base, variants[variant], sizes[size], fullWidth && "w-full", className);
}

export function Button(props: ButtonProps) {
  const {
    variant = "primary",
    size = "md",
    iconStart,
    iconEnd,
    loading = false,
    loadingLabel,
    fullWidth,
    className,
    children,
    ...rest
  } = props;
  const iconSize = size === "sm" ? 18 : 20;
  const classes = buttonClasses({ variant, size, fullWidth, className });

  const content = (
    <>
      {loading ? (
        <Spinner size={iconSize} />
      ) : (
        iconStart && <Icon name={iconStart} size={iconSize} />
      )}
      <span className="min-w-0 text-balance">{children}</span>
      {loadingLabel && loading && <span className="sr-only">{loadingLabel}</span>}
      {iconEnd && !loading && <Icon name={iconEnd} size={iconSize} />}
    </>
  );

  if (rest.href !== undefined) {
    const { href, external, newTabLabel, disabled, ...anchorProps } = rest as Omit<
      AsLink,
      keyof OwnProps
    >;
    if (disabled) {
      // A disabled link has no href, so it can't be focused or followed.
      return (
        <a aria-disabled="true" role="link" className={classes} {...anchorProps}>
          {content}
        </a>
      );
    }
    if (external) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={classes}
          {...anchorProps}
        >
          {content}
          {newTabLabel && <span className="sr-only">{newTabLabel}</span>}
        </a>
      );
    }
    return (
      <Link href={href} className={classes} {...anchorProps}>
        {content}
      </Link>
    );
  }

  const {
    type = "button",
    disabled,
    href: _href,
    external: _external,
    ...buttonProps
  } = rest as Omit<AsButton, keyof OwnProps>;
  return (
    <button
      type={type}
      className={classes}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...buttonProps}
    >
      {content}
    </button>
  );
}

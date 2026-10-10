import type { ComponentProps, ElementType } from "react";
import { cn } from "@/lib/cn";

type HeadingSize = "display" | "h1" | "h2" | "h3";

const headingSizes: Record<HeadingSize, string> = {
  display: "text-display",
  h1: "text-h1",
  h2: "text-h2",
  h3: "text-h3",
};

type HeadingProps = ComponentProps<"h2"> & {
  /** Semantic level, independent of the visual size. */
  as?: "h1" | "h2" | "h3" | "h4" | "p";
  size?: HeadingSize;
};

/** Display serif heading. Sizes are fluid; Georgian gets extra line-height. */
export function Heading({ as: Tag = "h2", size = "h2", className, ...rest }: HeadingProps) {
  return (
    <Tag
      className={cn("font-display font-semibold text-fg", headingSizes[size], className)}
      {...rest}
    />
  );
}

type EyebrowProps = ComponentProps<"p"> & { as?: ElementType };

/** Small tracked label above a heading. Uppercase in Latin only. */
export function Eyebrow({ as: Tag = "p", className, ...rest }: EyebrowProps) {
  return <Tag className={cn("eyebrow text-accent", className)} {...rest} />;
}

type TextProps = ComponentProps<"p"> & {
  as?: ElementType;
  size?: "body" | "small";
  tone?: "default" | "muted";
};

export function Text({
  as: Tag = "p",
  size = "body",
  tone = "default",
  className,
  ...rest
}: TextProps) {
  return (
    <Tag
      className={cn(
        size === "body" ? "text-body" : "text-small",
        tone === "muted" ? "text-fg-muted" : "text-fg",
        "max-w-[65ch]",
        className,
      )}
      {...rest}
    />
  );
}

import type { ComponentProps, ElementType } from "react";
import { cn } from "@/lib/cn";

type ContainerProps = ComponentProps<"div"> & {
  as?: ElementType;
  /** narrow ≈ 720px for reading, default 1200px. */
  size?: "default" | "narrow";
};

export function Container({
  as: Tag = "div",
  size = "default",
  className,
  ...rest
}: ContainerProps) {
  return (
    <Tag
      className={cn(
        "container-page",
        size === "narrow" && "max-w-[calc(45rem+2*var(--gutter))]",
        className,
      )}
      {...rest}
    />
  );
}

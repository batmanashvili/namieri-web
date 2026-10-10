import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Eyebrow, Heading, Text } from "./Typography";

type SectionHeaderProps = {
  /** Heading id, for the section's aria-labelledby. */
  id: string;
  eyebrow?: string;
  title: ReactNode;
  lead?: ReactNode;
  align?: "start" | "center";
  as?: "h1" | "h2";
  size?: "display" | "h1" | "h2";
  className?: string;
  children?: ReactNode;
};

/** Eyebrow, heading and an optional lead: the opening of every landing and page section. */
export function SectionHeader({
  id,
  eyebrow,
  title,
  lead,
  align = "start",
  as = "h2",
  size = "h2",
  className,
  children,
}: SectionHeaderProps) {
  const centered = align === "center";
  return (
    <div
      className={cn(
        "grid content-start gap-4",
        centered ? "justify-items-center text-center" : "justify-items-start",
        className,
      )}
    >
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <Heading id={id} as={as} size={size} className="max-w-[22ch]">
        {title}
      </Heading>
      {lead && (
        <Text tone="muted" className={cn(centered && "mx-auto")}>
          {lead}
        </Text>
      )}
      {children}
    </div>
  );
}

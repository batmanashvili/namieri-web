"use client";

import { useId, useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Icon } from "./Icon";

export type AccordionItem = { id: string; title: string; content: ReactNode };

type AccordionProps = {
  items: AccordionItem[];
  /** single: opening one closes the others. */
  type?: "single" | "multiple";
  defaultOpen?: string[];
  headingLevel?: "h2" | "h3" | "h4";
  className?: string;
};

/**
 * WAI-ARIA accordion: each title is a heading containing a button with
 * aria-expanded; panels are labelled regions. Closed panels are `inert`, so
 * they leave the tab order and the accessibility tree.
 */
export function Accordion({
  items,
  type = "single",
  defaultOpen = [],
  headingLevel: H = "h3",
  className,
}: AccordionProps) {
  const baseId = useId();
  const [open, setOpen] = useState<string[]>(defaultOpen);

  const toggle = (id: string) =>
    setOpen((current) =>
      current.includes(id)
        ? current.filter((x) => x !== id)
        : type === "single"
          ? [id]
          : [...current, id],
    );

  return (
    <div className={cn("border-t border-hairline", className)}>
      {items.map((item) => {
        const isOpen = open.includes(item.id);
        const buttonId = `${baseId}-${item.id}-button`;
        const panelId = `${baseId}-${item.id}-panel`;
        return (
          <div key={item.id} className="border-b border-hairline">
            <H className="font-body text-body font-medium">
              <button
                id={buttonId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(item.id)}
                className="flex min-h-14 w-full items-center justify-between gap-6 py-4 text-left transition-colors hover:text-accent"
              >
                <span className="text-balance">{item.title}</span>
                <span
                  aria-hidden="true"
                  className={cn(
                    "grid size-8 shrink-0 place-items-center rounded-full border border-hairline transition-transform duration-300",
                    isOpen && "rotate-45",
                  )}
                >
                  <Icon name="plus" size={16} />
                </span>
              </button>
            </H>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              inert={!isOpen}
              className={cn(
                "grid transition-[grid-template-rows] duration-300 ease-out",
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
              )}
            >
              <div className="overflow-hidden">
                <div
                  className={cn(
                    "pr-12 pb-6 text-body text-fg-muted transition-opacity duration-300",
                    !isOpen && "opacity-0",
                  )}
                >
                  {item.content}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

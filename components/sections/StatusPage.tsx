import type { ReactNode } from "react";
import { Plinth } from "@/components/ui/Plinth";
import { MeanderDivider } from "@/components/ui/MeanderDivider";
import { cn } from "@/lib/cn";

type StatusPageProps = {
  code: string;
  title: string;
  text: ReactNode;
  actions: ReactNode;
  className?: string;
};

/** On-brand 404 / 500 layout: navy field, empty plinth, meander. */
export function StatusPage({ code, title, text, actions, className }: StatusPageProps) {
  return (
    <section
      data-surface="navy"
      className={cn("relative isolate overflow-hidden bg-surface text-fg", className)}
    >
      <div className="container-page grid min-h-[calc(100svh-var(--header-height))] content-center gap-10 py-16 md:grid-cols-[1fr_auto] md:items-center">
        <div className="grid justify-items-start gap-5">
          <p className="eyebrow text-accent tabular">{code}</p>
          <h1 className="max-w-[16ch] font-display text-h1 font-semibold">{title}</h1>
          <p className="max-w-[48ch] text-body text-fg-muted">{text}</p>
          <div className="flex flex-wrap gap-3 pt-2">{actions}</div>
        </div>
        <div className="mx-auto w-56 md:w-72" aria-hidden="true">
          <Plinth className="w-full opacity-70" />
        </div>
      </div>
      <MeanderDivider className="absolute inset-x-0 bottom-0 opacity-50" />
    </section>
  );
}

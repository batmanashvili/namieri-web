"use client";

import { useState, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";

export const DISMISSED_KEY = "namieri:dismissed";

/**
 * Runs before first paint (see app/[locale]/layout.tsx) and hides bars the
 * visitor already dismissed, so they never flash in and shift the page.
 */
export const dismissedAnnouncementsScript = `try{var d=JSON.parse(localStorage.getItem("${DISMISSED_KEY}")||"[]");if(d.length){var s=document.createElement("style");s.textContent=d.map(function(i){return'[data-announcement="'+String(i).replace(/[^a-z0-9_-]/gi,"")+'"]{display:none!important}'}).join("");document.head.appendChild(s)}}catch(e){}`;

type AnnouncementBarProps = {
  /** Stable id; change it to show a new message to people who dismissed the old one. */
  id: string;
  children: ReactNode;
  className?: string;
};

/** Slim, dismissible one-line bar for a promo or delivery note. */
export function AnnouncementBar({ id, children, className }: AnnouncementBarProps) {
  const t = useTranslations("Announcement");
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  const dismiss = () => {
    setDismissed(true);
    try {
      const list = JSON.parse(localStorage.getItem(DISMISSED_KEY) ?? "[]") as string[];
      localStorage.setItem(DISMISSED_KEY, JSON.stringify([...new Set([...list, id])]));
    } catch {
      // Storage can be unavailable (private mode); the bar just comes back next visit.
    }
  };

  return (
    <aside
      aria-label={t("label")}
      data-announcement={id}
      data-surface="cream"
      className={cn("relative z-50 bg-surface text-fg", className)}
    >
      <div className="container-page flex min-h-11 items-center justify-center gap-3 py-1.5 ps-11 text-center text-small">
        <p className="flex-1 text-balance">{children}</p>
        <button
          type="button"
          onClick={dismiss}
          aria-label={t("dismiss")}
          className="-me-2 grid size-11 shrink-0 place-items-center rounded-control text-fg-muted transition-colors hover:bg-fg/8 hover:text-fg"
        >
          <Icon name="close" size={18} />
        </button>
      </div>
    </aside>
  );
}

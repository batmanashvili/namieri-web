"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/cn";

type StickyMobileCTAProps = {
  /** Usually a primary "Order now" and a secondary "Order on Wolt" Button. */
  children: ReactNode;
  /** Show after this many px of scroll (default: 60% of the viewport). */
  showAfter?: number;
  className?: string;
};

/**
 * Bottom action bar on phones (hidden from md up). Slides in after the
 * visitor scrolls past the hero and reserves its own space at the end of the
 * page so it never covers the footer.
 */
export function StickyMobileCTA({ children, showAfter, className }: StickyMobileCTAProps) {
  const t = useTranslations("StickyCta");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const threshold = showAfter ?? window.innerHeight * 0.6;
      setVisible(window.scrollY > threshold);
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [showAfter]);

  return (
    <>
      <div aria-hidden="true" className="h-20 md:hidden" />
      <aside
        aria-label={t("label")}
        data-surface="navy"
        inert={!visible}
        className={cn(
          "fixed inset-x-0 bottom-0 z-40 border-t border-hairline bg-surface/95 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-sm transition-[translate,opacity] duration-300 ease-out md:hidden",
          visible ? "translate-y-0 opacity-100" : "translate-y-full opacity-0",
          className,
        )}
      >
        <div className="mx-auto flex max-w-md gap-3 *:flex-1">{children}</div>
      </aside>
    </>
  );
}

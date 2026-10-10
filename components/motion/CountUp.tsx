"use client";

import { useEffect, useMemo, useRef } from "react";
import { animate } from "motion/react";
import { useLocale } from "next-intl";
import { intlLocale } from "@/lib/i18n/routing";
import { usePrefersReducedMotion } from "@/lib/hooks/usePrefersReducedMotion";
import { cn } from "@/lib/cn";

type CountUpProps = {
  value: number;
  decimals?: number;
  /** Seconds. */
  duration?: number;
  className?: string;
};

/**
 * Counts from 0 to `value` once, when it scrolls into view. The final value is
 * server-rendered (crawlers, no-JS and screen readers always get it) and its
 * width is reserved, so counting never shifts the layout.
 */
export function CountUp({ value, decimals = 0, duration = 1.6, className }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const locale = useLocale();
  const reduced = usePrefersReducedMotion();
  const format = useMemo(() => {
    const nf = new Intl.NumberFormat(intlLocale[locale], {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
    return (n: number) => nf.format(n);
  }, [locale, decimals]);
  const final = format(value);

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced || !("IntersectionObserver" in window)) return;

    // First callback = position at load, measured without forcing layout.
    let first = true;
    let stop: (() => void) | undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        if (first) {
          first = false;
          if (entry.isIntersecting) return observer.disconnect(); // on screen at load: keep the value
          el.textContent = format(0);
          return;
        }
        if (!entry.isIntersecting) return;
        observer.disconnect();
        const controls = animate(0, value, {
          duration,
          ease: [0.22, 1, 0.36, 1],
          onUpdate: (latest) => {
            el.textContent = format(latest);
          },
        });
        stop = () => controls.stop();
      },
      { threshold: 0.6 },
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      stop?.();
      el.textContent = format(value);
    };
  }, [value, duration, format, reduced]);

  return (
    <span className={cn("relative inline-grid tabular", className)}>
      <span aria-hidden="true" className="invisible col-start-1 row-start-1">
        {final}
      </span>
      <span ref={ref} aria-hidden="true" className="col-start-1 row-start-1">
        {final}
      </span>
      <span className="sr-only">{final}</span>
    </span>
  );
}

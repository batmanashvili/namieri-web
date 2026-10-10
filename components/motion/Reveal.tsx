"use client";

import { useEffect, useRef, type ElementType, type ReactNode } from "react";
import { usePrefersReducedMotion } from "@/lib/hooks/usePrefersReducedMotion";

type RevealProps = {
  as?: ElementType;
  /** Stagger delay in ms. */
  delay?: number;
  className?: string;
  children: ReactNode;
};

/**
 * Fades in with a 16 px rise over 600 ms, ease-out, the first time the
 * element scrolls into view. Elements already on screen at load are left
 * alone (no flash, no LCP delay). Disabled under prefers-reduced-motion.
 * Styles live in styles/globals.css ([data-reveal]).
 */
export function Reveal({ as: Tag = "div", delay = 0, className, children }: RevealProps) {
  const ref = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced || !("IntersectionObserver" in window)) return;

    // The first callback reports where the element is at load without forcing
    // a synchronous layout. Already on screen: leave it. Below the fold: hide
    // it (invisible, since it is off-screen) and reveal on entry.
    let first = true;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        if (first) {
          first = false;
          if (entry.isIntersecting) return observer.disconnect();
          el.dataset.reveal = "hidden";
          return;
        }
        if (entry.isIntersecting) {
          el.dataset.reveal = "shown";
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      if (el.dataset.reveal === "hidden") el.dataset.reveal = "shown";
    };
  }, [reduced]);

  return (
    <Tag
      ref={ref}
      data-reveal=""
      className={className}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}

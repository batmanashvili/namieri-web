"use client";

import { useRef, type ReactNode } from "react";
import { m, useScroll, useTransform } from "motion/react";
import { usePrefersReducedMotion } from "@/lib/hooks/usePrefersReducedMotion";
import { cn } from "@/lib/cn";

type ParallaxProps = {
  /** Total travel in px across the element's pass through the viewport. */
  distance?: number;
  className?: string;
  children: ReactNode;
};

/** Moves its content against the scroll for depth. Static under reduced motion. */
export function Parallax({ distance = 80, className, children }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [distance / 2, -distance / 2]);

  return (
    <div ref={ref} data-parallax="" className={cn("relative", className)}>
      {reduced ? children : <m.div style={{ y }}>{children}</m.div>}
    </div>
  );
}

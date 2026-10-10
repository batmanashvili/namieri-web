"use client";

import { createContext, useContext, useRef, type ReactNode } from "react";
import { useMotionValue, useScroll, type MotionValue } from "motion/react";
import { usePrefersReducedMotion } from "@/lib/hooks/usePrefersReducedMotion";
import { cn } from "@/lib/cn";

const ProgressContext = createContext<MotionValue<number> | null>(null);

/** Scroll progress (0 → 1) of the nearest PinnedScene. 1 under reduced motion. */
export function usePinnedProgress(): MotionValue<number> {
  const progress = useContext(ProgressContext);
  if (!progress) throw new Error("usePinnedProgress must be used inside <PinnedScene>");
  return progress;
}

type PinnedSceneProps = {
  /** How many screens of scrolling the scene stays pinned for. Capped at 1.5. */
  length?: number;
  className?: string;
  /** Classes for the pinned stage (the full-height sticky frame). */
  stageClassName?: string;
  children: ReactNode;
};

/**
 * Pins a full-screen stage while the user scrolls through `length` screens,
 * exposing progress to children via usePinnedProgress(). Under reduced
 * motion the scene is not pinned and shows its final state.
 */
export function PinnedScene({
  length = 1.5,
  className,
  stageClassName,
  children,
}: PinnedSceneProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const screens = Math.min(Math.max(length, 0), 1.5);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const done = useMotionValue(1);

  return (
    <div
      ref={ref}
      data-pinned=""
      className={cn("relative", className)}
      style={{ height: reduced ? undefined : `${100 + screens * 100}svh` }}
    >
      <div
        data-pinned-stage=""
        className={cn("sticky top-0 h-svh overflow-hidden", stageClassName)}
      >
        <ProgressContext value={reduced ? done : scrollYProgress}>{children}</ProgressContext>
      </div>
    </div>
  );
}

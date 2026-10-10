"use client";

import type { ReactNode } from "react";
import { LazyMotion, MotionConfig } from "motion/react";

// Fetched after hydration, so the animation features stay out of the critical path.
const loadFeatures = () => import("./features").then((module) => module.default);

/**
 * Loads Motion's DOM animation features once (use `m.*` components, not
 * `motion.*`) and makes every Motion animation honour prefers-reduced-motion.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={loadFeatures} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}

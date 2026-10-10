"use client";

import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/lib/hooks/usePrefersReducedMotion";
import { useSaveData } from "@/lib/hooks/useSaveData";
import { cn } from "@/lib/cn";

type VideoLoopProps = {
  /** Required. Shown first, and instead of the video under reduced motion or Save-Data. */
  poster: string;
  /** MP4 (H.264) source. */
  mp4?: string;
  /** WebM source, listed first so supporting browsers prefer it. */
  webm?: string;
  /** Describes the loop; the video is decorative to assistive tech when omitted. */
  label?: string;
  className?: string;
};

/**
 * Silent background loop (6–10 s, ≤ 2.5 MB). Sources are attached only after
 * mount and only when motion and data use are allowed; the video plays while
 * on screen and pauses off-screen.
 */
export function VideoLoop({ poster, mp4, webm, label, className }: VideoLoopProps) {
  const ref = useRef<HTMLVideoElement>(null);
  const reduced = usePrefersReducedMotion();
  const saveData = useSaveData();
  const allowed = !reduced && !saveData && Boolean(mp4 || webm);
  const [inView, setInView] = useState(false);
  // Latches on first view, so sources load once and stay attached.
  const [activated, setActivated] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || !allowed) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible = Boolean(entry?.isIntersecting);
        setInView(visible);
        if (visible) setActivated(true);
      },
      { threshold: 0.25 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [allowed]);

  useEffect(() => {
    const el = ref.current;
    if (el && activated) el.load();
  }, [activated]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (allowed && activated && inView) {
      el.muted = true;
      el.play().catch(() => {
        // Autoplay can be refused (e.g. Low Power Mode); the poster stays.
      });
    } else {
      el.pause();
    }
  }, [allowed, activated, inView]);

  return (
    <video
      ref={ref}
      poster={poster}
      muted
      loop
      playsInline
      preload="none"
      disablePictureInPicture
      aria-label={label}
      aria-hidden={label ? undefined : true}
      tabIndex={-1}
      className={cn("block size-full object-cover", className)}
    >
      {allowed && activated && webm && <source src={webm} type="video/webm" />}
      {allowed && activated && mp4 && <source src={mp4} type="video/mp4" />}
    </video>
  );
}

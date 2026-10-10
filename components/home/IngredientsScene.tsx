"use client";

import { m, useTransform, type MotionValue } from "motion/react";
import { usePinnedProgress } from "@/components/motion/PinnedScene";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Plinth } from "@/components/ui/Plinth";
import { Eyebrow, Heading } from "@/components/ui/Typography";

type IngredientsSceneProps = {
  eyebrow: string;
  title: string;
  notList: string;
  milk: string;
  cultures: string;
  cup: { src: string; width: number; height: number };
};

/*
 * "Two ingredients": as the visitor scrolls through the pinned stage, the
 * milk drop and the culture travel into the cup, then the headline lands.
 * With reduced motion the stage isn't pinned and a static "milk + cultures
 * = cup" illustration is shown instead (CSS motion-reduce, so there is no
 * flash before hydration). The headline is always in the DOM.
 */
export function IngredientsScene({
  eyebrow,
  title,
  notList,
  milk,
  cultures,
  cup,
}: IngredientsSceneProps) {
  const progress = usePinnedProgress();
  const milkX = useTransform(progress, [0, 0.6], ["-30%", "0%"]);
  const culturesX = useTransform(progress, [0, 0.6], ["30%", "0%"]);
  const travelY = useTransform(progress, [0, 0.6], ["0%", "26%"]);
  const shrink = useTransform(progress, [0.3, 0.62], [1, 0.35]);
  const fade = useTransform(progress, [0.5, 0.66], [1, 0]);
  const cupScale = useTransform(progress, [0.55, 0.72], [0.94, 1]);
  const glow = useTransform(progress, [0.58, 0.75], [0, 1]);
  const textOpacity = useTransform(progress, [0.66, 0.86], [0, 1]);
  const textY = useTransform(progress, [0.66, 0.86], [24, 0]);

  return (
    // The stage is a full screen under the sticky header (and, on phones, above the
    // sticky order bar), so content is padded clear of both.
    <div className="container-page grid h-full content-center justify-items-center gap-6 pt-[calc(var(--header-height)+1rem)] pb-24 text-center motion-reduce:py-(--section-pad-sm) sm:gap-8 md:pb-8">
      {/* Animated version */}
      <div
        aria-hidden="true"
        className="relative h-[clamp(12rem,32svh,24rem)] w-full max-w-xl motion-reduce:hidden"
      >
        <m.div style={{ x: milkX, y: travelY, opacity: fade }} className={travellerClass}>
          <Traveller icon="drop" label={milk} scale={shrink} />
        </m.div>
        <m.div style={{ x: culturesX, y: travelY, opacity: fade }} className={travellerClass}>
          <Traveller icon="culture" label={cultures} scale={shrink} />
        </m.div>
        <div className="absolute inset-x-0 bottom-0 mx-auto w-[min(52%,16rem)]">
          <m.div
            style={{ scale: cupScale }}
            className="relative z-10 mx-auto w-[72%] origin-bottom"
          >
            <m.span
              style={{ opacity: glow }}
              className="absolute inset-[8%] -z-10 rounded-full bg-[radial-gradient(closest-side,var(--white),transparent)]"
            />
            {/* eslint-disable-next-line @next/next/no-img-element -- decorative render, already optimised SVG */}
            <img src={cup.src} alt="" width={cup.width} height={cup.height} className="w-full" />
          </m.div>
          <Plinth className="-mt-[12%] w-full opacity-70" />
        </div>
      </div>

      {/* Static illustration for reduced motion */}
      <div
        aria-hidden="true"
        className="hidden items-center justify-center gap-3 motion-reduce:flex sm:gap-6"
      >
        <StaticItem icon="drop" label={milk} />
        <Icon name="plus" size={24} className="text-accent" />
        <StaticItem icon="culture" label={cultures} />
        <span className="text-h3 text-accent">=</span>
        {/* eslint-disable-next-line @next/next/no-img-element -- decorative render */}
        <img src={cup.src} alt="" width={cup.width} height={cup.height} className="w-24 sm:w-36" />
      </div>

      <m.div
        style={{ opacity: textOpacity, y: textY }}
        className="grid justify-items-center gap-4 motion-reduce:transform-none! motion-reduce:opacity-100!"
      >
        <Eyebrow>{eyebrow}</Eyebrow>
        <Heading id="ingredients-title" size="h2" className="max-w-[18ch] lg:text-h1">
          {title}
        </Heading>
        <p className="max-w-[46ch] text-body text-fg-muted">{notList}</p>
      </m.div>
    </div>
  );
}

const travellerClass = "absolute inset-0 flex items-start justify-center pt-[2%]";

function Traveller({
  icon,
  label,
  scale,
}: {
  icon: IconName;
  label: string;
  scale: MotionValue<number>;
}) {
  return (
    <m.span style={{ scale }} className="grid origin-top justify-items-center gap-2">
      <span className="grid size-16 place-items-center rounded-full border border-accent-fill/60 bg-surface text-fg sm:size-20">
        <Icon name={icon} size={34} />
      </span>
      <span className="max-w-[8rem] text-small text-balance text-fg-muted">{label}</span>
    </m.span>
  );
}

function StaticItem({ icon, label }: { icon: IconName; label: string }) {
  return (
    <span className="grid justify-items-center gap-2">
      <span className="grid size-14 place-items-center rounded-full border border-accent-fill/60 text-fg sm:size-20">
        <Icon name={icon} size={30} />
      </span>
      <span className="text-small text-fg-muted">{label}</span>
    </span>
  );
}

/**
 * Content switches for the landing page. Interface copy lives in
 * messages/*.json (namespace "Home"); this file holds what Namieri changes
 * often: the announcement, the hero video flag and which size each moment
 * links to.
 */
import { media, type MediaImage } from "./media";
import type { Localized } from "./product";

export type Announcement = {
  /** Stable id: change it to show a new message to people who dismissed the old one. */
  id: string;
  text: Localized;
};

/** The one place promotions appear. Set to null to hide the bar. */
export const announcement: Announcement | null = {
  id: "delivery-tbilisi-2026-10",
  text: {
    ka: "მიწოდება თბილისში · ასევე Wolt-ზე: Namieri Saburtalo",
    en: "Delivery across Tbilisi · Also on Wolt: Namieri Saburtalo",
  },
};

export const hero = {
  /** The size shown in front on the plinth, and the one standing behind it. */
  frontSizeId: "cup-150",
  backSizeId: "tub-500",
  /** Set `enabled: true` in content/media.ts once the real loop is supplied. */
  video: media.heroVideo,
} as const;

export type Moment = {
  id: "training" | "breakfast" | "family";
  /** Size the moment links to; null links to the product page without a preset size. */
  sizeId: string | null;
  image: MediaImage;
};

export const moments: readonly Moment[] = [
  { id: "training", sizeId: "cup-150", image: media.momentTraining },
  { id: "breakfast", sizeId: null, image: media.momentBreakfast },
  { id: "family", sizeId: "tub-500", image: media.momentFamily },
];

/** How many FAQ entries the landing page shows before linking to /faq. */
export const HOME_FAQ_COUNT = 6;

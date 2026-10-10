/**
 * Every photo and video slot on the site. Placeholders live in
 * /public/media/placeholder-* at the slot's exact aspect ratio, so a real
 * photo at the same ratio drops in by changing `src` (and width/height) here.
 * No component hard-codes an image path.
 */
import type { Localized } from "./product";

/** Aspect ratios a slot can reserve (see components/ui/ResponsiveImage.tsx). */
export type ImageRatio = "1/1" | "4/3" | "3/4" | "16/9" | "3/2";

export type MediaImage = {
  src: string;
  width: number;
  height: number;
  ratio: ImageRatio;
  alt: Localized;
};

export type MediaVideo = {
  /** Off by default; the slot shows nothing until a real loop is supplied. */
  enabled: boolean;
  poster: string;
  /** H.264 MP4 and WebM, 6–10 s, silent, ≤ 2.5 MB (Brief, "Motion"). */
  mp4?: string;
  webm?: string;
  label: Localized;
};

export const media = {
  heroVideo: {
    enabled: false,
    poster: "/media/placeholder-hero-poster.svg",
    mp4: "/video/sample-loop.mp4",
    webm: "/video/sample-loop.webm",
    label: {
      ka: "სქელი იოგურტი კოვზზე, ნელი კადრი",
      en: "A spoon drawn slowly through thick yogurt",
    },
  },
  momentTraining: {
    src: "/media/placeholder-moment-training.svg",
    width: 900,
    height: 1200,
    ratio: "3/4",
    alt: {
      ka: "იოგურტის თასი კენკრით, ქვის ზედაპირზე",
      en: "A bowl of yogurt with berries on a stone surface",
    },
  },
  momentBreakfast: {
    src: "/media/placeholder-moment-breakfast.svg",
    width: 900,
    height: 1200,
    ratio: "3/4",
    alt: {
      ka: "საუზმის სუფრა: იოგურტი თაფლითა და ნიგვზით",
      en: "Breakfast table: yogurt with honey and walnuts",
    },
  },
  momentFamily: {
    src: "/media/placeholder-moment-family.svg",
    width: 900,
    height: 1200,
    ratio: "3/4",
    alt: {
      ka: "ოჯახის სუფრა: იოგურტის დიდი თასი და სოუსები",
      en: "Family table: a large bowl of yogurt and small dishes of dips",
    },
  },
  recipeHoneyWalnut: {
    src: "/media/placeholder-recipe-honey-walnut.svg",
    width: 1200,
    height: 900,
    ratio: "4/3",
    alt: {
      ka: "იოგურტის თასი თაფლითა და ნიგვზით",
      en: "A bowl of yogurt with honey and walnuts",
    },
  },
  recipeBerryJar: {
    src: "/media/placeholder-recipe-berry-jar.svg",
    width: 1200,
    height: 900,
    ratio: "4/3",
    alt: {
      ka: "საუზმის ქილები იოგურტისა და კენკრის ფენებით",
      en: "Breakfast jars layered with yogurt and berries",
    },
  },
  recipeHerbDip: {
    src: "/media/placeholder-recipe-herb-dip.svg",
    width: 1200,
    height: 900,
    ratio: "4/3",
    alt: {
      ka: "იოგურტის სოუსი კიტრით, ნივრითა და კამით",
      en: "Yogurt dip with cucumber, garlic and dill",
    },
  },
  aboutOrigin: {
    src: "/media/placeholder-about-origin.svg",
    width: 1500,
    height: 1000,
    ratio: "3/2",
    alt: {
      ka: "მთის სოფელი და საძოვრები, სადაც პარტნიორი ფერმერები ცხოვრობენ",
      en: "A mountain village and pastures where our partner farmers live",
    },
  },
} as const satisfies Record<string, MediaImage | MediaVideo>;

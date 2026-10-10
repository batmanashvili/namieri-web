/**
 * Single source of truth for product, nutrition and company facts.
 *
 * Copy that belongs to a fact (size labels, packaging, ingredient names) lives here as
 * `{ ka, en }`. Interface strings (buttons, headings) live in messages/*.json.
 * Items marked [CONFIRM] are unverified; see the Website Brief, "Inconsistencies".
 */
import type { Locale } from "@/lib/i18n/routing";

export type Localized<T = string> = Record<Locale, T>;

export type SizeStatus = "available" | "coming_soon";

export type ProductImage = {
  src: string;
  width: number;
  height: number;
  alt: Localized;
};

type SizeBase = {
  id: string;
  label: Localized;
  packaging: Localized;
  image: ProductImage;
};

export type AvailableSize = SizeBase & {
  status: "available";
  weightGrams: number;
  /** Retail price used when the backend price is unavailable. Never a wholesale price. */
  fallbackPriceGel: number;
};

export type ComingSoonSize = SizeBase & {
  status: "coming_soon";
  /** Unknown until launch. */
  weightGrams?: number;
  fallbackPriceGel?: number;
};

export type ProductSize = AvailableSize | ComingSoonSize;

export const product = {
  name: { ka: "ბერძნული იოგურტი", en: "Greek yogurt" } satisfies Localized,
  brand: { ka: "ნამიერი", en: "Namieri" } satisfies Localized,
} as const;

export const sizes: readonly ProductSize[] = [
  {
    id: "cup-150",
    status: "available",
    weightGrams: 150,
    label: { ka: "150 გ", en: "150 g" },
    packaging: { ka: "ერთჯერადი ჭიქა", en: "Single cup" },
    fallbackPriceGel: 4.5,
    image: {
      src: "/images/products/cup-150.svg",
      width: 480,
      height: 480,
      alt: {
        ka: "ნამიერის ბერძნული იოგურტი, 150 გ ჭიქა",
        en: "Namieri Greek yogurt, 150 g cup",
      },
    },
  },
  {
    id: "tub-500",
    status: "available",
    weightGrams: 500,
    label: { ka: "500 გ", en: "500 g" },
    packaging: { ka: "ხელახლა დახურვადი ქილა", en: "Resealable tub" },
    fallbackPriceGel: 13,
    image: {
      src: "/images/products/tub-500.svg",
      width: 480,
      height: 480,
      alt: {
        ka: "ნამიერის ბერძნული იოგურტი, 500 გ ქილა",
        en: "Namieri Greek yogurt, 500 g tub",
      },
    },
  },
  {
    // Placeholder: weight, packaging, price and render are added when it launches.
    id: "coming-soon",
    status: "coming_soon",
    label: { ka: "ახალი ზომა", en: "New size" },
    packaging: { ka: "დეტალები მალე", en: "Details soon" },
    image: {
      src: "/images/products/coming-soon.svg",
      width: 480,
      height: 480,
      alt: {
        ka: "ახალი ზომის შეფუთვა, მალე",
        en: "New size packaging, coming soon",
      },
    },
  },
];

export const SERVING_GRAMS = 150;

/** Per 100 g, from the label. */
export const nutritionPer100g = {
  energyKj: 268,
  energyKcal: 64,
  proteinG: 12,
  carbohydrateG: 4.0,
  sugarsG: 4.0,
  fatG: 0,
  saturatesG: 0,
  saltG: 0.12,
} as const;

export type Nutrition = { [K in keyof typeof nutritionPer100g]: number };

export const ingredients = {
  items: [
    {
      id: "milk",
      // [CONFIRM] Info sheet says "raw milk", deck says "pasteurized", label says "milk".
      name: { ka: "ახალი ქართული რძე", en: "Fresh Georgian milk" },
    },
    {
      id: "cultures",
      name: { ka: "ცოცხალი კულტურები", en: "Live cultures" },
      detail: "YO-MIX® GREEK 01, YO-MIX® S32, HOLDBAC® YM-C",
    },
  ],
  freeFrom: [
    { ka: "დანამატების გარეშე", en: "No additives" },
    { ka: "კონსერვანტების გარეშე", en: "No preservatives" },
    { ka: "მცენარეული ცხიმების გარეშე", en: "No vegetable fats" },
  ],
} as const satisfies {
  items: readonly { id: string; name: Localized; detail?: string }[];
  freeFrom: readonly Localized[];
};

export const storage = {
  tempMinC: 2,
  tempMaxC: 6,
  shelfLifeUnopenedDays: 28,
  shelfLifeOpenedDays: 5,
} as const;

export const company = {
  legalName: { ka: "შპს ნამიერი", en: "Namieri LLC" },
  idCode: "422781181",
  address: {
    ka: "ნიკო ბურის ქ. 25, თბილისი 0159",
    en: "25 Niko Buri St, Tbilisi 0159",
  },
  phone: "+995 574 07 77 79",
  phoneHref: "tel:+995574077779",
  email: "namieri.ge@gmail.com",
  // [CONFIRM] Info sheet and deck: GE 01.10.51.0.3050. Label: N 09/8527.
  recognitionCode: "GE 01.10.51.0.3050",
  recognitionCodeConfirmed: false,
  haccp: true,
} as const satisfies {
  legalName: Localized;
  address: Localized;
  [key: string]: unknown;
};

const env = (value: string | undefined) => (value && value.length > 0 ? value : undefined);

const instagram =
  env(process.env.NEXT_PUBLIC_INSTAGRAM_URL) ?? "https://www.instagram.com/namieri.ge/";
const facebook = env(process.env.NEXT_PUBLIC_FACEBOOK_URL);

export const links = {
  wolt: env(process.env.NEXT_PUBLIC_WOLT_URL),
  instagram,
  facebook,
  /** Opens a direct-message thread: ig.me/m/<handle>. */
  instagramDm: instagramDmUrl(instagram),
  /** Messenger thread for the page (m.me/<page>), or the page itself if no username is known. */
  facebookDm: env(process.env.NEXT_PUBLIC_MESSENGER_URL) ?? messengerUrl(facebook),
} as const;

/** Instagram profile URL → ig.me DM link; falls back to the profile URL. */
export function instagramDmUrl(profileUrl: string): string {
  const handle = profileUrl.match(/instagram\.com\/([A-Za-z0-9._]+)/)?.[1];
  return handle ? `https://ig.me/m/${handle}` : profileUrl;
}

/** Facebook page URL → m.me link when the page has a username; otherwise the page URL. */
export function messengerUrl(pageUrl: string | undefined): string | undefined {
  if (!pageUrl) return undefined;
  const page = pageUrl.match(/facebook\.com\/(?!profile\.php)([A-Za-z0-9.-]+)\/?$/)?.[1];
  return page ? `https://m.me/${page}` : pageUrl;
}

// ---------------------------------------------------------------------------
// Derived helpers (available sizes only)
// ---------------------------------------------------------------------------

export function isAvailable(size: ProductSize): size is AvailableSize {
  return size.status === "available";
}

export const availableSizes = sizes.filter(isAvailable);

export function findSize(id: string): ProductSize | undefined {
  return sizes.find((size) => size.id === id);
}

/** Lowest retail price among available sizes, for "from 4,50 ₾". */
export function lowestPriceGel(list: readonly ProductSize[] = sizes): number | undefined {
  const prices = list.filter(isAvailable).map((size) => size.fallbackPriceGel);
  return prices.length ? Math.min(...prices) : undefined;
}

/** Grams of protein in one pack: weightGrams × 0.12. */
export function proteinPerPack(size: AvailableSize): number {
  return (size.weightGrams * nutritionPer100g.proteinG) / 100;
}

/** Number of 150 g servings in one pack. */
export function servings(size: AvailableSize): number {
  return size.weightGrams / SERVING_GRAMS;
}

/** Price per 100 g in GEL, rounded to tetri. */
export function pricePer100g(
  size: AvailableSize,
  priceGel: number = size.fallbackPriceGel,
): number {
  return Math.round((priceGel / size.weightGrams) * 100 * 100) / 100;
}

/** Nutrition scaled to an amount in grams, unrounded. */
export function nutritionFor(grams: number): Nutrition {
  const factor = grams / 100;
  return Object.fromEntries(
    Object.entries(nutritionPer100g).map(([key, value]) => [key, value * factor]),
  ) as Nutrition;
}

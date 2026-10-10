/**
 * "In the kitchen" recipes, seeded from the Instagram series
 * (ნამიერის რეცეპტი). [CONFIRM] titles, times and sizes with Namieri, and
 * replace `href` with each recipe's Instagram post once known.
 */
import { media, type MediaImage } from "./media";
import { links, type Localized } from "./product";

export type Recipe = {
  id: string;
  title: Localized;
  minutes: number;
  /** The size the recipe uses, from content/product.ts. */
  sizeId: string;
  image: MediaImage;
  /** External link to the recipe post. */
  href: string;
};

export const recipes: readonly Recipe[] = [
  {
    id: "honey-walnut-bowl",
    title: { ka: "იოგურტი თაფლითა და ნიგვზით", en: "Honey and walnut bowl" },
    minutes: 5,
    sizeId: "cup-150",
    image: media.recipeHoneyWalnut,
    href: links.instagram,
  },
  {
    id: "berry-breakfast-jar",
    title: { ka: "საუზმის ქილა კენკრით", en: "Berry breakfast jar" },
    minutes: 10,
    sizeId: "tub-500",
    image: media.recipeBerryJar,
    href: links.instagram,
  },
  {
    id: "cucumber-dill-dip",
    title: { ka: "სოუსი კიტრით, ნივრითა და კამით", en: "Cucumber, garlic and dill dip" },
    minutes: 10,
    sizeId: "tub-500",
    image: media.recipeHerbDip,
    href: links.instagram,
  },
];

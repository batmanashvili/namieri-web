import { useTranslations } from "next-intl";
import { PinnedScene } from "@/components/motion/PinnedScene";
import { Section } from "@/components/ui/Section";
import { findSize } from "@/content/product";
import { hero } from "@/content/home";
import { IngredientsScene } from "./IngredientsScene";

/** Cream, pinned for one screen: milk and cultures merge into the cup, then the headline lands. */
export function Ingredients() {
  const t = useTranslations("Home.ingredients");
  const cup = findSize(hero.frontSizeId)?.image;
  return (
    <Section id="ingredients" tone="cream" spacing="none" aria-labelledby="ingredients-title">
      <PinnedScene length={1}>
        <IngredientsScene
          eyebrow={t("eyebrow")}
          title={t("title")}
          notList={t("not")}
          milk={t("milk")}
          cultures={t("cultures")}
          cup={{
            src: cup?.src ?? "",
            width: cup?.width ?? 480,
            height: cup?.height ?? 480,
          }}
        />
      </PinnedScene>
    </Section>
  );
}

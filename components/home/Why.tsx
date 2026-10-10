import { useTranslations } from "next-intl";
import { Reveal } from "@/components/motion/Reveal";
import { FeatureCard } from "@/components/ui/Cards";
import type { IconName } from "@/components/ui/Icon";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ingredients, nutritionFor, nutritionPer100g, SERVING_GRAMS } from "@/content/product";

/*
 * Factual nutrition claims only (Website Brief, "Health wording"): the
 * approved copy is in messages under Home.why. Never "probiotic",
 * "immunity", "detox", "cure" or "treat"; tests/unit/claims.test.ts checks.
 */
const cultureNames = ingredients.items.find((item) => item.id === "cultures")?.detail ?? "";

/** Navy: four feature cards with the approved nutrition claims. */
export function Why() {
  const t = useTranslations("Home.why");
  const cards: { id: "protein" | "fat" | "sugar" | "cultures"; icon: IconName; text: string }[] = [
    {
      id: "protein",
      icon: "sparkle",
      text: t("protein.text", {
        protein: nutritionFor(SERVING_GRAMS).proteinG,
        grams: SERVING_GRAMS,
      }),
    },
    { id: "fat", icon: "dropOff", text: t("fat.text", { kcal: nutritionPer100g.energyKcal }) },
    { id: "sugar", icon: "cubeOff", text: t("sugar.text") },
    {
      id: "cultures",
      icon: "culture",
      text: t("cultures.text", { cultures: cultureNames }),
    },
  ];
  return (
    <Section id="why" tone="navy" waveBottom="cream" aria-labelledby="why-title">
      <div className="container-page">
        <SectionHeader id="why-title" eyebrow={t("eyebrow")} title={t("title")} />
        <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4 lg:gap-8">
          {cards.map((card, i) => (
            <Reveal key={card.id} delay={i * 100}>
              <FeatureCard icon={card.icon} title={t(`${card.id}.title`)}>
                <p>{card.text}</p>
              </FeatureCard>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}

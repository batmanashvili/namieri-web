import { useTranslations } from "next-intl";
import { MeanderDivider } from "@/components/ui/MeanderDivider";
import { Section } from "@/components/ui/Section";
import { StatCounter } from "@/components/ui/StatCounter";
import { ingredients, nutritionFor, nutritionPer100g, SERVING_GRAMS } from "@/content/product";

/** Navy: 18 g / 0% / 64 kcal / 2, counting up once, between meander hairlines. */
export function Numbers() {
  const t = useTranslations("Home.numbers");
  const tStats = useTranslations("Stats");
  const stats = [
    {
      id: "protein",
      value: nutritionFor(SERVING_GRAMS).proteinG,
      unit: tStats("unitG"),
      label: tStats("protein", { grams: SERVING_GRAMS }),
    },
    { id: "fat", value: nutritionPer100g.fatG, unit: "%", label: tStats("fat") },
    {
      id: "kcal",
      value: nutritionPer100g.energyKcal,
      unit: tStats("unitKcal"),
      label: tStats("kcal"),
    },
    { id: "ingredients", value: ingredients.items.length, label: tStats("ingredients") },
  ];

  return (
    <Section
      id="numbers"
      tone="navy"
      spacing="sm"
      waveBottom="cream"
      aria-labelledby="numbers-title"
    >
      <div className="container-page">
        <h2 id="numbers-title" className="eyebrow text-center text-accent">
          {t("title")}
        </h2>
        <MeanderDivider className="mt-8 opacity-70" />
        <ul className="grid grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <li
              key={stat.id}
              className={[
                "flex justify-center px-4 py-10 text-center sm:py-12",
                i % 2 === 1 ? "border-l border-hairline" : "",
                i >= 2 ? "border-t border-hairline lg:border-t-0" : "",
                i === 2 ? "lg:border-l" : "",
              ].join(" ")}
            >
              <StatCounter
                value={stat.value}
                unit={stat.unit}
                label={stat.label}
                className="items-center"
                labelClassName="text-fg"
              />
            </li>
          ))}
        </ul>
        <MeanderDivider className="opacity-70" />
      </div>
    </Section>
  );
}

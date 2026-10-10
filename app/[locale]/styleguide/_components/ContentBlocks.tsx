import { useLocale, useTranslations } from "next-intl";
import { Accordion } from "@/components/ui/Accordion";
import { FeatureCard, RecipeCard, TestimonialCard } from "@/components/ui/Cards";
import { IngredientList } from "@/components/ui/IngredientList";
import { NutritionTable } from "@/components/ui/NutritionTable";
import { ResponsiveImage } from "@/components/ui/ResponsiveImage";
import { SizeCard } from "@/components/ui/SizeCard";
import { StatCounter } from "@/components/ui/StatCounter";
import { VideoLoop } from "@/components/ui/VideoLoop";
import {
  availableSizes,
  ingredients,
  nutritionPer100g,
  proteinPerPack,
  sizes,
} from "@/content/product";
import { formatGrams } from "@/lib/format";
import { SgSection, Specimen, StateLabel, Triptych } from "./Layout";

export function ContentSection({ index }: { index: number }) {
  const t = useTranslations("Styleguide.content");
  const tStates = useTranslations("Styleguide.states");
  const tStats = useTranslations("Stats");
  const locale = useLocale();
  const cup = availableSizes[0]!;

  const faq = (["1", "2", "3", "4"] as const).map((n) => ({
    id: `q${n}`,
    title: t(`faq.q${n}`),
    content: <p>{t(`faq.a${n}`)}</p>,
  }));

  return (
    <SgSection id="content" index={index} lead={t("lead")} tone="cream">
      <Specimen title={t("stats")}>
        <Triptych>
          {() => (
            <div className="grid grid-cols-2 gap-x-4 gap-y-8">
              <StatCounter
                value={proteinPerPack(cup)}
                unit={tStats("unitG")}
                label={tStats("protein")}
              />
              <StatCounter value={nutritionPer100g.fatG} unit="%" label={tStats("fat")} />
              <StatCounter
                value={nutritionPer100g.energyKcal}
                unit={tStats("unitKcal")}
                label={tStats("kcal")}
              />
              <StatCounter value={ingredients.items.length} label={tStats("ingredients")} />
            </div>
          )}
        </Triptych>
      </Specimen>

      <Specimen title={t("sizeCards")}>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {sizes.map((size) => (
            <SizeCard key={size.id} size={size} />
          ))}
        </div>
        <Triptych>
          {(tone) =>
            tone === "navy" ? (
              <SizeCard size={availableSizes[1]!} />
            ) : tone === "cream" ? (
              <div className="grid gap-2">
                <StateLabel>{t("sizeLoading")}</StateLabel>
                <SizeCard size={cup} state="loading" />
              </div>
            ) : (
              <div className="grid gap-2">
                <StateLabel>{t("sizeError")}</StateLabel>
                <SizeCard size={cup} state="error" />
              </div>
            )
          }
        </Triptych>
      </Specimen>

      <Specimen title={t("nutrition")}>
        <Triptych>{(tone) => <NutritionTable captionVisible={tone === "white"} />}</Triptych>
      </Specimen>

      <Specimen title={t("ingredients")}>
        <Triptych>{() => <IngredientList headingLevel="h4" />}</Triptych>
      </Specimen>

      <Specimen title={t("features")} note={t("sampleNote")}>
        <Triptych>
          {(tone) => (
            <FeatureCard
              headingLevel="h4"
              icon={tone === "navy" ? "drop" : tone === "cream" ? "sparkle" : "shield"}
              title={
                tone === "navy"
                  ? t("featureOneTitle")
                  : tone === "cream"
                    ? t("featureTwoTitle")
                    : t("featureThreeTitle")
              }
            >
              <p>
                {tone === "navy"
                  ? t("featureOneText")
                  : tone === "cream"
                    ? t("featureTwoText")
                    : t("featureThreeText")}
              </p>
            </FeatureCard>
          )}
        </Triptych>
      </Specimen>

      <Specimen title={t("testimonials")} note={t("sampleNote")}>
        <Triptych>
          {(tone) => (
            <TestimonialCard
              quote={tone === "cream" ? t("testimonialTwo") : t("testimonialOne")}
              name={tone === "cream" ? t("testimonialTwoName") : t("testimonialOneName")}
              source={t("testimonialSource")}
            />
          )}
        </Triptych>
      </Specimen>

      <Specimen title={t("recipes")} note={t("sampleNote")}>
        <Triptych>
          {(tone) => (
            <RecipeCard
              headingLevel="h4"
              href="/recipes"
              title={tone === "white" ? t("recipeTwoTitle") : t("recipeOneTitle")}
              image={{ src: "/images/placeholders/yogurt-bowl.svg", alt: t("imageAlt") }}
              meta={[
                t("recipeMinutes", { minutes: tone === "white" ? 10 : 5 }),
                t("recipeUses", { size: formatGrams(tone === "white" ? 500 : 150, locale) }),
              ]}
            />
          )}
        </Triptych>
      </Specimen>

      <Specimen title={t("accordion")}>
        <Triptych stack panelClassName="lg:grid-cols-[12rem_1fr]">
          {(tone) => (
            <Accordion headingLevel="h4" items={faq} defaultOpen={tone === "white" ? ["q1"] : []} />
          )}
        </Triptych>
      </Specimen>

      <div className="grid gap-12 lg:grid-cols-2">
        <Specimen title={t("image")}>
          <ResponsiveImage
            src="/images/placeholders/yogurt-bowl.svg"
            alt={t("imageAlt")}
            ratio="4/3"
          />
          <StateLabel>{tStates("default")} · 4:3 · next/image</StateLabel>
        </Specimen>
        <Specimen title={t("video")} note={t("videoNote")}>
          <div className="aspect-video overflow-hidden rounded-card bg-navy-900">
            <VideoLoop
              poster="/images/placeholders/video-poster.svg"
              webm="/video/sample-loop.webm"
              mp4="/video/sample-loop.mp4"
              label={t("videoAlt")}
            />
          </div>
        </Specimen>
      </div>
    </SgSection>
  );
}

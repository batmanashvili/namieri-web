import { useTranslations } from "next-intl";
import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/Button";
import { RecipeCard } from "@/components/ui/Cards";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { findSize, links } from "@/content/product";
import { recipes } from "@/content/recipes";
import type { Locale } from "@/lib/i18n/routing";

/** Cream: three recipes from the Instagram series, plus a link to Instagram. */
export function Kitchen({ locale }: { locale: Locale }) {
  const t = useTranslations("Home.kitchen");
  const tCommon = useTranslations("Common");
  if (recipes.length === 0) return null;
  return (
    <Section id="kitchen" tone="cream" aria-labelledby="kitchen-title">
      <div className="container-page">
        <SectionHeader
          id="kitchen-title"
          eyebrow={t("eyebrow")}
          title={t("title")}
          lead={t("text")}
        />
        <ul className="mt-12 grid gap-10 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3 lg:gap-8">
          {recipes.slice(0, 3).map((recipe, i) => {
            const size = findSize(recipe.sizeId);
            return (
              <Reveal as="li" key={recipe.id} delay={i * 120}>
                <RecipeCard
                  href={recipe.href}
                  external
                  newTabLabel={tCommon("opensInNewTab")}
                  title={recipe.title[locale]}
                  image={{ src: recipe.image.src, alt: recipe.image.alt[locale] }}
                  meta={[
                    t("minutes", { minutes: recipe.minutes }),
                    ...(size ? [t("uses", { size: size.label[locale] })] : []),
                  ]}
                />
              </Reveal>
            );
          })}
        </ul>
        <div className="mt-12">
          <Button
            href={links.instagram}
            external
            newTabLabel={tCommon("opensInNewTab")}
            variant="secondary"
            iconStart="instagram"
          >
            {t("instagram")}
          </Button>
        </div>
      </div>
    </Section>
  );
}

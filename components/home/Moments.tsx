import { useTranslations } from "next-intl";
import { Reveal } from "@/components/motion/Reveal";
import { ResponsiveImage } from "@/components/ui/ResponsiveImage";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { TrackedButton } from "@/components/ui/TrackedButton";
import { moments } from "@/content/home";
import { PRODUCT_HREF } from "@/content/navigation";
import { findSize, nutritionFor, SERVING_GRAMS } from "@/content/product";
import type { Locale } from "@/lib/i18n/routing";

/** Cream: three moments of the day, each linking to the size that suits it. */
export function Moments({ locale }: { locale: Locale }) {
  const t = useTranslations("Home.moments");
  return (
    <Section id="moments" tone="cream" aria-labelledby="moments-title">
      <div className="container-page">
        <SectionHeader id="moments-title" eyebrow={t("eyebrow")} title={t("title")} />
        <ul className="mt-12 grid gap-12 md:grid-cols-3 md:gap-8 lg:mt-16">
          {moments.map((moment, i) => {
            const size = moment.sizeId ? findSize(moment.sizeId) : undefined;
            const sizeLabel = size?.label[locale] ?? "";
            return (
              <Reveal as="li" key={moment.id} delay={i * 120} className="grid content-start gap-5">
                <ResponsiveImage
                  src={moment.image.src}
                  alt={moment.image.alt[locale]}
                  ratio={moment.image.ratio}
                  sizes="(min-width: 48rem) 33vw, 100vw"
                />
                <h3 className="font-display text-h3 font-semibold">{t(`${moment.id}.title`)}</h3>
                <p className="text-body text-fg-muted">
                  {t(`${moment.id}.text`, {
                    protein: nutritionFor(SERVING_GRAMS).proteinG,
                    size: sizeLabel,
                  })}
                </p>
                <div>
                  {size ? (
                    <TrackedButton
                      href={`${PRODUCT_HREF}?size=${size.id}`}
                      variant="link"
                      iconEnd="arrowRight"
                      event="select_size_from_landing"
                      params={{ item_id: size.id, section: "moments" }}
                    >
                      {t("choose", { size: sizeLabel })}
                    </TrackedButton>
                  ) : (
                    <TrackedButton
                      href={PRODUCT_HREF}
                      variant="link"
                      iconEnd="arrowRight"
                      event="cta_order_click"
                      params={{ section: "moments" }}
                    >
                      {t("chooseAny")}
                    </TrackedButton>
                  )}
                </div>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </Section>
  );
}

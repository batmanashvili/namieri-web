import { useTranslations } from "next-intl";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SizeCard } from "@/components/ui/SizeCard";
import { TrackedButton } from "@/components/ui/TrackedButton";
import { PRODUCT_HREF } from "@/content/navigation";
import { isAvailable, sizes } from "@/content/product";
import type { Locale } from "@/lib/i18n/routing";

/**
 * White: one card per size in content/product.ts. Available sizes link to
 * the product page with ?size=<id>; a coming_soon size shows the Coming soon
 * card with no price and no link. Changing its status is a content change.
 * Three columns on desktop, horizontal snap-scroll on phones.
 */
export function Sizes({ locale }: { locale: Locale }) {
  const t = useTranslations("Home.sizes");
  return (
    <Section id="sizes" tone="white" aria-labelledby="sizes-title">
      <div className="container-page">
        <SectionHeader id="sizes-title" eyebrow={t("eyebrow")} title={t("title")} align="center" />
        <ul
          aria-label={t("listLabel")}
          className="-mx-(--gutter) mt-12 flex snap-x snap-mandatory scroll-px-(--gutter) [scrollbar-width:thin] gap-4 overflow-x-auto px-(--gutter) pb-4 lg:mx-0 lg:mt-16 lg:grid lg:grid-cols-3 lg:gap-6 lg:overflow-visible lg:px-0 lg:pb-0"
        >
          {sizes.map((size) => {
            const taglineKey = `taglines.${size.id}`;
            const tagline = t.has(taglineKey as "taglines.cup-150")
              ? t(taglineKey as "taglines.cup-150")
              : undefined;
            return (
              <li
                key={size.id}
                data-size={size.id}
                className="w-[82%] max-w-sm shrink-0 snap-start sm:w-[46%] lg:w-auto lg:max-w-none"
              >
                <SizeCard
                  size={size}
                  description={tagline}
                  action={
                    isAvailable(size) && (
                      <TrackedButton
                        href={`${PRODUCT_HREF}?size=${size.id}`}
                        fullWidth
                        iconEnd="arrowRight"
                        event="select_size_from_landing"
                        params={{ item_id: size.id, section: "sizes" }}
                      >
                        {t("choose", { size: size.label[locale] })}
                      </TrackedButton>
                    )
                  }
                />
              </li>
            );
          })}
        </ul>
      </div>
    </Section>
  );
}

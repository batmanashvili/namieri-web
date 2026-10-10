import { useTranslations } from "next-intl";
import { Reveal } from "@/components/motion/Reveal";
import { TestimonialCard } from "@/components/ui/Cards";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { testimonials } from "@/content/testimonials";
import type { Locale } from "@/lib/i18n/routing";

/** White: 3–6 curated reviews. Hidden while content/testimonials.ts is empty. */
export function Testimonials({ locale }: { locale: Locale }) {
  const t = useTranslations("Home.testimonials");
  if (testimonials.length === 0) return null;
  return (
    <Section id="reviews" tone="white" aria-labelledby="reviews-title">
      <div className="container-page">
        <SectionHeader id="reviews-title" eyebrow={t("eyebrow")} title={t("title")} />
        <ul className="mt-12 grid gap-6 md:grid-cols-2 lg:mt-16 lg:grid-cols-3">
          {testimonials.slice(0, 6).map((item, i) => (
            <Reveal as="li" key={item.id} delay={(i % 3) * 100}>
              <TestimonialCard
                quote={item.quote[locale]}
                name={item.name[locale]}
                source={item.source?.[locale]}
              />
            </Reveal>
          ))}
        </ul>
      </div>
    </Section>
  );
}

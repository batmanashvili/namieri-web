import { useTranslations } from "next-intl";
import { FaqList } from "@/components/sections/FaqList";
import { JsonLd } from "@/components/seo/JsonLd";
import { Button } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { faq } from "@/content/faq";
import { HOME_FAQ_COUNT } from "@/content/home";
import type { Locale } from "@/lib/i18n/routing";
import { faqPageJsonLd } from "@/lib/structured-data";

/** Cream: the first six questions, a link to /faq, and FAQPage structured data for them. */
export function HomeFaq({ locale }: { locale: Locale }) {
  const t = useTranslations("Home.faq");
  const entries = faq.slice(0, HOME_FAQ_COUNT);
  return (
    <Section id="faq" tone="cream" aria-labelledby="faq-title">
      <JsonLd data={faqPageJsonLd(entries, locale)} />
      <div className="container-page grid gap-10 lg:grid-cols-[1fr_1.6fr] lg:gap-16">
        <SectionHeader id="faq-title" eyebrow={t("eyebrow")} title={t("title")}>
          <Button href="/faq" variant="secondary" iconEnd="arrowRight" className="mt-4">
            {t("all")}
          </Button>
        </SectionHeader>
        <FaqList entries={entries} locale={locale} />
      </div>
    </Section>
  );
}

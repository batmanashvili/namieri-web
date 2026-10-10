import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import { FaqList } from "@/components/sections/FaqList";
import { PageHero } from "@/components/sections/PageHero";
import { SiteShell } from "@/components/sections/SiteShell";
import { JsonLd } from "@/components/seo/JsonLd";
import { Button } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { faq } from "@/content/faq";
import type { Locale } from "@/lib/i18n/routing";
import { initLocale } from "@/lib/i18n/server";
import { pageMetadata } from "@/lib/seo";
import { faqPageJsonLd } from "@/lib/structured-data";

export async function generateMetadata({ params }: PageProps<"/[locale]/faq">): Promise<Metadata> {
  const locale = await initLocale(params);
  const t = await getTranslations({ locale, namespace: "Metadata.pages.faq" });
  return pageMetadata({
    locale,
    path: "/faq",
    title: t("title"),
    description: t("description"),
    ownOgImage: true,
  });
}

export default async function FaqPage({ params }: PageProps<"/[locale]/faq">) {
  const locale = await initLocale(params);
  return <Faq locale={locale} />;
}

function Faq({ locale }: { locale: Locale }) {
  const t = useTranslations("Faq");
  return (
    <SiteShell headerVariant="overlay">
      <JsonLd data={faqPageJsonLd(faq, locale)} />
      <PageHero eyebrow={t("eyebrow")} title={t("title")} lead={t("lead")} />
      <Section tone="cream">
        <div className="container-page max-w-[calc(52rem+2*var(--gutter))]">
          <FaqList entries={faq} locale={locale} />
          <div className="mt-16 grid justify-items-start gap-4 rounded-card border border-hairline bg-raised p-6 sm:p-8">
            <h2 className="font-display text-h3 font-semibold">{t("moreTitle")}</h2>
            <p className="text-body text-fg-muted">{t("moreText")}</p>
            <Button href="/contact" variant="secondary" iconEnd="arrowRight">
              {t("contact")}
            </Button>
          </div>
        </div>
      </Section>
    </SiteShell>
  );
}

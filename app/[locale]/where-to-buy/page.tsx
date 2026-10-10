import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import { BuyChannels } from "@/components/sections/BuyChannels";
import { PageHero } from "@/components/sections/PageHero";
import { SiteShell } from "@/components/sections/SiteShell";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/Cards";
import { Plinth } from "@/components/ui/Plinth";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { districtName } from "@/content/districts";
import { stores, storeMapUrl } from "@/content/stores";
import type { Locale } from "@/lib/i18n/routing";
import { initLocale } from "@/lib/i18n/server";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/where-to-buy">): Promise<Metadata> {
  const locale = await initLocale(params);
  const t = await getTranslations({ locale, namespace: "Metadata.pages.whereToBuy" });
  return pageMetadata({
    locale,
    path: "/where-to-buy",
    title: t("title"),
    description: t("description"),
    ownOgImage: true,
  });
}

export default async function WhereToBuyPage({ params }: PageProps<"/[locale]/where-to-buy">) {
  const locale = await initLocale(params);
  return <WhereToBuy locale={locale} />;
}

function WhereToBuy({ locale }: { locale: Locale }) {
  const t = useTranslations("WhereToBuy");
  const tCommon = useTranslations("Common");
  return (
    <SiteShell headerVariant="overlay">
      <PageHero eyebrow={t("eyebrow")} title={t("title")} lead={t("lead")} />

      <Section tone="cream" spacing="sm" aria-label={t("eyebrow")}>
        <div className="container-page">
          <BuyChannels location="where_to_buy" headingLevel="h2" />
        </div>
      </Section>

      <Section id="stores" tone="white" aria-labelledby="stores-title">
        <div className="container-page">
          <SectionHeader id="stores-title" title={t("storesTitle")} />
          {stores.length === 0 ? (
            <EmptyState
              className="mt-12"
              title={t("storesEmptyTitle")}
              illustration={<Plinth className="w-40 opacity-80" />}
            >
              <p>{t("storesEmptyText")}</p>
            </EmptyState>
          ) : (
            <ul className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {stores.map((store) => (
                <li
                  key={store.id}
                  className="grid content-start gap-4 rounded-card border border-hairline bg-raised p-6"
                >
                  <h3 className="font-display text-h3 font-semibold">{store.name[locale]}</h3>
                  <dl className="grid gap-3 text-small">
                    <div>
                      <dt className="text-fg-muted">{t("district")}</dt>
                      <dd className="text-body">{districtName(store.district, locale)}</dd>
                    </div>
                    <div>
                      <dt className="text-fg-muted">{t("address")}</dt>
                      <dd className="text-body">{store.address[locale]}</dd>
                    </div>
                    <div>
                      <dt className="text-fg-muted">{t("hours")}</dt>
                      <dd className="text-body tabular">{store.hours[locale]}</dd>
                    </div>
                  </dl>
                  <div>
                    <Button
                      href={storeMapUrl(store)}
                      external
                      newTabLabel={tCommon("opensInNewTab")}
                      variant="link"
                      iconStart="map"
                    >
                      {t("openMap")}
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </Section>

      <Section tone="navy" spacing="sm" aria-labelledby="wholesale-title">
        <div className="container-page flex flex-col items-start gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="grid gap-3">
            <h2 id="wholesale-title" className="font-display text-h2 font-semibold">
              {t("wholesaleTitle")}
            </h2>
            <p className="text-body text-fg-muted">{t("wholesaleText")}</p>
          </div>
          <Button href="/contact#wholesale" variant="secondary" iconEnd="arrowRight">
            {t("wholesaleLink")}
          </Button>
        </div>
      </Section>
    </SiteShell>
  );
}

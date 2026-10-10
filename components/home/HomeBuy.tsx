import { useTranslations } from "next-intl";
import { BuyChannels } from "@/components/sections/BuyChannels";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";

/** Navy: Wolt first, then direct messages, and a stores teaser once stores exist. */
export function HomeBuy() {
  const t = useTranslations("Buy");
  return (
    <Section id="where-to-buy" tone="navy" waveBottom="cream" aria-labelledby="buy-title">
      <div className="container-page">
        <SectionHeader id="buy-title" eyebrow={t("eyebrow")} title={t("title")} lead={t("text")} />
        <BuyChannels location="home_where_to_buy" storesTeaser className="mt-12 lg:mt-16" />
      </div>
    </Section>
  );
}

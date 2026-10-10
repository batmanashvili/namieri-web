import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Hero } from "@/components/home/Hero";
import { HomeAnnouncement } from "@/components/home/HomeAnnouncement";
import { HomeBuy } from "@/components/home/HomeBuy";
import { HomeFaq } from "@/components/home/HomeFaq";
import { HomeStickyCta } from "@/components/home/HomeStickyCta";
import { Ingredients } from "@/components/home/Ingredients";
import { Kitchen } from "@/components/home/Kitchen";
import { Moments } from "@/components/home/Moments";
import { Numbers } from "@/components/home/Numbers";
import { Process } from "@/components/home/Process";
import { Quality } from "@/components/home/Quality";
import { Sizes } from "@/components/home/Sizes";
import { Testimonials } from "@/components/home/Testimonials";
import { Why } from "@/components/home/Why";
import { SiteShell } from "@/components/sections/SiteShell";
import { JsonLd } from "@/components/seo/JsonLd";
import { initLocale } from "@/lib/i18n/server";
import { pageMetadata } from "@/lib/seo";
import { organizationJsonLd } from "@/lib/structured-data";

export async function generateMetadata({ params }: PageProps<"/[locale]">): Promise<Metadata> {
  const locale = await initLocale(params);
  const t = await getTranslations({ locale, namespace: "Metadata" });
  return pageMetadata({ locale, path: "/", description: t("description") });
}

/** The landing page: 14 sections, from the announcement bar to the footer (Prompt 2). */
export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const locale = await initLocale(params);
  return (
    <SiteShell
      headerVariant="overlay"
      announcement={<HomeAnnouncement locale={locale} />}
      stickyCta={<HomeStickyCta locale={locale} />}
    >
      <JsonLd data={organizationJsonLd(locale)} />
      <Hero />
      <Ingredients />
      <Numbers />
      <Process locale={locale} />
      <Why />
      <Moments locale={locale} />
      <Sizes locale={locale} />
      <Quality />
      <Kitchen locale={locale} />
      <Testimonials locale={locale} />
      <HomeBuy />
      <HomeFaq locale={locale} />
    </SiteShell>
  );
}

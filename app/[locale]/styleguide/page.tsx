import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import { AnnouncementBar } from "@/components/sections/AnnouncementBar";
import { SiteShell } from "@/components/sections/SiteShell";
import { StickyMobileCTA } from "@/components/sections/StickyMobileCTA";
import { Button } from "@/components/ui/Button";
import { Plinth } from "@/components/ui/Plinth";
import { Section } from "@/components/ui/Section";
import { Eyebrow, Heading, Text } from "@/components/ui/Typography";
import { links } from "@/content/product";
import { PRODUCT_HREF } from "@/content/navigation";
import { initLocale } from "@/lib/i18n/server";
import { pageMetadata } from "@/lib/seo";
import { ButtonsSection, MotifsSection } from "./_components/BrandAndButtons";
import { ContentSection } from "./_components/ContentBlocks";
import { ColourSection, SpaceSection, TypeSection } from "./_components/Foundations";
import {
  FeedbackSection,
  FormsSection,
  MotionSection,
  NavigationSection,
} from "./_components/Interactive";
import { SECTION_IDS } from "./_components/Layout";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/styleguide">): Promise<Metadata> {
  const locale = await initLocale(params);
  const t = await getTranslations({ locale, namespace: "Metadata" });
  return pageMetadata({
    locale,
    path: "/styleguide",
    title: t("styleguideTitle"),
    description: t("styleguideDescription"),
    noindex: true,
  });
}

export default async function StyleguidePage({ params }: PageProps<"/[locale]/styleguide">) {
  await initLocale(params);
  return <Styleguide />;
}

function Styleguide() {
  const t = useTranslations("Styleguide");
  const tNav = useTranslations("Styleguide.navigation");
  const tCommon = useTranslations("Common");

  return (
    <SiteShell
      headerVariant="overlay"
      announcement={
        <AnnouncementBar id="wolt-saburtalo">{tNav("announcementSample")}</AnnouncementBar>
      }
      stickyCta={
        <StickyMobileCTA>
          <Button size="sm" href={PRODUCT_HREF}>
            {tCommon("orderNow")}
          </Button>
          {links.wolt ? (
            <Button
              size="sm"
              variant="secondary"
              href={links.wolt}
              external
              newTabLabel={tCommon("opensInNewTab")}
            >
              {tCommon("orderOnWolt")}
            </Button>
          ) : (
            <Button size="sm" variant="secondary" disabled href="#">
              {tCommon("orderOnWolt")}
            </Button>
          )}
        </StickyMobileCTA>
      }
    >
      <Section tone="navy" spacing="none" className="under-header" waveBottom="cream" waveDrift>
        <div className="relative container-page grid gap-10 pt-16 pb-12 md:pt-24 lg:grid-cols-[1fr_16rem] lg:items-end">
          <div className="grid justify-items-start gap-6">
            <Eyebrow>{t("eyebrow")}</Eyebrow>
            <Heading as="h1" size="display" className="max-w-[16ch]">
              {t("title")}
            </Heading>
            <Text tone="muted">{t("intro")}</Text>
          </div>
          <Plinth variant="column" className="hidden h-80 justify-self-end opacity-40 lg:block" />
        </div>
        <nav aria-label={t("contents")} className="container-page pb-6">
          <ul className="flex flex-wrap gap-2">
            {SECTION_IDS.map((id, i) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  className="inline-flex min-h-11 items-center gap-2 rounded-pill border border-hairline px-4 text-small text-fg-muted tabular transition-colors hover:border-accent-fill hover:text-fg"
                >
                  <span className="text-accent">{String(i + 1).padStart(2, "0")}</span>
                  {t(`sections.${id}`)}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </Section>

      <ColourSection index={0} />
      <TypeSection index={1} />
      <SpaceSection index={2} />
      <MotifsSection index={3} />
      <ButtonsSection index={4} />
      <ContentSection index={5} />
      <FormsSection index={6} />
      <NavigationSection index={7} />
      <FeedbackSection index={8} />
      <MotionSection index={9} />
    </SiteShell>
  );
}

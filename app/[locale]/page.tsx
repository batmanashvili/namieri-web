import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import { SiteShell } from "@/components/sections/SiteShell";
import { Button } from "@/components/ui/Button";
import { Plinth } from "@/components/ui/Plinth";
import { Section } from "@/components/ui/Section";
import { Eyebrow, Heading, Text } from "@/components/ui/Typography";
import { links } from "@/content/product";
import { initLocale } from "@/lib/i18n/server";
import { pageMetadata } from "@/lib/seo";

// Holding page until the landing page ships in Phase 2. Kept out of search results.
export async function generateMetadata({ params }: PageProps<"/[locale]">): Promise<Metadata> {
  const locale = await initLocale(params);
  const t = await getTranslations({ locale, namespace: "Metadata" });
  return pageMetadata({ locale, path: "/", description: t("description"), noindex: true });
}

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  await initLocale(params);
  return <Holding />;
}

function Holding() {
  const t = useTranslations("Home");
  const tCommon = useTranslations("Common");
  return (
    <SiteShell headerVariant="overlay">
      <Section tone="navy" className="under-header" waveBottom="ink" waveDrift>
        <div className="container-page grid min-h-[70svh] content-center justify-items-start gap-6">
          <Eyebrow>{t("eyebrow")}</Eyebrow>
          <Heading as="h1" size="display" className="max-w-[14ch]">
            {t("title")}
          </Heading>
          <Text tone="muted">{t("text")}</Text>
          <div className="flex flex-wrap gap-3 pt-2">
            <Button
              href={links.instagram}
              external
              newTabLabel={tCommon("opensInNewTab")}
              iconStart="instagram"
            >
              {t("instagram")}
            </Button>
            {links.wolt && (
              <Button
                href={links.wolt}
                external
                newTabLabel={tCommon("opensInNewTab")}
                variant="secondary"
              >
                {tCommon("orderOnWolt")}
              </Button>
            )}
          </div>
          <Plinth
            variant="column"
            className="pointer-events-none absolute right-[6vw] bottom-0 hidden h-[60%] opacity-25 md:block"
          />
        </div>
      </Section>
    </SiteShell>
  );
}

import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import { Reveal } from "@/components/motion/Reveal";
import { OrderCtas } from "@/components/sections/OrderCtas";
import { PageHero } from "@/components/sections/PageHero";
import { SiteShell } from "@/components/sections/SiteShell";
import { FeatureCard } from "@/components/ui/Cards";
import { Icon, type IconName } from "@/components/ui/Icon";
import { MeanderDivider } from "@/components/ui/MeanderDivider";
import { ResponsiveImage } from "@/components/ui/ResponsiveImage";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Text } from "@/components/ui/Typography";
import { media } from "@/content/media";
import { company } from "@/content/product";
import type { Locale } from "@/lib/i18n/routing";
import { initLocale } from "@/lib/i18n/server";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/about">): Promise<Metadata> {
  const locale = await initLocale(params);
  const t = await getTranslations({ locale, namespace: "Metadata.pages.about" });
  return pageMetadata({
    locale,
    path: "/about",
    title: t("title"),
    description: t("description"),
    ownOgImage: true,
  });
}

export default async function AboutPage({ params }: PageProps<"/[locale]/about">) {
  const locale = await initLocale(params);
  return <About locale={locale} />;
}

const values: { id: "quality" | "purity" | "trust"; icon: IconName }[] = [
  { id: "quality", icon: "sparkle" },
  { id: "purity", icon: "leaf" },
  { id: "trust", icon: "shield" },
];

const sourcing = ["farmers", "arrival", "batches", "haccp"] as const;

// [CONFIRM] Replace the story with the full About text from Namieri's info sheet (BLOCKERS.md).
function About({ locale }: { locale: Locale }) {
  const t = useTranslations("About");
  const facts: { label: string; value: string; href?: string }[] = [
    { label: t("facts.legalName"), value: company.legalName[locale] },
    { label: t("facts.idCode"), value: company.idCode },
    { label: t("facts.address"), value: company.address[locale] },
    { label: t("facts.recognition"), value: company.recognitionCode },
    ...(company.haccp ? [{ label: t("facts.foodSafety"), value: t("facts.haccp") }] : []),
    { label: t("facts.phone"), value: company.phone, href: company.phoneHref },
    { label: t("facts.email"), value: company.email, href: `mailto:${company.email}` },
  ];

  return (
    <SiteShell headerVariant="overlay">
      <PageHero eyebrow={t("eyebrow")} title={t("title")} lead={t("story1")}>
        <Text tone="muted">{t("story2")}</Text>
      </PageHero>

      <Section tone="cream" aria-labelledby="values-title">
        <div className="container-page">
          <SectionHeader id="values-title" eyebrow={t("valuesEyebrow")} title={t("valuesTitle")} />
          <div className="mt-12 grid gap-10 md:grid-cols-3 md:gap-8 lg:mt-16">
            {values.map((value, i) => (
              <Reveal key={value.id} delay={i * 100}>
                <FeatureCard icon={value.icon} title={t(`values.${value.id}.title`)}>
                  <p>{t(`values.${value.id}.text`)}</p>
                </FeatureCard>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>

      <Section tone="white" aria-labelledby="sourcing-title">
        <div className="container-page grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <ResponsiveImage
            src={media.aboutOrigin.src}
            alt={media.aboutOrigin.alt[locale]}
            ratio={media.aboutOrigin.ratio}
          />
          <div>
            <SectionHeader
              id="sourcing-title"
              eyebrow={t("sourcingEyebrow")}
              title={t("sourcingTitle")}
            />
            <ul className="mt-8 grid gap-4">
              {sourcing.map((item) => (
                <li key={item} className="flex gap-3 text-body">
                  <Icon name="checkCircle" size={22} className="mt-0.5 text-accent" />
                  <span>{t(`sourcing.${item}`)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Section tone="navy" waveBottom="cream" aria-labelledby="mission-title">
        <div className="container-page grid justify-items-center gap-8 text-center">
          <h2 id="mission-title" className="eyebrow text-accent">
            {t("missionEyebrow")}
          </h2>
          <MeanderDivider variant="divider" className="w-full max-w-md" />
          <p className="max-w-[24ch] font-display text-h1 font-semibold text-balance">
            {t("mission")}
          </p>
        </div>
      </Section>

      <Section tone="cream" aria-labelledby="facts-title">
        <div className="container-page grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
          <SectionHeader id="facts-title" eyebrow={t("factsEyebrow")} title={t("factsTitle")} />
          <dl className="grid border-t border-hairline sm:grid-cols-2 sm:gap-x-8">
            {facts.map((fact) => (
              <div key={fact.label} className="grid gap-1 border-b border-hairline py-4">
                <dt className="text-small text-fg-muted">{fact.label}</dt>
                <dd className="text-body font-medium break-words tabular">
                  {fact.href ? (
                    <a href={fact.href} className="underline decoration-1 underline-offset-4">
                      {fact.value}
                    </a>
                  ) : (
                    fact.value
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="container-page mt-20 grid justify-items-center gap-6 text-center">
          <p className="max-w-[24ch] font-display text-h2 font-semibold">{t("ctaTitle")}</p>
          <OrderCtas section="about" className="justify-center" />
        </div>
      </Section>
    </SiteShell>
  );
}

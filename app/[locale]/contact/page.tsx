import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import { LeadForm, type LeadFormCopy } from "@/components/sections/LeadForm";
import { MapEmbed } from "@/components/sections/MapEmbed";
import { PageHero } from "@/components/sections/PageHero";
import { SiteShell } from "@/components/sections/SiteShell";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { districts } from "@/content/districts";
import { availableSizes, company } from "@/content/product";
import { mapsSearchUrl } from "@/content/stores";
import { businessTypes, MAX_LENGTH, weeklyVolumes } from "@/lib/leads/schema";
import type { Locale } from "@/lib/i18n/routing";
import { initLocale } from "@/lib/i18n/server";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/contact">): Promise<Metadata> {
  const locale = await initLocale(params);
  const t = await getTranslations({ locale, namespace: "Metadata.pages.contact" });
  return pageMetadata({
    locale,
    path: "/contact",
    title: t("title"),
    description: t("description"),
    ownOgImage: true,
  });
}

export default async function ContactPage({ params }: PageProps<"/[locale]/contact">) {
  const locale = await initLocale(params);
  return <Contact locale={locale} />;
}

function Contact({ locale }: { locale: Locale }) {
  const t = useTranslations("Contact");
  const tForms = useTranslations("Forms");
  const tCommon = useTranslations("Common");
  const address = company.address[locale];

  const details: { id: string; icon: IconName; label: string; value: string; href?: string }[] = [
    { id: "address", icon: "pin", label: t("address"), value: address },
    {
      id: "phone",
      icon: "phone",
      label: t("phone"),
      value: company.phone,
      href: company.phoneHref,
    },
    {
      id: "email",
      icon: "mail",
      label: t("email"),
      value: company.email,
      href: `mailto:${company.email}`,
    },
  ];

  const copy: LeadFormCopy = {
    formLabel: t("form.label"),
    requiredNote: t("form.requiredNote"),
    optional: tCommon("optional"),
    businessName: t("form.businessName"),
    contactName: t("form.contactName"),
    phone: tForms("phone"),
    phoneHint: tForms("phoneHint"),
    email: tForms("email"),
    emailHint: t("form.emailHint"),
    businessType: t("form.businessType"),
    district: tForms("district"),
    sizes: t("form.sizes"),
    weeklyVolume: t("form.weeklyVolume"),
    message: tForms("message"),
    messageHint: t("form.messageHint"),
    consent: tForms("consent"),
    choose: tForms("selectPlaceholder"),
    submit: t("form.submit"),
    sending: tForms("sending"),
    errors: {
      required: tForms("requiredError"),
      choose: t("form.chooseError"),
      phone: tForms("phoneError"),
      email: tForms("emailError"),
      consent: t("form.consentError"),
      tooLong: {
        name: t("form.tooLong", { max: MAX_LENGTH.name }),
        email: t("form.tooLong", { max: MAX_LENGTH.email }),
        message: t("form.tooLong", { max: MAX_LENGTH.message }),
      },
    },
    errorSummary: Array.from({ length: 10 }, (_, i) => t("form.errorSummary", { count: i + 1 })),
    successTitle: t("form.successTitle"),
    successText: t("form.successText"),
    again: t("form.again"),
    failureTitle: t("form.failureTitle"),
    failureText: t("form.failureText"),
    honeypot: t("form.honeypot"),
    contact: { phone: company.phone, phoneHref: company.phoneHref, email: company.email },
  };

  return (
    <SiteShell headerVariant="overlay">
      <PageHero eyebrow={t("eyebrow")} title={t("title")} lead={t("lead")} />

      <Section tone="cream" aria-labelledby="details-title">
        <div className="container-page grid gap-12 lg:grid-cols-[1fr_1.5fr] lg:gap-16">
          <div>
            <SectionHeader id="details-title" title={t("detailsTitle")} size="h2" />
            <address className="mt-8 grid gap-6 not-italic">
              {details.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <span className="grid size-11 shrink-0 place-items-center rounded-full border border-accent-fill/60 text-accent">
                    <Icon name={item.icon} size={20} />
                  </span>
                  <div className="grid gap-0.5">
                    <span className="text-small text-fg-muted">{item.label}</span>
                    {item.href ? (
                      <a
                        href={item.href}
                        className="text-body font-medium break-all tabular underline decoration-1 underline-offset-4 hover:decoration-2"
                      >
                        {item.value}
                      </a>
                    ) : (
                      <span className="text-body font-medium">{item.value}</span>
                    )}
                  </div>
                </div>
              ))}
            </address>
          </div>
          <MapEmbed
            query={company.address.en}
            openUrl={mapsSearchUrl(`Namieri, ${company.address.en}`)}
            copy={{
              frameTitle: t("map.frameTitle", { address }),
              show: t("map.show"),
              note: t("map.note"),
              open: t("map.open"),
              newTab: tCommon("opensInNewTab"),
            }}
          />
        </div>
      </Section>

      <Section id="wholesale" tone="white" aria-labelledby="wholesale-title">
        <div className="container-page grid gap-12 lg:grid-cols-[1fr_1.5fr] lg:gap-16">
          <SectionHeader
            id="wholesale-title"
            eyebrow={t("wholesale.eyebrow")}
            title={t("wholesale.title")}
            lead={t("wholesale.text")}
          />
          <LeadForm
            locale={locale}
            copy={copy}
            businessTypes={businessTypes.map((id) => ({
              value: id,
              label: t(`form.businessTypes.${id}`),
            }))}
            districts={districts.map((d) => ({ value: d.id, label: d.name[locale] }))}
            sizes={availableSizes.map((size) => ({
              value: size.id,
              label: `${size.label[locale]} · ${size.packaging[locale]}`,
            }))}
            volumes={weeklyVolumes.map((id) => ({
              value: id,
              label: t(`form.weeklyVolumes.${id}`),
            }))}
          />
        </div>
      </Section>
    </SiteShell>
  );
}

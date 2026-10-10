import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { LegalPage } from "@/components/sections/LegalPage";
import { formatDate } from "@/lib/format";
import { initLocale } from "@/lib/i18n/server";
import { getLegalDocument } from "@/lib/legal";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/privacy">): Promise<Metadata> {
  const locale = await initLocale(params);
  const [document, t] = await Promise.all([
    getLegalDocument(locale, "privacy"),
    getTranslations({ locale, namespace: "Metadata.pages.privacy" }),
  ]);
  return pageMetadata({
    locale,
    path: "/privacy",
    title: document.title,
    description: t("description"),
    // Drafts stay out of search results until the final text is supplied.
    noindex: document.draft,
  });
}

export default async function Page({ params }: PageProps<"/[locale]/privacy">) {
  const locale = await initLocale(params);
  const document = await getLegalDocument(locale, "privacy");
  return (
    <LegalPage
      document={document}
      updated={document.updated ? formatDate(document.updated, locale) : undefined}
    />
  );
}

import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { LegalPage } from "@/components/sections/LegalPage";
import { formatDate } from "@/lib/format";
import { initLocale } from "@/lib/i18n/server";
import { getLegalDocument } from "@/lib/legal";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/terms">): Promise<Metadata> {
  const locale = await initLocale(params);
  const [document, t] = await Promise.all([
    getLegalDocument(locale, "terms"),
    getTranslations({ locale, namespace: "Metadata.pages.terms" }),
  ]);
  return pageMetadata({
    locale,
    path: "/terms",
    title: document.title,
    description: t("description"),
    // Drafts stay out of search results until the final text is supplied.
    noindex: document.draft,
  });
}

export default async function Page({ params }: PageProps<"/[locale]/terms">) {
  const locale = await initLocale(params);
  const document = await getLegalDocument(locale, "terms");
  return (
    <LegalPage
      document={document}
      updated={document.updated ? formatDate(document.updated, locale) : undefined}
    />
  );
}

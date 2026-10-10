import type { FaqEntry } from "@/content/faq";
import { company, links, product } from "@/content/product";
import type { Locale } from "@/lib/i18n/routing";
import { siteUrl } from "@/lib/site";

/** schema.org Organization for Namieri LLC. Product data comes with the product page (Phase 3). */
export function organizationJsonLd(locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteUrl}/#organization`,
    name: product.brand[locale],
    alternateName: product.brand[locale === "ka" ? "en" : "ka"],
    legalName: company.legalName[locale],
    url: `${siteUrl}/${locale}`,
    logo: `${siteUrl}/brand/badge.svg`,
    email: company.email,
    telephone: company.phone.replace(/\s/g, ""),
    taxID: company.idCode,
    address: {
      "@type": "PostalAddress",
      streetAddress: locale === "ka" ? "ნიკო ბურის ქ. 25" : "25 Niko Buri St",
      addressLocality: locale === "ka" ? "თბილისი" : "Tbilisi",
      postalCode: "0159",
      addressCountry: "GE",
    },
    sameAs: [links.instagram, links.facebook].filter(Boolean),
  };
}

/** schema.org FAQPage for the given entries, in one language. */
export function faqPageJsonLd(entries: readonly FaqEntry[], locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: locale,
    mainEntity: entries.map((entry) => ({
      "@type": "Question",
      name: entry.question[locale],
      acceptedAnswer: { "@type": "Answer", text: entry.answer[locale] },
    })),
  };
}

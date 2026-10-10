import { getTranslations } from "next-intl/server";
import { routing } from "@/lib/i18n/routing";
import { initLocale } from "@/lib/i18n/server";
import { ogSize, renderOgImage } from "@/lib/og/template";

export const alt = "Namieri";
export const size = ogSize;
export const contentType = "image/png";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

// Default share image for every page under /ka and /en.
export default async function OpenGraphImage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await initLocale(params);
  const t = await getTranslations({ locale, namespace: "Metadata" });
  return renderOgImage({ title: t("ogTagline"), eyebrow: t("siteName"), locale });
}

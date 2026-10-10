import { getTranslations } from "next-intl/server";
import { initLocale } from "@/lib/i18n/server";
import { ogSize, renderOgImage } from "./template";

export { ogSize };

export type OgPageKey = "about" | "whereToBuy" | "contact" | "faq";

/** Share image for an information page: its Open Graph tagline on the brand template. */
export async function pageOgImage(params: Promise<{ locale: string }>, page: OgPageKey) {
  const locale = await initLocale(params);
  const t = await getTranslations({ locale, namespace: "Metadata" });
  return renderOgImage({ title: t(`pages.${page}.og`), eyebrow: t("siteName"), locale });
}

import type { Metadata, Viewport } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { ConsentBanner } from "@/components/sections/ConsentBanner";
import { dismissedAnnouncementsScript } from "@/components/sections/AnnouncementBar";
import { ToastProvider } from "@/components/ui/Toast";
import { fontVariables } from "@/lib/fonts";
import { routing, ogLocale } from "@/lib/i18n/routing";
import { initLocale } from "@/lib/i18n/server";
import { NAVY_900, siteUrl } from "@/lib/site";
import "@/styles/globals.css";

/** Only these namespaces are sent to the browser; the rest stay on the server. */
const CLIENT_NAMESPACES = [
  "Common",
  "Nav",
  "Language",
  "Announcement",
  "StickyCta",
  "Consent",
  "Feedback",
  "Error",
] as const;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: LayoutProps<"/[locale]">): Promise<Metadata> {
  const locale = await initLocale(params);
  const t = await getTranslations({ locale, namespace: "Metadata" });
  return {
    metadataBase: new URL(siteUrl),
    title: { default: t("title"), template: t("titleTemplate") },
    description: t("description"),
    applicationName: t("siteName"),
    openGraph: {
      type: "website",
      siteName: t("siteName"),
      title: t("title"),
      description: t("description"),
      locale: ogLocale[locale],
    },
    twitter: { card: "summary_large_image" },
    formatDetection: { telephone: false, email: false, address: false },
  };
}

export const viewport: Viewport = {
  themeColor: NAVY_900,
  colorScheme: "light",
};

export default async function LocaleLayout({ children, params }: LayoutProps<"/[locale]">) {
  const locale = await initLocale(params);
  const messages = await getMessages();
  const clientMessages = Object.fromEntries(CLIENT_NAMESPACES.map((ns) => [ns, messages[ns]]));
  const tFeedback = await getTranslations("Feedback");

  return (
    <html lang={locale} className={fontVariables} data-scroll-behavior="smooth">
      <head>
        <script dangerouslySetInnerHTML={{ __html: dismissedAnnouncementsScript }} />
      </head>
      <body>
        <NextIntlClientProvider messages={clientMessages}>
          <MotionProvider>
            <ToastProvider
              regionLabel={tFeedback("notifications")}
              dismissLabel={tFeedback("dismiss")}
            >
              {children}
              <ConsentBanner />
            </ToastProvider>
          </MotionProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

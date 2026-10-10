import { routing } from "@/lib/i18n/routing";
import { ogSize, pageOgImage } from "@/lib/og/page";

export const alt = "Namieri";
export const size = ogSize;
export const contentType = "image/png";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default function OpenGraphImage({ params }: { params: Promise<{ locale: string }> }) {
  return pageOgImage(params, "about");
}

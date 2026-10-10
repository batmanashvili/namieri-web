import { notFound } from "next/navigation";
import { initLocale } from "@/lib/i18n/server";

// Any unknown path under /ka or /en renders the localized not-found page.
export default async function CatchAll({ params }: PageProps<"/[locale]/[...rest]">) {
  await initLocale(params);
  notFound();
}

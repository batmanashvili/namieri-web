import { AnnouncementBar } from "@/components/sections/AnnouncementBar";
import { announcement } from "@/content/home";
import type { Locale } from "@/lib/i18n/routing";

/** The landing page's announcement from content/home.ts; nothing renders when it is null. */
export function HomeAnnouncement({ locale }: { locale: Locale }) {
  if (!announcement) return null;
  return <AnnouncementBar id={announcement.id}>{announcement.text[locale]}</AnnouncementBar>;
}

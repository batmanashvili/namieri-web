/** Tbilisi's ten administrative districts, plus "outside Tbilisi" for wholesale enquiries. */
import type { Localized } from "./product";

export const districts = [
  { id: "mtatsminda", name: { ka: "მთაწმინდა", en: "Mtatsminda" } },
  { id: "vake", name: { ka: "ვაკე", en: "Vake" } },
  { id: "saburtalo", name: { ka: "საბურთალო", en: "Saburtalo" } },
  { id: "krtsanisi", name: { ka: "კრწანისი", en: "Krtsanisi" } },
  { id: "isani", name: { ka: "ისანი", en: "Isani" } },
  { id: "samgori", name: { ka: "სამგორი", en: "Samgori" } },
  { id: "chughureti", name: { ka: "ჩუღურეთი", en: "Chughureti" } },
  { id: "didube", name: { ka: "დიდუბე", en: "Didube" } },
  { id: "nadzaladevi", name: { ka: "ნაძალადევი", en: "Nadzaladevi" } },
  { id: "gldani", name: { ka: "გლდანი", en: "Gldani" } },
  { id: "outside", name: { ka: "თბილისის გარეთ", en: "Outside Tbilisi" } },
] as const satisfies readonly { id: string; name: Localized }[];

export type District = (typeof districts)[number]["id"];

export const districtIds = districts.map((d) => d.id) as readonly District[];

export function districtName(id: District, locale: keyof Localized): string {
  return districts.find((d) => d.id === id)?.name[locale] ?? id;
}

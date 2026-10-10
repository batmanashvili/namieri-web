/**
 * Retail partners. While the list is empty, /where-to-buy shows "Stores
 * coming soon" and the landing page hides its stores teaser.
 *
 * Example entry:
 *   {
 *     id: "saburtalo-market",
 *     name: { ka: "…", en: "…" },
 *     district: "saburtalo",
 *     address: { ka: "…", en: "…" },
 *     hours: { ka: "ყოველდღე 09:00–22:00", en: "Daily 09:00–22:00" },
 *   },
 */
import type { District } from "./districts";
import type { Localized } from "./product";

export type Store = {
  id: string;
  name: Localized;
  district: District;
  address: Localized;
  hours: Localized;
  /** Optional; defaults to a Google Maps search for the address. */
  mapUrl?: string;
};

export const stores: readonly Store[] = [];

/** Google Maps link for a store, from its own mapUrl or a search for its address. */
export function storeMapUrl(store: Store): string {
  return store.mapUrl ?? mapsSearchUrl(`${store.name.en}, ${store.address.en}`);
}

/** Google Maps URLs API search link (no key needed). */
export function mapsSearchUrl(query: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

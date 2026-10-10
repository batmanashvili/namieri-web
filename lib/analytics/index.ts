/**
 * Consent-gated analytics. Nothing is sent, queued or loaded until the
 * visitor accepts analytics cookies; events fired before that are dropped.
 *
 * Events are pushed to `window.dataLayer` (GTM / GA4 format). To connect a
 * vendor, load its script in `loadVendor()` below — it runs only after consent.
 */

export type AnalyticsEventMap = {
  view_item: { item_id: string; price?: number };
  select_size: { item_id: string };
  add_to_cart: { item_id: string; quantity: number; price?: number };
  click_wolt: { location: string };
  /** "Order now" clicks; section is where the button sits (hero, sizes, sticky, …). */
  cta_order_click: { section: string };
  /** A size chosen on the landing page (size cards, moments). */
  select_size_from_landing: { item_id: string; section: string };
  begin_checkout: { value?: number };
  login: { method: "phone" | "email" | "google" };
  add_shipping_info: { zone?: string };
  purchase: { transaction_id: string; value: number };
  b2b_form_submit: { business_type: string };
};
export type AnalyticsEvent = keyof AnalyticsEventMap;

export type Consent = "granted" | "denied" | null;

export const CONSENT_KEY = "namieri:consent";
const CONSENT_EVENT = "namieri:consent-change";

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

export function readConsent(): Consent {
  try {
    const value = window.localStorage.getItem(CONSENT_KEY);
    return value === "granted" || value === "denied" ? value : null;
  } catch {
    return null;
  }
}

export function writeConsent(consent: Exclude<Consent, null>) {
  try {
    window.localStorage.setItem(CONSENT_KEY, consent);
  } catch {
    // Private mode: the choice lasts for this page view only.
  }
  window.dispatchEvent(new Event(CONSENT_EVENT));
  if (consent === "granted") loadVendor();
}

export function subscribeConsent(onChange: () => void) {
  window.addEventListener(CONSENT_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(CONSENT_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

let vendorLoaded = false;

/** Called once consent is granted. Add the analytics vendor's script here. */
export function loadVendor() {
  if (vendorLoaded || typeof window === "undefined") return;
  vendorLoaded = true;
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push({ event: "consent_granted" });
}

export function track<E extends AnalyticsEvent>(event: E, params: AnalyticsEventMap[E]) {
  if (typeof window === "undefined" || readConsent() !== "granted") return;
  loadVendor();
  window.dataLayer?.push({ event, ...params });
}

"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import { loadVendor, readConsent, subscribeConsent, writeConsent } from "@/lib/analytics";
import { Button } from "@/components/ui/Button";

const SERVER_PENDING = "server" as const;

/**
 * Analytics consent. Rendered client-side only (it depends on the stored
 * choice) and fixed to the bottom of the viewport, so it never shifts layout.
 */
export function ConsentBanner() {
  const t = useTranslations("Consent");
  const consent = useSyncExternalStore(subscribeConsent, readConsent, () => SERVER_PENDING);

  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (consent === "granted") loadVendor();
  }, [consent]);

  // While the banner is up, pad the page by its height so the end of the
  // page (footer links, language switch) stays reachable.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const root = document.documentElement;
    const observer = new ResizeObserver(() =>
      root.style.setProperty("--consent-space", `${el.offsetHeight + 24}px`),
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      root.style.removeProperty("--consent-space");
    };
  }, [consent]);

  if (consent !== null) return null;

  return (
    <section
      ref={ref}
      aria-label={t("label")}
      data-surface="white"
      className="fixed inset-x-3 bottom-3 z-60 mx-auto max-w-xl rounded-card border border-hairline bg-surface p-5 text-fg sm:inset-x-6 sm:bottom-6 sm:p-6"
    >
      <p className="text-small">
        {t("text")}{" "}
        <Link href="/privacy" className="font-medium text-link underline underline-offset-4">
          {t("privacy")}
        </Link>
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        <Button size="sm" onClick={() => writeConsent("granted")}>
          {t("accept")}
        </Button>
        <Button size="sm" variant="secondary" onClick={() => writeConsent("denied")}>
          {t("decline")}
        </Button>
      </div>
    </section>
  );
}

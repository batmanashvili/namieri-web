"use client";

import { useState, useSyncExternalStore } from "react";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { readConsent, subscribeConsent } from "@/lib/analytics";

type MapEmbedProps = {
  /** Address to show, e.g. "25 Niko Buri St, Tbilisi 0159". */
  query: string;
  /** Google Maps link opened in a new tab. */
  openUrl: string;
  copy: { frameTitle: string; show: string; note: string; open: string; newTab: string };
};

/**
 * Google Maps embed that loads only after the visitor asks for it or has
 * accepted analytics cookies, because Google may set its own cookies.
 * Until then a line-art placeholder holds the space (no layout shift).
 */
export function MapEmbed({ query, openUrl, copy }: MapEmbedProps) {
  const consent = useSyncExternalStore(subscribeConsent, readConsent, () => null);
  const [requested, setRequested] = useState(false);
  const load = requested || consent === "granted";

  return (
    <div
      data-map={load ? "loaded" : "placeholder"}
      className="relative aspect-[4/3] w-full overflow-hidden rounded-card border border-hairline bg-raised sm:aspect-[16/10]"
    >
      {load ? (
        <iframe
          src={`https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`}
          title={copy.frameTitle}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
          className="absolute inset-0 size-full border-0"
        />
      ) : (
        <>
          <svg
            aria-hidden="true"
            viewBox="0 0 400 250"
            preserveAspectRatio="xMidYMid slice"
            className="absolute inset-0 size-full text-accent-fill opacity-35"
            fill="none"
            stroke="currentColor"
            vectorEffect="non-scaling-stroke"
          >
            <path d="M-10 70C80 60 150 90 230 80s120-30 190-20M-10 170c90-20 170 10 250 0s110-40 170-30M90-10c-10 80 20 150 10 270M260-10c20 90-10 160 10 270M330-10c-20 60 10 140-20 270" />
            <path d="M-10 120h420M180-10v270" strokeDasharray="2 6" />
          </svg>
          <div className="absolute inset-0 grid place-content-center justify-items-center gap-4 p-6 text-center">
            <span className="grid size-14 place-items-center rounded-full border border-accent-fill bg-surface text-accent">
              <Icon name="pin" size={28} />
            </span>
            <Button size="sm" iconStart="map" onClick={() => setRequested(true)}>
              {copy.show}
            </Button>
            <p className="max-w-xs bg-raised text-small text-fg-muted">{copy.note}</p>
            <a
              href={openUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center gap-1.5 bg-raised text-small font-medium text-link underline underline-offset-4"
            >
              {copy.open}
              <Icon name="arrowUpRight" size={16} />
              <span className="sr-only">{copy.newTab}</span>
            </a>
          </div>
        </>
      )}
    </div>
  );
}

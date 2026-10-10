"use client";

import { company } from "@/content/product";
import "@/styles/globals.css";

/** Last-resort 500 page, used when the root layout itself fails. Bilingual. */
export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="ka">
      <body
        data-surface="navy"
        className="grid min-h-dvh place-items-center bg-surface p-6 text-center text-fg"
      >
        <title>500 · Namieri</title>
        <main className="grid max-w-lg justify-items-center gap-4">
          <p className="eyebrow text-accent tabular">500</p>
          <h1 className="font-display text-h2 font-semibold">რაღაც შეფერხდა</h1>
          <p lang="en" className="font-display-latin text-h3 font-semibold">
            Something went wrong
          </p>
          <p className="text-small text-fg-muted">
            <a className="text-link tabular underline underline-offset-4" href={company.phoneHref}>
              {company.phone}
            </a>
          </p>
          <button
            type="button"
            onClick={reset}
            className="mt-2 min-h-12 rounded-control bg-accent-fill px-6 font-medium text-on-accent hover:bg-accent-fill-hover"
          >
            თავიდან ცდა · <span lang="en">Try again</span>
          </button>
        </main>
      </body>
    </html>
  );
}

import NextLink from "next/link";
import { cormorantGaramond, firago, firagoMedium, notoSerifGeorgian } from "@/lib/fonts";
import "@/styles/globals.css";

/*
 * Requests outside /ka and /en that the proxy does not redirect (for
 * example a missing file). Bilingual, since there is no locale to go by.
 */
export default function GlobalNotFound() {
  const fonts = [firago, firagoMedium, notoSerifGeorgian, cormorantGaramond]
    .map((f) => f.variable)
    .join(" ");
  return (
    <html lang="ka" className={fonts}>
      <body
        data-surface="navy"
        className="grid min-h-dvh place-items-center bg-surface p-6 text-center text-fg"
      >
        <title>404 · Namieri</title>
        <main className="grid justify-items-center gap-4">
          <p className="eyebrow text-accent tabular">404</p>
          <h1 className="font-display text-h1 font-semibold">გვერდი ვერ მოიძებნა</h1>
          <p lang="en" className="font-display-latin text-h3 font-semibold">
            Page not found
          </p>
          <p className="flex flex-wrap justify-center gap-6 pt-4 text-body">
            <NextLink className="text-link underline underline-offset-4" href="/ka">
              მთავარი გვერდი
            </NextLink>
            <NextLink className="text-link underline underline-offset-4" href="/en" lang="en">
              Home page
            </NextLink>
          </p>
        </main>
      </body>
    </html>
  );
}

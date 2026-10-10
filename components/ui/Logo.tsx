import { useLocale } from "next-intl";
import { product } from "@/content/product";
import { cn } from "@/lib/cn";
import type { Locale } from "@/lib/i18n/routing";

/*
 * Wordmark from public/brand/. The script logo is never re-typeset in a font:
 * swap the SVG files for the designer's and keep the aspect ratios below in sync.
 */
const logos: Record<Locale, { src: string; width: number; height: number }> = {
  ka: { src: "/brand/logo-ka.svg", width: 433, height: 111 },
  en: { src: "/brand/logo-en.svg", width: 327, height: 72 },
};

type LogoProps = {
  /** Defaults to the page locale. */
  locale?: Locale;
  /** Rendered height in px; width follows the file's aspect ratio. */
  height?: number;
  /** Empty when the logo sits inside a link that already has a label. */
  decorative?: boolean;
  className?: string;
};

export function Logo({
  locale: localeProp,
  height = 32,
  decorative = false,
  className,
}: LogoProps) {
  const pageLocale = useLocale();
  const locale = localeProp ?? pageLocale;
  const logo = logos[locale];
  const width = Math.round((logo.width / logo.height) * height);
  return (
    // eslint-disable-next-line @next/next/no-img-element -- SVG brand file, swapped as-is
    <img
      src={logo.src}
      width={width}
      height={height}
      alt={decorative ? "" : product.brand[locale]}
      className={cn("block h-auto max-w-full", className)}
      style={{ height }}
      decoding="async"
    />
  );
}

export function Badge({ size = 64, className }: { size?: number; className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- SVG brand file, swapped as-is
    <img
      src="/brand/badge.svg"
      width={size}
      height={size}
      alt=""
      className={cn("block", className)}
    />
  );
}

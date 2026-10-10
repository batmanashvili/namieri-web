"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/lib/i18n/navigation";
import { locales, type Locale } from "@/lib/i18n/routing";
import { cn } from "@/lib/cn";

type LanguageSwitcherProps = {
  /** compact: "ქარ | EN" pill for the header. full: names, for menus and the footer. */
  variant?: "compact" | "full";
  className?: string;
  onNavigate?: () => void;
};

/** Switches locale while keeping the current path (e.g. /ka/styleguide ↔ /en/styleguide). */
export function LanguageSwitcher({
  variant = "compact",
  className,
  onNavigate,
}: LanguageSwitcherProps) {
  const t = useTranslations("Language");
  const current = useLocale();
  const pathname = usePathname();

  const name = (locale: Locale) => (variant === "compact" ? t(`${locale}Short`) : t(locale));

  return (
    <nav aria-label={t("label")} className={className}>
      <ul
        className={cn(
          "flex items-center",
          variant === "compact" ? "rounded-pill border border-hairline p-0.5" : "gap-2",
        )}
      >
        {locales.map((locale) => {
          const active = locale === current;
          const classes = cn(
            "inline-flex min-h-11 items-center justify-center rounded-pill text-small font-medium transition-colors",
            variant === "compact" ? "min-w-11 px-3" : "px-4",
            active ? "bg-fg/10 text-fg" : "text-fg-muted hover:bg-fg/8 hover:text-fg",
          );
          return (
            <li key={locale}>
              {active ? (
                <span aria-current="true" lang={locale} className={classes}>
                  {name(locale)}
                </span>
              ) : (
                <Link
                  href={pathname}
                  locale={locale}
                  lang={locale}
                  hrefLang={locale}
                  aria-label={t("switchTo", { language: t(locale) })}
                  onClick={onNavigate}
                  className={classes}
                >
                  {name(locale)}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

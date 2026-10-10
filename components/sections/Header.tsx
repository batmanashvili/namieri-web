"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/lib/i18n/navigation";
import { mainNav } from "@/content/navigation";
import { Dialog } from "@/components/ui/Dialog";
import { IconButton } from "@/components/ui/IconButton";
import { Logo } from "@/components/ui/Logo";
import { MeanderDivider } from "@/components/ui/MeanderDivider";
import { cn } from "@/lib/cn";
import { CartLink } from "./CartLink";
import { LanguageSwitcher } from "./LanguageSwitcher";

const SOLID_AFTER_PX = 80;

type HeaderBarProps = {
  solid: boolean;
  cartCount?: number;
  onOpenMenu?: () => void;
  menuOpen?: boolean;
  className?: string;
};

/** Presentational bar: logo, primary nav, language switch, cart, menu button. */
export function HeaderBar({
  solid,
  cartCount = 0,
  onOpenMenu,
  menuOpen = false,
  className,
}: HeaderBarProps) {
  const t = useTranslations("Nav");
  const pathname = usePathname();

  return (
    <div
      data-surface="navy"
      data-solid={solid || undefined}
      className={cn(
        "border-b border-transparent bg-transparent text-fg transition-[background-color,border-color] duration-300",
        "data-solid:border-hairline data-solid:bg-navy-900",
        className,
      )}
    >
      <div className="container-page flex h-(--header-height) items-center justify-between gap-4">
        <Link href="/" aria-label={t("homeLink")} className="-m-2 rounded-control p-2">
          <Logo decorative height={28} />
        </Link>

        <nav aria-label={t("label")} className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {mainNav.map((item) => {
              const current = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <li key={item.key}>
                  <Link
                    href={item.href}
                    aria-current={current ? "page" : undefined}
                    className={cn(
                      "relative inline-flex min-h-11 items-center px-3 text-small font-medium text-fg-muted transition-colors hover:text-fg",
                      "after:absolute after:inset-x-3 after:bottom-2 after:h-px after:bg-accent-fill after:opacity-0 after:transition-opacity aria-[current=page]:text-fg aria-[current=page]:after:opacity-100",
                    )}
                  >
                    {t(item.key)}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-1">
          <LanguageSwitcher className="me-1 hidden sm:block" />
          <CartLink count={cartCount} />
          <IconButton
            icon="menu"
            label={t("openMenu")}
            aria-expanded={menuOpen}
            aria-haspopup="dialog"
            onClick={onOpenMenu}
            className="lg:hidden"
          />
        </div>
      </div>
    </div>
  );
}

type HeaderProps = {
  /** overlay: transparent over a navy hero until 80 px of scroll. solid: always navy. */
  variant?: "overlay" | "solid";
  cartCount?: number;
};

export function Header({ variant = "solid", cartCount = 0 }: HeaderProps) {
  const t = useTranslations("Nav");
  const tCommon = useTranslations("Common");
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const sentinel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (variant !== "overlay" || !sentinel.current) return;
    const observer = new IntersectionObserver(([entry]) => setScrolled(!entry?.isIntersecting));
    observer.observe(sentinel.current);
    return () => observer.disconnect();
  }, [variant]);

  return (
    <>
      <a
        href="#main"
        className="sr-only-focusable fixed top-2 left-2 z-70 rounded-control bg-white px-4 py-3 text-small font-medium text-ink-900"
      >
        {tCommon("skipToContent")}
      </a>
      {variant === "overlay" && (
        <div
          ref={sentinel}
          aria-hidden="true"
          className="pointer-events-none absolute top-0 left-0 w-px"
          style={{ height: SOLID_AFTER_PX }}
        />
      )}
      {/* Sticky in both variants; overlay pages pull their hero up beneath it with `under-header`. */}
      <header className="sticky inset-x-0 top-0 z-50">
        <HeaderBar
          solid={variant === "solid" || scrolled}
          cartCount={cartCount}
          menuOpen={menuOpen}
          onOpenMenu={() => setMenuOpen(true)}
        />
      </header>

      <Dialog
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        title={t("menu")}
        hideTitle
        closeLabel={t("closeMenu")}
        variant="fullscreen"
        tone="navy"
        className="lg:hidden"
      >
        <nav aria-label={t("label")} className="flex min-h-full flex-col pt-6">
          <ul className="grid gap-1">
            <li>
              <Link
                href="/"
                onClick={() => setMenuOpen(false)}
                className="block py-3 font-display text-h2 font-semibold"
              >
                {t("home")}
              </Link>
            </li>
            {mainNav.map((item) => (
              <li key={item.key}>
                <Link
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="block py-3 font-display text-h2 font-semibold transition-colors hover:text-accent"
                >
                  {t(item.key)}
                </Link>
              </li>
            ))}
          </ul>
          <MeanderDivider className="mt-auto mb-6 pt-10" />
          <LanguageSwitcher variant="full" onNavigate={() => setMenuOpen(false)} />
        </nav>
      </Dialog>
    </>
  );
}

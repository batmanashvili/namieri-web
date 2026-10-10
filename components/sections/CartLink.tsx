"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import { CART_HREF } from "@/content/navigation";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";

/** Cart icon with a count badge. The count is a placeholder until the cart lands in Phase 3. */
export function CartLink({ count = 0, className }: { count?: number; className?: string }) {
  const t = useTranslations("Nav");
  return (
    <Link
      href={CART_HREF}
      aria-label={t("cartCount", { count })}
      className={cn(
        "relative inline-grid size-11 place-items-center rounded-control text-fg transition-colors hover:bg-fg/8",
        className,
      )}
    >
      <Icon name="cart" size={22} />
      {count > 0 && (
        <span
          aria-hidden="true"
          className="absolute top-1 right-0.5 grid h-4.5 min-w-4.5 place-items-center rounded-pill bg-accent-fill px-1 text-[0.6875rem] leading-none font-medium text-on-accent tabular"
        >
          {count > 99 ? "99+" : count}
        </span>
      )}
    </Link>
  );
}

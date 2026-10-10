import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { TrackedButton } from "@/components/ui/TrackedButton";
import { PRODUCT_HREF } from "@/content/navigation";
import { links } from "@/content/product";
import { cn } from "@/lib/cn";

type OrderCtasProps = {
  /** Analytics section id, e.g. "hero". */
  section: string;
  size?: "md" | "lg";
  className?: string;
};

/**
 * "Order now" (→ product page) and "Order on Wolt" (new tab). Full width on
 * phones. Until NEXT_PUBLIC_WOLT_URL is set, the second button links to
 * /where-to-buy instead, which explains how to find the Wolt venue.
 */
export function OrderCtas({ section, size = "lg", className }: OrderCtasProps) {
  const t = useTranslations("Common");
  const tNav = useTranslations("Nav");
  return (
    <div className={cn("flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap", className)}>
      <TrackedButton
        href={PRODUCT_HREF}
        size={size}
        iconEnd="arrowRight"
        event="cta_order_click"
        params={{ section }}
      >
        {t("orderNow")}
      </TrackedButton>
      {links.wolt ? (
        <TrackedButton
          href={links.wolt}
          external
          newTabLabel={t("opensInNewTab")}
          variant="secondary"
          size={size}
          iconEnd="arrowUpRight"
          event="click_wolt"
          params={{ location: section }}
        >
          {t("orderOnWolt")}
        </TrackedButton>
      ) : (
        <Button href="/where-to-buy" variant="secondary" size={size}>
          {tNav("whereToBuy")}
        </Button>
      )}
    </div>
  );
}

import { useTranslations } from "next-intl";
import { StickyMobileCTA } from "@/components/sections/StickyMobileCTA";
import { TrackedButton } from "@/components/ui/TrackedButton";
import { PRODUCT_HREF } from "@/content/navigation";
import { lowestPriceGel } from "@/content/product";
import { formatPrice } from "@/lib/format";
import type { Locale } from "@/lib/i18n/routing";

/** Phones only: "from 4,50 ₾" and "Order now", shown once the hero has scrolled away. */
export function HomeStickyCta({ locale }: { locale: Locale }) {
  const t = useTranslations("Common");
  const from = lowestPriceGel();
  return (
    <StickyMobileCTA afterElementId="hero">
      {from !== undefined && (
        <p className="self-center text-body font-medium text-fg tabular">
          {t("fromPrice", { price: formatPrice(from, locale) })}
        </p>
      )}
      <TrackedButton href={PRODUCT_HREF} event="cta_order_click" params={{ section: "sticky" }}>
        {t("orderNow")}
      </TrackedButton>
    </StickyMobileCTA>
  );
}

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { TrackedButton } from "@/components/ui/TrackedButton";
import { links } from "@/content/product";
import { stores } from "@/content/stores";
import { cn } from "@/lib/cn";

type BuyChannelsProps = {
  /** Analytics location, e.g. "home_where_to_buy". */
  location: string;
  /** Show the "In stores" teaser when content/stores.ts has entries (landing page). */
  storesTeaser?: boolean;
  headingLevel?: "h2" | "h3";
  className?: string;
};

const card = "flex flex-col gap-4 rounded-card border bg-raised p-6 sm:p-8";

/** Wolt (primary), Instagram and Facebook direct messages, and optionally a stores teaser. */
export function BuyChannels({
  location,
  storesTeaser = false,
  headingLevel: H = "h3",
  className,
}: BuyChannelsProps) {
  const t = useTranslations("Buy");
  const tCommon = useTranslations("Common");
  const showStores = storesTeaser && stores.length > 0;

  return (
    <div className={cn("grid gap-6 lg:grid-cols-[1.25fr_1fr]", className)}>
      <article
        className={cn(card, "border-accent-fill/70", showStores && "lg:row-span-2")}
        data-channel="wolt"
      >
        <H className="font-display text-h2 font-semibold">{t("wolt.title")}</H>
        <p className="text-body text-fg-muted">{t("wolt.text")}</p>
        <div className="mt-auto pt-4">
          {links.wolt ? (
            <TrackedButton
              href={links.wolt}
              external
              newTabLabel={tCommon("opensInNewTab")}
              size="lg"
              iconEnd="arrowUpRight"
              event="click_wolt"
              params={{ location }}
              className="w-full sm:w-auto"
            >
              {tCommon("orderOnWolt")}
            </TrackedButton>
          ) : (
            <p className="text-body font-medium text-fg">{t("wolt.search")}</p>
          )}
        </div>
      </article>

      <article className={cn(card, "border-hairline")} data-channel="dm">
        <H className="font-display text-h3 font-semibold">{t("dm.title")}</H>
        <p className="text-body text-fg-muted">{t("dm.text")}</p>
        <div className="mt-auto flex flex-col gap-3 pt-2 sm:flex-row sm:flex-wrap">
          <Button
            href={links.instagramDm}
            external
            newTabLabel={tCommon("opensInNewTab")}
            variant="secondary"
            iconStart="instagram"
          >
            {t("dm.instagram")}
          </Button>
          {links.facebookDm && (
            <Button
              href={links.facebookDm}
              external
              newTabLabel={tCommon("opensInNewTab")}
              variant="secondary"
              iconStart="facebook"
            >
              {t("dm.facebook")}
            </Button>
          )}
        </div>
      </article>

      {showStores && (
        <article className={cn(card, "border-hairline")} data-channel="stores">
          <H className="flex items-center gap-3 font-display text-h3 font-semibold">
            <Icon name="store" size={26} className="text-accent" />
            {t("stores.title")}
          </H>
          <p className="text-body text-fg-muted">{t("stores.text", { count: stores.length })}</p>
          <div className="mt-auto pt-2">
            <Button href="/where-to-buy#stores" variant="link" iconEnd="arrowRight">
              {t("stores.link")}
            </Button>
          </div>
        </article>
      )}
    </div>
  );
}

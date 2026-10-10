import { useId, type ReactNode } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  isAvailable,
  pricePer100g,
  proteinPerPack,
  servings,
  type ProductSize,
} from "@/content/product";
import { cn } from "@/lib/cn";
import { formatGrams, formatNumber, formatPrice } from "@/lib/format";
import { Button } from "./Button";
import { Icon } from "./Icon";
import { Pill } from "./Pill";
import { Plinth } from "./Plinth";
import { ResponsiveImage } from "./ResponsiveImage";
import { Skeleton } from "./Skeleton";

type SizeCardProps = {
  size: ProductSize;
  /** Live retail price from the backend; falls back to content/product.ts. */
  priceGel?: number;
  /** loading: price still fetching. error: price failed and there is no usable fallback. */
  state?: "ready" | "loading" | "error";
  /** One line under the heading, e.g. "One serving, on the go". */
  description?: ReactNode;
  /** Replaces the default "Add to cart" button. */
  action?: ReactNode;
  headingLevel?: "h2" | "h3";
  className?: string;
};

const frame =
  "group/card relative flex h-full flex-col rounded-card border border-hairline bg-raised p-6 " +
  "transition-[border-color] duration-200 hover:border-accent-fill/70 sm:p-8";

export function SizeCard({
  size,
  priceGel,
  state = "ready",
  description,
  action,
  headingLevel: Heading = "h3",
  className,
}: SizeCardProps) {
  const t = useTranslations("Product");
  const locale = useLocale();
  const headingId = useId();

  const media = (
    <div className="relative mx-auto mb-6 w-full max-w-64">
      <ResponsiveImage
        src={size.image.src}
        alt={size.image.alt[locale]}
        ratio="1/1"
        fit="contain"
        rounded={false}
        frameClassName="relative z-10 bg-transparent"
        sizes="16rem"
      />
      <Plinth className="-mt-[20%] w-full opacity-60" />
    </div>
  );

  if (!isAvailable(size)) {
    return (
      <article
        className={cn(frame, "hover:border-hairline", className)}
        aria-labelledby={headingId}
      >
        <Pill icon="sparkle" className="absolute top-6 right-6 z-20">
          {t("comingSoon")}
        </Pill>
        {media}
        <Heading id={headingId} className="font-display text-h3 font-semibold">
          {size.label[locale]}
        </Heading>
        <p className="mt-1 text-small text-fg-muted">{size.packaging[locale]}</p>
        <p className="mt-6 text-body text-fg-muted">{description ?? t("comingSoonNote")}</p>
      </article>
    );
  }

  const price = priceGel ?? size.fallbackPriceGel;
  const servingCount = servings(size);

  return (
    <article
      className={cn(frame, className)}
      aria-labelledby={headingId}
      aria-busy={state === "loading" || undefined}
    >
      {media}
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <Heading id={headingId} className="font-display text-h3 font-semibold">
          {size.label[locale]}
        </Heading>
        <p className="text-small text-fg-muted">{size.packaging[locale]}</p>
      </div>
      {description && <p className="mt-2 text-body text-fg-muted">{description}</p>}

      <div className="mt-5 min-h-16" aria-live="polite">
        {state === "loading" ? (
          <>
            <Skeleton className="h-8 w-28" />
            <Skeleton className="mt-2 h-4 w-36" />
          </>
        ) : state === "error" ? (
          <p className="flex items-center gap-2 text-small text-danger">
            <Icon name="alert" size={18} />
            {t("priceUnavailable")}
          </p>
        ) : (
          <>
            <p className="text-h3 leading-none font-medium text-fg tabular">
              <span className="sr-only">{t("price")}: </span>
              {formatPrice(price, locale)}
            </p>
            <p className="mt-2 text-small text-fg-muted tabular">
              {t("pricePer100g", { price: formatPrice(pricePer100g(size, price), locale) })}
            </p>
          </>
        )}
      </div>

      <dl className="mt-5 grid grid-cols-2 gap-4 border-t border-hairline pt-5 text-small">
        <div>
          <dt className="text-fg-muted">{t("proteinPerPack")}</dt>
          <dd className="mt-1 text-body font-medium text-accent tabular">
            {formatGrams(proteinPerPack(size), locale)}
          </dd>
        </div>
        <div>
          <dt className="text-fg-muted">{t("servings", { count: servingCount })}</dt>
          <dd className="mt-1 text-body font-medium text-fg tabular">
            {formatNumber(servingCount, locale, { maximumFractionDigits: 1 })}
          </dd>
        </div>
      </dl>

      <div className="mt-auto pt-6">
        {action ?? (
          <Button fullWidth disabled={state !== "ready"} iconStart="cart">
            {t("addToCart")}
          </Button>
        )}
      </div>
    </article>
  );
}

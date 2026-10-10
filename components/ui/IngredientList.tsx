import { useLocale, useTranslations } from "next-intl";
import { ingredients, storage } from "@/content/product";
import { cn } from "@/lib/cn";
import { Icon } from "./Icon";

type IngredientListProps = {
  className?: string;
  showStorage?: boolean;
  headingLevel?: "h2" | "h3" | "h4";
};

export function IngredientList({
  className,
  showStorage = true,
  headingLevel: H = "h3",
}: IngredientListProps) {
  const t = useTranslations("Ingredients");
  const locale = useLocale();

  return (
    <div className={cn("grid gap-8", className)}>
      <div>
        <H className="font-display text-h3 font-semibold">{t("heading")}</H>
        <ol className="mt-4 grid gap-3">
          {ingredients.items.map((item, index) => (
            <li key={item.id} className="flex gap-4 border-b border-hairline pb-3">
              <span className="w-6 shrink-0 font-medium text-accent tabular">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span>
                <span className="block font-medium">{item.name[locale]}</span>
                {"detail" in item && (
                  <span className="block text-small text-fg-muted">{item.detail}</span>
                )}
              </span>
            </li>
          ))}
        </ol>
      </div>

      <div>
        <H className="eyebrow text-accent">{t("freeFromHeading")}</H>
        <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-small">
          {ingredients.freeFrom.map((item) => (
            <li key={item.en} className="flex items-center gap-2">
              <Icon name="check" size={18} className="text-accent" />
              {item[locale]}
            </li>
          ))}
        </ul>
      </div>

      {showStorage && (
        <div>
          <H className="eyebrow text-accent">{t("storageHeading")}</H>
          <ul className="mt-3 grid gap-2 text-small">
            <li>{t("storageTemp", { min: storage.tempMinC, max: storage.tempMaxC })}</li>
            <li>{t("unopened", { days: storage.shelfLifeUnopenedDays })}</li>
            <li>{t("opened", { days: storage.shelfLifeOpenedDays })}</li>
          </ul>
        </div>
      )}
    </div>
  );
}

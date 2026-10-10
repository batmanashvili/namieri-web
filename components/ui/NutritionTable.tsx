import { useLocale, useTranslations } from "next-intl";
import { nutritionFor, nutritionPer100g, SERVING_GRAMS, type Nutrition } from "@/content/product";
import { cn } from "@/lib/cn";
import { formatNutrient, type NutrientKey } from "@/lib/format";

type Row = { key: Exclude<NutrientKey, "energyKcal">; label: string; sub?: boolean };

type NutritionTableProps = {
  className?: string;
  /** Show the caption as a visible heading (default) or keep it for screen readers only. */
  captionVisible?: boolean;
};

/** EU-style nutrition declaration per 100 g and per 150 g serving. */
export function NutritionTable({ className, captionVisible = true }: NutritionTableProps) {
  const t = useTranslations("Nutrition");
  const locale = useLocale();
  const per100: Nutrition = nutritionPer100g;
  const perServing = nutritionFor(SERVING_GRAMS);

  const rows: Row[] = [
    { key: "energyKj", label: t("energy") },
    { key: "fatG", label: t("fat") },
    { key: "saturatesG", label: t("saturates"), sub: true },
    { key: "carbohydrateG", label: t("carbohydrate") },
    { key: "sugarsG", label: t("sugars"), sub: true },
    { key: "proteinG", label: t("protein") },
    { key: "saltG", label: t("salt") },
  ];

  const cell = (values: Nutrition, key: Row["key"]) =>
    key === "energyKj" ? (
      <>
        <span className="whitespace-nowrap">{`${formatNutrient("energyKj", values.energyKj, locale)} ${t("unitKj")}`}</span>
        {" / "}
        <span className="whitespace-nowrap">{`${formatNutrient("energyKcal", values.energyKcal, locale)} ${t("unitKcal")}`}</span>
      </>
    ) : (
      <span className="whitespace-nowrap">{`${formatNutrient(key, values[key], locale)} ${t("unitG")}`}</span>
    );

  return (
    <div className={cn("w-full overflow-x-auto", className)}>
      <table className="w-full border-collapse text-left text-small tabular">
        <caption
          className={cn(
            "pb-4 text-left font-display text-h3 font-semibold text-fg",
            !captionVisible && "sr-only",
          )}
        >
          {t("caption")}
        </caption>
        <thead>
          <tr className="border-y border-fg/40">
            <th scope="col" className="py-3 pr-4 font-medium">
              {t("typicalValues")}
            </th>
            <th scope="col" className="py-3 pr-4 text-right font-medium">
              {t("per100g")}
            </th>
            <th scope="col" className="py-3 text-right font-medium">
              {t("perServing", { grams: SERVING_GRAMS })}
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.key} className="border-b border-hairline">
              <th
                scope="row"
                className={cn(
                  "py-3 pr-4 font-normal",
                  row.sub ? "ps-4 text-fg-muted" : "font-medium text-fg",
                )}
              >
                {row.label}
              </th>
              <td className="py-3 pr-4 text-right">{cell(per100, row.key)}</td>
              <td className="py-3 text-right">{cell(perServing, row.key)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

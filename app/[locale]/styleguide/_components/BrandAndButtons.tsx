import { useTranslations } from "next-intl";
import { Button, type ButtonVariant } from "@/components/ui/Button";
import { IconButton } from "@/components/ui/IconButton";
import { Badge, Logo } from "@/components/ui/Logo";
import { MeanderDivider } from "@/components/ui/MeanderDivider";
import { Plinth } from "@/components/ui/Plinth";
import { YogurtWave } from "@/components/ui/YogurtWave";
import { SgSection, Specimen, StateLabel, Triptych } from "./Layout";

/* ---- Brand motifs -------------------------------------------------------------- */

export function MotifsSection({ index }: { index: number }) {
  const t = useTranslations("Styleguide.motifs");

  return (
    <SgSection id="motifs" index={index} lead={t("lead")} tone="navy">
      <div className="grid gap-12 lg:grid-cols-[2fr_1fr]">
        <Specimen title={t("logos")}>
          <div className="flex flex-wrap items-end gap-x-12 gap-y-8">
            <Logo locale="ka" height={56} />
            <Logo locale="en" height={40} />
          </div>
        </Specimen>
        <Specimen title={t("badge")}>
          <Badge size={96} />
        </Specimen>
      </div>

      <Specimen title={t("meander")}>
        <Triptych>
          {() => (
            <div className="grid gap-6">
              <StateLabel>{t("meanderBorder")}</StateLabel>
              <MeanderDivider />
              <StateLabel>{t("meanderDivider")}</StateLabel>
              <MeanderDivider variant="divider" />
            </div>
          )}
        </Triptych>
      </Specimen>

      <Specimen title={t("wave")}>
        <div className="grid gap-4 md:grid-cols-2">
          {[false, true].map((drift) => (
            <div
              key={String(drift)}
              className="overflow-hidden rounded-card border border-hairline"
            >
              <div className="h-28 bg-navy-900 p-5">
                <StateLabel>{drift ? t("waveDrift") : t("waveStatic")}</StateLabel>
              </div>
              <YogurtWave fill="cream" drift={drift} className="-mt-px bg-navy-900" />
              <div className="h-16 bg-cream-50" />
            </div>
          ))}
        </div>
      </Specimen>

      <Specimen title={t("plinth")}>
        <Triptych>
          {(tone) => (
            <div className="flex items-end justify-center gap-8">
              <Plinth
                variant="column"
                className={tone === "navy" ? "h-56 opacity-60" : "h-56 opacity-80"}
              />
              <Plinth className={tone === "navy" ? "w-44 opacity-60" : "w-44 opacity-80"} />
            </div>
          )}
        </Triptych>
      </Specimen>
    </SgSection>
  );
}

/* ---- Buttons ----------------------------------------------------------------- */

const variants: ButtonVariant[] = ["primary", "secondary", "ghost", "link"];
const previewStates = ["default", "hover", "focus", "active", "disabled", "loading"] as const;

export function ButtonsSection({ index }: { index: number }) {
  const t = useTranslations("Styleguide");
  const tb = useTranslations("Styleguide.buttons");
  const tCommon = useTranslations("Common");
  const tNav = useTranslations("Nav");

  return (
    <SgSection id="buttons" index={index} lead={tb("lead")}>
      {variants.map((variant) => (
        <Specimen key={variant} title={tb(variant)}>
          <Triptych>
            {() => (
              <ul className="grid grid-cols-2 gap-x-4 gap-y-5">
                {previewStates.map((state) => (
                  <li key={state} className="grid justify-items-start gap-2">
                    <Button
                      variant={variant}
                      size="sm"
                      iconEnd={variant === "link" ? "arrowRight" : undefined}
                      disabled={state === "disabled"}
                      loading={state === "loading"}
                      loadingLabel={tCommon("loading")}
                      data-preview={
                        state === "hover" || state === "focus" || state === "active"
                          ? state
                          : undefined
                      }
                      tabIndex={state === "default" ? undefined : -1}
                    >
                      {tCommon("orderNow")}
                    </Button>
                    <StateLabel>{t(`states.${state}`)}</StateLabel>
                  </li>
                ))}
              </ul>
            )}
          </Triptych>
        </Specimen>
      ))}

      <Specimen title={tb("sizes")}>
        <Triptych>
          {() => (
            <div className="grid justify-items-start gap-4">
              <Button size="sm">{tCommon("orderNow")}</Button>
              <Button size="md" iconStart="cart">
                {tCommon("orderNow")}
              </Button>
              <Button size="lg" variant="secondary" iconEnd="arrowUpRight">
                {tCommon("orderOnWolt")}
              </Button>
              <Button size="md" className="max-w-full">
                {tb("longLabel")}
              </Button>
            </div>
          )}
        </Triptych>
      </Specimen>

      <Specimen title={tb("iconButton")}>
        <Triptych>
          {() => (
            <div className="flex flex-wrap items-center gap-3">
              <IconButton icon="menu" label={tNav("openMenu")} />
              <IconButton icon="close" label={tNav("closeMenu")} variant="secondary" />
              <IconButton icon="cart" label={tNav("cart")} variant="primary" />
              <IconButton icon="menu" label={tNav("openMenu")} data-preview="hover" tabIndex={-1} />
              <IconButton icon="menu" label={tNav("openMenu")} data-preview="focus" tabIndex={-1} />
              <IconButton icon="menu" label={tNav("openMenu")} disabled />
            </div>
          )}
        </Triptych>
      </Specimen>
    </SgSection>
  );
}

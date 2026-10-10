import { useLocale, useTranslations } from "next-intl";
import { CountUp } from "@/components/motion/CountUp";
import { Parallax } from "@/components/motion/Parallax";
import { PinnedScene } from "@/components/motion/PinnedScene";
import { Reveal } from "@/components/motion/Reveal";
import { AnnouncementBar } from "@/components/sections/AnnouncementBar";
import { HeaderBar } from "@/components/sections/Header";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/Cards";
import {
  Checkbox,
  FormField,
  Input,
  QuantityStepper,
  RadioCardGroup,
  Select,
  Textarea,
} from "@/components/ui/Form";
import { Pill } from "@/components/ui/Pill";
import { Plinth } from "@/components/ui/Plinth";
import { YogurtWave } from "@/components/ui/YogurtWave";
import { Skeleton } from "@/components/ui/Skeleton";
import { Spinner } from "@/components/ui/Spinner";
import { ToastView } from "@/components/ui/Toast";
import { districts } from "@/content/districts";
import { isAvailable, sizes } from "@/content/product";
import { formatPrice } from "@/lib/format";
import { DialogDemo, PhoneDemo, ToastDemo, TwoIngredientsScene } from "./Demos";
import { SgSection, Specimen, StateLabel, Triptych } from "./Layout";

/* ---- Forms ---------------------------------------------------------------------- */

export function FormsSection({ index }: { index: number }) {
  const t = useTranslations("Styleguide.forms");
  const tStates = useTranslations("Styleguide.states");
  const f = useTranslations("Forms");
  const tCommon = useTranslations("Common");
  const tProduct = useTranslations("Product");
  const locale = useLocale();

  const districtOptions = districts.map((d) => ({ value: d.id, label: d.name[locale] }));

  return (
    <SgSection id="forms" index={index} lead={t("lead")}>
      <Specimen title={t("input")}>
        <Triptych>
          {() => (
            <div className="grid gap-6">
              <FormField label={f("name")}>
                <Input autoComplete="name" />
              </FormField>
              <div className="grid gap-1">
                <FormField label={f("name")}>
                  <Input defaultValue="Nino" data-preview="hover" tabIndex={-1} />
                </FormField>
                <StateLabel>{tStates("hover")}</StateLabel>
              </div>
              <div className="grid gap-1">
                <FormField label={f("name")}>
                  <Input defaultValue="Nino" data-preview="focus" tabIndex={-1} />
                </FormField>
                <StateLabel>{tStates("focus")}</StateLabel>
              </div>
              <div className="grid gap-1">
                <FormField label={f("name")}>
                  <Input defaultValue="Nino" disabled />
                </FormField>
                <StateLabel>{tStates("disabled")}</StateLabel>
              </div>
              <FormField label={f("email")} hint={f("emailHint")} error={f("emailError")} required>
                <Input type="email" defaultValue="name@" autoComplete="email" />
              </FormField>
            </div>
          )}
        </Triptych>
      </Specimen>

      <div className="grid gap-12 lg:grid-cols-2">
        <Specimen title={t("textarea")}>
          <Triptych stack>
            {() => (
              <FormField
                label={f("message")}
                hint={f("messageHint")}
                optionalLabel={tCommon("optional")}
              >
                <Textarea rows={3} />
              </FormField>
            )}
          </Triptych>
        </Specimen>
        <Specimen title={t("select")}>
          <Triptych stack>
            {(tone) => (
              <FormField
                label={f("district")}
                required
                error={tone === "white" ? f("requiredError") : undefined}
              >
                <Select
                  options={districtOptions}
                  placeholder={f("selectPlaceholder")}
                  defaultValue={tone === "cream" ? "vake" : undefined}
                />
              </FormField>
            )}
          </Triptych>
        </Specimen>
      </div>

      <Specimen title={t("checkbox")}>
        <Triptych>
          {() => (
            <div className="grid gap-2">
              <Checkbox label={f("consent")} />
              <Checkbox label={f("consent")} defaultChecked />
              <Checkbox label={f("consent")} disabled />
              <Checkbox label={f("consent")} error={f("requiredError")} required />
            </div>
          )}
        </Triptych>
      </Specimen>

      <Specimen title={t("radioCards")}>
        <Triptych stack>
          {(tone) => (
            <RadioCardGroup
              name={`size-${tone}`}
              legend={f("sizeLegend")}
              defaultValue={tone === "white" ? undefined : "cup-150"}
              error={tone === "white" ? f("requiredError") : undefined}
              required
              options={sizes.map((size) => ({
                value: size.id,
                title: size.label[locale],
                description: size.packaging[locale],
                meta: isAvailable(size) ? formatPrice(size.fallbackPriceGel, locale) : undefined,
                disabled: !isAvailable(size),
                badge: !isAvailable(size) ? (
                  <Pill icon="sparkle">{tProduct("comingSoon")}</Pill>
                ) : undefined,
              }))}
            />
          )}
        </Triptych>
      </Specimen>

      <div className="grid gap-12 lg:grid-cols-2">
        <Specimen title={t("phone")}>
          <Triptych stack>
            {(tone) => (
              <PhoneDemo
                label={f("phone")}
                hint={f("phoneHint")}
                error={f("phoneError")}
                defaultValue={tone === "white" ? "57407" : tone === "cream" ? "574077779" : ""}
                validateInitially={tone === "white"}
              />
            )}
          </Triptych>
        </Specimen>
        <Specimen title={t("stepper")}>
          <Triptych stack>
            {(tone) => (
              <div className="flex flex-wrap items-center gap-6">
                <QuantityStepper
                  label={f("quantity")}
                  decreaseLabel={f("decrease")}
                  increaseLabel={f("increase")}
                  defaultValue={tone === "cream" ? 3 : 1}
                  disabled={tone === "white"}
                />
                <StateLabel>
                  {tone === "white" ? tStates("disabled") : tStates("default")}
                </StateLabel>
              </div>
            )}
          </Triptych>
        </Specimen>
      </div>
    </SgSection>
  );
}

/* ---- Navigation -------------------------------------------------------------------- */

export function NavigationSection({ index }: { index: number }) {
  const t = useTranslations("Styleguide.navigation");
  const tCommon = useTranslations("Common");

  return (
    <SgSection id="navigation" index={index} lead={t("lead")} tone="cream">
      <Specimen title={t("header")}>
        <div className="grid gap-4" inert>
          <div className="grid gap-2">
            <StateLabel>{t("overlay")}</StateLabel>
            <div className="relative h-64 overflow-hidden rounded-card bg-navy-900">
              <Plinth variant="column" className="absolute top-6 right-[18%] h-80 opacity-40" />
              <div className="absolute inset-x-0 bottom-0">
                <YogurtWave fill="cream" />
              </div>
              <HeaderBar solid={false} className="relative" />
            </div>
          </div>
          <div className="grid gap-2">
            <StateLabel>{t("solid")}</StateLabel>
            <div className="overflow-hidden rounded-card bg-white">
              <HeaderBar solid cartCount={2} />
              <div className="h-16" />
            </div>
          </div>
        </div>
      </Specimen>

      <Specimen title={t("announcement")}>
        <div className="overflow-hidden rounded-card border border-hairline">
          <AnnouncementBar id="styleguide-sample">{t("announcementSample")}</AnnouncementBar>
        </div>
      </Specimen>

      <Specimen title={t("sticky")} note={t("stickyNote")}>
        <div
          inert
          data-surface="navy"
          className="mx-auto w-full max-w-sm rounded-card border border-hairline bg-surface p-3"
        >
          <div className="flex gap-3 *:flex-1">
            <Button size="sm">{tCommon("orderNow")}</Button>
            <Button size="sm" variant="secondary">
              {tCommon("orderOnWolt")}
            </Button>
          </div>
        </div>
      </Specimen>

      <Specimen title={t("footer")}>{null}</Specimen>
    </SgSection>
  );
}

/* ---- Feedback ----------------------------------------------------------------------- */

export function FeedbackSection({ index }: { index: number }) {
  const t = useTranslations("Styleguide.feedback");
  const fb = useTranslations("Feedback");
  const tCommon = useTranslations("Common");

  return (
    <SgSection id="feedback" index={index} lead={t("lead")}>
      <Specimen title={t("toast")}>
        <ToastDemo
          labels={{ success: t("showSuccess"), error: t("showError"), info: t("showInfo") }}
          messages={{ success: fb("toastSuccess"), error: fb("toastError"), info: fb("toastInfo") }}
        />
        <Triptych>
          {(tone) => (
            <ToastView
              tone={tone === "navy" ? "success" : tone === "cream" ? "error" : "info"}
              dismissLabel={fb("dismiss")}
            >
              {tone === "navy"
                ? fb("toastSuccess")
                : tone === "cream"
                  ? fb("toastError")
                  : fb("toastInfo")}
            </ToastView>
          )}
        </Triptych>
      </Specimen>

      <div className="grid gap-12 lg:grid-cols-2">
        <Specimen title={`${t("drawer")} · ${t("modal")}`}>
          <DialogDemo
            copy={{
              openDrawer: t("openDrawer"),
              openModal: t("openModal"),
              close: tCommon("close"),
              drawerTitle: fb("drawerTitle"),
              drawerText: fb("drawerText"),
              emptyTitle: fb("emptyCartTitle"),
              emptyText: fb("emptyCartText"),
              emptyAction: fb("emptyCartAction"),
              modalTitle: fb("modalTitle"),
              modalText: fb("modalText"),
              modalConfirm: fb("modalConfirm"),
            }}
          />
        </Specimen>
        <Specimen title={t("spinner")}>
          <Triptych
            className="lg:grid-cols-1"
            panelClassName="flex flex-row flex-wrap items-center gap-4"
          >
            {() => (
              <>
                <Spinner label={tCommon("loading")} />
                <Spinner size={28} />
                <Button size="sm" loading loadingLabel={tCommon("loading")}>
                  {tCommon("orderNow")}
                </Button>
              </>
            )}
          </Triptych>
        </Specimen>
      </div>

      <Specimen title={t("skeleton")}>
        <Triptych>
          {() => (
            <div className="grid gap-3" aria-busy="true">
              <Skeleton shape="block" className="aspect-[4/3] w-full" />
              <Skeleton className="w-2/3" />
              <Skeleton className="w-1/2" />
              <Skeleton className="h-11 w-full" />
            </div>
          )}
        </Triptych>
      </Specimen>

      <Specimen title={t("empty")}>
        <Triptych>
          {() => (
            <EmptyState
              title={fb("emptyCartTitle")}
              illustration={<Plinth className="w-36 opacity-80" />}
              action={
                <Button size="sm" href="/product">
                  {fb("emptyCartAction")}
                </Button>
              }
            >
              <p>{fb("emptyCartText")}</p>
            </EmptyState>
          )}
        </Triptych>
      </Specimen>
    </SgSection>
  );
}

/* ---- Motion -------------------------------------------------------------------------- */

export function MotionSection({ index }: { index: number }) {
  const t = useTranslations("Styleguide.motion");
  const tStats = useTranslations("Stats");

  return (
    <>
      <SgSection id="motion" index={index} lead={t("lead")} tone="navy">
        <Specimen title={t("reveal")}>
          <div className="grid gap-4 md:grid-cols-3">
            {[0, 120, 240].map((delay) => (
              <Reveal
                key={delay}
                delay={delay}
                className="rounded-card border border-hairline bg-raised p-6"
              >
                <p className="text-body">{t("revealSample")}</p>
              </Reveal>
            ))}
          </div>
        </Specimen>

        <div className="grid gap-12 lg:grid-cols-2">
          <Specimen title={t("parallax")} note={t("parallaxNote")}>
            <div className="relative grid h-80 place-items-center overflow-hidden rounded-card border border-hairline">
              <Parallax distance={120} className="w-48">
                {/* eslint-disable-next-line @next/next/no-img-element -- placeholder render */}
                <img
                  src="/images/products/cup-150.svg"
                  alt=""
                  width={192}
                  height={192}
                  className="relative z-10"
                />
                <Plinth className="-mt-8 w-full opacity-60" />
              </Parallax>
            </div>
          </Specimen>
          <Specimen title={t("countUp")}>
            <div className="grid grid-cols-2 gap-6">
              {[
                { value: 18, unit: tStats("unitG") },
                { value: 0, unit: "%" },
                { value: 64, unit: tStats("unitKcal") },
                { value: 2, unit: "" },
              ].map((item) => (
                <p
                  key={item.unit + item.value}
                  className="flex items-baseline gap-1 font-medium text-accent"
                >
                  <CountUp value={item.value} className="text-h1" />
                  <span className="text-h3">{item.unit}</span>
                </p>
              ))}
            </div>
          </Specimen>
        </div>

        <Specimen title={t("pinned")} note={t("pinnedNote")}>
          {null}
        </Specimen>
      </SgSection>

      <section data-surface="navy" aria-label={t("pinned")} className="bg-surface text-fg">
        <PinnedScene length={1.5}>
          <TwoIngredientsScene
            milk={t("pinnedMilk")}
            cultures={t("pinnedCultures")}
            result={t("pinnedResult")}
          />
        </PinnedScene>
      </section>
    </>
  );
}

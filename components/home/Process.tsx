import { useTranslations } from "next-intl";
import { Reveal } from "@/components/motion/Reveal";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { formatNumber } from "@/lib/format";
import type { Locale } from "@/lib/i18n/routing";

// [CONFIRM] process wording with Namieri.
const steps: { id: "milk" | "cultures" | "ferment" | "strain"; icon: IconName }[] = [
  { id: "milk", icon: "milkCan" },
  { id: "cultures", icon: "culture" },
  { id: "ferment", icon: "hourglass" },
  { id: "strain", icon: "strainer" },
];

/** Cream: four line-art steps; a row on desktop, a vertical timeline on phones. */
export function Process({ locale }: { locale: Locale }) {
  const t = useTranslations("Home.process");
  return (
    <Section id="process" tone="cream" aria-labelledby="process-title">
      <div className="container-page">
        <SectionHeader
          id="process-title"
          eyebrow={t("eyebrow")}
          title={t("title")}
          align="center"
        />
        <ol className="relative mt-14 grid gap-10 ps-10 before:absolute before:inset-y-2 before:start-[1.75rem] before:w-px before:bg-hairline lg:mt-20 lg:grid-cols-4 lg:gap-8 lg:ps-0 lg:before:inset-x-[12.5%] lg:before:inset-y-auto lg:before:top-7 lg:before:h-px lg:before:w-auto">
          {steps.map((step, i) => (
            <Reveal
              as="li"
              key={step.id}
              delay={i * 120}
              className="relative grid content-start gap-4 lg:justify-items-center lg:text-center"
            >
              <span className="absolute -start-10 grid size-14 place-items-center rounded-full border border-accent-fill bg-surface text-fg lg:static">
                <Icon name={step.icon} size={26} />
              </span>
              <span className="eyebrow ps-8 text-accent tabular lg:ps-0">
                <span className="sr-only">{t("step", { number: i + 1 })}: </span>
                <span aria-hidden="true">
                  {formatNumber(i + 1, locale, { minimumIntegerDigits: 2 })}
                </span>
              </span>
              <p className="ps-8 font-display text-h3 font-semibold lg:max-w-[16ch] lg:ps-0">
                {t(`steps.${step.id}`)}
              </p>
            </Reveal>
          ))}
        </ol>
      </div>
    </Section>
  );
}

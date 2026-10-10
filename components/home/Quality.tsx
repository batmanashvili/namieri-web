import { useTranslations } from "next-intl";
import { Reveal } from "@/components/motion/Reveal";
import { FeatureCard } from "@/components/ui/Cards";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { company } from "@/content/product";

const cards: { id: "farmers" | "tested" | "consistent" | "clean"; icon: IconName }[] = [
  { id: "farmers", icon: "milkCan" },
  { id: "tested", icon: "shield" },
  { id: "consistent", icon: "repeat" },
  { id: "clean", icon: "leaf" },
];

/** Navy: sourcing and testing, plus a quiet credentials row (HACCP, National Food Agency). */
export function Quality() {
  const t = useTranslations("Home.quality");
  const tFooter = useTranslations("Footer");
  return (
    <Section id="quality" tone="navy" waveBottom="cream" aria-labelledby="quality-title">
      <div className="container-page">
        <SectionHeader id="quality-title" eyebrow={t("eyebrow")} title={t("title")} />
        <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4 lg:gap-8">
          {cards.map((card, i) => (
            <Reveal key={card.id} delay={i * 100}>
              <FeatureCard icon={card.icon} title={t(`${card.id}.title`)}>
                <p>{t(`${card.id}.text`)}</p>
              </FeatureCard>
            </Reveal>
          ))}
        </div>
        <div className="mt-16 flex flex-col gap-4 border-t border-hairline pt-8 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-10">
          <p className="eyebrow text-accent">{t("credentials")}</p>
          <ul className="flex flex-col gap-3 text-small text-fg-muted sm:flex-row sm:flex-wrap sm:gap-x-10">
            {company.haccp && (
              <li className="flex items-center gap-2">
                <Icon name="shield" size={20} className="text-accent" />
                {t("haccp")}
              </li>
            )}
            <li className="flex items-center gap-2">
              <Icon name="checkCircle" size={20} className="text-accent" />
              <span>
                {t("nfa")} ·{" "}
                <span className="tabular">
                  {tFooter("recognitionCode", { code: company.recognitionCode })}
                </span>
              </span>
            </li>
          </ul>
        </div>
      </div>
    </Section>
  );
}

import { useTranslations } from "next-intl";
import { Icon } from "@/components/ui/Icon";
import { Section } from "@/components/ui/Section";
import { Eyebrow, Heading } from "@/components/ui/Typography";
import type { LegalDocument } from "@/lib/legal";
import { SiteShell } from "./SiteShell";

/** Terms and privacy: the Markdown document, with a Draft banner until the final text arrives. */
export function LegalPage({ document, updated }: { document: LegalDocument; updated?: string }) {
  const t = useTranslations("Legal");
  return (
    <SiteShell headerVariant="overlay">
      <Section
        tone="navy"
        spacing="none"
        waveBottom="white"
        aria-labelledby="page-title"
        className="under-header"
      >
        <div className="container-page grid justify-items-start gap-5 pt-16 pb-10 sm:pt-24">
          <Eyebrow>{t("eyebrow")}</Eyebrow>
          {/* Capped at 7.4vw so long Georgian words ("კონფიდენციალურობის") fit at 360 px. */}
          <Heading
            as="h1"
            id="page-title"
            size="h1"
            className="w-full text-[length:min(var(--text-h1),7.4vw)] leading-(--leading-h1)"
          >
            {document.title}
          </Heading>
          {updated && <p className="text-small text-fg-muted">{t("updated", { date: updated })}</p>}
        </div>
      </Section>
      <Section tone="white" spacing="sm">
        <div className="container-page max-w-[calc(45rem+2*var(--gutter))]">
          {document.draft && (
            <aside
              data-draft=""
              className="mb-10 flex gap-3 rounded-card border border-accent-fill bg-raised p-5 text-small"
            >
              <Icon name="info" size={20} className="mt-0.5 text-accent" />
              <p>
                <strong className="font-medium text-fg">{t("draft")}.</strong>{" "}
                <span className="text-fg-muted">{t("draftText")}</span>
              </p>
            </aside>
          )}
          <div className="legal-prose" dangerouslySetInnerHTML={{ __html: document.html }} />
        </div>
      </Section>
    </SiteShell>
  );
}

import type { ReactNode } from "react";
import { Plinth } from "@/components/ui/Plinth";
import { Section } from "@/components/ui/Section";
import { Eyebrow, Heading, Text } from "@/components/ui/Typography";
import type { WaveFill } from "@/components/ui/YogurtWave";

type PageHeroProps = {
  eyebrow: string;
  title: string;
  lead?: ReactNode;
  /** Colour of the section below, for the wave. */
  next?: WaveFill;
  children?: ReactNode;
};

/** Navy opening band of an information page, under the transparent header. */
export function PageHero({ eyebrow, title, lead, next = "cream", children }: PageHeroProps) {
  return (
    <Section
      tone="navy"
      spacing="none"
      waveBottom={next}
      aria-labelledby="page-title"
      className="under-header overflow-hidden"
    >
      <div className="relative container-page grid justify-items-start gap-6 pt-16 pb-12 sm:pt-24 lg:pb-16">
        <Eyebrow>{eyebrow}</Eyebrow>
        <Heading as="h1" id="page-title" size="h1" className="max-w-[20ch]">
          {title}
        </Heading>
        {lead && (
          <Text tone="muted" className="text-[clamp(1.0625rem,1rem+0.4vw,1.375rem)]">
            {lead}
          </Text>
        )}
        {children}
        <Plinth
          variant="column"
          className="pointer-events-none absolute end-[4vw] top-6 hidden h-[calc(100%+3rem)] opacity-20 lg:block"
        />
      </div>
    </Section>
  );
}

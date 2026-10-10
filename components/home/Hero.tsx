import { useLocale, useTranslations } from "next-intl";
import { Parallax } from "@/components/motion/Parallax";
import { OrderCtas } from "@/components/sections/OrderCtas";
import { Plinth } from "@/components/ui/Plinth";
import { ResponsiveImage } from "@/components/ui/ResponsiveImage";
import { Section } from "@/components/ui/Section";
import { Eyebrow, Heading, Text } from "@/components/ui/Typography";
import { VideoLoop } from "@/components/ui/VideoLoop";
import { hero } from "@/content/home";
import {
  findSize,
  nutritionFor,
  nutritionPer100g,
  SERVING_GRAMS,
  type ProductSize,
} from "@/content/product";
import { cn } from "@/lib/cn";

/** Navy, full-screen hero: headline and CTAs, the cup on its plinth, the drifting yogurt wave. */
export function Hero() {
  const t = useTranslations("Home.hero");
  return (
    <Section
      id="hero"
      tone="navy"
      spacing="none"
      waveBottom="cream"
      waveDrift
      aria-labelledby="hero-title"
      className="under-header grid min-h-svh grid-rows-[1fr_auto]"
    >
      <div className="container-page grid h-full items-center gap-10 pt-8 pb-4 sm:pt-12 lg:grid-cols-[1.1fr_1fr] lg:gap-6 lg:pt-6">
        <div className="grid justify-items-start gap-6">
          <Eyebrow>{t("eyebrow")}</Eyebrow>
          <Heading as="h1" id="hero-title" size="display" className="max-w-[13ch]">
            {t("title")}
          </Heading>
          <Text tone="muted" className="text-[clamp(1.0625rem,1rem+0.4vw,1.375rem)]">
            {t("subtitle", {
              protein: nutritionFor(SERVING_GRAMS).proteinG,
              fat: nutritionPer100g.fatG,
            })}
          </Text>
          <OrderCtas section="hero" className="pt-2" />
        </div>
        <HeroProduct front={findSize(hero.frontSizeId)} back={findSize(hero.backSizeId)} />
      </div>
    </Section>
  );
}

function HeroProduct({ front, back }: { front?: ProductSize; back?: ProductSize }) {
  const locale = useLocale();
  const video = hero.video;
  return (
    <div className="relative mx-auto w-full max-w-[30rem] lg:max-w-[36rem]">
      {video.enabled && (
        <div className="absolute inset-[-8%] -z-10 overflow-hidden rounded-full opacity-70">
          <VideoLoop
            poster={video.poster}
            mp4={video.mp4}
            webm={video.webm}
            label={video.label[locale]}
          />
          <div className="absolute inset-0 bg-[radial-gradient(closest-side,transparent,var(--navy-900))]" />
        </div>
      )}
      <Parallax distance={56}>
        {/*
          Fixed-ratio stage, so nothing shifts while the renders load. Positions put each
          render's base on the plinth's top slab; re-tune them if a new render has a
          different amount of empty space below the product.
        */}
        <div className="relative aspect-square">
          <Plinth className="absolute inset-x-[10%] bottom-0 opacity-70" />
          {back && (
            <ProductRender
              size={back}
              className="right-[12%] bottom-[40%] w-[46%] brightness-90"
              alt={back.image.alt[locale]}
            />
          )}
          {front && (
            <ProductRender
              size={front}
              className="bottom-[36.4%] left-[12%] z-10 w-[56%]"
              alt={front.image.alt[locale]}
              priority
            />
          )}
        </div>
      </Parallax>
    </div>
  );
}

function ProductRender({
  size,
  alt,
  priority = false,
  className,
}: {
  size: ProductSize;
  alt: string;
  priority?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("absolute", className)}>
      <ResponsiveImage
        src={size.image.src}
        alt={alt}
        ratio="1/1"
        fit="contain"
        rounded={false}
        frameClassName="bg-transparent"
        sizes="(min-width: 64rem) 20rem, 60vw"
        loading="eager"
        fetchPriority={priority ? "high" : "auto"}
      />
    </div>
  );
}

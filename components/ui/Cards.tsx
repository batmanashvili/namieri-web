import type { ReactNode } from "react";
import { Link } from "@/lib/i18n/navigation";
import { cn } from "@/lib/cn";
import { Icon, type IconName } from "./Icon";
import { ResponsiveImage } from "./ResponsiveImage";

/* ---- FeatureCard ------------------------------------------------------- */

type FeatureCardProps = {
  icon: IconName;
  title: string;
  children: ReactNode;
  headingLevel?: "h2" | "h3" | "h4";
  className?: string;
};

export function FeatureCard({
  icon,
  title,
  children,
  headingLevel: H = "h3",
  className,
}: FeatureCardProps) {
  return (
    <article className={cn("flex flex-col gap-4 border-t border-hairline pt-6", className)}>
      <span className="grid size-12 place-items-center rounded-full border border-accent-fill/60 text-accent">
        <Icon name={icon} size={22} />
      </span>
      <H className="font-display text-h3 font-semibold">{title}</H>
      <div className="text-body text-fg-muted">{children}</div>
    </article>
  );
}

/* ---- TestimonialCard --------------------------------------------------- */

type TestimonialCardProps = {
  quote: string;
  name: string;
  source?: string;
  className?: string;
};

/** Curated review. Only publish quotes with the person's permission. */
export function TestimonialCard({ quote, name, source, className }: TestimonialCardProps) {
  return (
    <figure
      className={cn(
        "flex h-full flex-col rounded-card border border-hairline bg-raised p-6 sm:p-8",
        className,
      )}
    >
      <span aria-hidden="true" className="font-display-latin text-[4rem] leading-[0.6] text-accent">
        “
      </span>
      <blockquote className="mt-4 flex-1 font-display text-h3 leading-snug font-semibold">
        <p>{quote}</p>
      </blockquote>
      <figcaption className="mt-6 text-small">
        <span className="font-medium text-fg">{name}</span>
        {source && <span className="text-fg-muted"> · {source}</span>}
      </figcaption>
    </figure>
  );
}

/* ---- RecipeCard -------------------------------------------------------- */

type RecipeCardProps = {
  href: string;
  title: string;
  image: { src: string; alt: string };
  meta: string[];
  headingLevel?: "h2" | "h3" | "h4";
  className?: string;
};

/** The whole card is one link (a stretched pseudo-element), so there is a single tab stop. */
export function RecipeCard({
  href,
  title,
  image,
  meta,
  headingLevel: H = "h3",
  className,
}: RecipeCardProps) {
  return (
    <article className={cn("group/recipe relative flex flex-col gap-4", className)}>
      <ResponsiveImage
        src={image.src}
        alt={image.alt}
        ratio="4/3"
        sizes="(min-width: 64rem) 33vw, (min-width: 40rem) 50vw, 100vw"
        className="transition-transform duration-700 ease-out group-hover/recipe:scale-[1.03]"
      />
      <ul className="flex flex-wrap gap-x-4 gap-y-1 text-small text-fg-muted">
        {meta.map((item, i) => (
          <li key={item} className="flex items-center gap-1.5">
            {i === 0 && <Icon name="clock" size={16} />}
            {item}
          </li>
        ))}
      </ul>
      <H className="font-display text-h3 font-semibold">
        <Link
          href={href}
          className="underline decoration-transparent decoration-1 underline-offset-[0.25em] transition-[text-decoration-color] group-hover/recipe:decoration-current after:absolute after:inset-0 after:content-['']"
        >
          {title}
        </Link>
      </H>
    </article>
  );
}

/* ---- EmptyState -------------------------------------------------------- */

type EmptyStateProps = {
  title: string;
  children?: ReactNode;
  action?: ReactNode;
  illustration?: ReactNode;
  className?: string;
};

export function EmptyState({ title, children, action, illustration, className }: EmptyStateProps) {
  return (
    <div className={cn("mx-auto flex max-w-sm flex-col items-center gap-4 text-center", className)}>
      {illustration}
      <p className="font-display text-h3 font-semibold">{title}</p>
      {children && <div className="text-body text-fg-muted">{children}</div>}
      {action}
    </div>
  );
}

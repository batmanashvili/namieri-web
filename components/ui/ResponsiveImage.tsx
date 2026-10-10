import Image, { type ImageProps } from "next/image";
import { cn } from "@/lib/cn";

const ratios = {
  "1/1": "aspect-square",
  "4/3": "aspect-[4/3]",
  "3/4": "aspect-[3/4]",
  "16/9": "aspect-video",
  "3/2": "aspect-[3/2]",
} as const;

type ResponsiveImageProps = Omit<ImageProps, "fill" | "width" | "height" | "alt"> & {
  /** Required, in the page language. Pass "" only for purely decorative images. */
  alt: string;
  /** The box reserves this ratio before the image loads, so there is no layout shift. */
  ratio?: keyof typeof ratios;
  /** next/image `sizes`; defaults to full width on mobile, half on desktop. */
  sizes?: string;
  rounded?: boolean;
  fit?: "cover" | "contain";
  frameClassName?: string;
};

/**
 * next/image in a fixed-ratio frame with a tinted placeholder. Swapping a
 * render for a photo is a content change: only `src` changes.
 */
export function ResponsiveImage({
  ratio = "4/3",
  sizes = "(min-width: 64rem) 50vw, 100vw",
  rounded = true,
  fit = "cover",
  className,
  frameClassName,
  src,
  alt,
  ...rest
}: ResponsiveImageProps) {
  const isSvg = typeof src === "string" && src.endsWith(".svg");
  return (
    <div
      className={cn(
        "relative w-full overflow-hidden bg-fg/6",
        ratios[ratio],
        rounded && "rounded-card",
        frameClassName,
      )}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        unoptimized={isSvg}
        className={cn(fit === "cover" ? "object-cover" : "object-contain", className)}
        {...rest}
      />
    </div>
  );
}

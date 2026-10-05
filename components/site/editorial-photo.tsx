import Image, { type StaticImageData } from "next/image";
import { cn } from "@/lib/utils";

/**
 * A photo in the site's style: one shared warm grade (.photo-grade), a blurred preview while it
 * loads, and an optional hairline frame offset behind it in the accent color.
 * The parent sets the size with an aspect-ratio class.
 */
export function EditorialPhoto({
  src,
  alt,
  sizes,
  className,
  imgClassName,
  frame = false,
  children,
}: {
  src: StaticImageData;
  alt: string;
  sizes: string;
  className?: string;
  /** e.g. "object-[50%_20%]" to choose which part of the photo stays in the crop. */
  imgClassName?: string;
  frame?: boolean;
  /** Overlays such as a small label chip. */
  children?: React.ReactNode;
}) {
  return (
    <div className={cn("relative", className)}>
      {frame && (
        <div aria-hidden className="absolute inset-0 translate-x-3 translate-y-3 rounded-[var(--radius)] border border-brand/40 sm:translate-x-4 sm:translate-y-4" />
      )}
      <div className="group relative h-full w-full overflow-hidden rounded-[var(--radius)] bg-muted">
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          placeholder="blur"
          className={cn(
            "photo-grade object-cover transition-transform duration-[1600ms] ease-[var(--ease-editorial)] group-hover:scale-[1.03]",
            imgClassName,
          )}
        />
        <span aria-hidden className="photo-tone pointer-events-none absolute inset-0" />
        {children}
      </div>
    </div>
  );
}

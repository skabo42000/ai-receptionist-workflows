"use client";

import { siteDemo } from "@/config/site-demo";
import { useDemo } from "@/components/providers/demo-provider";
import { initials } from "@/lib/brand";
import { cn } from "@/lib/utils";

/** The generic demo business name (business names can't be personalized). */
export function BrandName() {
  return <>{useDemo().brand.name}</>;
}

/** The personalized city, or the default city. */
export function BrandCity() {
  return <>{useDemo().brand.city ?? siteDemo.business.city}</>;
}

/** Serif monogram built from the business initials, so any name instantly has a logo. */
export function Monogram({ className }: { className?: string }) {
  const { brand } = useDemo();
  return (
    <span
      aria-hidden
      className={cn(
        "font-display relative inline-flex size-10 shrink-0 items-center justify-center rounded-full border border-foreground/70 text-[1.05rem] leading-none",
        className,
      )}
    >
      <span className="absolute inset-[3px] rounded-full border border-brand/40" />
      {initials(brand.name)}
    </span>
  );
}

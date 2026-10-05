// Shared class strings. Kept out of "use client" files on purpose: a server component that
// imports a plain value from a client module gets a reference stub, not the string.

/** Solid ink pill: the main call to action. */
export const pillPrimary =
  "inline-flex h-12 items-center justify-center gap-2 rounded-full bg-primary px-7 text-sm font-medium tracking-wide text-primary-foreground transition-[background-color,transform] duration-300 hover:bg-primary/88 active:translate-y-px focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none";

/** Hairline outline pill. */
export const pillOutline =
  "inline-flex h-12 items-center justify-center gap-2 rounded-full border border-foreground/25 px-6 text-sm font-medium tracking-wide transition-colors duration-300 hover:border-foreground/60 hover:bg-foreground/[0.03] active:translate-y-px focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none";

/** Underlined text link with an arrow that slides on hover. */
export const textLink =
  "group inline-flex min-h-10 items-center gap-2 text-sm font-medium tracking-wide underline decoration-foreground/25 decoration-1 underline-offset-[6px] transition-colors hover:decoration-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none rounded-sm";

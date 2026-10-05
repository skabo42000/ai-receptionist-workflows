import { ArrowRight, Sparkle } from "lucide-react";
import { CustomizeButton, GetThisLink } from "./actions";

/** The one place Synq Logic sits above the demo business: slim, quiet, always visible. */
export function DemoRibbon() {
  return (
    <aside aria-label="About this demo" className="demo-ribbon relative z-50">
      <div className="container-editorial flex h-12 items-center justify-between gap-3 text-[0.68rem] tracking-[0.03em] sm:text-[0.72rem]">
        <p className="flex min-w-0 items-center gap-2">
          <Sparkle aria-hidden className="size-3.5 shrink-0 text-[var(--brand-dark)]" strokeWidth={1.5} />
          <span className="truncate">
            <span className="sm:hidden">Demo by Synq Logic</span>
            <span className="hidden sm:inline">An interactive showcase by Synq Logic</span>
          </span>
        </p>
        <div className="flex shrink-0 items-center gap-5">
          <CustomizeButton className="inline-flex min-h-11 items-center gap-2 rounded-full px-3 font-medium text-[var(--brand-dark)] transition-colors hover:bg-white/[0.07] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--brand-dark)]">
            Try your colors <ArrowRight aria-hidden className="size-3.5" />
          </CustomizeButton>
          <GetThisLink
            source="ribbon"
            className="hidden items-center gap-1 opacity-80 transition-opacity hover:opacity-100 md:inline-flex"
          />
        </div>
      </div>
    </aside>
  );
}

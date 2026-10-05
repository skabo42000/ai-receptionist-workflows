"use client";

import { ArrowRight, ArrowUpRight, MessageCircle, Sparkle } from "lucide-react";
import { useDemo } from "@/components/providers/demo-provider";
import { useVoice } from "@/components/voice/voice-provider";
import { trackEvent } from "@/lib/analytics";
import { consultationUrl } from "@/lib/consultation";
import { cn } from "@/lib/utils";
import { pillOutline, pillPrimary, textLink } from "./styles";

/** "(Demo)" on every simulated action, so visitors know they're trying a showcase. */
/** Link to the privacy page. Opens a new tab so a chat or call in progress isn't lost. */
export function PrivacyLink({ className }: { className?: string }) {
  return (
    <a href="/privacy" target="_blank" className={cn("underline underline-offset-2 hover:text-foreground", className)}>
      Privacy
    </a>
  );
}

export function DemoTag() {
  return <span className="font-normal opacity-65">(Demo)</span>;
}

export function BookButton({
  serviceId = null,
  className,
  children = (
    <>
      Book online <DemoTag />
    </>
  ),
  source,
}: {
  serviceId?: string | null;
  className?: string;
  children?: React.ReactNode;
  source: string;
}) {
  const { openBooking } = useDemo();
  return (
    <button
      type="button"
      className={className ?? pillPrimary}
      onClick={() => {
        trackEvent("book_open", { source, service: serviceId });
        openBooking(serviceId);
      }}
    >
      {children}
    </button>
  );
}

/** Pulsing "live" dot used on every talk-to-AI control. */
export function LiveDot({ className }: { className?: string }) {
  return (
    <span aria-hidden className={cn("relative flex size-2", className)}>
      <span className="animate-soft-ping absolute inset-0 rounded-full bg-brand" />
      <span className="relative size-2 rounded-full bg-brand" />
    </span>
  );
}

/** Opens the floating receptionist panel and starts a conversation. */
export function TalkButton({
  className,
  children = "Talk to our AI",
  source,
}: {
  className?: string;
  children?: React.ReactNode;
  source: string;
}) {
  const { start, openPanel, status } = useVoice();
  return (
    <button
      type="button"
      className={className ?? pillOutline}
      onClick={() => {
        openPanel("voice");
        if (status === "idle" || status === "ended") start(source);
      }}
    >
      <LiveDot />
      {children}
    </button>
  );
}

/** Opens Anna's window on the text chat tab. */
export function ChatButton({ className, children = "Chat with Anna" }: { className?: string; children?: React.ReactNode }) {
  const { openPanel } = useVoice();
  return (
    <button type="button" className={className ?? pillOutline} onClick={() => openPanel("chat")}>
      <MessageCircle aria-hidden className="size-4" strokeWidth={1.6} />
      {children}
    </button>
  );
}

export function TryReceptionistLink({ className }: { className?: string }) {
  return (
    <TalkButton source="hero_link" className={cn(textLink, "h-12", className)}>
      Try our AI receptionist <DemoTag />
      <ArrowRight aria-hidden className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
    </TalkButton>
  );
}

/** Scrolls to the free quote form with this service already picked. */
export function AskQuoteButton({ serviceId, className, children }: { serviceId: string; className?: string; children: React.ReactNode }) {
  const { requestQuote } = useDemo();
  return (
    <button type="button" className={className} onClick={() => requestQuote(serviceId)}>
      {children}
    </button>
  );
}

export function CustomizeButton({ className, children = "Try your colors" }: { className?: string; children?: React.ReactNode }) {
  const { setCustomizerOpen } = useDemo();
  return (
    <button
      type="button"
      className={className}
      onClick={() => {
        trackEvent("customize_open");
        setCustomizerOpen(true);
      }}
    >
      {children}
    </button>
  );
}

/**
 * The real call to action: Synq Logic's free consultation (siteDemo.synq.bookingUrl).
 * `compact` shortens the label on phone-width screens (the header); elsewhere it's always full.
 */
export function ConsultationButton({ source, className, compact = true }: { source: string; className?: string; compact?: boolean }) {
  return (
    <GetThisLink
      source={source}
      className={cn(
        pillPrimary,
        "h-10 gap-1.5 px-4 text-[0.8rem] whitespace-nowrap",
        // On phones the header button shrinks so the business name keeps its room.
        compact && "max-sm:h-9 max-sm:px-3 max-sm:text-xs",
        className,
      )}
    >
      <Sparkle aria-hidden className="size-3.5 text-brand-inverse" strokeWidth={1.75} />
      {compact ? (
        <>
          <span className="sm:hidden">Free consult</span>
          <span className="hidden sm:inline">Book free consultation</span>
        </>
      ) : (
        "Book free consultation"
      )}
      <ArrowUpRight aria-hidden className={cn("size-3.5", compact && "max-sm:hidden")} />
    </GetThisLink>
  );
}

export function GetThisLink({ className, children, source }: { className?: string; children?: React.ReactNode; source: string }) {
  return (
    <a
      href={consultationUrl(source)}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onClick={() => trackEvent("get_this_click", { source })}
    >
      {children ?? (
        <>
          Get this website <ArrowUpRight aria-hidden className="size-3.5" />
        </>
      )}
    </a>
  );
}

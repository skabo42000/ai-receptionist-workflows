"use client";

import { motion } from "motion/react";
import { ArrowUpRight, CalendarCheck2, Check, MessageSquareText, PhoneCall, Sparkle } from "lucide-react";
import { GetThisLink } from "@/components/site/actions";
import { SynqContact } from "@/components/site/synq-contact";
import { DialogTitle } from "@/components/ui/dialog";

const EASE = [0.22, 1, 0.36, 1] as const;

const INCLUDED = [
  { icon: CalendarCheck2, label: "Online booking, day or night" },
  { icon: PhoneCall, label: "An AI receptionist on every call" },
  { icon: MessageSquareText, label: "Automatic reminders and follow-ups" },
];

/** How long the visitor took, in words. Only shown when it's genuinely quick. */
function speedText(seconds: number | null) {
  if (seconds === null || seconds > 90) return null;
  const value = Math.max(1, seconds);
  return `${value} second${value === 1 ? "" : "s"}`;
}

/**
 * The "Trojan horse" reveal: the visitor has just used the demo booking (or quote) flow, and
 * instead of a fake confirmation they see how fast it was and a direct invitation to get the
 * same system. Nothing is saved or sent anywhere.
 */
export function DemoReveal({
  kind,
  seconds,
  detail,
  onKeepExploring,
}: {
  kind: "booking" | "quote";
  /** Measured from opening the flow to the final click. */
  seconds: number | null;
  /** e.g. "Signature Service · Sat, Oct 10 · 10:00 AM" */
  detail?: string;
  onKeepExploring: () => void;
}) {
  const speed = speedText(seconds);
  const fadeUp = (delay: number) => ({
    initial: { opacity: 0, y: 14 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: EASE, delay },
  });

  return (
    <div className="flex flex-col">
      <div className="px-6 pt-10 pb-8 sm:px-10 sm:pt-12">
        <motion.span
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 16 }}
          className="relative flex size-12 items-center justify-center rounded-full bg-brand text-brand-foreground"
        >
          <span aria-hidden className="animate-soft-ping absolute inset-0 rounded-full bg-brand/40" />
          <Check aria-hidden className="relative size-6" strokeWidth={2.4} />
        </motion.span>

        <motion.p {...fadeUp(0.1)} className="eyebrow mt-6">
          Success{detail ? ` · ${detail}` : ""}
        </motion.p>
        <motion.div {...fadeUp(0.18)}>
          <DialogTitle className="font-display mt-3 text-[2.6rem] leading-[1.02] font-normal sm:text-6xl">
            {speed ? (
              <>
                Done in <em className="text-brand italic">{speed}.</em>
              </>
            ) : (
              <>
                Done in a <em className="text-brand italic">few clicks.</em>
              </>
            )}
          </DialogTitle>
        </motion.div>
        <motion.p {...fadeUp(0.26)} className="mt-4 text-lg leading-relaxed sm:text-xl">
          {kind === "booking"
            ? "That's exactly how fast and easy it could be for your customers to book you."
            : "That's exactly how easily your customers could ask you for a quote."}
        </motion.p>
        <motion.p {...fadeUp(0.34)} className="mt-3 leading-relaxed text-muted-foreground">
          No forms to fill. No phone tag. No waiting until Monday. Stop losing customers to clunky websites and missed calls.
        </motion.p>
      </div>

      <motion.div {...fadeUp(0.42)} className="bg-foreground px-6 py-8 text-background sm:px-10 sm:py-10">
        <p className="eyebrow text-background/60">Built by Synq Logic</p>
        <p className="font-display mt-3 text-3xl leading-tight sm:text-4xl">Want a system like this for your business?</p>
        <ul className="mt-5 grid gap-2.5 text-sm text-background/80 sm:grid-cols-3 sm:gap-4">
          {INCLUDED.map(({ icon: Icon, label }) => (
            <li key={label} className="flex items-start gap-2.5">
              <Icon aria-hidden className="mt-0.5 size-4 shrink-0 text-brand-inverse" strokeWidth={1.5} />
              {label}
            </li>
          ))}
        </ul>
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-7">
          <GetThisLink
            source={`reveal_${kind}`}
            className="inline-flex h-14 items-center justify-center gap-2 rounded-full bg-background px-8 text-base font-medium text-foreground shadow-[0_18px_40px_-18px_rgb(0_0_0/0.6)] transition-transform duration-300 hover:-translate-y-0.5"
          >
            <Sparkle aria-hidden className="size-4 text-brand" strokeWidth={1.75} />
            Book your free strategy call
            <ArrowUpRight aria-hidden className="size-4" />
          </GetThisLink>
          <button
            type="button"
            onClick={onKeepExploring}
            className="text-sm text-background/70 underline decoration-background/30 underline-offset-[6px] transition-colors hover:text-background"
          >
            Keep exploring the demo
          </button>
        </div>
        <p className="mt-4 text-xs text-background/55">Free and no obligation, with the Synq Logic team.</p>
        <SynqContact
          className="mt-5 border-t border-background/15 pt-5 sm:flex-row sm:gap-6"
          linkClassName="text-background/70 hover:text-background"
        />
      </motion.div>
    </div>
  );
}

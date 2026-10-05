"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "motion/react";
import { Bell, CalendarCheck2, Check, HeartHandshake, Mail, RotateCcw } from "lucide-react";
import { prefersReducedMotion } from "@/components/providers/demo-provider";
import { cn } from "@/lib/utils";

const STEPS = [
  { icon: CalendarCheck2, title: "Booked online", detail: "Added to the calendar" },
  { icon: Mail, title: "Confirmation sent", detail: "The details, delivered" },
  { icon: Bell, title: "Reminder scheduled", detail: "One less thing to remember" },
  { icon: HeartHandshake, title: "Follow-up ready", detail: "A thoughtful next step" },
];

/** A replayable illustration. It never submits forms or sends messages. */
export function AutomationPreview() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.25 });
  const [progress, setProgress] = useState(0);
  const [run, setRun] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (prefersReducedMotion()) {
      const timer = window.setTimeout(() => setProgress(STEPS.length), 0);
      return () => window.clearTimeout(timer);
    }
    const timers = STEPS.map((_, index) => window.setTimeout(() => setProgress(index + 1), 350 + index * 700));
    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [inView, run]);

  return (
    <div ref={ref} className="mt-10 border-t pt-8 sm:mt-12 sm:pt-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow">Behind the scenes · sample preview</p>
          <h3 className="font-display mt-3 text-2xl sm:text-3xl">One booking. Everything follows.</h3>
        </div>
        <button
          type="button"
          onClick={() => {
            setProgress(0);
            setRun((current) => current + 1);
          }}
          className="inline-flex min-h-11 items-center gap-2 self-start rounded-sm text-xs font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none sm:self-auto"
        >
          <RotateCcw aria-hidden className="size-3.5" strokeWidth={1.5} /> Replay the preview
        </button>
      </div>
      <ol aria-label="Sample booking and follow-up sequence" className="mt-5 grid grid-cols-2 gap-3 sm:mt-6 sm:grid-cols-4">
        {STEPS.map(({ icon: Icon, title, detail }, index) => {
          const complete = progress > index;
          return (
            <li key={title} className={cn(
              "relative border bg-background/60 p-4 transition-colors duration-500 motion-reduce:transition-none sm:p-5",
              complete && "border-brand/25 bg-brand/[0.035]",
            )}>
              <div className="flex items-center justify-between">
                <Icon aria-hidden className="size-5 text-brand" strokeWidth={1.3} />
                <span aria-hidden className={cn(
                  "flex size-5 items-center justify-center rounded-full border text-[0.6rem] transition-colors duration-500 motion-reduce:transition-none",
                  complete ? "border-brand bg-brand text-brand-foreground" : "border-border text-muted-foreground",
                )}>
                  {complete ? <Check className="size-3" strokeWidth={2} /> : index + 1}
                </span>
              </div>
              <p className="mt-4 text-[0.8rem] font-medium sm:text-sm">{title}</p>
              <p className="mt-1.5 text-[0.7rem] leading-relaxed text-muted-foreground sm:text-xs">{detail}</p>
            </li>
          );
        })}
      </ol>
      <p className="mt-4 text-[0.7rem] leading-relaxed text-muted-foreground">An example of what happens after a booking. No emails or messages are sent in this preview.</p>
    </div>
  );
}

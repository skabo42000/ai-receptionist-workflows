"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft } from "lucide-react";
import { siteDemo } from "@/config/site-demo";
import type { Service } from "@/config/schema";
import { useDemo } from "@/components/providers/demo-provider";
import { DemoReveal } from "@/components/reveal/demo-reveal";
import { textLink } from "@/components/site/styles";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { trackEvent } from "@/lib/analytics";
import { formatDuration, formatLongDate, formatShortDate, formatTime } from "@/lib/format";
import { generateSlots, isClosed, lastBookableDay, startOfDay } from "@/lib/slots";
import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;
const BOOKABLE = siteDemo.services.filter((service) => service.durationMinutes !== null);
/** Long enough to see the chosen time light up, short enough to feel instant. */
const REVEAL_DELAY_MS = 450;

type Stage = "service" | "time" | "reveal";

export function BookingDialog() {
  const { booking, setBookingOpen } = useDemo();
  return (
    <Dialog open={booking.open} onOpenChange={setBookingOpen}>
      <DialogContent
        aria-describedby={undefined}
        className="flex flex-col gap-0 overflow-hidden bg-background p-0 max-sm:top-0 max-sm:left-0 max-sm:h-dvh max-sm:max-w-none max-sm:translate-x-0 max-sm:translate-y-0 max-sm:rounded-none sm:max-h-[min(92dvh,780px)] sm:max-w-3xl sm:rounded-[calc(var(--radius)*2)]"
      >
        {/* Mounted only while open, so every visit starts fresh (and the timer starts now). */}
        <BookingFlow initialServiceId={booking.serviceId} onClose={() => setBookingOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}

function firstOpenDay(from: Date) {
  const day = startOfDay(from);
  for (let i = 0; i < 14; i++) {
    const slots = generateSlots(day, 30, siteDemo.hours, from);
    if (slots.some((slot) => slot.available)) return day;
    day.setDate(day.getDate() + 1);
  }
  return undefined;
}

/**
 * Demo booking, frontend only: choose a service, pick a day and a time. The moment a time is
 * clicked, the flow turns into the reveal (no name, email or phone is ever asked for).
 */
function BookingFlow({ initialServiceId, onClose }: { initialServiceId: string | null; onClose: () => void }) {
  const initialService = BOOKABLE.find((service) => service.id === initialServiceId) ?? null;
  const [stage, setStage] = useState<Stage>(initialService ? "time" : "service");
  const [service, setService] = useState<Service | null>(initialService);
  const [now] = useState(() => new Date());
  // Same clock as a click event's timeStamp (milliseconds since the page loaded).
  const [openedAt] = useState(() => performance.now());
  const [date, setDate] = useState<Date | undefined>(() => firstOpenDay(now));
  const [time, setTime] = useState<string | null>(null);
  const [seconds, setSeconds] = useState<number | null>(null);
  const revealTimer = useRef<number | null>(null);

  useEffect(() => () => {
    if (revealTimer.current !== null) window.clearTimeout(revealTimer.current);
  }, []);

  const slots = useMemo(
    () => (service && date ? generateSlots(date, service.durationMinutes ?? 30, siteDemo.hours, now) : []),
    [service, date, now],
  );

  function pickTime(slot: string, clickedAt: number) {
    if (revealTimer.current !== null) return;
    setTime(slot);
    const taken = Math.round((clickedAt - openedAt) / 1000);
    revealTimer.current = window.setTimeout(() => {
      setSeconds(taken);
      setStage("reveal");
      trackEvent("demo_reveal", { kind: "booking", seconds: taken, service: service?.id ?? null });
    }, REVEAL_DELAY_MS);
  }

  if (stage === "reveal" && service && date && time) {
    return (
      <div className="min-h-0 flex-1 overflow-y-auto">
        <DemoReveal
          kind="booking"
          seconds={seconds}
          detail={`${service.name} · ${formatShortDate(date)} · ${formatTime(time)}`}
          onKeepExploring={onClose}
        />
      </div>
    );
  }

  const step = stage === "service" ? 1 : 2;

  return (
    <>
      <div className="border-b px-6 pt-6 pb-5 sm:px-9 sm:pt-8">
        <div className="flex items-center gap-4 pr-10">
          <p className="eyebrow">Book online (Demo) · Step {step} of 2</p>
          <div className="hidden flex-1 grid-cols-2 gap-1.5 sm:grid">
            {[1, 2].map((n) => (
              <span key={n} className="h-px bg-border">
                <motion.span
                  className="block h-px origin-left bg-foreground"
                  initial={false}
                  animate={{ scaleX: n <= step ? 1 : 0 }}
                  transition={{ duration: 0.6, ease: EASE }}
                />
              </span>
            ))}
          </div>
        </div>
        <DialogTitle className="font-display mt-3 text-[2rem] leading-tight font-normal sm:text-4xl">
          {stage === "service" ? "Choose a service" : "Pick a day and time"}
        </DialogTitle>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6 sm:px-9 sm:py-8">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={stage}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.3, ease: EASE }}
          >
            {stage === "service" && (
              <ul className="divide-y border-y">
                {BOOKABLE.map((item) => (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => {
                        setService(item);
                        setTime(null);
                        setStage("time");
                      }}
                      className="group flex w-full items-center justify-between gap-6 py-5 text-left transition-colors hover:bg-card focus-visible:bg-card focus-visible:outline-none sm:px-3"
                    >
                      <span className="min-w-0">
                        <span className="font-display block text-2xl leading-tight">{item.name}</span>
                        <span className="mt-1 block text-sm text-muted-foreground">{item.description}</span>
                      </span>
                      <span className="shrink-0 text-right text-sm text-muted-foreground">{formatDuration(item.durationMinutes)}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {stage === "time" && service && (
              <div>
                <SelectionSummary service={service} onChange={() => setStage("service")} />
                <div className="mt-6 grid gap-8 md:grid-cols-[auto_1fr]">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(day) => {
                      setDate(day);
                      setTime(null);
                    }}
                    disabled={[{ before: startOfDay(now) }, { after: lastBookableDay(now) }, (day) => isClosed(day, siteDemo.hours)]}
                    startMonth={startOfDay(now)}
                    endMonth={lastBookableDay(now)}
                    className="mx-auto rounded-[var(--radius)] border bg-card p-3 [--cell-size:--spacing(10)] md:mx-0"
                  />
                  <div>
                    {date ? (
                      <>
                        <p className="eyebrow">{formatLongDate(date)}</p>
                        {slots.length === 0 ? (
                          <p className="mt-4 text-sm text-muted-foreground">No times left on this day. Please pick another.</p>
                        ) : (
                          <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-4">
                            {slots.map((slot) => (
                              <button
                                key={slot.time}
                                type="button"
                                disabled={!slot.available}
                                aria-pressed={time === slot.time}
                                onClick={(event) => pickTime(slot.time, event.timeStamp)}
                                className={cn(
                                  "h-11 rounded-[var(--radius)] border text-sm transition-colors duration-300 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
                                  slot.available
                                    ? "hover:border-foreground/50 aria-pressed:border-foreground aria-pressed:bg-foreground aria-pressed:text-background"
                                    : "cursor-not-allowed border-dashed text-muted-foreground/50 line-through",
                                )}
                              >
                                <span className="sr-only">{slot.available ? "" : "Taken: "}</span>
                                {formatTime(slot.time)}
                              </button>
                            ))}
                          </div>
                        )}
                      </>
                    ) : (
                      <p className="text-sm text-muted-foreground">Pick a day to see open times.</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex items-center justify-between gap-3 border-t px-6 py-4 sm:px-9">
        {stage === "time" ? (
          <>
            <button type="button" onClick={() => setStage("service")} className={textLink}>
              <ArrowLeft aria-hidden className="size-4" /> Back
            </button>
            <p className="text-xs text-muted-foreground">Tap a time to book (Demo)</p>
          </>
        ) : (
          <p className="text-xs text-muted-foreground">Sample services · Demo booking</p>
        )}
      </div>
    </>
  );
}

function SelectionSummary({ service, onChange }: { service: Service; onChange: () => void }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-[var(--radius)] bg-card px-4 py-3 text-sm">
      <p>
        <span className="font-display text-lg">{service.name}</span>
        <span className="text-muted-foreground"> · {formatDuration(service.durationMinutes)}</span>
      </p>
      <button type="button" onClick={onChange} className="text-xs underline underline-offset-4">
        Change
      </button>
    </div>
  );
}

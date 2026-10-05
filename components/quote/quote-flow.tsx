"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { siteDemo } from "@/config/site-demo";
import { useDemo } from "@/components/providers/demo-provider";
import { DemoReveal } from "@/components/reveal/demo-reveal";
import { DemoTag } from "@/components/site/actions";
import { pillPrimary, textLink } from "@/components/site/styles";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Field, choiceEditorial, inputEditorial, textareaEditorial } from "@/components/ui/field";
import { trackEvent } from "@/lib/analytics";
import { zipError } from "@/lib/forms";
import { matchService } from "@/lib/quote-match";

const OTHER = "other";
const TIMINGS = [
  { id: "asap", label: "As soon as possible" },
  { id: "week", label: "This week" },
  { id: "flexible", label: "I'm flexible" },
] as const;
type Timing = (typeof TIMINGS)[number]["id"];

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Demo quote, frontend only: what you need, then where and when. The final click opens the
 * reveal instead of asking for contact details; nothing is saved or sent.
 */
export function QuoteFlow() {
  const { quoteRequest } = useDemo();
  const [stage, setStage] = useState<1 | 2>(1);
  const [choice, setChoice] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [zip, setZip] = useState("");
  const [timing, setTiming] = useState<Timing>("week");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [seenRequest, setSeenRequest] = useState<number | null>(null);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [reveal, setReveal] = useState<{ seconds: number | null; detail: string } | null>(null);

  // A service card's "Ask about it" pre-selects that service (adjusting state from new input).
  if (quoteRequest && quoteRequest.at !== seenRequest) {
    setSeenRequest(quoteRequest.at);
    setChoice(quoteRequest.serviceId);
    setStage(1);
    setErrors({});
    setStartedAt(quoteRequest.at);
  }

  /** The clock for "Done in N seconds" starts at the visitor's first interaction. */
  function touch() {
    if (startedAt === null) setStartedAt(Date.now());
  }

  function next() {
    if (!choice && description.trim().length < 3) return setErrors({ need: "Pick an option or describe what you need." });
    if (choice === OTHER && description.trim().length < 3) return setErrors({ need: "Tell us a little about what you need." });
    setErrors({});
    setStage(2);
  }

  function finish() {
    const zipProblem = zipError(zip);
    if (zipProblem) return setErrors({ zip: zipProblem });
    setErrors({});
    const matched =
      choice && choice !== OTHER
        ? siteDemo.services.find((service) => service.id === choice)
        : matchService(description, siteDemo.services);
    const seconds = startedAt === null ? null : Math.round((Date.now() - startedAt) / 1000);
    const timingLabel = TIMINGS.find((t) => t.id === timing)?.label ?? "";
    setReveal({ seconds, detail: `${matched?.name ?? "Custom request"} · ZIP ${zip} · ${timingLabel}` });
    trackEvent("demo_reveal", { kind: "quote", seconds, service: matched?.id ?? "custom" });
  }

  function restart() {
    setReveal(null);
    setStage(1);
    setChoice(null);
    setDescription("");
    setZip("");
    setStartedAt(null);
  }

  return (
    <div className="paper p-6 sm:p-10">
      <div className="mb-8">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="eyebrow">Free quote (Demo)</span>
          <span>Step {stage} of 2</span>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-1.5">
          {[1, 2].map((n) => (
            <span key={n} className="h-px bg-border">
              <motion.span
                className="block h-px origin-left bg-foreground"
                initial={false}
                animate={{ scaleX: n <= stage ? 1 : 0 }}
                transition={{ duration: 0.6, ease: EASE }}
              />
            </span>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={stage}
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -16 }}
          transition={{ duration: 0.35, ease: EASE }}
        >
          {stage === 1 && (
            <div>
              <h3 className="font-display text-3xl sm:text-4xl">What can we help with?</h3>
              <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-3">
                {[...siteDemo.services.map((s) => ({ id: s.id, name: s.name })), { id: OTHER, name: "Something else" }].map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    aria-pressed={choice === option.id}
                    onClick={() => {
                      touch();
                      setChoice(choice === option.id ? null : option.id);
                    }}
                    className={choiceEditorial}
                  >
                    {option.name}
                  </button>
                ))}
              </div>
              <Field id="quote-need" label="Or describe it in your own words" optional={choice !== OTHER} error={errors.need} className="mt-6">
                <textarea
                  id="quote-need"
                  value={description}
                  maxLength={500}
                  onChange={(event) => {
                    touch();
                    setDescription(event.target.value);
                  }}
                  placeholder="A few words about what you need…"
                  className={textareaEditorial}
                  aria-invalid={Boolean(errors.need)}
                />
              </Field>
              <div className="mt-8 flex justify-end">
                <button type="button" onClick={next} className={pillPrimary}>
                  Continue <ArrowRight aria-hidden className="size-4" />
                </button>
              </div>
            </div>
          )}

          {stage === 2 && (
            <div>
              <h3 className="font-display text-3xl sm:text-4xl">Where, and how soon?</h3>
              <Field id="quote-zip" label="ZIP code" error={errors.zip} className="mt-6 max-w-[14rem]">
                <input
                  id="quote-zip"
                  value={zip}
                  onChange={(event) => setZip(event.target.value.replace(/\D/g, "").slice(0, 5))}
                  inputMode="numeric"
                  autoComplete="postal-code"
                  placeholder="60540"
                  className={inputEditorial}
                  aria-invalid={Boolean(errors.zip)}
                />
              </Field>
              <fieldset className="mt-7">
                <legend className="eyebrow text-foreground/75">Timing</legend>
                <div className="mt-3 grid gap-2 sm:grid-cols-3">
                  {TIMINGS.map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      aria-pressed={timing === option.id}
                      onClick={() => setTiming(option.id)}
                      className={choiceEditorial}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </fieldset>
              <div className="mt-8 flex items-center justify-between gap-4">
                <button type="button" onClick={() => setStage(1)} className={textLink}>
                  <ArrowLeft aria-hidden className="size-4" /> Back
                </button>
                <button type="button" onClick={finish} className={pillPrimary}>
                  Get my quote <DemoTag />
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <Dialog open={reveal !== null} onOpenChange={(open) => !open && restart()}>
        <DialogContent
          aria-describedby={undefined}
          className="flex flex-col gap-0 overflow-hidden bg-background p-0 max-sm:top-0 max-sm:left-0 max-sm:h-dvh max-sm:max-w-none max-sm:translate-x-0 max-sm:translate-y-0 max-sm:rounded-none sm:max-h-[min(92dvh,780px)] sm:max-w-3xl sm:rounded-[calc(var(--radius)*2)]"
        >
          {reveal && (
            <div className="min-h-0 flex-1 overflow-y-auto">
              <DemoReveal kind="quote" seconds={reveal.seconds} detail={reveal.detail} onKeepExploring={restart} />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

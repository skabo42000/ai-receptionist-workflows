import { Fragment } from "react";
import { BellRing, ClipboardList, Clock3, Sparkle, Zap } from "lucide-react";
import { BrandName } from "./brand-text";
import { BookButton, ConsultationButton, TryReceptionistLink } from "./actions";
import { HeroCollage } from "./hero-collage";

const HEADLINE: { text: string; accent?: boolean }[] = [
  { text: "Exceptional service," },
  { text: "effortlessly booked.", accent: true },
];

const FEATURES = [
  { icon: Clock3, label: "Answered 24/7" },
  { icon: Zap, label: "Book in under a minute" },
  { icon: BellRing, label: "Reminders before every visit" },
  { icon: ClipboardList, label: "Free quotes, fast" },
];

/** Word-by-word rise, done in CSS so the headline paints without waiting for JavaScript. */
function RisingHeadline() {
  let index = 0;
  return (
    <h1
      aria-label={HEADLINE.map((part) => part.text).join(" ")}
      className="hero-headline font-display leading-[0.98] tracking-[-0.025em] sm:leading-[0.94]"
    >
      {HEADLINE.map((part) => (
        <span key={part.text} aria-hidden className="block">
          {part.text.split(" ").map((word) => {
            const delay = 120 + index++ * 70;
            return (
              <Fragment key={word + delay}>
                <span className="inline-block overflow-hidden pr-[0.06em] pb-[0.1em] align-bottom">
                  <span
                    className={part.accent ? "word-rise text-brand italic" : "word-rise"}
                    style={{ animationDelay: `${delay}ms` }}
                  >
                    {word}
                  </span>
                </span>{" "}
              </Fragment>
            );
          })}
        </span>
      ))}
    </h1>
  );
}

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden">
      <div className="container-editorial grid gap-9 pt-7 pb-14 sm:gap-12 sm:pt-14 sm:pb-20 lg:grid-cols-12 lg:gap-10 lg:pt-20 lg:pb-24">
        <div className="lg:col-span-7">
          <p className="eyebrow fade-up flex items-center gap-3" style={{ animationDelay: "40ms" }}>
            <span className="font-display text-sm tracking-normal text-brand normal-case italic">N° 01</span>
            <span aria-hidden className="h-px w-8 bg-border" />
            <span className="truncate">
              Welcome to <BrandName />
            </span>
          </p>

          <div className="mt-5 sm:mt-7">
            <RisingHeadline />
          </div>

          <p
            className="fade-up mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:mt-8 sm:text-xl"
            style={{ animationDelay: "520ms" }}
          >
            Book a visit, request a free quote, or talk to our receptionist. All at your convenience.
          </p>

          <div className="fade-up mt-6 flex flex-col gap-2 sm:mt-10 sm:flex-row sm:items-center sm:gap-8" style={{ animationDelay: "640ms" }}>
            <div id="hero-booking-action" className="flex flex-col sm:block">
              <BookButton source="hero" />
            </div>
            <TryReceptionistLink />
          </div>

          {/* The real offer, set apart from the demo buttons above. */}
          <div
            className="fade-up mt-6 flex max-w-2xl flex-col gap-3 rounded-[calc(var(--radius)*2)] border border-brand/30 bg-card/70 p-4 sm:mt-8 sm:flex-row sm:items-center sm:justify-between sm:rounded-full sm:py-2 sm:pr-2 sm:pl-5"
            style={{ animationDelay: "700ms" }}
          >
            <p className="flex items-center gap-2.5 text-sm">
              <Sparkle aria-hidden className="size-4 shrink-0 text-brand" strokeWidth={1.75} />
              <span>
                <span className="font-medium">Like what you see?</span>{" "}
                <span className="text-muted-foreground">Get this for your business.</span>
              </span>
            </p>
            <ConsultationButton source="hero" compact={false} />
          </div>

          <ul
            className="fade-up mt-7 grid max-w-2xl grid-cols-2 gap-x-5 gap-y-3 border-t pt-5 sm:mt-12 sm:grid-cols-4 sm:pt-7"
            style={{ animationDelay: "760ms" }}
          >
            {FEATURES.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-start gap-2.5 text-[0.82rem] leading-snug text-foreground/80">
                <Icon aria-hidden className="mt-0.5 size-4 shrink-0 text-brand" strokeWidth={1.5} />
                {label}
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-5">
          <HeroCollage />
        </div>
      </div>
    </section>
  );
}

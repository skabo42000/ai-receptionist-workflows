import {
  ArrowUpRight,
  CalendarCheck2,
  Check,
  Magnet,
  MapPin,
  MessagesSquare,
  MonitorSmartphone,
  PhoneCall,
  Star,
  Zap,
} from "lucide-react";
import { CustomizeButton, GetThisLink } from "./actions";
import { Reveal } from "./reveal";
import { SynqContact } from "./synq-contact";

/** Everything Synq Logic builds and runs. Plain English, benefits only, no promised results. */
const OFFERINGS = [
  {
    icon: MonitorSmartphone,
    title: "A website that wins trust",
    text: "Designed around your brand and built to turn visitors into bookings on every screen.",
  },
  {
    icon: CalendarCheck2,
    title: "Online booking",
    text: "Clients book in seconds, day or night, without picking up the phone.",
  },
  {
    icon: PhoneCall,
    title: "AI receptionist",
    text: "Answers every call, handles common questions and books visits, even after hours.",
  },
  {
    icon: MessagesSquare,
    title: "AI chat on your website",
    text: "Replies to visitors straight away and guides them to book or get in touch.",
  },
  {
    icon: Magnet,
    title: "Never miss a lead",
    text: "Every enquiry from your website, phone and forms lands in one place and gets a fast, friendly follow-up.",
  },
  {
    icon: MapPin,
    title: "Climb on Google",
    text: "We tune your Google Business Profile and your pages and keep them active, so more local customers find you on Search and Maps before they find a competitor.",
  },
  {
    icon: Zap,
    title: "Automate the busywork",
    text: "Confirmations, reminders, follow-ups and the repetitive admin run on their own in the background, so hours come back to your week.",
  },
  {
    icon: Star,
    title: "Reviews on autopilot",
    text: "Every happy client is invited to leave a Google review after their visit, automatically.",
  },
];

/** How working with Synq Logic goes, from the first call to running it for them. */
const STEPS = [
  { title: "Free strategy call", text: "Tell us how your business runs today and where it gets stuck. No pressure, no obligation." },
  {
    title: "A clear look at your business",
    text: "We look at your website, how you show up on Google, and how calls and bookings are handled, to find where customers slip away.",
  },
  { title: "Your growth plan", text: "A plain-English plan: what to fix first, what to automate and what it takes. No jargon." },
  { title: "We build it and run it", text: "We set everything up, run it for you and keep improving it, while you run your business." },
];

/** Why owners hand this to us. Approach only: no invented numbers, results or guarantees. */
const REASONS = [
  {
    title: "One team for all of it",
    text: "Website, Google, AI receptionist and automation from one team that sees the whole picture. No juggling freelancers and apps.",
  },
  {
    title: "Done for you",
    text: "We don't hand you software and walk away. We set it up, watch over it and keep fine-tuning it, so it keeps working for you.",
  },
  {
    title: "Focused on what matters",
    text: "More calls answered, more bookings and more customers coming back, explained in plain English, not likes and clicks.",
  },
];

/** Inverted panel (ink on ivory, ivory on ink) where Synq Logic speaks to the business owner. */
export function SynqBand() {
  return (
    <section className="py-16 sm:py-24">
      <div className="container-editorial">
        <Reveal>
          <div className="relative overflow-hidden rounded-[calc(var(--radius)*2)] bg-foreground px-7 py-14 text-background sm:px-14 sm:py-20">
            <div className="pointer-events-none absolute -top-40 -right-40 size-[480px] rounded-full bg-brand-inverse/25 blur-[110px]" />

            <div className="relative grid gap-10 lg:grid-cols-12 lg:items-end">
              <div className="lg:col-span-7">
                <p className="eyebrow text-background/60">Built by Synq Logic</p>
                <h2 className="font-display mt-5 text-[2.6rem] leading-[1.02] sm:text-6xl">
                  Want all of this <em className="text-brand-inverse italic">for your business?</em>
                </h2>
                <p className="mt-6 max-w-xl text-lg leading-relaxed text-background/70">
                  Your website is only the start. We&apos;re the team behind it: we build the whole system around it, then
                  run it and keep improving it, so new customers find you, reach you, book you and keep coming back,
                  while you focus on your business.
                </p>
              </div>
              <div className="flex flex-col gap-4 lg:col-span-5 lg:items-end">
                <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                  <GetThisLink
                    source="band"
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-background px-7 text-sm font-medium tracking-wide whitespace-nowrap text-foreground transition-opacity hover:opacity-90 lg:w-72"
                  >
                    Book a free strategy call <ArrowUpRight aria-hidden className="size-4" />
                  </GetThisLink>
                  <CustomizeButton className="inline-flex h-12 items-center justify-center rounded-full border border-background/30 px-6 text-sm font-medium tracking-wide whitespace-nowrap transition-colors hover:border-background/70 lg:w-72">
                    Try your colors
                  </CustomizeButton>
                </div>
                <div className="lg:w-72">
                  <p className="eyebrow text-[0.6rem] text-background/50">Or reach us directly</p>
                  <SynqContact className="mt-3" linkClassName="text-background/75 hover:text-background" />
                </div>
              </div>
            </div>

            <div className="relative mt-16">
              <p className="eyebrow flex items-center gap-3 text-background/60">
                Everything we build and run for you
                <span aria-hidden className="h-px flex-1 bg-background/15" />
              </p>
              {/* 1px gaps over a translucent background draw hairlines between the tiles. */}
              <ul className="mt-8 grid gap-px overflow-hidden rounded-[var(--radius)] bg-background/12 min-[360px]:grid-cols-2 lg:grid-cols-4">
                {OFFERINGS.map(({ icon: Icon, title, text }, index) => (
                  <li key={title} className="group bg-foreground p-4 transition-colors duration-500 hover:bg-background/[0.04] sm:p-7">
                    <div className="flex items-center justify-between">
                      <Icon aria-hidden className="size-5 text-brand-inverse" strokeWidth={1.4} />
                      <span className="font-display text-sm text-background/60 italic">{String(index + 1).padStart(2, "0")}</span>
                    </div>
                    <h3 className="font-display mt-5 text-[1.3rem] leading-tight sm:mt-8 sm:text-2xl">{title}</h3>
                    <p className="mt-3 text-[0.8rem] leading-relaxed text-background/65 sm:text-sm">{text}</p>
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative mt-16 grid gap-14 lg:grid-cols-12 lg:gap-12">
              <div className="lg:col-span-7">
                <p className="eyebrow flex items-center gap-3 text-background/60">
                  How we work
                  <span aria-hidden className="h-px flex-1 bg-background/15" />
                </p>
                <ol className="mt-8 grid gap-x-10 gap-y-8 sm:grid-cols-2">
                  {STEPS.map(({ title, text }, index) => (
                    <li key={title} className="border-t border-background/15 pt-5">
                      <span className="font-display text-lg text-brand-inverse italic">Step {index + 1}</span>
                      <h3 className="font-display mt-2 text-[1.45rem] leading-tight">{title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-background/65">{text}</p>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="lg:col-span-5">
                <p className="eyebrow flex items-center gap-3 text-background/60">
                  Why owners work with us
                  <span aria-hidden className="h-px flex-1 bg-background/15" />
                </p>
                <ul className="mt-8 space-y-7">
                  {REASONS.map(({ title, text }) => (
                    <li key={title} className="flex gap-4">
                      <Check aria-hidden className="mt-1.5 size-4 shrink-0 text-brand-inverse" strokeWidth={2} />
                      <div>
                        <h3 className="font-display text-[1.45rem] leading-tight">{title}</h3>
                        <p className="mt-2 text-sm leading-relaxed text-background/65">{text}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="relative mt-16 flex flex-col items-start gap-6 border-t border-background/15 pt-10 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-display text-3xl leading-tight sm:text-4xl">
                  Ready for less busywork <em className="text-brand-inverse italic">and more customers?</em>
                </p>
                <p className="mt-2 text-sm text-background/60">Free consultation · No obligation · Plain English</p>
              </div>
              <GetThisLink
                source="band_bottom"
                className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-background px-7 text-sm font-medium tracking-wide whitespace-nowrap text-foreground transition-opacity hover:opacity-90"
              >
                Book a free strategy call <ArrowUpRight aria-hidden className="size-4" />
              </GetThisLink>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

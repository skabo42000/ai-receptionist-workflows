import { CalendarCheck2, Check, MessageSquareText } from "lucide-react";
import { BrandName } from "./brand-text";
import { cn } from "@/lib/utils";

/** Three real product moments instead of a stock photo: it works for any business. */
function Floating({
  className,
  delay,
  duration,
  children,
}: {
  className?: string;
  delay: number;
  duration: number;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("fade-up", className)} style={{ animationDelay: `${delay}ms` }}>
      <div className="drift" style={{ animationDuration: `${duration}s`, animationDelay: `${delay}ms` }}>
        {children}
      </div>
    </div>
  );
}

export function HeroCollage() {
  // The cards stack in normal flow and each overlaps the one above by less than that card's
  // bottom padding (-mt-3 plus the 7px drift stays under 20px), so no card ever covers text.
  return (
    <div aria-hidden className="relative mx-auto flex w-full max-w-md flex-col lg:max-w-none lg:pt-2">
      {/* Soft accent glow behind the cards */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 size-[360px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand/[0.06] blur-[90px]" />

      <Floating delay={420} duration={9} className="relative z-10 ml-auto w-[87%] sm:w-[82%] lg:w-[80%]">
        <div className="paper p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <p className="eyebrow flex items-center gap-2 text-[0.58rem] tracking-[0.13em] text-foreground/80 sm:text-[0.65rem] sm:tracking-[0.2em]">
              <CalendarCheck2 className="size-3.5 shrink-0 text-brand" strokeWidth={1.5} />
              Appointment confirmed
            </p>
            <span className="ml-2 flex size-5 shrink-0 items-center justify-center rounded-full bg-brand text-brand-foreground sm:size-6">
              <Check className="size-3.5" strokeWidth={2.5} />
            </span>
          </div>
          <p className="font-display mt-4 text-[1.65rem] leading-none sm:mt-5 sm:text-3xl">Signature Service</p>
          <p className="mt-2 text-xs text-muted-foreground sm:text-sm">Saturday · 10:00 AM · 60 min</p>
          <div className="mt-4 flex items-center gap-3 border-t pt-3 text-[0.65rem] text-muted-foreground sm:mt-5 sm:gap-4 sm:pt-4 sm:text-xs">
            <span>Added to your calendar</span>
            <span className="size-1 rounded-full bg-border" />
            <span>Reminder set</span>
          </div>
        </div>
      </Floating>

      <Floating delay={620} duration={10} className="relative z-20 -mt-3 mr-auto w-[91%] lg:w-[84%]">
        <div className="paper p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <p className="flex items-center gap-2.5 text-sm font-medium">
              <span className="relative flex size-6 items-center justify-center">
                <span className="animate-soft-ping absolute inset-0 rounded-full bg-brand/40" />
                <span className="relative size-4 rounded-full bg-[radial-gradient(circle_at_30%_30%,color-mix(in_oklch,var(--brand)_45%,white),var(--brand))]" />
              </span>
              AI receptionist
            </p>
            <span className="text-xs text-muted-foreground">11:42 PM</span>
          </div>
          <div className="mt-4 space-y-2.5 text-xs leading-relaxed sm:mt-5 sm:space-y-3 sm:text-sm">
            <p className="max-w-[85%] rounded-xl rounded-bl-sm bg-muted px-3 py-2.5 sm:px-4">Do you have anything Saturday morning?</p>
            <p className="ml-auto max-w-[85%] rounded-xl rounded-br-sm border border-brand/25 bg-brand/[0.05] px-3 py-2.5 sm:px-4">
              Yes, Saturday at 10:00. Shall I book it for you?
            </p>
          </div>
        </div>
      </Floating>

      <Floating delay={820} duration={11} className="relative z-30 -mt-3 mr-[3%] ml-auto w-[76%] lg:w-[66%]">
        <div className="paper p-4 sm:p-5">
          <p className="eyebrow flex items-center gap-2">
            <MessageSquareText className="size-4 text-brand" strokeWidth={1.5} />
            Text message
          </p>
          <p className="mt-3 text-xs leading-relaxed sm:text-sm">
            Reminder from <BrandName />: see you Saturday at 10:00 AM. Reply C to confirm.
          </p>
          <p className="mt-3 text-right text-[0.7rem] text-muted-foreground">Delivered</p>
        </div>
      </Floating>
    </div>
  );
}

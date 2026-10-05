"use client";

import { useEffect, useState } from "react";
import { useDemo } from "@/components/providers/demo-provider";
import { cn } from "@/lib/utils";
import { BookButton, ChatButton, DemoTag, LiveDot } from "./actions";
import { pillOutline, pillPrimary } from "./styles";

/** Appears once the hero's booking action scrolls behind the header. */
export function MobileActionBar() {
  const [pastHeroAction, setPastHeroAction] = useState(false);
  const { booking, customizerOpen } = useDemo();

  useEffect(() => {
    const action = document.getElementById("hero-booking-action");
    if (!action) return;
    const observer = new IntersectionObserver(
      ([entry]) => setPastHeroAction(entry.boundingClientRect.bottom <= 72),
      { rootMargin: "-72px 0px 0px 0px", threshold: 0 },
    );
    observer.observe(action);
    return () => observer.disconnect();
  }, []);

  const visible = pastHeroAction && !booking.open && !customizerOpen;

  return (
    <div
      data-mobile-action-bar
      aria-hidden={!visible}
      inert={!visible}
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 border-t bg-background/95 px-3 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-md transition-[transform,opacity,visibility] duration-300 motion-reduce:transition-none md:hidden",
        visible ? "visible translate-y-0 opacity-100" : "invisible translate-y-full opacity-0",
      )}
    >
      <p className="mb-2.5 flex items-center justify-center gap-2 text-[0.72rem] text-muted-foreground">
        <LiveDot />
        Questions? Ask Anna, our AI receptionist.
      </p>
      <div className="grid grid-cols-2 gap-2">
        <BookButton source="mobile_bar" className={cn(pillPrimary, "h-12 w-full px-3 text-[0.8rem]")} />
        <ChatButton className={cn(pillOutline, "h-12 w-full gap-1.5 bg-background px-3 text-[0.8rem]")}>
          Ask Anna <DemoTag />
        </ChatButton>
      </div>
    </div>
  );
}

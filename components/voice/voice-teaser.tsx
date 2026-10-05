"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, X } from "lucide-react";
import { useDemo } from "@/components/providers/demo-provider";
import { DemoTag, LiveDot } from "@/components/site/actions";
import { useVoice } from "./voice-provider";

const DISMISS_KEY = "voice-teaser-dismissed";
const DELAY_MS = 4000;

/**
 * A small invitation above the floating receptionist button (desktop). It appears once the
 * visitor has scrolled past the hero (and at least 4s after load), and steps aside for the
 * receptionist section, dialogs, the customizer and live calls. Dismissing it lasts the visit.
 * Phones get a one-line version in the mobile action bar instead.
 */
export function VoiceTeaser() {
  const { panelOpen, openPanel, status, start } = useVoice();
  const { booking, customizerOpen } = useDemo();
  const [ready, setReady] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [pastHero, setPastHero] = useState(false);
  const [receptionistInView, setReceptionistInView] = useState(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(DISMISS_KEY) === "1") return;
    } catch {
      // Storage blocked: just show it.
    }
    const id = window.setTimeout(() => setReady(true), DELAY_MS);
    return () => window.clearTimeout(id);
  }, []);

  // Wait until the visitor has moved past the hero, so the card never sits on the hero collage.
  useEffect(() => {
    const onScroll = () => setPastHero(window.scrollY > window.innerHeight * 0.75);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Step aside while the receptionist section (it has its own start button) or the footer (its
  // contact links sit right under the card) is on screen.
  useEffect(() => {
    const targets = [document.getElementById("receptionist"), document.querySelector("footer")].filter(
      (el): el is HTMLElement => el !== null,
    );
    if (!targets.length) return;
    const visible = new Set<Element>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target);
          else visible.delete(entry.target);
        }
        setReceptionistInView(visible.size > 0);
      },
      { threshold: 0.2 },
    );
    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  function dismiss() {
    setDismissed(true);
    try {
      sessionStorage.setItem(DISMISS_KEY, "1");
    } catch {
      // Not remembered this time; harmless.
    }
  }

  function startChat() {
    openPanel("chat");
    dismiss();
  }

  function startTalking() {
    openPanel("voice");
    if (status === "idle" || status === "ended") start("teaser");
    dismiss();
  }

  const visible =
    ready &&
    pastHero &&
    !receptionistInView &&
    !dismissed &&
    !panelOpen &&
    !booking.open &&
    !customizerOpen &&
    (status === "idle" || status === "ended");

  return (
    <AnimatePresence>
      {visible && (
        <motion.aside
          aria-label="Message from Anna"
          initial={{ opacity: 0, y: 12, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.98 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="fixed right-6 bottom-[6.6rem] z-50 hidden w-[17.5rem] md:block"
        >
          <div className="paper relative p-5 pr-10">
            <button
              type="button"
              onClick={dismiss}
              aria-label="Dismiss"
              className="absolute top-2.5 right-2.5 inline-flex size-7 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-foreground/[0.05] hover:text-foreground"
            >
              <X className="size-3.5" />
            </button>
            <p className="flex items-center gap-2 text-[0.62rem] tracking-[0.18em] text-muted-foreground uppercase">
              <LiveDot />
              Online now
            </p>
            <p className="font-display mt-3 text-[1.45rem] leading-tight">Hi, I&apos;m Anna. Ask me anything.</p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Ask what Synq Logic could build for your business, or hear how I&apos;d answer your customers, day or night.
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
              <button
                type="button"
                onClick={startChat}
                className="group inline-flex items-center gap-2 text-sm font-medium underline decoration-foreground/25 underline-offset-[6px] transition-colors hover:decoration-foreground"
              >
                Chat with Anna <DemoTag />
                <ArrowRight aria-hidden className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
              <button
                type="button"
                onClick={startTalking}
                className="text-xs text-muted-foreground underline underline-offset-4 transition-colors hover:text-foreground"
              >
                or talk by voice
              </button>
            </div>
          </div>
          {/* Small tail pointing down at the orb button */}
          <span aria-hidden className="absolute right-[3.15rem] -bottom-1.5 size-3 rotate-45 border-r border-b bg-card" />
        </motion.aside>
      )}
    </AnimatePresence>
  );
}

"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { type MotionValue, useMotionValue } from "motion/react";
import type Vapi from "@vapi-ai/web";
import { siteDemo } from "@/config/site-demo";
import { useDemo } from "@/components/providers/demo-provider";
import { trackEvent } from "@/lib/analytics";

export type VoiceStatus = "idle" | "connecting" | "live" | "ended";
export type VoiceLine = { id: number; role: "assistant" | "caller"; text: string };
export type PanelTab = "chat" | "voice";

// Anna, the demo's Vapi assistant (created by `npm run vapi:sync`). With both values set, the orb
// starts a real browser call; without them it falls back to the scripted preview.
const VAPI_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY ?? "";
const VAPI_ASSISTANT_ID = process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID ?? "";
const LIVE = Boolean(VAPI_PUBLIC_KEY && VAPI_ASSISTANT_ID);

/** Synq Logic's phone line, offered when the browser call can't start. */
const FALLBACK_PHONE = siteDemo.synq.aiLineDisplay;

type VoiceContextValue = {
  status: VoiceStatus;
  lines: VoiceLine[];
  speaking: "assistant" | "caller" | null;
  /** 0-1, drives the orb (Vapi's volume events, or a simulated pulse in preview mode). */
  volume: MotionValue<number>;
  /** true when the scripted preview stands in for the live call (no Vapi keys). */
  isPreview: boolean;
  /** A short problem message (microphone blocked, call failed), or null. */
  notice: string | null;
  panelOpen: boolean;
  setPanelOpen: (open: boolean) => void;
  /** Anna's floating window has two tabs: text chat and voice. */
  panelTab: PanelTab;
  setPanelTab: (tab: PanelTab) => void;
  openPanel: (tab: PanelTab) => void;
  start: (source: string) => void;
  stop: () => void;
};

const VoiceContext = createContext<VoiceContextValue | null>(null);

export function useVoice() {
  const value = useContext(VoiceContext);
  if (!value) throw new Error("useVoice must be used inside <VoiceProvider>");
  return value;
}

const PREVIEW_SCRIPT: Omit<VoiceLine, "id">[] = [
  { role: "assistant", text: "Hi, I'm Anna, Synq Logic's AI receptionist. I can tell you what we build, or show you how I'd answer your customers." },
  { role: "caller", text: "Show me how you'd answer my customers." },
  { role: "assistant", text: "Happy to. Thanks for calling! I have tomorrow at ten or Thursday at two. Which suits you?" },
  { role: "caller", text: "Thursday at two, please." },
  { role: "assistant", text: "And that's it, booked in seconds. Tap Book free consultation to get this for your business." },
];

const WORD_MS = { assistant: 170, caller: 140 } as const;
const PAUSE_MS = 650;

const SYNQ_MISHEARD = /\b(?:sync|synch|synk|synq|sink)[\s-]?logi(?:x|cs|c)\b/gi;

function describeError(error: unknown) {
  const text = JSON.stringify(error ?? "") + String((error as { message?: string })?.message ?? "");
  if (/NotAllowed|Permission|denied|microphone/i.test(text)) {
    return `Your microphone is blocked. Allow it in your browser's address bar, or call us at ${FALLBACK_PHONE}.`;
  }
  return `The call couldn't connect. Please try again in a moment, or call us at ${FALLBACK_PHONE}.`;
}

export function VoiceProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<VoiceStatus>("idle");
  const [lines, setLines] = useState<VoiceLine[]>([]);
  const [speaking, setSpeaking] = useState<"assistant" | "caller" | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const { prospect } = useDemo();
  const [panelTab, setPanelTab] = useState<PanelTab>("chat");
  const [notice, setNotice] = useState<string | null>(null);

  const openPanel = useCallback((tab: PanelTab) => {
    setPanelTab(tab);
    setPanelOpen(true);
    if (tab === "chat") trackEvent("chat_open");
  }, []);
  const volume = useMotionValue(0);
  const timers = useRef<number[]>([]);
  const frame = useRef<number | null>(null);
  const speakingRef = useRef<"assistant" | "caller" | null>(null);
  const vapiRef = useRef<Vapi | null>(null);
  const nextLineId = useRef(0);
  /** The caption line still being spoken (partial transcripts update it in place). */
  const openLine = useRef<{ id: number; role: "assistant" | "caller" } | null>(null);

  const clearTimers = useCallback(() => {
    timers.current.forEach((id) => window.clearTimeout(id));
    timers.current = [];
    if (frame.current !== null) cancelAnimationFrame(frame.current);
    frame.current = null;
  }, []);

  const later = useCallback((ms: number, run: () => void) => {
    timers.current.push(window.setTimeout(run, ms));
  }, []);

  const setWho = useCallback((who: "assistant" | "caller" | null) => {
    speakingRef.current = who;
    setSpeaking(who);
  }, []);

  // ---------- Live call (Vapi in the browser) ----------

  // Captions come from speech-to-text, which hears the company name as "Sync Logix" and similar.

  const addTranscript = useCallback((role: "assistant" | "caller", raw: string, final: boolean) => {
    const text = raw.replace(SYNQ_MISHEARD, "Synq Logic");
    const open = openLine.current;
    if (open && open.role === role) {
      setLines((current) => current.map((line) => (line.id === open.id ? { ...line, text } : line)));
      if (final) openLine.current = null;
      return;
    }
    const id = nextLineId.current++;
    setLines((current) => [...current, { id, role, text }]);
    openLine.current = final ? null : { id, role };
  }, []);

  const endLive = useCallback(() => {
    setWho(null);
    volume.set(0);
    openLine.current = null;
    setStatus((current) => (current === "idle" ? current : "ended"));
  }, [setWho, volume]);

  const getVapi = useCallback(async () => {
    if (vapiRef.current) return vapiRef.current;
    const { default: VapiClient } = await import("@vapi-ai/web");
    // avoidEval keeps the call working under the site's Content Security Policy.
    const vapi = new VapiClient(VAPI_PUBLIC_KEY, undefined, { avoidEval: true });
    vapi.on("call-start", () => setStatus("live"));
    vapi.on("call-end", endLive);
    vapi.on("speech-start", () => setWho("assistant"));
    vapi.on("speech-end", () => setWho(null));
    vapi.on("volume-level", (level: number) => volume.set(Math.min(1, level * 1.6)));
    vapi.on("message", (message: { type?: string; role?: string; transcript?: string; transcriptType?: string }) => {
      if (message?.type !== "transcript" || !message.transcript) return;
      addTranscript(message.role === "user" ? "caller" : "assistant", message.transcript, message.transcriptType === "final");
    });
    vapi.on("error", (error: unknown) => {
      setNotice(describeError(error));
      endLive();
    });
    vapiRef.current = vapi;
    return vapi;
  }, [addTranscript, endLive, setWho, volume]);

  useEffect(() => () => void vapiRef.current?.stop(), []);

  // ---------- Scripted preview (no Vapi keys) ----------

  const animateVolume = useCallback(() => {
    const tick = (t: number) => {
      const who = speakingRef.current;
      const target =
        who === "assistant"
          ? 0.45 + 0.35 * Math.abs(Math.sin(t / 140) * Math.sin(t / 370))
          : who === "caller"
            ? 0.12 + 0.12 * Math.abs(Math.sin(t / 110))
            : 0;
      volume.set(volume.get() + (target - volume.get()) * 0.18);
      frame.current = requestAnimationFrame(tick);
    };
    frame.current = requestAnimationFrame(tick);
  }, [volume]);

  const startPreview = useCallback(() => {
    animateVolume();
    let at = 900;
    later(at, () => setStatus("live"));
    PREVIEW_SCRIPT.forEach((line, index) => {
      const words = line.text.split(" ");
      later(at, () => {
        setWho(line.role);
        setLines((current) => [...current, { id: index, role: line.role, text: "" }]);
      });
      words.forEach((_, w) => {
        later(at + w * WORD_MS[line.role], () =>
          setLines((current) => current.map((l) => (l.id === index ? { ...l, text: words.slice(0, w + 1).join(" ") } : l))),
        );
      });
      at += words.length * WORD_MS[line.role];
      later(at, () => setWho(null));
      at += PAUSE_MS;
    });
    later(at + 400, () => {
      clearTimers();
      setWho(null);
      volume.set(0);
      setStatus("ended");
    });
  }, [animateVolume, clearTimers, later, setWho, volume]);

  // ---------- Shared controls ----------

  const start = useCallback(
    (source: string) => {
      clearTimers();
      trackEvent("voice_start", { source, preview: !LIVE });
      setLines([]);
      setNotice(null);
      openLine.current = null;
      setStatus("connecting");
      if (!LIVE) return startPreview();
      void (async () => {
        try {
          const vapi = await getVapi();
          // metadata.prospect shows up in the end-of-call report, so the lead alert says who it was.
          const call = await vapi.start(VAPI_ASSISTANT_ID, prospect ? { metadata: { prospect } } : undefined);
          if (!call) throw new Error("call-start-failed");
        } catch (error) {
          setNotice(describeError(error));
          endLive();
        }
      })();
    },
    [clearTimers, endLive, getVapi, prospect, startPreview],
  );

  const stop = useCallback(() => {
    clearTimers();
    if (LIVE) void vapiRef.current?.stop();
    setWho(null);
    volume.set(0);
    openLine.current = null;
    setStatus((current) => (current === "idle" ? current : "ended"));
  }, [clearTimers, setWho, volume]);

  useEffect(() => clearTimers, [clearTimers]);

  const value = useMemo(
    () => ({
      status,
      lines,
      speaking,
      volume,
      isPreview: !LIVE,
      notice,
      panelOpen,
      setPanelOpen,
      panelTab,
      setPanelTab,
      openPanel,
      start,
      stop,
    }),
    [status, lines, speaking, volume, notice, panelOpen, panelTab, openPanel, start, stop],
  );

  return <VoiceContext.Provider value={value}>{children}</VoiceContext.Provider>;
}

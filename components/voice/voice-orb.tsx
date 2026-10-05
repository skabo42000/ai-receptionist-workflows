"use client";

import { motion, useTransform } from "motion/react";
import { Mic, PhoneOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { DemoTag, PrivacyLink } from "@/components/site/actions";
import { pillOutline, pillPrimary } from "@/components/site/styles";
import { useVoice } from "./voice-provider";

/** A softly lit sphere in the accent color that swells with the voice. */
export function VoiceOrb({ className }: { className?: string }) {
  const { volume, status } = useVoice();
  const halo = useTransform(volume, [0, 1], [1, 1.32]);
  const core = useTransform(volume, [0, 1], [1, 1.07]);
  const glow = useTransform(volume, [0, 1], [0.35, 0.95]);
  const idle = status === "idle" || status === "ended";

  return (
    <div aria-hidden className={cn("relative aspect-square", className)}>
      <motion.div className="absolute inset-[4%] rounded-full bg-brand/35 blur-3xl" style={{ opacity: glow, scale: halo }} />
      <motion.div className="absolute inset-0 rounded-full border border-brand/25" style={{ scale: halo }} />
      <div className="absolute inset-[9%] rounded-full border border-foreground/10" />
      <motion.div className={cn("absolute inset-[18%]", idle && "animate-breathe")} style={{ scale: core }}>
        <div
          className="absolute inset-0 rounded-full shadow-[inset_0_-12px_30px_rgb(0_0_0/0.25)]"
          style={{
            background:
              "radial-gradient(circle at 32% 28%, color-mix(in oklch, var(--brand) 30%, white) 0%, var(--brand) 48%, color-mix(in oklch, var(--brand) 65%, black) 100%)",
          }}
        />
        <div className="spin-slow absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,transparent_0deg,rgb(255_255_255/0.22)_60deg,transparent_140deg)] mix-blend-overlay" />
      </motion.div>
    </div>
  );
}

export function voiceStatusText(status: string, speaking: string | null) {
  if (status === "connecting") return "Connecting…";
  if (status === "live") return speaking === "assistant" ? "Speaking…" : "Listening…";
  if (status === "ended") return "Conversation ended";
  return "Ready when you are";
}

/** The last few lines of the conversation, as live captions. */
export function VoiceTranscript({ className, max = 3 }: { className?: string; max?: number }) {
  const { lines } = useVoice();
  const visible = lines.slice(-max);
  // Before the first words, a suggested opener fills the caption space instead of a blank gap.
  if (visible.length === 0) {
    return (
      <div className={cn("flex flex-col items-center justify-center gap-2 text-center", className)}>
        <p className="eyebrow text-[0.6rem]">Try asking</p>
        <p className="font-display text-xl text-muted-foreground italic">&ldquo;Show me how you&apos;d answer my customers.&rdquo;</p>
      </div>
    );
  }
  return (
    <div aria-live="polite" className={cn("space-y-3 text-left", className)}>
      {visible.map((line) => (
        <motion.p
          key={line.id}
          layout
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            "grid grid-cols-[5.5rem_1fr] items-baseline text-[0.95rem] leading-relaxed",
            line.role === "caller" ? "text-muted-foreground" : "text-foreground",
          )}
        >
          <span className="eyebrow text-[0.6rem]">{line.role === "caller" ? "You" : "Anna"}</span>
          <span>{line.text}</span>
        </motion.p>
      ))}
    </div>
  );
}

export function VoiceControls({ source, className }: { source: string; className?: string }) {
  const { status, start, stop } = useVoice();
  if (status === "live" || status === "connecting") {
    return (
      <button type="button" onClick={stop} className={cn(pillOutline, className)}>
        <PhoneOff aria-hidden className="size-4" strokeWidth={1.5} />
        End conversation
      </button>
    );
  }
  return (
    <button type="button" onClick={() => start(source)} className={cn(pillPrimary, className)}>
      <Mic aria-hidden className="size-4" strokeWidth={1.5} />
      {status === "ended" ? "Talk again" : "Start a conversation"} <DemoTag />
    </button>
  );
}

/** One honest line under the call button: what kind of call this is. */
export function PreviewNote({ className }: { className?: string }) {
  const { isPreview } = useVoice();
  return (
    <p className={cn("text-[0.7rem] text-muted-foreground", className)}>
      {isPreview ? (
        "Scripted voice preview · no microphone needed"
      ) : (
        <>
          Live AI voice · uses your microphone · up to 3 minutes · <PrivacyLink />
        </>
      )}
    </p>
  );
}

/** Shown when the call can't start (microphone blocked, connection failed). */
export function VoiceNotice({ className }: { className?: string }) {
  const { notice } = useVoice();
  if (!notice) return null;
  return (
    <p role="alert" className={cn("rounded-[var(--radius)] border border-brand/30 px-3 py-2 text-xs leading-relaxed", className)}>
      {notice}
    </p>
  );
}

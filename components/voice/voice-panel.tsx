"use client";

import { AnimatePresence, motion } from "motion/react";
import { MessageCircle, Mic, X } from "lucide-react";
import { ChatView } from "@/components/chat/chat-view";
import { cn } from "@/lib/utils";
import { type PanelTab, useVoice } from "./voice-provider";
import { PreviewNote, VoiceControls, VoiceNotice, VoiceOrb, VoiceTranscript, voiceStatusText } from "./voice-orb";

const TABS: { id: PanelTab; label: string; icon: typeof Mic }[] = [
  { id: "chat", label: "Chat", icon: MessageCircle },
  { id: "voice", label: "Voice", icon: Mic },
];

/**
 * Anna's floating window: an orb button bottom-right (desktop) that opens a panel with two
 * ways to reach her, text chat (default, no microphone needed) and a voice call.
 */
export function VoicePanel() {
  const { panelOpen, setPanelOpen, panelTab, setPanelTab, openPanel, status, speaking, stop } = useVoice();
  const callActive = status === "live" || status === "connecting";

  function close() {
    stop();
    setPanelOpen(false);
  }

  return (
    <>
      <AnimatePresence>
        {panelOpen && (
          <motion.div
            role="dialog"
            aria-label="Anna, Synq Logic's AI receptionist"
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="paper fixed inset-x-3 bottom-[7.25rem] z-50 flex h-[min(560px,calc(100dvh-9.5rem))] flex-col overflow-hidden md:inset-x-auto md:right-6 md:bottom-28 md:h-[min(600px,calc(100dvh-9rem))] md:w-[400px]"
          >
            <div className="flex items-center gap-3 border-b px-5 pt-4 pb-3">
              <VoiceOrb className="size-10 shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="font-display truncate text-xl leading-tight">Anna · Synq Logic</p>
                <p className="truncate text-xs text-muted-foreground">
                  {panelTab === "voice" || callActive ? voiceStatusText(status, speaking) : "AI receptionist · replies in seconds"}
                </p>
              </div>
              <button
                type="button"
                onClick={close}
                aria-label="Close"
                className="inline-flex size-9 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-foreground/[0.05] hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            </div>

            <div role="tablist" aria-label="How to reach Anna" className="grid grid-cols-2 gap-1 border-b p-2">
              {TABS.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  role="tab"
                  aria-selected={panelTab === id}
                  onClick={() => setPanelTab(id)}
                  className={cn(
                    "inline-flex h-9 items-center justify-center gap-2 rounded-full text-sm transition-colors",
                    panelTab === id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <Icon aria-hidden className="size-4" strokeWidth={1.6} />
                  {label}
                  {id === "voice" && callActive && panelTab !== "voice" && <span className="size-1.5 rounded-full bg-brand" />}
                </button>
              ))}
            </div>

            {panelTab === "chat" ? (
              <ChatView className="min-h-0 flex-1" />
            ) : (
              <div className="flex min-h-0 flex-1 flex-col items-center overflow-y-auto px-6 py-6 text-center">
                <VoiceOrb className="w-[min(150px,40vw)]" />
                <p className="font-display mt-4 text-2xl">{voiceStatusText(status, speaking)}</p>
                <VoiceTranscript className="mt-4 min-h-[6.5rem] w-full" />
                <VoiceControls source="panel" className="mt-5 h-11 w-full" />
                <PreviewNote className="mt-3 text-center" />
                <VoiceNotice className="mt-3" />
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="button"
        onClick={() => (panelOpen ? close() : openPanel("chat"))}
        aria-label={panelOpen ? "Close Anna, the AI receptionist" : "Chat with Anna, our AI receptionist (demo)"}
        className="group fixed right-6 bottom-6 z-50 hidden size-16 items-center justify-center rounded-full bg-card shadow-[var(--shadow-paper)] ring-1 ring-border transition-transform duration-300 hover:scale-105 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none md:flex"
      >
        <span className="animate-soft-ping absolute inset-1 rounded-full bg-brand/25" />
        <VoiceOrb className="size-12" />
        <span className="absolute -top-0.5 -right-0.5 flex size-6 items-center justify-center rounded-full bg-primary text-primary-foreground ring-2 ring-background">
          {panelOpen ? <X aria-hidden className="size-3" /> : <MessageCircle aria-hidden className="size-3" strokeWidth={2} />}
        </span>
      </button>
    </>
  );
}

"use client";

import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import { siteDemo } from "@/config/site-demo";
import { trackEvent } from "@/lib/analytics";
import { useDemo } from "@/components/providers/demo-provider";
import { consultationUrl } from "@/lib/consultation";

export type ChatMessage = { id: number; role: "anna" | "you"; text: string };

type ChatContextValue = {
  messages: ChatMessage[];
  pending: boolean;
  send: (text: string) => void;
  reset: () => void;
};

const ChatContext = createContext<ChatContextValue | null>(null);

export function useChat() {
  const value = useContext(ChatContext);
  if (!value) throw new Error("useChat must be used inside <ChatProvider>");
  return value;
}

const GREETING =
  "Hi, I'm Anna, Synq Logic's AI receptionist. Ask me what we could build for your business, or let me show you how I'd answer your customers.";

const BOOKING_LINK = `[Book a free strategy call](${consultationUrl("chat_fallback")})`;
const RATE_LIMITED = `You've reached the message limit for this demo. Let's keep talking with our team instead: ${BOOKING_LINK}`;
const TROUBLE = `Sorry, I'm having a little trouble right now. You can call our team at ${siteDemo.synq.aiLineDisplay}, or book a free consultation here: ${BOOKING_LINK}`;

/**
 * Anna's text chat. Messages live in the browser for this visit only; each one goes through
 * our own /api/chat route (never straight to n8n). A new random session id per page load (and
 * per "New chat") keeps conversations apart in the assistant's short-term memory.
 */
export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [sessionBase] = useState(() => crypto.randomUUID());
  const [round, setRound] = useState(0);
  const [messages, setMessages] = useState<ChatMessage[]>([{ id: 0, role: "anna", text: GREETING }]);
  const [pending, setPending] = useState(false);
  const nextId = useRef(1);
  const { prospect } = useDemo();
  const sessionId = `${sessionBase}-${round}`;

  const push = useCallback((role: ChatMessage["role"], text: string) => {
    const id = nextId.current++;
    setMessages((current) => [...current, { id, role, text }]);
  }, []);

  const send = useCallback(
    (raw: string) => {
      const text = raw.trim().slice(0, 2000);
      if (!text || pending) return;
      push("you", text);
      setPending(true);
      trackEvent("chat_message");
      void (async () => {
        try {
          const response = await fetch("/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            // prospect = the /d/ link this visit came from (if any), so lead alerts say who it was.
            body: JSON.stringify({ chatInput: text, sessionId, prospect }),
          });
          if (response.status === 429) return push("anna", RATE_LIMITED);
          const data = (await response.json().catch(() => ({}))) as { output?: string };
          push("anna", response.ok && data.output ? data.output : TROUBLE);
        } catch {
          push("anna", TROUBLE);
        } finally {
          setPending(false);
        }
      })();
    },
    [pending, prospect, push, sessionId],
  );

  const reset = useCallback(() => {
    setRound((current) => current + 1);
    nextId.current = 1;
    setMessages([{ id: 0, role: "anna", text: GREETING }]);
  }, []);

  const value = useMemo(() => ({ messages, pending, send, reset }), [messages, pending, send, reset]);
  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

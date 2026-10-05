"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { ArrowUp, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { PrivacyLink } from "@/components/site/actions";
import { ChatMarkdown } from "./chat-markdown";
import { useChat } from "./chat-provider";

const SUGGESTIONS = ["What do you build?", "Show me how you'd answer my customers", "How does it work?"];

/** The chat tab of Anna's window: messages, quick suggestions, and the message box. */
export function ChatView({ className }: { className?: string }) {
  const { messages, pending, send, reset } = useChat();
  const [draft, setDraft] = useState("");
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Keep the newest message in view.
  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, pending]);

  useEffect(() => {
    inputRef.current?.focus({ preventScroll: true });
  }, []);

  function submit(text: string) {
    if (!text.trim() || pending) return;
    send(text);
    setDraft("");
  }

  return (
    <div className={cn("flex min-h-0 flex-col", className)}>
      <div ref={listRef} aria-live="polite" className="min-h-0 flex-1 space-y-3 overflow-y-auto px-5 py-4">
        {messages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn("flex", message.role === "you" ? "justify-end" : "justify-start")}
          >
            <div
              className={cn(
                "max-w-[85%] rounded-2xl px-4 py-2.5 text-[0.92rem] leading-relaxed",
                message.role === "you"
                  ? "rounded-br-sm bg-primary text-primary-foreground"
                  : "rounded-bl-sm border border-brand/20 bg-background",
              )}
            >
              {message.role === "anna" ? <ChatMarkdown text={message.text} /> : message.text}
            </div>
          </motion.div>
        ))}

        {pending && (
          <div className="flex justify-start" role="status" aria-label="Anna is typing">
            <div className="flex gap-1 rounded-2xl rounded-bl-sm border border-brand/20 bg-background px-4 py-3.5">
              {[0, 1, 2].map((dot) => (
                <span key={dot} className="size-1.5 animate-pulse rounded-full bg-brand" style={{ animationDelay: `${dot * 180}ms` }} />
              ))}
            </div>
          </div>
        )}

        {messages.length === 1 && !pending && (
          <div className="flex flex-wrap gap-2 pt-1">
            {SUGGESTIONS.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => submit(suggestion)}
                className="rounded-full border border-foreground/20 px-3 py-1.5 text-xs transition-colors hover:border-foreground/50"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          submit(draft);
        }}
        className="border-t px-4 pt-3 pb-4"
      >
        <div className="flex items-end gap-2 rounded-2xl border bg-background px-3 py-2 focus-within:border-brand">
          <label htmlFor="anna-chat-input" className="sr-only">
            Message Anna
          </label>
          <textarea
            id="anna-chat-input"
            ref={inputRef}
            value={draft}
            rows={1}
            maxLength={2000}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                submit(draft);
              }
            }}
            placeholder="Ask Anna anything…"
            className="max-h-28 min-h-6 flex-1 resize-none bg-transparent py-1 text-[0.92rem] outline-none placeholder:text-muted-foreground"
          />
          <button
            type="submit"
            disabled={!draft.trim() || pending}
            aria-label="Send"
            className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-opacity disabled:opacity-30"
          >
            <ArrowUp className="size-4" />
          </button>
        </div>
        <div className="mt-2 flex items-center justify-between text-[0.68rem] text-muted-foreground">
          <span>
            Demo chat · please don&apos;t share personal details ·{" "}
            <PrivacyLink />
          </span>
          {messages.length > 1 && (
            <button type="button" onClick={reset} className="inline-flex items-center gap-1 hover:text-foreground">
              <RotateCcw aria-hidden className="size-3" /> New chat
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

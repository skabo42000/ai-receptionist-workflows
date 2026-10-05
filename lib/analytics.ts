import { track } from "@vercel/analytics";

export type DemoEvent =
  | "book_open"
  | "demo_reveal"
  | "voice_start"
  | "chat_open"
  | "chat_message"
  | "customize_open"
  | "share_copy"
  | "get_this_click";

export function trackEvent(name: DemoEvent, data?: Record<string, string | number | boolean | null>) {
  if (process.env.NEXT_PUBLIC_ENABLE_ANALYTICS !== "true") return;
  try {
    track(name, data);
  } catch {
    // Analytics must never break the page.
  }
}

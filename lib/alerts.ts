// Lead alerts: server-side only (imported by route handlers, never by client components).
// Events go to the n8n workflow "Anna - demo lead alerts", which emails
// team@synqlogic.com. The same secret header also authenticates Vapi's end-of-call reports.
const ALERT_URL = process.env.N8N_ALERT_WEBHOOK_URL;
const ALERT_SECRET = process.env.VAPI_SERVER_SECRET;

export type AlertEvent =
  | { type: "opened"; slug: string; demo: string }
  | { type: "chat_interest"; sessionId: string; demo: string; message: string; reply: string };

/** Never throws and never blocks the visitor: call it inside `after()`. */
export async function sendAlert(event: AlertEvent) {
  if (!ALERT_URL || !ALERT_SECRET) return;
  try {
    await fetch(ALERT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Vapi-Secret": ALERT_SECRET },
      body: JSON.stringify(event),
      signal: AbortSignal.timeout(8_000),
    });
  } catch {
    // An alert is nice to have; the visitor's request already succeeded.
  }
}

// Messages that sound like a real prospect rather than someone just trying the demo.
const INTEREST =
  /\b(price|prices|pricing|cost|costs|how much|quote for (me|us|my)|consult|consultation|strategy call|book a call|call me|contact (you|your team)|get started|sign up|interested|my business|my company|my website|my shop|my practice|our business|our company|our website|hire you|work with you|build (me|us)|set (this|it) up for)\b/i;

export function soundsInterested(message: string) {
  return INTEREST.test(message);
}

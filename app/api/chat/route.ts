import { after, type NextRequest } from "next/server";
import { sendAlert, soundsInterested } from "@/lib/alerts";
import { prospectNameFromSlug } from "@/lib/prospect";
import { rateLimit } from "@/lib/rate-limit";
import { clientIp, fromOtherSite } from "@/lib/request";

// Anna's text chat: forwards to the n8n workflow "Anna - demo website chat".
// The webhook URL and the X-Chat-Auth secret stay on the server (.env.local); the browser only
// ever talks to this route. Same pattern as the synqlogic.com chat.
const WEBHOOK_URL = process.env.N8N_CHAT_WEBHOOK_URL;
const CHAT_SECRET = process.env.N8N_CHAT_SECRET;

// Cost protection, checked in this order. Every AI reply costs money, so a visitor (or a bot)
// can't run up the bill: a burst limit, an hourly and a daily limit per visitor, and a daily
// total for the whole site. In-memory per server instance, so these are best-effort; the hard
// stop is the daily cap inside the n8n workflow and the spending limit on the AI account.
const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const LIMITS = [
  { scope: "burst", perVisitor: true, limit: 6, windowMs: MINUTE },
  { scope: "hour", perVisitor: true, limit: 20, windowMs: HOUR },
  { scope: "day", perVisitor: true, limit: 40, windowMs: DAY },
  { scope: "site", perVisitor: false, limit: 300, windowMs: DAY },
] as const;
const MAX_MESSAGE_LENGTH = 2000;

export async function POST(request: NextRequest) {
  if (!WEBHOOK_URL || !CHAT_SECRET) return Response.json({ error: "chat_not_configured" }, { status: 503 });
  if (fromOtherSite(request)) return Response.json({ error: "forbidden" }, { status: 403 });

  const ip = clientIp(request);
  for (const { scope, perVisitor, limit, windowMs } of LIMITS) {
    const result = rateLimit(perVisitor ? `${scope}:${ip}` : scope, limit, windowMs);
    if (!result.allowed) {
      return Response.json(
        { error: "rate_limited" },
        { status: 429, headers: { "Retry-After": String(result.retryAfterSeconds) } },
      );
    }
  }

  let body: { chatInput?: unknown; sessionId?: unknown; prospect?: unknown };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "invalid_json" }, { status: 400 });
  }

  const { chatInput } = body;
  const sessionId = typeof body.sessionId === "string" ? body.sessionId.slice(0, 80) : "";
  if (typeof chatInput !== "string" || !chatInput.trim() || chatInput.length > MAX_MESSAGE_LENGTH) {
    return Response.json({ error: "invalid_message" }, { status: 400 });
  }

  try {
    const upstream = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Chat-Auth": CHAT_SECRET },
      body: JSON.stringify({ chatInput, sessionId }),
      signal: AbortSignal.timeout(60_000),
    });
    if (!upstream.ok) return Response.json({ error: "upstream_error" }, { status: 502 });
    const data = (await upstream.json()) as { output?: unknown };
    if (typeof data.output !== "string") return Response.json({ error: "upstream_error" }, { status: 502 });
    // Email the team (once per visit, deduplicated in n8n) when a message sounds like a real prospect.
    const reply = data.output;
    if (soundsInterested(chatInput)) {
      const demo = typeof body.prospect === "string" ? (prospectNameFromSlug(body.prospect) ?? "") : "";
      after(() => sendAlert({ type: "chat_interest", sessionId, demo, message: chatInput, reply }));
    }
    return Response.json({ output: reply });
  } catch {
    return Response.json({ error: "upstream_unreachable" }, { status: 502 });
  }
}

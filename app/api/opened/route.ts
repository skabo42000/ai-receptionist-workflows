import { after, type NextRequest } from "next/server";
import { sendAlert } from "@/lib/alerts";
import { prospectNameFromSlug } from "@/lib/prospect";
import { rateLimit } from "@/lib/rate-limit";
import { clientIp, fromOtherSite } from "@/lib/request";

// A personal /d/ demo link was opened by a real person (the page only calls this after the first
// scroll, tap or key press, so link previews and email scanners don't count). n8n emails the team
// at most once per link every few hours.
const MINUTE = 60 * 1000;

export async function POST(request: NextRequest) {
  if (fromOtherSite(request)) return Response.json({ error: "forbidden" }, { status: 403 });

  let body: { slug?: unknown };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "invalid_json" }, { status: 400 });
  }
  const slug = typeof body.slug === "string" ? body.slug : "";
  const demo = prospectNameFromSlug(slug);
  if (!demo) return Response.json({ error: "invalid_slug" }, { status: 400 });

  const perVisitor = rateLimit(`opened:${clientIp(request)}`, 10, 60 * MINUTE);
  const perLink = rateLimit(`opened-link:${slug}`, 1, 30 * MINUTE);
  if (perVisitor.allowed && perLink.allowed) after(() => sendAlert({ type: "opened", slug, demo }));

  // Always the same answer, so the page can't tell whether an email went out.
  return new Response(null, { status: 204 });
}

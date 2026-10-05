// Code node "Build alert" in the n8n workflow "Anna - demo lead alerts".
// Mode: Run Once for All Items. Turns one event into one email for team@synqlogic.com,
// or into nothing (empty calls, repeats, too many alerts today).
//
// Events:
// - Vapi end-of-call-report (Anna's server URL; Vapi sends the X-Vapi-Secret header)
// - { type: "opened", demo, slug }            from the website when a /d/ prospect link is opened
// - { type: "chat_interest", sessionId, demo, message, reply } from the website's chat route

const DAILY_EMAIL_CAP = 40;
const OPENED_REPEAT_HOURS = 6;
const store = $getWorkflowStaticData("global");
const now = new Date();
const today = now.toISOString().slice(0, 10);

const body = $input.first().json.body ?? {};
const text = (value, max = 200) => String(value ?? "").replace(/\s+/g, " ").trim().slice(0, max);
const demoLine = (demo) => (demo ? `Prospect link: ${text(demo, 60)}` : "Prospect link: none (the main demo)");

function seenRecently(key, hours) {
  store.seen ??= {};
  for (const [k, at] of Object.entries(store.seen)) if (now - new Date(at) > 48 * 3600e3) delete store.seen[k];
  if (store.seen[key] && now - new Date(store.seen[key]) < hours * 3600e3) return true;
  store.seen[key] = now.toISOString();
  return false;
}

let alert = null;

if (body.message?.type === "end-of-call-report") {
  const m = body.message;
  const seconds = Math.round(m.durationSeconds ?? (m.endedAt && m.startedAt ? (new Date(m.endedAt) - new Date(m.startedAt)) / 1000 : 0));
  // Speech-to-text hears the company name as "SyncLogix" and similar.
  const transcript = String(m.artifact?.transcript ?? m.transcript ?? "").trim().replace(/\b(?:sync|synch|synk|synq|sink)[\s-]?logi(?:x|cs|c)\b/gi, "Synq Logic");
  const callerSpoke = /^User:/m.test(transcript);
  // metadata.prospect = the /d/<slug> link the caller came from ("bella-studio" -> "Bella Studio").
  const slug = text(m.call?.assistantOverrides?.metadata?.prospect, 60);
  const demo = /^[a-z0-9-]+$/.test(slug) ? slug.split("-").filter(Boolean).map((w) => w[0].toUpperCase() + w.slice(1)).join(" ") : "";
  // Skip calls where the visitor never said anything (mic problems, instant hang-ups).
  if (callerSpoke && seconds >= 8) {
    const minutes = `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
    alert = {
      subject: `Demo: voice call with Anna (${minutes})${demo ? ` · ${text(demo, 40)}` : ""}`,
      message: [
        "Someone talked to Anna on the demo website.",
        "",
        demoLine(demo),
        `Length: ${minutes} · Ended: ${text(m.endedReason, 80)}`,
        m.analysis?.summary ? `\nSummary:\n${text(m.analysis.summary, 1200)}` : "",
        "",
        "Transcript:",
        transcript.slice(0, 6000),
        m.recordingUrl || m.artifact?.recordingUrl ? `\nRecording: ${m.recordingUrl || m.artifact.recordingUrl}` : "",
      ].join("\n"),
    };
  }
} else if (body.type === "opened") {
  const slug = text(body.slug, 60);
  if (slug && !seenRecently(`opened:${slug}`, OPENED_REPEAT_HOURS)) {
    alert = {
      subject: `Demo opened: ${text(body.demo, 60)}`,
      message: [
        `${text(body.demo, 60)} just opened their personal demo link.`,
        "",
        `Link: https://demo.synqlogic.com/d/${slug}`,
        `Time: ${now.toLocaleString("en-US", { timeZone: "America/Chicago" })} (Central)`,
        "",
        "Good moment to follow up while it's fresh.",
      ].join("\n"),
    };
  }
} else if (body.type === "chat_interest") {
  const session = text(body.sessionId, 80) || "unknown";
  if (!seenRecently(`chat:${session}`, 24)) {
    alert = {
      subject: `Demo: chat visitor showed interest${body.demo ? ` · ${text(body.demo, 40)}` : ""}`,
      message: [
        "A visitor asked Anna something that sounds like real interest.",
        "",
        demoLine(body.demo),
        "",
        `Visitor: ${text(body.message, 1500)}`,
        "",
        `Anna: ${text(body.reply, 1500)}`,
        "",
        `(Visit code ${session}. One alert per visit; the full chat is in the "Anna - demo website chat" executions.)`,
      ].join("\n"),
    };
  }
}

if (!alert) return [];

if (store.capDay !== today) {
  store.capDay = today;
  store.capCount = 0;
}
if (store.capCount >= DAILY_EMAIL_CAP) return [];
store.capCount += 1;

return [{ json: alert }];

import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { siteDemo } from "@/config/site-demo";

export const metadata: Metadata = {
  title: "Privacy · Live demo by Synq Logic",
  description: "What this demo website does with your messages, voice and visit, in plain English.",
};

const LAST_UPDATED = "October 4, 2026";

const linkClass = "underline decoration-foreground/30 underline-offset-4 transition-colors hover:decoration-foreground";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-t pt-8">
      <h2 className="font-display text-[1.75rem] leading-tight">{title}</h2>
      <div className="mt-4 space-y-3 leading-relaxed text-muted-foreground">{children}</div>
    </section>
  );
}

export default function PrivacyPage() {
  const { email, aiLineDisplay, aiLineTel, siteUrl } = siteDemo.synq;
  const mail = <a href={`mailto:${email}`} className={linkClass}>{email}</a>;

  return (
    <main className="container-editorial max-w-3xl py-16 md:py-24">
      <Link href="/" className="inline-flex min-h-10 items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
        <ArrowLeft aria-hidden className="size-4" /> Back to the demo
      </Link>
      <p className="eyebrow mt-10">Privacy</p>
      <h1 className="font-display mt-4 text-5xl leading-[1.02] tracking-[-0.02em] md:text-6xl">
        Your privacy, <em className="text-brand">in plain English.</em>
      </h1>
      <p className="mt-5 text-sm text-muted-foreground">Last updated {LAST_UPDATED}</p>

      <div className="mt-12 space-y-10">
        <p className="text-lg leading-relaxed">
          This is a demo website made by{" "}
          <a href={siteUrl} target="_blank" rel="noopener noreferrer" className={linkClass}>
            Synq Logic
          </a>{" "}
          to show business owners what we build. This page explains what happens to your information when you try it.
        </p>

        <Section title="Booking and quotes">
          <p>
            The demo booking and free-quote forms are simulations. What you pick stays in your browser: nothing is
            saved or sent, no appointment is made, and we never ask for your name, email or phone number there.
          </p>
        </Section>

        <Section title="Chatting with Anna">
          <p>
            Anna is an AI assistant. When you send her a message, it travels to our automation platform and to the AI
            providers that write her replies (Anthropic, with Google as a backup). A random visit code, created fresh
            on each visit, lets her remember the conversation while you&apos;re here.
          </p>
          <p>
            Messages are kept in our system logs so we can check how Anna is doing and improve her. When a message
            asks about working with us, our team gets a copy by email so we can follow up properly. Please don&apos;t
            share personal or sensitive details in the chat.
          </p>
        </Section>

        <Section title="Talking with Anna by voice">
          <p>
            Voice calls run in your browser and only start when you press the button and allow your microphone. They
            last up to 3 minutes. Our voice platform and its AI providers turn your speech into text and Anna&apos;s
            replies into speech.
          </p>
          <p>
            Calls may be recorded and transcribed so we can review and improve Anna; she says so at the start of every
            call. Our team receives a short summary and the transcript by email. If you&apos;d rather not be recorded,
            use the chat or email us instead.
          </p>
        </Section>

        <Section title="Colors and personal links">
          <p>
            If you use &ldquo;Try your colors&rdquo;, the city and color you choose are shown on the page and added to
            the page link so you can share it. We don&apos;t store them anywhere else.
          </p>
          <p>
            If we sent you a personal link to this demo, our team gets a short email when it&apos;s opened, so we know
            it reached you. Nothing else about your visit is recorded.
          </p>
        </Section>

        <Section title="Booking a consultation">
          <p>
            The &ldquo;Book free consultation&rdquo; buttons take you to Calendly, our scheduling service. If you book
            a call there, we receive the details you enter so our team can meet you.
          </p>
        </Section>

        <Section title="Analytics, cookies and your browser">
          <p>
            This site doesn&apos;t use advertising or tracking cookies. Our host, Vercel, gives us anonymous visit
            counts that don&apos;t identify you, and keeps standard technical logs (such as IP address and browser
            type) for security.
          </p>
          <p>
            Your browser remembers two small things on your own device: whether you chose dark mode, and whether you
            closed Anna&apos;s invitation during this visit.
          </p>
        </Section>

        <Section title="Who sees your information">
          <p>
            Only the Synq Logic team and the services that run this demo for us, as described above. We don&apos;t sell
            your information and we don&apos;t use it for ads.
          </p>
        </Section>

        <Section title="Your choices">
          <p>
            You can ask us what we hold about you, or ask us to delete your chat messages or call recordings, by
            emailing {mail}. We keep chat logs and recordings only as long as we need them to improve the demo.
          </p>
        </Section>

        <Section title="Questions">
          <p>
            Email {mail} or call{" "}
            <a href={aiLineTel} className={linkClass}>
              {aiLineDisplay}
            </a>
            . If this page changes, we&apos;ll update the date at the top.
          </p>
        </Section>
      </div>

      <Link href="/" className="mt-16 inline-flex min-h-10 items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
        <ArrowLeft aria-hidden className="size-4" /> Back to the demo
      </Link>
    </main>
  );
}

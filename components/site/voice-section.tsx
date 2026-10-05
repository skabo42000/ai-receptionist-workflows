"use client";

import { CalendarSearch, MessageCircleQuestion, NotebookPen } from "lucide-react";
import { useVoice } from "@/components/voice/voice-provider";
import { PreviewNote, VoiceControls, VoiceNotice, VoiceOrb, VoiceTranscript, voiceStatusText } from "@/components/voice/voice-orb";
import phoneCallPhoto from "@/assets/photos/phone-call.jpg";
import { LiveDot } from "./actions";
import { EditorialPhoto } from "./editorial-photo";
import { Reveal } from "./reveal";
import { Accent, SectionHeading } from "./section-heading";

const ABILITIES = [
  { icon: MessageCircleQuestion, text: "Answers questions about services and opening hours" },
  { icon: CalendarSearch, text: "Checks availability and books your visit" },
  { icon: NotebookPen, text: "Takes a message when you'd rather speak to the team" },
];

export function VoiceSection() {
  const { status, speaking, panelOpen, panelTab } = useVoice();
  // When the floating window's voice tab is open it owns the call, so the big orb stays calm.
  const owned = !(panelOpen && panelTab === "voice");

  return (
    <section id="receptionist" className="receptionist-stage relative isolate overflow-hidden py-16 sm:py-24">
      <div aria-hidden className="pointer-events-none absolute -right-36 bottom-0 size-[600px] rounded-full border border-brand/10" />
      <div aria-hidden className="pointer-events-none absolute -right-20 bottom-16 size-[470px] rounded-full border border-brand/10" />
      <div className="container-editorial relative grid gap-9 lg:grid-cols-12 lg:items-center lg:gap-x-16 lg:gap-y-8">
        <div className="lg:col-span-5 lg:col-start-1 lg:row-start-1">
          <SectionHeading
            number="04"
            label="Always answered"
            title={
              <>
                A receptionist that <Accent>never sleeps.</Accent>
              </>
            }
            intro="A question answered. A visit arranged. A warm welcome, even after hours. Try the conversation right here."
          />
        </div>

        <Reveal delay={0.1} className="lg:col-span-6 lg:col-start-7 lg:row-span-2 lg:row-start-1">
          <div className="relative mx-auto max-w-lg border border-brand/20 bg-card/80 px-5 py-6 shadow-[0_30px_80px_-40px_rgb(0_0_0/0.65)] sm:px-8 sm:py-8">
            <div className="flex items-center justify-between gap-4 border-b pb-5 text-left">
              <div className="min-w-0">
                <p className="eyebrow text-[0.6rem] text-brand">A voice for your business</p>
                <p className="font-display mt-2 truncate text-2xl">Anna</p>
                <p className="mt-1 text-xs text-muted-foreground">AI receptionist · Synq Logic</p>
              </div>
              <span className="inline-flex shrink-0 items-center gap-2 rounded-full border border-brand/25 px-3 py-1.5 text-xs text-muted-foreground">
                <LiveDot />
                Online now
              </span>
            </div>
            <div className="flex flex-col items-center pt-5 text-center sm:pt-6">
              <VoiceOrb className="w-[min(160px,42vw)] sm:w-[180px]" />
              <p className="font-display mt-2 text-[1.7rem]">{owned ? voiceStatusText(status, speaking) : "Talking in the corner panel"}</p>
              <VoiceControls source="section" className="mt-5 w-full sm:w-auto" />
              <PreviewNote className="mt-3 max-w-xs text-center" />
              <VoiceNotice className="mt-3 max-w-sm text-center" />
              <VoiceTranscript className="mt-6 min-h-[5rem] w-full border-t pt-5" max={3} />
              <p className="mt-4 max-w-xs text-[0.65rem] leading-relaxed text-muted-foreground">
                Calls are answered by an AI assistant and may be recorded to improve service.
              </p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.15} className="lg:col-span-5 lg:col-start-1 lg:row-start-2">
            {/* Shown whole, with nothing on top: a medium crop from her hair to her coat. */}
            <EditorialPhoto
              src={phoneCallPhoto}
              alt="A smiling woman talking on her phone"
              sizes="(min-width: 1024px) 28rem, 90vw"
              imgClassName="object-[50%_15%]"
              className="mb-8 aspect-[5/4] w-full"
            />
            <ul className="space-y-4">
              {ABILITIES.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-4 border-b pb-4 text-sm leading-relaxed">
                  <Icon aria-hidden className="size-5 shrink-0 text-brand" strokeWidth={1.4} />
                  {text}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-xs leading-relaxed text-muted-foreground">For your business, the same receptionist can answer your phone line too.</p>
        </Reveal>
      </div>
    </section>
  );
}

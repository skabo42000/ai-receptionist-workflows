import { Mail, Phone } from "lucide-react";
import { siteDemo } from "@/config/site-demo";
import { cn } from "@/lib/utils";

/** Synq Logic's direct contact details: email and phone, as real links. */
export function SynqContact({ className, linkClassName }: { className?: string; linkClassName?: string }) {
  const link = cn("inline-flex min-h-9 items-center gap-2 transition-colors", linkClassName);
  return (
    <div className={cn("flex flex-col gap-2 text-sm", className)}>
      <a href={`mailto:${siteDemo.synq.email}`} className={link}>
        <Mail aria-hidden className="size-4 shrink-0" strokeWidth={1.5} />
        <span>
          Email us: <span className="whitespace-nowrap underline underline-offset-4">{siteDemo.synq.email}</span>
        </span>
      </a>
      <a href={siteDemo.synq.aiLineTel} className={link}>
        <Phone aria-hidden className="size-4 shrink-0" strokeWidth={1.5} />
        <span>
          Call us: <span className="whitespace-nowrap underline underline-offset-4">{siteDemo.synq.aiLineDisplay}</span>
        </span>
      </a>
    </div>
  );
}

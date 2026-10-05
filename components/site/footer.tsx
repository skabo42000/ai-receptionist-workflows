import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { siteDemo } from "@/config/site-demo";
import { synqSiteUrl } from "@/lib/consultation";
import { groupHours } from "@/lib/format";
import { BrandCity, BrandName, Monogram } from "./brand-text";
import { pillPrimary } from "./styles";
import { SynqContact } from "./synq-contact";

/** Unsplash photos used on the page (free license; credit is a courtesy). */
const PHOTO_CREDITS = [
  { id: "ZhoSk8W4lt8", by: "Imani Bahati" },
  { id: "rs0zS97YkHk", by: "Alessia Marusova" },
  { id: "DSc8JFhUg3M", by: "David Villasana" },
];

export function Footer() {
  const hours = groupHours(siteDemo.hours);
  return (
    <footer className="border-t pt-16 pb-28 md:pb-16">
      <div className="container-editorial">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <div className="flex items-center gap-3">
              <Monogram />
              <p className="font-display text-2xl">
                <BrandName />
              </p>
            </div>
            <p className="mt-5 max-w-sm leading-relaxed text-muted-foreground">{siteDemo.business.tagline}</p>
          </div>
          <div className="md:col-span-3 md:col-start-6">
            <p className="eyebrow">Visit</p>
            <p className="mt-4 text-sm leading-relaxed">
              {siteDemo.business.address}
              <br />
              <BrandCity />
            </p>
            <p className="mt-3 text-sm tracking-wider text-muted-foreground">
              <span aria-hidden>{siteDemo.business.phoneDisplay}</span>
              <span className="sr-only">Phone number hidden in this demo</span>
            </p>
          </div>
          <div className="md:col-span-4">
            <p className="eyebrow">Hours</p>
            <ul className="mt-4 space-y-1.5 text-sm">
              {hours.map((row) => (
                <li key={row.days} className="flex justify-between gap-4">
                  <span className="text-muted-foreground">{row.days}</span>
                  <span className="whitespace-nowrap">{row.value}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-14 flex flex-col gap-6 border-t pt-10 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl">
            <p className="eyebrow">The team behind this demo</p>
            <p className="font-display mt-3 text-3xl leading-tight sm:text-4xl">
              Liked what you saw? <em className="text-brand italic">There&apos;s more where this came from.</em>
            </p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              See how Synq Logic helps local businesses get found on Google, answer every call and turn more visitors into
              customers.
            </p>
          </div>
          <a
            href={synqSiteUrl("footer_visit")}
            target="_blank"
            rel="noopener noreferrer"
            className={`${pillPrimary} shrink-0`}
          >
            Visit synqlogic.com <ArrowUpRight aria-hidden className="size-4" />
          </a>
        </div>
        <div className="mt-10 flex flex-col gap-4 rounded-[var(--radius)] border bg-card/60 p-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p className="text-sm">
            <span className="font-medium">Questions about this demo, or a website like it?</span>{" "}
            <span className="text-muted-foreground">Talk to the Synq Logic team.</span>
          </p>
          <SynqContact className="shrink-0 sm:flex-row sm:gap-6" linkClassName="text-foreground/80 hover:text-foreground" />
        </div>
        <div className="mt-8 flex flex-col gap-3 border-t pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            Demo website by{" "}
            <a href={siteDemo.synq.siteUrl} target="_blank" rel="noopener noreferrer" className="text-foreground underline underline-offset-4">
              Synq Logic
            </a>
            . Names, services and reviews are sample content. Photos:{" "}
            {PHOTO_CREDITS.map((credit, index) => (
              <span key={credit.id}>
                <a href={`https://unsplash.com/photos/${credit.id}`} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">
                  {credit.by}
                </a>
                {index < PHOTO_CREDITS.length - 2 ? ", " : index === PHOTO_CREDITS.length - 2 ? " and " : " on Unsplash."}
              </span>
            ))}
          </p>
          <p className="flex shrink-0 items-center gap-4">
            <Link href="/privacy" className="underline underline-offset-4 hover:text-foreground">
              Privacy
            </Link>
            <span>© {new Date().getFullYear()} Synq Logic</span>
          </p>
        </div>
      </div>
    </footer>
  );
}

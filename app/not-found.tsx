import Link from "next/link";
import { pillPrimary } from "@/components/site/styles";

export default function NotFound() {
  return (
    <main className="container-editorial flex min-h-dvh flex-col items-start justify-center py-24">
      <p className="eyebrow flex items-center gap-3">
        <span className="font-display text-sm tracking-normal text-brand normal-case italic">N° 404</span>
        <span aria-hidden className="h-px w-8 bg-border" />
        Page not found
      </p>
      <h1 className="font-display mt-6 text-5xl leading-[1.02] tracking-[-0.02em] md:text-7xl">
        This page took <em className="text-brand">the day off.</em>
      </h1>
      <p className="mt-6 max-w-md leading-relaxed text-muted-foreground">
        The link may be old or mistyped. Everything in the demo is one click away.
      </p>
      <Link href="/" className={`${pillPrimary} mt-10`}>
        Back to the demo
      </Link>
    </main>
  );
}

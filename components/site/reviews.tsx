import { Star } from "lucide-react";
import { siteDemo } from "@/config/site-demo";
import { Reveal } from "./reveal";
import { SectionHeading } from "./section-heading";

function ReviewStars() {
  return (
    <span role="img" aria-label="5 out of 5 stars" className="flex gap-1 text-brand">
      {Array.from({ length: 5 }, (_, index) => <Star key={index} aria-hidden className="size-3 fill-current" strokeWidth={0} />)}
    </span>
  );
}

function ReviewCaption({ detail }: { detail: string }) {
  return (
    <figcaption className="mt-6 flex flex-wrap items-center gap-3 text-[0.62rem] tracking-[0.16em] text-muted-foreground uppercase">
      <span>{detail}</span>
      <span aria-hidden className="h-px w-5 bg-border" />
      <span>Sample review</span>
    </figcaption>
  );
}

export function Reviews() {
  const [featured, ...supporting] = siteDemo.sampleReviews;

  return (
    <section id="reviews" className="bg-card/60 py-20 sm:py-24">
      <div className="container-editorial">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            number="07"
            label="Kind words"
            title="In their own words."
          />
          <p className="max-w-xs text-sm text-muted-foreground lg:pb-3 lg:text-right">
            Sample reviews. On your website, your real Google reviews appear here.
          </p>
        </div>

        <div className="mt-10 grid gap-10 border-t pt-10 sm:mt-12 sm:pt-12 lg:grid-cols-12 lg:gap-16">
          {featured && (
            <Reveal className="lg:col-span-7">
              <figure>
                <ReviewStars />
                <blockquote className="font-display relative mt-6 text-[2.05rem] leading-[1.16] sm:text-[2.8rem]">
                  <span aria-hidden className="mb-1 block text-6xl leading-[0.6] text-brand sm:text-7xl">“</span>
                  {featured.quote}
                </blockquote>
                <ReviewCaption detail={featured.detail} />
              </figure>
            </Reveal>
          )}
          <div className="grid gap-8 border-t pt-8 sm:grid-cols-2 lg:col-span-5 lg:grid-cols-1 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-10">
            {supporting.map((review, index) => (
              <Reveal key={review.quote} delay={index * 0.1}>
                <figure>
                  <ReviewStars />
                  <blockquote className="font-display mt-4 text-[1.5rem] leading-snug">“{review.quote}”</blockquote>
                  <ReviewCaption detail={review.detail} />
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

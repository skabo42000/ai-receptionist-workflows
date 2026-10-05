import { ArrowRight } from "lucide-react";
import { siteDemo } from "@/config/site-demo";
import { formatDuration } from "@/lib/format";
import { AskQuoteButton, BookButton, DemoTag } from "./actions";
import { textLink } from "./styles";
import { Reveal } from "./reveal";
import { SectionHeading } from "./section-heading";

export function Services() {
  return (
    <section id="services" className="border-t py-16 sm:py-24">
      <div className="container-editorial">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            number="02"
            label="Services"
            title="Service, with care."
            intro="A few ways we can help. Choose a service to try booking. Each can be tailored to your business."
          />
          <p className="eyebrow shrink-0 lg:pb-3">Sample services</p>
        </div>

        {/* 1px gaps over a hairline-colored background draw the grid lines at every breakpoint. */}
        <ul className="mt-10 grid gap-px border-y bg-border sm:mt-12 sm:grid-cols-2 lg:grid-cols-3">
          {siteDemo.services.map((service, index) => (
            <li key={service.id} className="bg-background">
              <Reveal delay={(index % 3) * 0.08} className="h-full">
                <article className="group flex h-full flex-col p-6 transition-colors duration-500 hover:bg-card sm:p-8">
                  <span className="font-display text-lg text-brand italic">{String(index + 1).padStart(2, "0")}</span>
                  <h3 className="font-display mt-5 text-[1.8rem] leading-none transition-transform duration-500 group-hover:-translate-y-0.5 sm:mt-7 sm:text-[2rem]">
                    {service.name}
                  </h3>
                  <p className="mt-4 text-[0.95rem] leading-relaxed text-muted-foreground">{service.description}</p>
                  <div className="mt-auto flex items-end justify-between gap-4 pt-7 sm:pt-9">
                    <p className="text-xs tracking-[0.12em] text-muted-foreground uppercase">{formatDuration(service.durationMinutes)}</p>
                    {service.durationMinutes === null ? (
                      <AskQuoteButton serviceId={service.id} className={textLink}>
                        Ask about it <DemoTag />
                        <ArrowRight aria-hidden className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                      </AskQuoteButton>
                    ) : (
                      <BookButton serviceId={service.id} source="service_card" className={textLink}>
                        Book this <DemoTag />
                        <ArrowRight aria-hidden className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                      </BookButton>
                    )}
                  </div>
                </article>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

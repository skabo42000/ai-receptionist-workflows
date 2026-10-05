import { Plus } from "lucide-react";
import { siteDemo } from "@/config/site-demo";
import { Reveal } from "./reveal";
import { SectionHeading } from "./section-heading";

export function Faq() {
  return (
    <section id="faq" className="border-t py-16 sm:py-24">
      <div className="container-editorial grid gap-14 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <SectionHeading
            number="08"
            label="Questions"
            title="Good to know."
          />
        </div>
        <Reveal className="lg:col-span-7 lg:col-start-6">
          <div className="border-t">
            {siteDemo.faqs.map((item) => (
              <details key={item.q} className="group border-b">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 text-left [&::-webkit-details-marker]:hidden">
                  <span className="font-display text-2xl leading-snug">{item.q}</span>
                  <Plus
                    aria-hidden
                    className="size-5 shrink-0 text-brand transition-transform duration-500 group-open:rotate-45"
                    strokeWidth={1.4}
                  />
                </summary>
                <p className="max-w-2xl pb-7 leading-relaxed text-muted-foreground">{item.a}</p>
              </details>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

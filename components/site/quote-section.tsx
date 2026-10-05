import { QuoteFlow } from "@/components/quote/quote-flow";
import coffeePhoto from "@/assets/photos/coffee-planner.jpg";
import { EditorialPhoto } from "./editorial-photo";
import { Reveal } from "./reveal";
import { SectionHeading } from "./section-heading";

const PROMISES = ["Three quick questions", "A personal, no-obligation quote", "No calls unless you want one"];

export function QuoteSection() {
  return (
    <section id="quote" className="bg-card/60 py-16 sm:py-24">
      <div className="container-editorial grid gap-14 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <SectionHeading
            number="05"
            label="Free quote"
            title="Your plans, a personal quote."
            intro="Tell us what you have in mind. Our team will reply with a personal, no-obligation quote."
          />
          <Reveal delay={0.1}>
            <ul className="mt-8 space-y-4">
              {PROMISES.map((text, index) => (
                <li key={text} className="flex items-baseline gap-4 border-b pb-4">
                  <span className="font-display text-brand italic">0{index + 1}</span>
                  {text}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.15} className="mt-9">
            <EditorialPhoto
              src={coffeePhoto}
              alt="A cup of coffee next to an open planner on a wooden table"
              sizes="(min-width: 1024px) 30rem, 90vw"
              imgClassName="object-[50%_62%]"
              className="aspect-[8/5] w-full"
            />
          </Reveal>
        </div>
        <Reveal delay={0.12} className="lg:col-span-7">
          <QuoteFlow />
        </Reveal>
      </div>
    </section>
  );
}

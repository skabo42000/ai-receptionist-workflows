import { AutomationPreview } from "@/components/automation/automation-preview";
import { Reveal } from "./reveal";

const STEPS = [
  { title: "Choose", text: "A service you need. A time that suits you." },
  { title: "Book", text: "All the details, confirmed in one place." },
  { title: "Relax", text: "A reminder before your visit. We take it from there." },
];

export function Experience() {
  return (
    <section id="experience" className="border-y bg-card/60 py-12 sm:py-16">
      <div className="container-editorial">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-start lg:gap-12">
          <Reveal className="lg:col-span-3">
            <p className="eyebrow"><span className="font-display mr-3 text-brand normal-case italic">N° 03</span> The experience</p>
            <h2 className="font-display mt-4 text-3xl leading-tight sm:text-4xl">A little less to do.</h2>
          </Reveal>
          <ol className="grid gap-6 sm:grid-cols-3 sm:gap-8 lg:col-span-9">
            {STEPS.map((step, index) => (
              <li key={step.title}>
                <Reveal delay={index * 0.1} className="flex gap-4 sm:block">
                  <span className="font-display pt-1 text-sm text-brand italic">0{index + 1}</span>
                  <div>
                    <h3 className="font-display text-2xl sm:mt-3">{step.title}</h3>
                    <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">{step.text}</p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
        <AutomationPreview />
      </div>
    </section>
  );
}

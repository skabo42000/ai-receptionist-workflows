import { Globe, MapPin } from "lucide-react";
import { siteDemo } from "@/config/site-demo";
import { groupHours } from "@/lib/format";
import flowersPhoto from "@/assets/photos/flowers-vase.jpg";
import { BrandCity, BrandName } from "./brand-text";
import { EditorialPhoto } from "./editorial-photo";
import { Reveal } from "./reveal";
import { SectionHeading } from "./section-heading";

export function About() {
  const hours = groupHours(siteDemo.hours);

  return (
    <section id="about" className="border-t py-16 sm:py-24">
      <div className="container-editorial grid gap-16 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <SectionHeading
            number="06"
            label="About"
            title="Small details. Personal attention."
          />
          <Reveal delay={0.1} className="mt-9 lg:mt-12">
            <EditorialPhoto
              src={flowersPhoto}
              alt="White flowers in a glass vase in soft, striped window light"
              sizes="(min-width: 1024px) 26rem, 85vw"
              imgClassName="object-[50%_80%]"
              frame
              className="aspect-[4/5] w-[85%] max-w-sm sm:w-full"
            />
          </Reveal>
        </div>

        <div className="lg:col-span-5 lg:col-start-8">
          <Reveal>
            <p className="font-display text-2xl leading-snug">
              <BrandName /> was built on a simple idea: great service should be easy to book and a pleasure to receive.
            </p>
            <p className="mt-5 leading-relaxed text-muted-foreground">
              We keep our schedule organized, our communication clear and our attention on you. Book whenever it suits you,
              get a reminder before every visit, and reach us at any hour.
            </p>
          </Reveal>

          <Reveal delay={0.1} className="mt-12 grid gap-10">
            <div>
              <p className="eyebrow">Opening hours</p>
              <dl className="mt-4 space-y-2.5 text-sm">
                {hours.map((row) => (
                  <div key={row.days} className="flex justify-between gap-4 border-b pb-2.5">
                    <dt className="text-muted-foreground">{row.days}</dt>
                    <dd className="whitespace-nowrap">{row.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div>
              <p className="eyebrow">Where we work</p>
              <ul className="mt-4 space-y-2.5 text-sm">
                <li className="flex items-center gap-3 border-b pb-2.5">
                  <MapPin aria-hidden className="size-4 shrink-0 text-brand" strokeWidth={1.5} />
                  <span>
                    In person in <BrandCity /> and nearby
                  </span>
                </li>
                <li className="flex items-center gap-3 border-b pb-2.5">
                  <Globe aria-hidden className="size-4 shrink-0 text-brand" strokeWidth={1.5} />
                  Remote and online, wherever you are
                </li>
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

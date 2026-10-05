import { cn } from "@/lib/utils";
import { Reveal } from "./reveal";

/** "N° 02 — Services" label followed by a large serif title. */
export function SectionHeading({
  number,
  label,
  title,
  intro,
  className,
  align = "left",
}: {
  number: string;
  label: string;
  title: React.ReactNode;
  intro?: React.ReactNode;
  className?: string;
  align?: "left" | "center";
}) {
  return (
    <Reveal className={cn("max-w-3xl", align === "center" && "mx-auto text-center", className)}>
      <p className={cn("eyebrow flex items-center gap-3", align === "center" && "justify-center")}>
        <span className="font-display text-sm tracking-normal text-brand normal-case italic">N° {number}</span>
        <span aria-hidden className="h-px w-8 bg-border" />
        {label}
      </p>
      <h2 className="font-display mt-5 text-[2.35rem] leading-[1.06] text-balance sm:text-5xl lg:text-[3.35rem]">{title}</h2>
      {intro && <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">{intro}</p>}
    </Reveal>
  );
}

export function Accent({ children }: { children: React.ReactNode }) {
  return <em className="pr-[0.04em] text-brand italic">{children}</em>;
}

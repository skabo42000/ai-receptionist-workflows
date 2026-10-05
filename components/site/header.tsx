"use client";

import { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { BrandName, Monogram } from "./brand-text";
import { BookButton, ConsultationButton, CustomizeButton, DemoTag, TalkButton } from "./actions";
import { pillOutline } from "./styles";
import { ThemeToggle } from "./theme-toggle";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "#services", label: "Services" },
  { href: "#about", label: "About" },
  { href: "#reviews", label: "Reviews" },
  { href: "#quote", label: "Quote" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b transition-[background-color,border-color,backdrop-filter] duration-500",
        scrolled ? "border-border bg-background/85 backdrop-blur-md" : "border-transparent bg-background/0",
      )}
    >
      <div className="container-editorial flex h-[4.5rem] items-center justify-between gap-3 sm:gap-6">
        <a href="#top" className="flex min-w-0 items-center gap-3 rounded-full focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none">
          <Monogram className="max-sm:size-9 max-sm:text-base" />
          <span className="font-display truncate text-lg leading-none sm:text-[1.4rem]">
            <BrandName />
          </span>
        </a>

        <nav aria-label="Main" className="hidden items-center gap-9 xl:flex">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-[0.8rem] tracking-[0.08em] text-foreground/70 uppercase transition-colors hover:text-foreground"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <ThemeToggle className="hidden sm:inline-flex" />
          <TalkButton source="header" className={cn(pillOutline, "hidden h-10 px-4 text-[0.8rem] 2xl:inline-flex")}>
            Live AI call <DemoTag />
          </TalkButton>
          <BookButton source="header" className={cn(pillOutline, "hidden h-10 px-4 text-[0.8rem] md:inline-flex")}>
            Book <DemoTag />
          </BookButton>
          {/* The real call to action: always visible, on every screen size. */}
          <ConsultationButton source="header" />

          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger
              aria-label="Open menu"
              className="inline-flex size-10 items-center justify-center rounded-full transition-colors hover:bg-foreground/[0.05] focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none xl:hidden"
            >
              <Menu className="size-5" strokeWidth={1.5} />
            </SheetTrigger>
            <SheetContent side="right" className="w-[86%] gap-0 bg-background p-0 sm:max-w-sm">
              <div className="flex items-center gap-3 border-b px-6 py-5">
                <Monogram className="size-9 text-base" />
                <div className="min-w-0">
                  <SheetTitle className="font-display truncate text-xl font-normal">
                    <BrandName />
                  </SheetTitle>
                  <SheetDescription className="text-xs">Live demo by Synq Logic</SheetDescription>
                </div>
              </div>
              <nav aria-label="Mobile" className="flex flex-col px-6 py-4">
                {NAV.map((item, index) => (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className="font-display flex items-baseline gap-4 border-b py-4 text-3xl"
                  >
                    <span className="text-sm text-brand italic">0{index + 1}</span>
                    {item.label}
                  </a>
                ))}
              </nav>
              <div className="mt-auto flex flex-col gap-3 px-6 pt-4 pb-8">
                <div className="flex flex-col gap-3" onClick={() => setMenuOpen(false)}>
                  <ConsultationButton source="menu" compact={false} className="h-12 w-full text-sm" />
                  <BookButton source="menu" className={cn(pillOutline, "w-full")} />
                  <TalkButton source="menu" className={cn(pillOutline, "w-full")}>
                    Talk to our AI receptionist <DemoTag />
                  </TalkButton>
                  <CustomizeButton className="mt-2 text-sm text-muted-foreground underline underline-offset-4">
                    Try your colors
                  </CustomizeButton>
                </div>
                <div className="mt-2 flex items-center justify-between border-t pt-4 text-sm text-muted-foreground">
                  Light / dark
                  <ThemeToggle />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

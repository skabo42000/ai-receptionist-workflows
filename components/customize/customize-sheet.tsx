"use client";

import { useState } from "react";
import { ArrowUpRight, Check, Link2, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { siteDemo } from "@/config/site-demo";
import { DEFAULT_PALETTE_ID, PALETTES } from "@/config/palettes";
import { useDemo } from "@/components/providers/demo-provider";
import { GetThisLink } from "@/components/site/actions";
import { pillPrimary } from "@/components/site/styles";
import { Field, inputEditorial } from "@/components/ui/field";
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";
import { trackEvent } from "@/lib/analytics";
import { MAX_CITY, cleanCity } from "@/lib/brand";
import { accentFromHex, resolveAccent } from "@/lib/color";
import { cn } from "@/lib/utils";

/** "Try your colors": a visitor picks an accent color and city, and the whole site re-dresses
 *  live. No business name (Bosko, 2026-10-04: it's just a demo). The URL updates too (see DemoProvider), so the result can be shared. */
export function CustomizeSheet() {
  const { brand, setBrand, customizerOpen, setCustomizerOpen } = useDemo();
  const [city, setCity] = useState(brand.city ?? "");

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied. Share it or keep it for later.");
      trackEvent("share_copy");
    } catch {
      toast.error("Couldn't copy automatically. Copy the address from your browser bar.");
    }
  }

  function reset() {
    setCity("");
    setBrand({ name: siteDemo.business.name, city: null, accent: resolveAccent(DEFAULT_PALETTE_ID) });
  }

  return (
    <Sheet open={customizerOpen} onOpenChange={setCustomizerOpen}>
      <SheetContent side="right" className="w-full gap-0 overflow-y-auto bg-background p-0 sm:max-w-md">
        <div className="border-b px-7 pt-8 pb-6">
          <p className="eyebrow">Live demo by Synq Logic</p>
          <SheetTitle className="font-display mt-3 text-4xl font-normal">Make it yours</SheetTitle>
          <SheetDescription className="mt-2 text-sm leading-relaxed">
            Pick your colors and your city. See the website change as you choose, then save the link to share it.
          </SheetDescription>
        </div>

        <div className="space-y-8 px-7 py-8">
          <Field id="customize-city" label="City" optional>
            <input
              id="customize-city"
              value={city}
              maxLength={MAX_CITY}
              placeholder={siteDemo.business.city}
              autoComplete="address-level2"
              onChange={(event) => {
                setCity(event.target.value);
                setBrand({ ...brand, city: cleanCity(event.target.value) });
              }}
              className={inputEditorial}
            />
          </Field>

          <fieldset>
            <legend className="eyebrow text-foreground/75">Accent color</legend>
            <div className="mt-4 grid grid-cols-4 gap-3">
              {PALETTES.map((palette) => {
                const selected = brand.accent.key === palette.id;
                return (
                  <button
                    key={palette.id}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => setBrand({ ...brand, accent: resolveAccent(palette.id) })}
                    className="group flex flex-col items-center gap-2 rounded-[var(--radius)] py-2 text-xs focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
                  >
                    <span
                      className={cn(
                        "flex size-11 items-center justify-center rounded-full ring-offset-2 ring-offset-background transition-shadow",
                        selected ? "ring-2 ring-foreground" : "group-hover:ring-1 group-hover:ring-foreground/40",
                      )}
                      style={{ background: `linear-gradient(135deg, ${palette.light} 50%, ${palette.dark} 50%)` }}
                    >
                      {selected && <Check aria-hidden className="size-4 text-white drop-shadow" strokeWidth={2.5} />}
                    </span>
                    {palette.name}
                  </button>
                );
              })}
              <label
                className={cn(
                  "group flex cursor-pointer flex-col items-center gap-2 rounded-[var(--radius)] py-2 text-xs focus-within:ring-3 focus-within:ring-ring/50",
                )}
              >
                <span
                  className={cn(
                    "relative flex size-11 items-center justify-center overflow-hidden rounded-full ring-offset-2 ring-offset-background",
                    brand.accent.key === "custom" ? "ring-2 ring-foreground" : "ring-1 ring-foreground/20",
                  )}
                  style={{
                    background:
                      brand.accent.key === "custom"
                        ? brand.accent.light
                        : "conic-gradient(#b85c5c, #c9a24f, #6f9a6b, #4f78a8, #8a5f9e, #b85c5c)",
                  }}
                >
                  <input
                    type="color"
                    aria-label="Pick any color"
                    value={brand.accent.hex}
                    onChange={(event) => {
                      const accent = accentFromHex(event.target.value);
                      if (accent) setBrand({ ...brand, accent });
                    }}
                    className="absolute inset-0 cursor-pointer opacity-0"
                  />
                </span>
                Custom
              </label>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">Custom colors are softened automatically so text stays easy to read.</p>
          </fieldset>

          <div className="flex flex-col gap-3 border-t pt-8">
            <button type="button" onClick={copyLink} className={cn(pillPrimary, "w-full")}>
              <Link2 aria-hidden className="size-4" /> Copy share link
            </button>
            <button
              type="button"
              onClick={reset}
              className="inline-flex items-center justify-center gap-2 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <RotateCcw aria-hidden className="size-3.5" /> Reset to the original
            </button>
          </div>

          <div className="rounded-[var(--radius)] bg-card p-5">
            <p className="font-display text-xl">Love how it looks?</p>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
              Book a free call and we&apos;ll build the real thing, with your services, your photos and your phone line.
            </p>
            <GetThisLink source="customizer" className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium underline underline-offset-4">
              Book a free strategy call <ArrowUpRight aria-hidden className="size-3.5" />
            </GetThisLink>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

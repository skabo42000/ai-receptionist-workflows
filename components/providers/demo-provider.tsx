"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { MotionConfig } from "motion/react";
import { type Brand, brandQuery } from "@/lib/brand";

type DemoContextValue = {
  brand: Brand;
  /** The /d/<slug> prospect link this visit came from (lead alerts only, never shown), or null. */
  prospect: string | null;
  setBrand: (brand: Brand) => void;
  booking: { open: boolean; serviceId: string | null };
  openBooking: (serviceId?: string | null) => void;
  setBookingOpen: (open: boolean) => void;
  customizerOpen: boolean;
  setCustomizerOpen: (open: boolean) => void;
  /** Service picked from a card's "Ask about it" button, consumed by the quote form. */
  quoteRequest: { serviceId: string; at: number } | null;
  requestQuote: (serviceId: string) => void;
};

const DemoContext = createContext<DemoContextValue | null>(null);

export function useDemo() {
  const value = useContext(DemoContext);
  if (!value) throw new Error("useDemo must be used inside <DemoProvider>");
  return value;
}

export function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "start" });
}

export function DemoProvider({
  initialBrand,
  prospect = null,
  children,
}: {
  initialBrand: Brand;
  prospect?: string | null;
  children: React.ReactNode;
}) {
  const [brand, setBrand] = useState(initialBrand);
  const [booking, setBooking] = useState<{ open: boolean; serviceId: string | null }>({ open: false, serviceId: null });
  const [customizerOpen, setCustomizerOpen] = useState(false);
  const [quoteRequest, setQuoteRequest] = useState<{ serviceId: string; at: number } | null>(null);

  // Keep the accent colors, the shareable URL and the tab title in sync with the brand.
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--brand-light", brand.accent.light);
    root.style.setProperty("--brand-dark", brand.accent.dark);
    document.title = `${brand.name} · Live demo by Synq Logic`;
    // Leave the address alone until the visitor changes something (keeps /d/ links clean).
    if (brand === initialBrand) return;
    const url = `${window.location.pathname}${brandQuery(brand)}${window.location.hash}`;
    if (url !== `${window.location.pathname}${window.location.search}${window.location.hash}`) {
      window.history.replaceState(window.history.state, "", url);
    }
  }, [brand, initialBrand]);

  const openBooking = useCallback((serviceId: string | null = null) => setBooking({ open: true, serviceId }), []);
  const setBookingOpen = useCallback((open: boolean) => setBooking((current) => ({ ...current, open })), []);
  const requestQuote = useCallback((serviceId: string) => {
    setQuoteRequest({ serviceId, at: Date.now() });
    scrollToId("quote");
  }, []);

  const value = useMemo(
    () => ({ brand, prospect, setBrand, booking, openBooking, setBookingOpen, customizerOpen, setCustomizerOpen, quoteRequest, requestQuote }),
    [brand, prospect, booking, openBooking, setBookingOpen, customizerOpen, quoteRequest, requestQuote],
  );

  return (
    <DemoContext.Provider value={value}>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </DemoContext.Provider>
  );
}

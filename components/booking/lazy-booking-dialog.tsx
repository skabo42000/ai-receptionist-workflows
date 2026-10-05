"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useDemo } from "@/components/providers/demo-provider";

const loadDialog = () => import("./booking-dialog");
const BookingDialog = dynamic(() => loadDialog().then((module) => module.BookingDialog), { ssr: false });

/**
 * The booking dialog (with its calendar library) stays out of the first page load. It's fetched
 * quietly once the page is idle, and rendered from the first time a visitor opens booking.
 */
export function LazyBookingDialog() {
  const { booking } = useDemo();
  const [needed, setNeeded] = useState(false);

  if (booking.open && !needed) setNeeded(true);

  useEffect(() => {
    const prefetch = () => void loadDialog();
    // Safari has no requestIdleCallback: fall back to a short delay.
    if (typeof window.requestIdleCallback === "function") {
      const id = window.requestIdleCallback(prefetch, { timeout: 6000 });
      return () => window.cancelIdleCallback(id);
    }
    const id = setTimeout(prefetch, 4000);
    return () => clearTimeout(id);
  }, []);

  return needed ? <BookingDialog /> : null;
}

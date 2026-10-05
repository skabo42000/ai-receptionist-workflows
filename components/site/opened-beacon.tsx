"use client";

import { useEffect } from "react";

const EVENTS = ["pointerdown", "keydown", "scroll", "touchstart"] as const;

/**
 * On a personal /d/ link: tells the team the prospect opened their demo. Waits for a first real
 * interaction so link previews and email security scanners (which load pages but never scroll or
 * tap) don't trigger it. Once per browser tab session. Add ?me=1 to the link to check it yourself
 * without sending an alert.
 */
export function OpenedBeacon({ slug }: { slug: string }) {
  useEffect(() => {
    const key = `synq-opened:${slug}`;
    try {
      if (new URLSearchParams(window.location.search).has("me") || sessionStorage.getItem(key)) return;
    } catch {
      // Storage blocked: still send; n8n deduplicates.
    }

    const send = () => {
      EVENTS.forEach((name) => window.removeEventListener(name, send));
      try {
        sessionStorage.setItem(key, "1");
      } catch {}
      void fetch("/api/opened", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug }),
        keepalive: true,
      }).catch(() => {});
    };
    EVENTS.forEach((name) => window.addEventListener(name, send, { once: true, passive: true }));
    return () => EVENTS.forEach((name) => window.removeEventListener(name, send));
  }, [slug]);

  return null;
}

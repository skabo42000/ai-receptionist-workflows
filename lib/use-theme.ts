"use client";

import { useSyncExternalStore } from "react";

/** Light (Ivory) is the default look; dark (Ink) is remembered once a visitor picks it.
 *  The inline script in app/layout.tsx applies the saved choice before the first paint. */
export const THEME_SCRIPT = `(function(){try{var d=localStorage.getItem("theme")==="dark";var r=document.documentElement;r.classList.toggle("dark",d);r.style.colorScheme=d?"dark":"light"}catch(e){}})()`;

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
  return () => observer.disconnect();
}

export function useIsDark() {
  return useSyncExternalStore(
    subscribe,
    () => document.documentElement.classList.contains("dark"),
    () => false,
  );
}

export function setDarkMode(dark: boolean) {
  const root = document.documentElement;
  root.classList.toggle("dark", dark);
  root.style.colorScheme = dark ? "dark" : "light";
  try {
    localStorage.setItem("theme", dark ? "dark" : "light");
  } catch {
    // Private mode or blocked storage: the choice just isn't remembered.
  }
}

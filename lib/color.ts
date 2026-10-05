import { DEFAULT_PALETTE_ID, PALETTES } from "@/config/palettes";

export type Accent = {
  /** Palette id, or "custom" for a visitor-picked color. */
  key: string;
  /** Hex used for the color picker's current value. */
  hex: string;
  light: string;
  dark: string;
};

const HEX = /^#?([0-9a-f]{6})$/i;

function srgbToLinear(channel: number) {
  return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
}

/** sRGB hex -> OKLCH (lightness 0-1, chroma, hue in degrees). */
export function hexToOklch(hex: string) {
  const value = HEX.exec(hex)?.[1];
  if (!value) return null;
  const [r, g, b] = [0, 2, 4].map((i) => srgbToLinear(parseInt(value.slice(i, i + 2), 16) / 255));
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
  const A = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const B = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
  const hue = (Math.atan2(B, A) * 180) / Math.PI;
  return { l: L, c: Math.hypot(A, B), h: hue < 0 ? hue + 360 : hue };
}

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const oklch = (l: number, c: number, h: number) => `oklch(${l.toFixed(3)} ${c.toFixed(3)} ${h.toFixed(1)})`;

/**
 * Turns any hex color into a light-mode and dark-mode accent that stay readable on ivory and
 * on ink: lightness is clamped into a safe band and chroma is capped to keep it refined.
 */
export function accentFromHex(hex: string): Accent | null {
  const color = hexToOklch(hex);
  if (!color) return null;
  const chroma = Math.min(color.c, 0.14);
  return {
    key: "custom",
    hex: `#${HEX.exec(hex)![1].toLowerCase()}`,
    light: oklch(clamp(color.l, 0.36, 0.54), chroma, color.h),
    dark: oklch(clamp(color.l + 0.3, 0.74, 0.84), Math.min(chroma, 0.1), color.h),
  };
}

export function accentFromPalette(id: string): Accent | null {
  const palette = PALETTES.find((item) => item.id === id);
  return palette ? { key: palette.id, hex: palette.light, light: palette.light, dark: palette.dark } : null;
}

/** Palette id or hex (with or without #). Anything else falls back to the default palette. */
export function resolveAccent(input: string | null | undefined, fallbackId: string = DEFAULT_PALETTE_ID): Accent {
  const value = (input ?? "").trim().toLowerCase();
  return (
    accentFromPalette(value) ??
    (HEX.test(value) ? accentFromHex(value) : null) ??
    accentFromPalette(fallbackId) ??
    accentFromPalette(DEFAULT_PALETTE_ID)!
  );
}

/** The value written to ?color=: palette id, or hex without the # for custom colors. */
export function accentParam(accent: Accent) {
  return accent.key === "custom" ? accent.hex.slice(1) : accent.key;
}

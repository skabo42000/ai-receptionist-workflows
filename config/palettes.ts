/**
 * Curated accent colors for "Make it yours". Each has a light-mode value (readable on ivory)
 * and a dark-mode value (readable on ink). Custom colors are adjusted in lib/color.ts.
 */
export const PALETTES = [
  { id: "bronze", name: "Bronze", light: "#866a42", dark: "#c2a57a" },
  { id: "sage", name: "Sage", light: "#5f7360", dark: "#9db39c" },
  { id: "navy", name: "Navy", light: "#2f4468", dark: "#93a7cc" },
  { id: "oxblood", name: "Oxblood", light: "#7a2e2e", dark: "#d29a93" },
  { id: "plum", name: "Plum", light: "#5e3a5c", dark: "#c49ac0" },
  { id: "forest", name: "Forest", light: "#2f5243", dark: "#8ebba6" },
] as const;

export type PaletteId = (typeof PALETTES)[number]["id"];

export const DEFAULT_PALETTE_ID: PaletteId = "bronze";

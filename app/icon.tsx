import { ImageResponse } from "next/og";
import { MonogramMark, loadSerifFonts } from "@/lib/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default async function Icon() {
  return new ImageResponse(<MonogramMark size={size.width} />, { ...size, fonts: await loadSerifFonts() });
}

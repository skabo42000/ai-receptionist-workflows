import { ImageResponse } from "next/og";
import { MonogramMark, OG_COLORS, loadSerifFonts } from "@/lib/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// iOS crops home-screen icons itself, so the mark sits on a full ivory square.
export default async function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", padding: 22, background: OG_COLORS.ivory }}>
        <MonogramMark size={136} />
      </div>
    ),
    { ...size, fonts: await loadSerifFonts() },
  );
}

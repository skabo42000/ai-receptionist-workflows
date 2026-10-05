import { ImageResponse } from "next/og";
import { MonogramMark, OG_COLORS, loadSerifFonts } from "@/lib/og";

export const alt = "Live demo by Synq Logic: online booking, free quotes and an AI receptionist";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const FEATURES = ["Online booking", "Free quotes", "AI receptionist"];

// The preview card shown when the demo link is shared (texts, email, LinkedIn).
export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 80px",
          background: OG_COLORS.ivory,
          color: OG_COLORS.ink,
          fontFamily: "Instrument Serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ display: "flex", width: 64, height: 64 }}>
            <MonogramMark size={64} />
          </div>
          <div style={{ display: "flex", fontSize: 22, letterSpacing: 5, color: OG_COLORS.muted, fontFamily: "sans-serif" }}>
            LIVE DEMO · SYNQ LOGIC
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", fontSize: 108, lineHeight: 0.98, letterSpacing: -2 }}>
          <div style={{ display: "flex" }}>Exceptional service,</div>
          <div style={{ display: "flex", fontStyle: "italic", color: OG_COLORS.bronze }}>effortlessly booked.</div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: `2px solid ${OG_COLORS.line}`,
            paddingTop: 28,
            fontFamily: "sans-serif",
            fontSize: 24,
            color: OG_COLORS.muted,
          }}
        >
          <div style={{ display: "flex", gap: 36 }}>
            {FEATURES.map((label) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 8, height: 8, borderRadius: 4, background: OG_COLORS.bronze }} />
                {label}
              </div>
            ))}
          </div>
          <div style={{ display: "flex", color: OG_COLORS.ink }}>Try it yourself →</div>
        </div>
      </div>
    ),
    { ...size, fonts: await loadSerifFonts() },
  );
}

import { readFile } from "node:fs/promises";
import { join } from "node:path";

// Shared by the generated tab icons and the link-preview image (server only, build time).
export const OG_COLORS = { ivory: "#f7f3ec", paper: "#fbf8f3", ink: "#1a1714", muted: "#6b645b", line: "#e4ddd1", bronze: "#866a42" };

export async function loadSerifFonts() {
  const dir = join(process.cwd(), "assets/fonts");
  const [regular, italic] = await Promise.all([
    readFile(join(dir, "InstrumentSerif-Regular.ttf")),
    readFile(join(dir, "InstrumentSerif-Italic.ttf")),
  ]);
  return [
    { name: "Instrument Serif", data: regular, style: "normal" as const, weight: 400 as const },
    { name: "Instrument Serif", data: italic, style: "italic" as const, weight: 400 as const },
  ];
}

/** The serif "S" monogram in a double ring, matching the header logo style. */
export function MonogramMark({ size }: { size: number }) {
  const ring = Math.max(1, Math.round(size / 40));
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: OG_COLORS.ivory,
        borderRadius: "50%",
        border: `${ring * 2}px solid ${OG_COLORS.ink}`,
      }}
    >
      <div
        style={{
          width: "84%",
          height: "84%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "50%",
          border: `${ring}px solid ${OG_COLORS.bronze}`,
          fontFamily: "Instrument Serif",
          fontSize: size * 0.56,
          color: OG_COLORS.ink,
          lineHeight: 1,
          paddingBottom: size * 0.04,
        }}
      >
        S
      </div>
    </div>
  );
}

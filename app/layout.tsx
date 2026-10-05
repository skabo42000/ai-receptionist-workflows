import type { Metadata, Viewport } from "next";
import { Inter, Instrument_Serif } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { Toaster } from "@/components/ui/sonner";
import { THEME_SCRIPT } from "@/lib/use-theme";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument",
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
});

const DESCRIPTION =
  "A live demo website by Synq Logic: online booking, free quotes and an AI receptionist, all working together.";

export const metadata: Metadata = {
  // Absolute URLs for the share image; the future home of this demo.
  metadataBase: new URL("https://demo.synqlogic.com"),
  title: "Live demo by Synq Logic",
  description: DESCRIPTION,
  openGraph: {
    type: "website",
    siteName: "Synq Logic",
    title: "Live demo by Synq Logic",
    description: DESCRIPTION,
  },
  twitter: { card: "summary_large_image" },
  // A demo with sample content: keep every page out of search results.
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f3ec" },
    { media: "(prefers-color-scheme: dark)", color: "#12100e" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} ${instrumentSerif.variable}`} suppressHydrationWarning>
      <head>
        {/* Applies a saved dark-mode choice before the first paint (constant script, no visitor input). */}
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body className="grain min-h-dvh">
        {children}
        <Toaster position="bottom-center" />
        {process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === "true" && <Analytics />}
      </body>
    </html>
  );
}

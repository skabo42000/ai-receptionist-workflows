import type { NextConfig } from "next";

// Based on the synq-logic-website headers, with two deliberate differences:
// 1. microphone=(self): the in-browser AI receptionist needs the mic. The agency site's
//    microphone=() would silently block it.
// 2. X-Robots-Tag noindex: this is a demo with sample content and personalized names.
// 'unsafe-inline' on scripts is required because Next.js ships hydration data as inline
// <script> tags; the only other inline script is the constant theme script in app/layout.tsx.
// Vapi's browser calls run on Daily: the call bundle loads from c.daily.co and audio flows over
// *.daily.co. Daily's noise filter (Krisp) loads an audio worklet from a blob: URL and runs
// WebAssembly, so script-src needs blob: and 'wasm-unsafe-eval' (without them the call connects
// but Vapi never hears the caller). Verified with a real call on a production build (2026-10-04).
const CONTENT_SECURITY_POLICY = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval' blob: https://c.daily.co",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  "media-src 'self' blob:",
  "worker-src 'self' blob:",
  "connect-src 'self' https://api.vapi.ai https://*.daily.co wss://*.daily.co",
  "frame-ancestors 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
].join("; ");

const SECURITY_HEADERS = [
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(self), geolocation=(), browsing-topics=()" },
  { key: "X-Robots-Tag", value: "noindex, nofollow" },
  // The dev server needs eval for fast refresh, so the CSP only applies to production builds.
  ...(process.env.NODE_ENV === "production" ? [{ key: "Content-Security-Policy", value: CONTENT_SECURITY_POLICY }] : []),
];

const nextConfig: NextConfig = {
  // Don't announce the framework in every response.
  poweredByHeader: false,
  async headers() {
    return [
      { source: "/:path*", headers: SECURITY_HEADERS },
      { source: "/api/:path*", headers: [{ key: "Cache-Control", value: "no-store" }] },
    ];
  },
};

export default nextConfig;

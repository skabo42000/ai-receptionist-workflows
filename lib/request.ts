import type { NextRequest } from "next/server";

export function clientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}

/** Browsers always send Origin on a POST; refuse ones from other websites. */
export function fromOtherSite(request: NextRequest): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  try {
    return new URL(origin).host !== request.headers.get("host");
  } catch {
    return true;
  }
}

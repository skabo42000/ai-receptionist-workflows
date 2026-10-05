import type { Service } from "@/config/schema";

/**
 * Phase 1 stand-in for the AI quote: matches the visitor's own words to a configured service by
 * keywords, so the request reaches the team already sorted. Phase 2 swaps this for an n8n AI call.
 * It never produces prices: quotes are written by the business.
 */
export function matchService(text: string, services: Service[]): Service | null {
  const words = text.toLowerCase();
  let best: { service: Service; score: number } | null = null;
  for (const service of services) {
    const score = [service.name.toLowerCase(), ...service.keywords].filter((keyword) => words.includes(keyword)).length;
    if (score > 0 && (!best || score > best.score)) best = { service, score };
  }
  return best?.service ?? null;
}

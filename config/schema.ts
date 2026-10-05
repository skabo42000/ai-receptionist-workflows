import { z } from "zod";

const time = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Use 24h HH:MM");

export const serviceSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string().min(1).max(60),
  description: z.string().max(200),
  /** null = not a timed visit (e.g. a membership), so it can't be booked as a slot. */
  durationMinutes: z.number().int().positive().max(480).nullable(),
  // No prices on this site by decision (2026-10-03): quotes are requests the team answers.
  /** Words that help match a visitor's own description to this service. */
  keywords: z.array(z.string()),
});

export const siteConfigSchema = z.object({
  business: z.object({
    name: z.string().min(1).max(40),
    tagline: z.string().max(120),
    city: z.string().min(1).max(30),
    address: z.string().max(80),
    phoneDisplay: z.string().max(20),
  }),
  timezone: z.string(),
  /** A palette id from config/palettes.ts. */
  accent: z.string(),
  /** Index 0 = Sunday. null = closed. */
  hours: z.array(z.object({ open: time, close: time }).nullable()).length(7),
  services: z.array(serviceSchema).min(1).max(12),
  faqs: z.array(z.object({ q: z.string(), a: z.string() })),
  sampleReviews: z.array(z.object({ quote: z.string().max(240), detail: z.string().max(60) })),
  voice: z.object({
    /** Vapi assistant used by the voice orb. Set in Phase 3; never overridable from the URL. */
    assistantId: z.string().nullable(),
    maxCallSeconds: z.number().int().min(30).max(600),
  }),
  synq: z.object({
    bookingUrl: z.url(),
    siteUrl: z.url(),
    aiLineDisplay: z.string(),
    aiLineTel: z.string(),
    email: z.email(),
  }),
});

export type Service = z.infer<typeof serviceSchema>;
export type SiteConfig = z.infer<typeof siteConfigSchema>;

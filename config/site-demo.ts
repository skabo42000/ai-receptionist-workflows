import type { SiteConfig } from "./schema";

/**
 * The universal demo business. Everything a visitor sees comes from here (plus the cleaned
 * ?biz= / ?city= / ?color= values from the URL). Services, reviews and the phone number are
 * sample content and are labelled as such on the page. There are no prices anywhere by design.
 */
const config: SiteConfig = {
  business: {
    name: "Your Business",
    tagline: "Exceptional service, effortlessly booked.",
    city: "Naperville",
    address: "Your street address",
    // Masked on purpose: a demo shows where the number goes without showing a fake one.
    phoneDisplay: "(***) ***-****",
  },
  timezone: "America/Chicago",
  accent: "bronze",
  hours: [
    null,
    { open: "09:00", close: "18:00" },
    { open: "09:00", close: "18:00" },
    { open: "09:00", close: "18:00" },
    { open: "09:00", close: "19:00" },
    { open: "09:00", close: "18:00" },
    { open: "10:00", close: "16:00" },
  ],
  services: [
    {
      id: "consultation",
      name: "Consultation",
      description: "A relaxed first conversation to understand what you need and plan the best next step.",
      durationMinutes: 30,
      keywords: ["consult", "advice", "first", "talk", "meet", "question", "plan", "estimate", "assessment"],
    },
    {
      id: "signature",
      name: "Signature Service",
      description: "Our most-loved service, delivered with care from start to finish.",
      durationMinutes: 60,
      keywords: ["signature", "standard", "regular", "normal", "usual", "full", "complete", "service"],
    },
    {
      id: "premium",
      name: "Premium Experience",
      description: "Everything in the Signature Service, plus extra time and finishing touches.",
      durationMinutes: 90,
      keywords: ["premium", "deluxe", "luxury", "best", "extra", "special", "vip", "longer"],
    },
    {
      id: "express",
      name: "Express Service",
      description: "Quick, focused and done right, for when time is short.",
      durationMinutes: 30,
      keywords: ["quick", "fast", "express", "short", "small", "simple", "urgent", "today"],
    },
    {
      id: "follow-up",
      name: "Follow-up Visit",
      description: "Check in, fine-tune and keep results at their best.",
      durationMinutes: 45,
      keywords: ["follow", "again", "return", "repeat", "touch up", "maintenance", "check"],
    },
    {
      id: "membership",
      name: "Membership",
      description: "Priority booking, member perks and a standing monthly visit.",
      durationMinutes: null,
      keywords: ["member", "membership", "monthly", "subscription", "plan", "regular basis", "every month"],
    },
  ],
  faqs: [
    {
      q: "How do I book?",
      a: "Online in under a minute, by phone, or by talking to our receptionist right here on this page. It answers day and night.",
    },
    {
      q: "Can I change or cancel my appointment?",
      a: "Of course. Use the link in your confirmation email or just give us a call. We kindly ask for 24 hours' notice.",
    },
    {
      q: "Will I get a reminder?",
      a: "Yes. You'll get a confirmation right away and a friendly reminder before every visit.",
    },
    {
      q: "Is the receptionist a real person?",
      a: "It's an AI receptionist that can answer questions, check availability and book visits at any hour. Whenever you'd rather speak to someone from our team, it takes a message and we call you back.",
    },
    {
      q: "How do I get a quote?",
      a: "Use the free quote form on this page. Tell us what you need in a few words and we'll get back to you with a personal quote.",
    },
    {
      q: "Is my information safe?",
      a: "We only use your details to look after your appointment and keep you informed. We never sell them.",
    },
  ],
  sampleReviews: [
    {
      quote: "Booking took less than a minute, and the reminder the day before was a lifesaver.",
      detail: "Booked online",
    },
    {
      quote: "I called after hours expecting voicemail. Instead I got answers and an appointment on the spot.",
      detail: "Booked by phone",
    },
    {
      quote: "Everything felt personal and effortless, from the first message to the follow-up.",
      detail: "Returning client",
    },
  ],
  voice: {
    assistantId: null,
    maxCallSeconds: 180,
  },
  synq: {
    // Synq Logic's free strategy call: every agency button on the page (header, hero, the
    // demo reveal, closing band) links here. Same link as synqlogic.com; swap for Cal.com here.
    bookingUrl: "https://example.com/book",
    siteUrl: "https://synqlogic.com",
    // Synq Logic's phone line (answered by the Synq AI phone assistant) and team email.
    aiLineDisplay: "(630) 581-1550",
    aiLineTel: "tel:+16305811550",
    email: "team@synqlogic.com",
  },
};

// Typed here; checked against the zod schema on the server only (config/validate.ts), so the
// validation library never ships to visitors' browsers.
export const siteDemo = config;

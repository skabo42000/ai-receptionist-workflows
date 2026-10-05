import { siteDemo } from "@/config/site-demo";

/**
 * The free-consultation link with tracking tags. Calendly stores utm_* values on each booking,
 * so Bosko can see that a call came from the demo site and which button (`source`) was clicked.
 */
export function consultationUrl(source: string): string {
  return withTracking(siteDemo.synq.bookingUrl, source);
}

/** The main synqlogic.com website, tagged the same way so its analytics show visits from the demo. */
export function synqSiteUrl(source: string): string {
  return withTracking(siteDemo.synq.siteUrl, source);
}

function withTracking(href: string, source: string): string {
  const url = new URL(href);
  url.searchParams.set("utm_source", "demo.synqlogic.com");
  url.searchParams.set("utm_medium", "website");
  url.searchParams.set("utm_campaign", "demo-site");
  url.searchParams.set("utm_content", source);
  return url.toString();
}

/** Adds the tracking tags when a link (e.g. one Anna writes in chat) points at the booking page. */
export function tagConsultationLink(href: string, source: string): string {
  const base = siteDemo.synq.bookingUrl;
  return href === base || href.startsWith(`${base}?`) || href === `${base}/` ? consultationUrl(source) : href;
}

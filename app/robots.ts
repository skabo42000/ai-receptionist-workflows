import type { MetadataRoute } from "next";

// A demo with sample content: keep search engines out entirely (the headers say noindex too).
export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", disallow: "/" } };
}

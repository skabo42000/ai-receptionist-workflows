import { siteConfigSchema } from "./schema";
import { siteDemo } from "./site-demo";

/**
 * Checks config/site-demo.ts against the schema. Imported by the page (a server component), so a
 * bad edit fails the build and server render loudly, while zod stays out of the browser bundle.
 */
export const validatedSiteDemo = siteConfigSchema.parse(siteDemo);

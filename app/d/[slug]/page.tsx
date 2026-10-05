import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DemoPage } from "@/components/site/demo-page";
import { resolveBrand } from "@/lib/brand";
import { isProspectSlug } from "@/lib/prospect";
import "@/config/validate";

// Prospect link, e.g. /d/bella-studio. Looks exactly like the main demo (no business names on the
// page, by Bosko's choice); the slug only tells the team who opened it (see lib/prospect.ts).

export const metadata: Metadata = { title: "Live demo by Synq Logic" };

export default async function ProspectPage({ params, searchParams }: PageProps<"/d/[slug]">) {
  const { slug } = await params;
  if (!isProspectSlug(slug)) notFound();
  return <DemoPage brand={resolveBrand(await searchParams)} prospectSlug={slug} />;
}

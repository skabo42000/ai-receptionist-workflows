import type { Metadata } from "next";
import { DemoPage } from "@/components/site/demo-page";
import { resolveBrand } from "@/lib/brand";
// Server-side check of config/site-demo.ts (keeps zod out of the browser bundle).
import "@/config/validate";

export async function generateMetadata({ searchParams }: PageProps<"/">): Promise<Metadata> {
  const brand = resolveBrand(await searchParams);
  return { title: `${brand.name} · Live demo by Synq Logic` };
}

export default async function Page({ searchParams }: PageProps<"/">) {
  // Only ?city= and ?color= are read, and both are cleaned (see lib/brand.ts).
  return <DemoPage brand={resolveBrand(await searchParams)} />;
}

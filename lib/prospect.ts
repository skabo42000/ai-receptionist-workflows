import { cleanBusinessName } from "@/lib/brand";

// Prospect links: demo.synqlogic.com/d/bella-studio shows the normal demo (no business name on the
// page) and emails the team "Demo opened: Bella Studio" when it's opened. Nothing is stored: the
// name for the alert comes from the link itself. ?city= and ?color= work as on the main page.
// The same slug rules live in the Lead Sniper link builder.

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const SMALL_WORDS = new Set(["and", "of", "the", "at", "on", "in", "for", "by"]);

export function isProspectSlug(value: string) {
  return value.length >= 2 && value.length <= 60 && SLUG.test(value);
}

/** "bella-studio" → "Bella Studio". Returns null for anything that isn't a clean slug. */
export function prospectNameFromSlug(slug: string): string | null {
  if (!isProspectSlug(slug)) return null;
  const words = slug.split("-").map((word, index) =>
    index > 0 && SMALL_WORDS.has(word) ? word : word.charAt(0).toUpperCase() + word.slice(1),
  );
  return cleanBusinessName(words.join(" "));
}

/** "Joe's Pizza & Grill" → "joes-pizza-and-grill". */
export function prospectSlug(name: string) {
  return name
    .normalize("NFKD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60)
    .replace(/-+$/, "");
}

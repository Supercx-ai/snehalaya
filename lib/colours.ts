import type { ColorFilterValue } from "./shopify";

// No static colour list anymore — every colour shown on the site comes live from
// Shopify's Color category metafield (getColorFilterValues). Add/remove/rename a colour
// in Admin and it shows up or disappears here automatically, no code change.

export function slugifyColour(label: string) {
  return label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

// CSS understands most colour words directly ("purple", "gold", "red"...) — no manual
// hex table to maintain. Only "Multicolor" needs a special-cased swatch; anything else
// Shopify's taxonomy adds later just works as long as it's a real CSS colour name.
export function colourSwatch(label: string): string {
  const key = label.toLowerCase().replace(/\s+/g, "");
  if (key === "multicolor" || key === "multicolour") {
    return "conic-gradient(red, orange, yellow, green, blue, purple, red)";
  }
  return key;
}

// Matches a URL slug (e.g. from /colours/purple) back to the live filter value, returning
// Shopify's ready-to-use filter input.
export function resolveColourSlug(slug: string, liveValues: ColorFilterValue[]): Record<string, unknown> | null {
  const match = liveValues.find((v) => slugifyColour(v.label) === slug);
  return match ? JSON.parse(match.input) : null;
}

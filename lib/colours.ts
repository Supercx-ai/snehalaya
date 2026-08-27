import type { ColorFilterValue } from "./shopify";

// No static colour list anymore — every colour shown on the site comes live from
// Shopify's Color category metafield (getColorFilterValues). Add/remove/rename a colour
// in Admin and it shows up or disappears here automatically, no code change.

export function slugifyColour(label: string) {
  return label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

// The Find Your Saree colour row (Figma node 2191:864). Brand swatch values, sampled from
// the comp — deliberately NOT CSS colour words: the comp's "Red" is #8e2434, not the pure
// red a CSS keyword resolves to, and "Pastel" has no CSS equivalent at all. Doubles as the
// fallback row when the store exposes no live Color facet.
export const FINDER_COLOURS = [
  { label: "Red", hex: "#8e2434" },
  { label: "Pink", hex: "#c06a86" },
  { label: "Blue", hex: "#2e4a7a" },
  { label: "Green", hex: "#2e5e4e" },
  { label: "Gold", hex: "#f8c460" },
  { label: "Pastel", hex: "#e4d2be" },
  { label: "Black", hex: "#171717" },
] as const;

// Brand swatches win where we have one, so a live facet value called "Red" renders the
// comp's maroon-red rather than #ff0000. CSS understands most other colour words directly
// ("purple", "gold", "teal"...) — no manual hex table to maintain for the long tail. Only
// "Multicolor" needs a special-cased swatch.
export function colourSwatch(label: string): string {
  const key = label.toLowerCase().replace(/\s+/g, "");
  const brand = FINDER_COLOURS.find((c) => c.label.toLowerCase() === key);
  if (brand) return brand.hex;
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

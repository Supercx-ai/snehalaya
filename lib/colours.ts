// Static swatch list — matched against product tags (e.g. a product tagged "blue"),
// not a colour_family metafield (doesn't exist yet). Once that metafield is populated,
// swap the `tag:` query in app/colours/[family]/page.tsx for a real productFilter.
export const COLOUR_FAMILIES = [
  { slug: "red", name: "Red", hex: "#c0392b" },
  { slug: "pink", name: "Pink", hex: "#e91e8c" },
  { slug: "blue", name: "Blue", hex: "#2563eb" },
  { slug: "green", name: "Green", hex: "#16a34a" },
  { slug: "yellow", name: "Yellow", hex: "#eab308" },
  { slug: "orange", name: "Orange", hex: "#ea580c" },
  { slug: "purple", name: "Purple", hex: "#7c3aed" },
  { slug: "black", name: "Black", hex: "#111111" },
  { slug: "white", name: "White", hex: "#f5f5f5" },
  { slug: "gold", name: "Gold", hex: "#d4af37" },
  { slug: "beige", name: "Beige", hex: "#d8c3a5" },
  { slug: "multicolour", name: "Multicolour", hex: "conic-gradient(red, orange, yellow, green, blue, purple, red)" },
] as const;

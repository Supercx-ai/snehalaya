// Price bands for the SareeFinder facet.
export const PRICE_RANGES = [
  { label: "Any Price", min: undefined, max: undefined },
  { label: "Under ₹5k", min: undefined, max: 5000 },
  { label: "₹5k–₹10k", min: 5000, max: 10000 },
  { label: "₹10k–₹25k", min: 10000, max: 25000 },
  { label: "₹25k–₹55k", min: 25000, max: 55000 },
  { label: "₹55k+", min: 55000, max: undefined },
] as const;

// Canonical Shop-by-Weave list — shared by the homepage/PLP ShopByWeave strip and the
// /weaves/[weave] listing pages. `query` is the Storefront search term the PLP runs
// (kept broad — "Kanchipuram", "Tussar" — so title/tag matches are inclusive); `image`
// is the per-card 2x export from Figma node 2304:2 (gradient board + model + border).
export type Weave = {
  slug: string;
  label: string;
  query: string;
  image: string;
  w: number;
  h: number;
};

export const WEAVES: Weave[] = [
  { slug: "linen", label: "Linen", query: "Linen", image: "/figma/weaves/plp/linen.png?v=2", w: 365, h: 455 },
  { slug: "kanchipuram-silk", label: "Kanchipuram Silk", query: "Kanchipuram", image: "/figma/weaves/plp/kanchipuram.png?v=2", w: 362, h: 459 },
  { slug: "banarasi", label: "Banarasi", query: "Banarasi", image: "/figma/weaves/plp/banarasi.png?v=2", w: 363, h: 459 },
  { slug: "kota", label: "Kota", query: "Kota", image: "/figma/weaves/plp/kota.png?v=2", w: 363, h: 459 },
  { slug: "chettinad-cotton", label: "Chettinad Cotton", query: "Chettinad", image: "/figma/weaves/plp/chettinad.png?v=2", w: 363, h: 453 },
  { slug: "tussara", label: "Tussara", query: "Tussar", image: "/figma/weaves/plp/tussara.png?v=2", w: 362, h: 453 },
];

export function getWeave(slug: string): Weave | undefined {
  return WEAVES.find((w) => w.slug === slug);
}

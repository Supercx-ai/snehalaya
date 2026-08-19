"use server";

import { searchProducts, predictiveSearch, getCollection, getProducts } from "./shopify";

// Default "Top Results" for the search popup before the visitor types — best sellers if
// that collection exists, otherwise the latest products.
export async function topPicks() {
  const best = await getCollection("new-arrival", { first: 8, sortKey: "BEST_SELLING" }).catch(() => null);
  if (best && best.products.nodes.length > 0) return best.products.nodes;
  return getProducts(8).catch(() => []);
}

// Same bind-friendly shape as loadMoreCollectionProducts: `after` last.
export async function loadMoreSearchResults(query: string, filters: Record<string, unknown>[], after: string) {
  return searchProducts(query, { first: 24, after, filters });
}

// Live colour filter for the image-search page — as the picker dot moves over the uploaded
// photo, re-query the catalogue for that colour name.
export async function productsByColour(colour: string) {
  return (await searchProducts(colour, { first: 12 })).nodes;
}

// Weave PLP variant — carries sort so infinite scroll keeps the chosen order.
export async function loadMoreWeaveResults(
  query: string,
  filters: Record<string, unknown>[],
  sortKey: string | undefined,
  reverse: boolean | undefined,
  after: string
) {
  return searchProducts(query, { first: 12, after, filters, sortKey, reverse });
}

export async function instantSearch(query: string) {
  if (query.trim().length < 2) return [];
  return predictiveSearch(query);
}

"use server";

import { searchProducts, predictiveSearch } from "./shopify";

// Same bind-friendly shape as loadMoreCollectionProducts: `after` last.
export async function loadMoreSearchResults(query: string, filters: Record<string, unknown>[], after: string) {
  return searchProducts(query, { first: 24, after, filters });
}

export async function instantSearch(query: string) {
  if (query.trim().length < 2) return [];
  return predictiveSearch(query);
}

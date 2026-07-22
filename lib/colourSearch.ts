"use server";

import { searchProducts } from "./shopify";

// Same bind-friendly shape as the other loadMore actions: `after` last. `filterInput` is
// the resolved taxonomyMetafield filter object (from resolveColorFilter), not a tag.
export async function loadMoreColourProducts(filterInput: Record<string, unknown>, after: string) {
  return searchProducts("", { first: 12, after, filters: [filterInput] });
}

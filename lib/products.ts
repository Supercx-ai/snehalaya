"use server";

import { getProductsPage } from "./shopify";

// Server action the "Load more" button calls to fetch the next page.
export async function loadMoreProducts(after: string) {
  return getProductsPage(12, after);
}

// Sort-aware variant for the all-products PLP — pre-bound by the page so
// InfiniteProducts only ever passes the cursor.
export async function loadMoreAllProducts(sortKey: string | undefined, reverse: boolean | undefined, after: string) {
  return getProductsPage(12, after, sortKey, reverse);
}

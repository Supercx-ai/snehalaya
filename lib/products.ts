"use server";

import { getProductsPage } from "./shopify";

// Server action the "Load more" button calls to fetch the next page.
export async function loadMoreProducts(after: string) {
  return getProductsPage(12, after);
}

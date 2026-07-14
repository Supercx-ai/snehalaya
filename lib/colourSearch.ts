"use server";

import { getProductsByQuery } from "./shopify";

// Same bind-friendly shape as the other loadMore actions: `after` last.
export async function loadMoreColourProducts(tag: string, after: string) {
  return getProductsByQuery(`tag:${tag}`, { first: 12, after });
}

"use server";

import { getCollection } from "./shopify";

// Server action the collection page's infinite scroll calls for the next page,
// keeping whatever filters/sort the visitor has selected.
// `after` is last so the page can .bind() everything else and hand InfiniteProducts
// a plain (cursor) => Promise<page> function.
export async function loadMoreCollectionProducts(
  handle: string,
  filters: Record<string, unknown>[],
  sortKey: string | undefined,
  reverse: boolean | undefined,
  after: string
) {
  const collection = await getCollection(handle, { first: 12, after, filters, sortKey, reverse });
  return collection?.products ?? { nodes: [], filters: [], pageInfo: { hasNextPage: false, endCursor: null } };
}

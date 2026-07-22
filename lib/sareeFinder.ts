"use server";

import { getColorFilterValues, getFabricFilterValues, searchProducts, type Product } from "./shopify";
import { resolveColourSlug } from "./colours";

export type PriceRange = { min?: number; max?: number };

// Fabric and Colour are both resolved against live Category-metafield facets — verified
// live that two taxonomyMetafield filters combine correctly in the same search() call.
export async function findSarees(fabricSlug: string | null, colourSlug: string | null, price: PriceRange | null) {
  const filters: Record<string, unknown>[] = [];

  if (fabricSlug) {
    const liveValues = await getFabricFilterValues();
    const fabricFilter = resolveColourSlug(fabricSlug, liveValues);
    // A fabric was picked but nothing has it set yet — real zero, not "show everything".
    if (!fabricFilter) return { count: 0, capped: false, products: [] as Product[] };
    filters.push(fabricFilter);
  }

  if (colourSlug) {
    const liveValues = await getColorFilterValues();
    const colorFilter = resolveColourSlug(colourSlug, liveValues);
    if (!colorFilter) return { count: 0, capped: false, products: [] as Product[] };
    filters.push(colorFilter);
  }

  // Both on "All" → empty query + no filters, which correctly matches every product
  // (verified live) rather than a hand-rolled early-return.
  // ponytail: fetch-then-filter is fine at current catalog size; at large scale with a
  // popular fabric+colour combo returning hundreds of matches, add real pagination + move
  // price filtering server-side once Shopify's combined query+filter behavior is sorted out.
  const page = await searchProducts("", { first: 250, filters });
  let products = page.nodes;
  if (price) {
    products = products.filter((p) => {
      const amount = Number(p.priceRange.minVariantPrice.amount);
      if (price.min != null && amount < price.min) return false;
      if (price.max != null && amount > price.max) return false;
      return true;
    });
  }

  return { count: products.length, capped: page.pageInfo.hasNextPage, products };
}

"use server";

import { shopifyFetch, type Money } from "./shopify";

// Live product data the wishlist page needs beyond what localStorage stores:
// current price/compare-at, stock status, weave label, and a variant id for Move to Bag.
export type WishlistProduct = {
  handle: string;
  title: string;
  featuredImage: { url: string; altText: string | null } | null;
  priceRange: { minVariantPrice: Money };
  compareAtPriceRange: { minVariantPrice: Money } | null;
  weaveType: { value: string } | null;
  totalInventory: number | null;
  variants: { nodes: { id: string; availableForSale: boolean }[] };
};

function query(withInventory: boolean) {
  return `query WishlistItem($handle: String!) { product(handle: $handle) {
    handle title
    featuredImage { url altText }
    priceRange { minVariantPrice { amount currencyCode } }
    compareAtPriceRange { minVariantPrice { amount currencyCode } }
    weaveType: metafield(namespace: "custom", key: "weave_type") { value }
    ${withInventory ? "totalInventory" : ""}
    variants(first: 1) { nodes { id availableForSale } }
  } }`;
}

// totalInventory needs no extra scope on a real store, but retry without it in case the
// mock API (or a restricted token) rejects the field — stock then degrades to In/Out only.
async function fetchOne(handle: string): Promise<WishlistProduct | null> {
  try {
    return (await shopifyFetch<{ product: WishlistProduct | null }>(query(true), { handle }, { tags: ["products"] })).product;
  } catch {
    try {
      const d = await shopifyFetch<{ product: WishlistProduct | null }>(query(false), { handle }, { tags: ["products"] });
      return d.product ? { ...d.product, totalInventory: null } : null;
    } catch {
      return null;
    }
  }
}

export async function getWishlistProducts(handles: string[]): Promise<Record<string, WishlistProduct | null>> {
  const unique = [...new Set(handles)].slice(0, 50);
  const results = await Promise.all(unique.map(fetchOne));
  return Object.fromEntries(unique.map((h, i) => [h, results[i]]));
}

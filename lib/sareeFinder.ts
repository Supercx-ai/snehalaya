"use server";

import { getColorFilterValues, getFabricFilterValues, searchProducts, type Product } from "./shopify";
import { resolveColourSlug, slugifyColour, FINDER_COLOURS } from "./colours";
import { FINDER_FABRICS } from "./weaves";

export type PriceRange = { min?: number; max?: number };

// A slug the live facet can't resolve still has to mean something. Previously any such
// slug returned a hard 0 — which is what made the whole finder look broken on a store
// that hasn't configured the Color/Fabric category metafields as filters in Search &
// Discovery. Fall back to the comp's search term and let Shopify match title/tags.
function searchTermFor(slug: string) {
  const fabric = FINDER_FABRICS.find((f) => slugifyColour(f.label) === slug);
  if (fabric) return fabric.query;
  const colour = FINDER_COLOURS.find((c) => slugifyColour(c.label) === slug);
  if (colour) return colour.label;
  return slug.replace(/-+/g, " ");
}

// Fabric and Colour are both resolved against live Category-metafield facets first —
// verified live that two taxonomyMetafield filters combine correctly in the same search()
// call. Anything the facets don't know about degrades to a keyword term instead.
export async function findSarees(fabricSlug: string | null, colourSlug: string | null, price: PriceRange | null) {
  const filters: Record<string, unknown>[] = [];
  const terms: string[] = [];

  if (fabricSlug) {
    const fabricFilter = resolveColourSlug(fabricSlug, await getFabricFilterValues());
    if (fabricFilter) filters.push(fabricFilter);
    else terms.push(searchTermFor(fabricSlug));
  }

  if (colourSlug) {
    const colorFilter = resolveColourSlug(colourSlug, await getColorFilterValues());
    if (colorFilter) filters.push(colorFilter);
    else terms.push(searchTermFor(colourSlug));
  }

  // Both on "All" → empty query + no filters, which correctly matches every product
  // (verified live) rather than a hand-rolled early-return.
  // ponytail: fetch-then-filter is fine at current catalog size; at large scale with a
  // popular fabric+colour combo returning hundreds of matches, add real pagination + move
  // price filtering server-side once Shopify's combined query+filter behavior is sorted out.
  const page = await searchProducts(terms.join(" "), { first: 250, filters });
  let products = page.nodes;

  // Storefront search ORs its terms — verified live that "Cotton Red" returns MORE hits
  // (16) than "Cotton" alone (10). So the multi-term query is only a recall net; the
  // actual AND across fabric + colour has to be applied here, or picking a colour would
  // widen the result set instead of narrowing it.
  if (terms.length > 1) {
    products = products.filter((p) => {
      const haystack = `${p.title} ${p.weaveType?.value ?? ""} ${(p.tags ?? []).join(" ")}`.toLowerCase();
      return terms.every((t) => haystack.includes(t.toLowerCase()));
    });
  }

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

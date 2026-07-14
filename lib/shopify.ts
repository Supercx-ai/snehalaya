// Thin Storefront API client — native fetch, no SDK.
// Reads are force-cached + tagged (so the webhook's revalidateTag works on POST GraphQL).
// Mutations (cart) are no-store.

const API_VERSION = "2026-07"; // ponytail: bump quarterly when Shopify deprecates it
const domain = process.env.SHOPIFY_STORE_DOMAIN;
const token = process.env.SHOPIFY_STOREFRONT_TOKEN;
// Use the real store only when BOTH domain and Storefront token exist;
// otherwise fall back to Shopify's free mock API so the app keeps working.
const live = domain && token;
const endpoint = live
  ? `https://${domain}/api/${API_VERSION}/graphql.json`
  : "https://mock.shop/api";

type GraphQLResponse<T> = { data?: T; errors?: { message: string }[] };

// Shopify Markets country codes this storefront offers a currency switch for.
// Real localized prices — only takes effect once Markets is configured in Admin for
// that country; until then Shopify just returns the shop's default currency (safe no-op,
// verified live: passing country:"US" today still returns INR because no US market exists yet).
export type CountryCode = "IN" | "US" | "GB" | "AE" | "SG" | "MY";

// Inserts `@inContext(country: $country)` onto the operation signature so every query/
// mutation can opt into localized pricing by passing opts.country, without hand-editing
// each query string. Operation signatures always look like `query Name(...)`/`mutation Name(...)`.
function withContext(query: string): string {
  return query.replace(
    /^(\s*)(query|mutation)(\s+\w+)?\s*\(([^)]*)\)/,
    (_m, ws, kind, name = "", params) => `${ws}${kind}${name}(${params}, $country: CountryCode) @inContext(country: $country)`
  );
}

export async function shopifyFetch<T>(
  query: string,
  variables: Record<string, unknown> = {},
  opts: { tags?: string[]; cache?: RequestCache; country?: CountryCode } = {}
): Promise<T> {
  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // mock.shop needs no token; only send it when hitting a real store.
      ...(live ? { "X-Shopify-Storefront-Access-Token": token! } : {}),
    },
    body: JSON.stringify({
      query: opts.country ? withContext(query) : query,
      variables: opts.country ? { ...variables, country: opts.country } : variables,
    }),
    cache: opts.cache ?? "force-cache",
    ...(opts.tags ? { next: { tags: opts.tags } } : {}),
  });

  if (!res.ok) throw new Error(`Shopify ${res.status}: ${await res.text()}`);
  const json: GraphQLResponse<T> = await res.json();
  if (json.errors?.length) throw new Error(json.errors.map((e) => e.message).join("; "));
  return json.data!;
}

// --- Types (only the fields we read) ---
export type Money = { amount: string; currencyCode: string };
export type ImageT = { url: string; altText: string | null; width: number; height: number };
export type Product = {
  id: string;
  handle: string;
  title: string;
  description: string;
  featuredImage: ImageT | null;
  priceRange: { minVariantPrice: Money };
  variants: { nodes: { id: string; availableForSale: boolean }[] };
};
// Custom fields the store owner is expected to add in Admin → Settings → Custom data →
// Products, marked Storefront-visible. All optional — missing keys just render nothing.
export const METAFIELD_KEYS = [
  "colour_primary", "colour_secondary", "colour_border", "colour_pallu", "colour_family", "colour_shade",
  "colour_confidence", "dominant_colours", "weave_type", "zari_type", "border_style", "blouse_included",
  "blouse_length", "occasion_type", "silk_mark", "gi_tag", "craft_story", "care_instructions",
  "ready_to_ship", "ship_days",
] as const;
export type MetafieldKey = (typeof METAFIELD_KEYS)[number];
export type ProductMetafields = Partial<Record<MetafieldKey, string>>;

export type ProductDetail = Product & {
  tags: string[];
  images: { nodes: ImageT[] };
  metafields: ProductMetafields;
};
export type Collection = {
  id: string;
  handle: string;
  title: string;
  description: string;
  image: ImageT | null;
  products?: { nodes: Product[] };
};
export type CartLine = {
  id: string;
  quantity: number;
  merchandise: {
    id: string;
    title: string;
    price: Money;
    product: { id: string; title: string; handle: string; featuredImage: ImageT | null };
  };
};
export type Cart = {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: { subtotalAmount: Money; totalAmount: Money };
  discountCodes: { code: string; applicable: boolean }[];
  lines: { nodes: CartLine[] };
};

// --- Fragments ---
const PRODUCT_FIELDS = `
  id handle title description
  featuredImage { url altText width height }
  priceRange { minVariantPrice { amount currencyCode } }
  variants(first: 1) { nodes { id availableForSale } }
`;
const CART_FIELDS = `
  id checkoutUrl totalQuantity
  cost { subtotalAmount { amount currencyCode } totalAmount { amount currencyCode } }
  discountCodes { code applicable }
  lines(first: 50) { nodes {
    id quantity
    merchandise { ... on ProductVariant {
      id title price { amount currencyCode }
      product { id title handle featuredImage { url altText width height } }
    } }
  } }
`;

// Product/collection pages are ISR-cached (same HTML for every visitor), so their
// server-rendered price is always the default currency. This is a small, uncached,
// per-visitor query a client component calls to swap in the selected currency's price
// without losing ISR on the page itself.
export function getProductPrice(handle: string, country: CountryCode) {
  return shopifyFetch<{ product: { priceRange: { minVariantPrice: Money } } | null }>(
    `query Price($handle: String!) { product(handle: $handle) { priceRange { minVariantPrice { amount currencyCode } } } }`,
    { handle },
    { cache: "no-store", country }
  ).then((d) => d.product?.priceRange.minVariantPrice ?? null);
}

// --- Products ---
export function getProducts(first = 24) {
  return shopifyFetch<{ products: { nodes: Product[] } }>(
    `query Products($first: Int!) { products(first: $first) { nodes { ${PRODUCT_FIELDS} } } }`,
    { first },
    { tags: ["products"] }
  ).then((d) => d.products.nodes);
}

// Cursor-paginated page of products, for "load more" / lazy loading.
export function getProductsPage(first = 12, after?: string) {
  return shopifyFetch<{
    products: { nodes: Product[]; pageInfo: { hasNextPage: boolean; endCursor: string | null } };
  }>(
    `query ProductsPage($first: Int!, $after: String) {
      products(first: $first, after: $after) {
        nodes { ${PRODUCT_FIELDS} }
        pageInfo { hasNextPage endCursor }
      }
    }`,
    { first, after },
    { tags: ["products"] }
  ).then((d) => d.products);
}

const METAFIELD_IDENTIFIERS = METAFIELD_KEYS.map((key) => `{ namespace: "custom", key: "${key}" }`).join(", ");

// Namespace "custom" is a guess — confirm the real namespace once these are set up in
// Admin → Settings → Custom data → Products (must be marked Storefront-visible, or every
// value here stays null even after the fields exist).
// Tag/keyword search via the products field's `query` string (Shopify search syntax,
// e.g. "tag:blue"). Used for colour landing pages until a real colour_family metafield exists.
export function getProductsByQuery(query: string, opts: { first?: number; after?: string } = {}) {
  return shopifyFetch<{
    products: { nodes: Product[]; pageInfo: { hasNextPage: boolean; endCursor: string | null } };
  }>(
    `query ByQuery($query: String!, $first: Int!, $after: String) {
      products(query: $query, first: $first, after: $after) {
        nodes { ${PRODUCT_FIELDS} }
        pageInfo { hasNextPage endCursor }
      }
    }`,
    { query, first: opts.first ?? 12, after: opts.after },
    { tags: ["products"] }
  ).then((d) => d.products);
}

export function getProduct(handle: string) {
  return shopifyFetch<{
    product: (Product & { tags: string[]; images: { nodes: ImageT[] }; metafields: ({ key: string; value: string } | null)[] }) | null;
  }>(
    `query Product($handle: String!) { product(handle: $handle) {
      ${PRODUCT_FIELDS}
      tags
      images(first: 8) { nodes { url altText width height } }
      metafields(identifiers: [${METAFIELD_IDENTIFIERS}]) { key value }
    } }`,
    { handle },
    { tags: ["products", `product:${handle}`] }
  ).then((d): ProductDetail | null => {
    if (!d.product) return null;
    const metafields: ProductMetafields = {};
    for (const m of d.product.metafields) if (m) metafields[m.key as MetafieldKey] = m.value;
    return { ...d.product, metafields };
  });
}

// --- Collections ---
export function getCollections(first = 20) {
  return shopifyFetch<{ collections: { nodes: Collection[] } }>(
    `query Collections($first: Int!) { collections(first: $first) {
      nodes { id handle title description image { url altText width height } }
    } }`,
    { first },
    { tags: ["collections"] }
  ).then((d) => d.collections.nodes);
}

export type FilterValue = { id: string; label: string; count: number; input: string };
export type ProductFilter = { id: string; label: string; type: string; values: FilterValue[] };
export type CollectionPage = Collection & {
  products: { nodes: Product[]; filters: ProductFilter[]; pageInfo: { hasNextPage: boolean; endCursor: string | null } };
};

// filters: raw ProductFilter input objects (parsed from a FilterValue.input JSON string,
// or { price: { min, max } }) — see Shopify's collection filtering docs.
export function getCollection(
  handle: string,
  opts: { first?: number; after?: string; filters?: Record<string, unknown>[]; sortKey?: string; reverse?: boolean } = {}
) {
  return shopifyFetch<{ collection: CollectionPage | null }>(
    `query Collection($handle: String!, $first: Int!, $after: String, $filters: [ProductFilter!], $sortKey: ProductCollectionSortKeys, $reverse: Boolean) {
      collection(handle: $handle) {
        id handle title description image { url altText width height }
        products(first: $first, after: $after, filters: $filters, sortKey: $sortKey, reverse: $reverse) {
          nodes { ${PRODUCT_FIELDS} }
          filters { id label type values { id label count input } }
          pageInfo { hasNextPage endCursor }
        }
      }
    }`,
    { handle, first: opts.first ?? 12, after: opts.after, filters: opts.filters ?? [], sortKey: opts.sortKey, reverse: opts.reverse },
    { tags: ["collections", `collection:${handle}`] }
  ).then((d) => d.collection);
}

// --- Blog ---
export type Article = {
  handle: string;
  title: string;
  excerpt: string;
  publishedAt: string;
  image: ImageT | null;
  contentHtml?: string;
};

export function getArticles(blogHandle = "news", first = 20) {
  return shopifyFetch<{ blog: { title: string; articles: { nodes: Article[] } } | null }>(
    `query Articles($blogHandle: String!, $first: Int!) { blog(handle: $blogHandle) {
      title articles(first: $first, sortKey: PUBLISHED_AT, reverse: true) {
        nodes { handle title excerpt publishedAt image { url altText width height } }
      }
    } }`,
    { blogHandle, first },
    { tags: ["blog"] }
  ).then((d) => d.blog);
}

export function getArticle(articleHandle: string, blogHandle = "news") {
  return shopifyFetch<{ blog: { articleByHandle: Article | null } | null }>(
    `query Article($blogHandle: String!, $articleHandle: String!) { blog(handle: $blogHandle) {
      articleByHandle(handle: $articleHandle) { handle title excerpt contentHtml publishedAt image { url altText width height } }
    } }`,
    { blogHandle, articleHandle },
    { tags: ["blog", `article:${articleHandle}`] }
  ).then((d) => d.blog?.articleByHandle ?? null);
}

// --- Metaobjects ---
// Type/field keys are a guess — confirm once you create the "Announcement bar" metaobject
// definition in Admin → Content → Metaobjects (expects fields named "message" and "link").
export function getAnnouncementBar() {
  return shopifyFetch<{ metaobjects: { nodes: { fields: { key: string; value: string | null }[] }[] } }>(
    `{ metaobjects(type: "announcement_bar", first: 1) { nodes { fields { key value } } } }`,
    {},
    { tags: ["metaobjects"] }
  ).then((d) => {
    const fields = d.metaobjects.nodes[0]?.fields;
    if (!fields) return null;
    const map = Object.fromEntries(fields.map((f) => [f.key, f.value]));
    return { message: map.message ?? null, link: map.link ?? null };
  });
}

// --- Search ---
// Full results page — same filter/sort shape as collections, reuses ProductFilter/FilterValue.
export function searchProducts(
  query: string,
  opts: { first?: number; after?: string; filters?: Record<string, unknown>[] } = {}
) {
  return shopifyFetch<{
    search: { edges: { node: Product }[]; productFilters: ProductFilter[]; pageInfo: { hasNextPage: boolean; endCursor: string | null } };
  }>(
    `query Search($query: String!, $first: Int!, $after: String, $filters: [ProductFilter!]) {
      search(query: $query, types: [PRODUCT], first: $first, after: $after, productFilters: $filters) {
        edges { node { ... on Product { ${PRODUCT_FIELDS} } } }
        productFilters { id label type values { id label count input } }
        pageInfo { hasNextPage endCursor }
      }
    }`,
    { query, first: opts.first ?? 24, after: opts.after, filters: opts.filters ?? [] },
    { tags: ["products"] }
  ).then((d) => ({
    nodes: d.search.edges.map((e) => e.node),
    filters: d.search.productFilters,
    pageInfo: d.search.pageInfo,
  }));
}

// Instant/autocomplete dropdown — no key needed, native Storefront API.
export function predictiveSearch(query: string) {
  return shopifyFetch<{ predictiveSearch: { products: Product[] } }>(
    `query Predictive($query: String!) { predictiveSearch(query: $query, limit: 5, types: [PRODUCT]) {
      products { ${PRODUCT_FIELDS} }
    } }`,
    { query },
    { cache: "no-store" } // instant results must reflect live query text, not a stale tag-cached entry
  ).then((d) => d.predictiveSearch.products);
}

// --- Cart (mutations: never cached) ---
type CartResult = { cart: Cart | null; userErrors: { message: string }[] };

// Cart reads/mutations are already no-store (per-visitor, never cached) — unlike product/
// collection pages (ISR'd, same HTML for everyone), so `country` here is always safe to honor.
export function getCart(id: string, country?: CountryCode) {
  return shopifyFetch<{ cart: Cart | null }>(
    `query Cart($id: ID!) { cart(id: $id) { ${CART_FIELDS} } }`,
    { id },
    { cache: "no-store", country }
  ).then((d) => d.cart);
}

export function cartCreate(merchandiseId: string, quantity = 1, country?: CountryCode) {
  return shopifyFetch<{ cartCreate: CartResult }>(
    `mutation Create($lines: [CartLineInput!]) {
      cartCreate(input: { lines: $lines }) { cart { ${CART_FIELDS} } userErrors { message } }
    }`,
    { lines: [{ merchandiseId, quantity }] },
    { cache: "no-store", country }
  ).then((d) => d.cartCreate.cart);
}

export function cartLinesAdd(cartId: string, merchandiseId: string, quantity = 1, country?: CountryCode) {
  return shopifyFetch<{ cartLinesAdd: CartResult }>(
    `mutation Add($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) { cart { ${CART_FIELDS} } userErrors { message } }
    }`,
    { cartId, lines: [{ merchandiseId, quantity }] },
    { cache: "no-store", country }
  ).then((d) => d.cartLinesAdd.cart);
}

export function cartLinesUpdate(cartId: string, lineId: string, quantity: number, country?: CountryCode) {
  return shopifyFetch<{ cartLinesUpdate: CartResult }>(
    `mutation Update($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
      cartLinesUpdate(cartId: $cartId, lines: $lines) { cart { ${CART_FIELDS} } userErrors { message } }
    }`,
    { cartId, lines: [{ id: lineId, quantity }] },
    { cache: "no-store", country }
  ).then((d) => d.cartLinesUpdate.cart);
}

export function cartLinesRemove(cartId: string, lineId: string, country?: CountryCode) {
  return shopifyFetch<{ cartLinesRemove: CartResult }>(
    `mutation Remove($cartId: ID!, $lineIds: [ID!]!) {
      cartLinesRemove(cartId: $cartId, lineIds: $lineIds) { cart { ${CART_FIELDS} } userErrors { message } }
    }`,
    { cartId, lineIds: [lineId] },
    { cache: "no-store", country }
  ).then((d) => d.cartLinesRemove.cart);
}

export function cartDiscountCodesUpdate(cartId: string, codes: string[], country?: CountryCode) {
  return shopifyFetch<{ cartDiscountCodesUpdate: CartResult }>(
    `mutation Discount($cartId: ID!, $codes: [String!]) {
      cartDiscountCodesUpdate(cartId: $cartId, discountCodes: $codes) { cart { ${CART_FIELDS} } userErrors { message } }
    }`,
    { cartId, codes },
    { cache: "no-store", country }
  ).then((d) => d.cartDiscountCodesUpdate.cart);
}

// Re-prices an EXISTING cart. A cart's currency is fixed at creation time — re-querying it
// under a different @inContext does NOT change its cost (verified live). This mutation is
// the actual mechanism Shopify uses to switch an existing cart's currency.
export function cartBuyerIdentityUpdate(cartId: string, countryCode: CountryCode) {
  return shopifyFetch<{ cartBuyerIdentityUpdate: CartResult }>(
    `mutation UpdateIdentity($cartId: ID!, $countryCode: CountryCode!) {
      cartBuyerIdentityUpdate(cartId: $cartId, buyerIdentity: { countryCode: $countryCode }) {
        cart { ${CART_FIELDS} } userErrors { message }
      }
    }`,
    { cartId, countryCode },
    { cache: "no-store" }
  ).then((d) => d.cartBuyerIdentityUpdate.cart);
}

// Upsell strip in the cart drawer — recommendations based on the first line's product.
export function getProductRecommendations(productId: string) {
  return shopifyFetch<{ productRecommendations: Product[] }>(
    `query Recs($productId: ID!) { productRecommendations(productId: $productId) { ${PRODUCT_FIELDS} } }`,
    { productId },
    { tags: ["products"] }
  ).then((d) => d.productRecommendations.slice(0, 4));
}

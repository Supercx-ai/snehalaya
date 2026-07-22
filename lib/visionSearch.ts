// Google Cloud Vision Product Search — REST calls (matches this project's no-SDK pattern
// for the Shopify client). Product Search is officially in "maintenance mode" at Google —
// this is a deliberate interim choice while fashion-specific vendors (Syte/Vue.ai) are
// being evaluated in parallel; see project notes.
//
// UNVERIFIED LIVE — written from Google's documented REST shape, but no service account
// exists yet to test against. Confirm each call once GOOGLE_SERVICE_ACCOUNT_KEY_BASE64 etc.
// are set; the API version path (v1p3beta1) or category string ("apparel-v2") may need a
// small correction once you can see real error responses.
import { getGoogleAccessToken, GOOGLE_PROJECT_ID, GOOGLE_LOCATION, visionSearchConfigured } from "./googleAuth";
import { mirrorImageToGCS, deleteFromGCS } from "./gcs";

export { visionSearchConfigured };

const API_BASE = "https://vision.googleapis.com/v1p3beta1";
const PRODUCT_SET_ID = "storefront-products";
const CATEGORY = "apparel-v2"; // sarees/clothing

function resourcePath(kind: "productSets" | "products", id?: string) {
  const base = `projects/${GOOGLE_PROJECT_ID}/locations/${GOOGLE_LOCATION}/${kind}`;
  return id ? `${base}/${id}` : base;
}

// Shopify's gid ("gid://shopify/Product/123456") isn't a valid Vision resource ID
// (no slashes/colons allowed) — use just the numeric tail, stable and unique.
export function shopifyGidToGoogleId(gid: string): string {
  return gid.split("/").pop()!;
}

async function visionFetch(path: string, opts: { method?: string; body?: unknown } = {}) {
  const token = await getGoogleAccessToken();
  const res = await fetch(`${API_BASE}/${path}`, {
    method: opts.method ?? "GET",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  });
  if (!res.ok && res.status !== 404 && res.status !== 409) {
    throw new Error(`Vision API ${path} failed: ${res.status} ${await res.text()}`);
  }
  return res;
}

// Idempotent — call once at startup of any indexing operation; 409 (already exists) is fine.
export async function ensureProductSet() {
  await visionFetch(`${resourcePath("productSets")}?productSetId=${PRODUCT_SET_ID}`, {
    method: "POST",
    body: { displayName: "Storefront products" },
  });
}

// Re-indexes a product from scratch (delete + recreate) — simpler and correct-enough for
// v1 than trying to patch an existing reference image in place, which Product Search
// doesn't cleanly support anyway.
export async function indexProduct(product: { id: string; title: string; imageUrl: string }) {
  await ensureProductSet();
  const googleId = shopifyGidToGoogleId(product.id);

  await removeProduct(product.id); // clears any stale prior index entry

  await visionFetch(`${resourcePath("products")}?productId=${googleId}`, {
    method: "POST",
    body: { displayName: product.title, productCategory: CATEGORY },
  });

  const gcsPath = `products/${googleId}.jpg`;
  const gcsUri = await mirrorImageToGCS(product.imageUrl, gcsPath);

  await visionFetch(`${resourcePath("products", googleId)}/referenceImages?referenceImageId=${googleId}`, {
    method: "POST",
    body: { uri: gcsUri },
  });

  await visionFetch(`${resourcePath("productSets", PRODUCT_SET_ID)}:addProduct`, {
    method: "POST",
    body: { product: resourcePath("products", googleId) },
  });
}

export async function removeProduct(shopifyGid: string) {
  const googleId = shopifyGidToGoogleId(shopifyGid);
  await visionFetch(resourcePath("products", googleId), { method: "DELETE" });
  await deleteFromGCS(`products/${googleId}.jpg`).catch(() => {});
}

export type ImageSearchMatch = { googleProductId: string; score: number };

// The customer's uploaded photo — sent as raw base64 content, does NOT need a GCS URI
// (that constraint only applies to indexed reference images, not the query image).
export async function searchByImage(imageBuffer: Buffer): Promise<ImageSearchMatch[]> {
  const token = await getGoogleAccessToken();
  const res = await fetch(`${API_BASE}/images:annotate`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      requests: [
        {
          image: { content: imageBuffer.toString("base64") },
          features: [{ type: "PRODUCT_SEARCH" }],
          imageContext: {
            productSearchParams: {
              productSet: resourcePath("productSets", PRODUCT_SET_ID),
              productCategories: [CATEGORY],
            },
          },
        },
      ],
    }),
  });
  if (!res.ok) throw new Error(`Vision image search failed: ${res.status} ${await res.text()}`);

  const json = await res.json();
  const results = json.responses?.[0]?.productSearchResults?.results ?? [];
  return results.map((r: { product: { name: string }; score: number }) => ({
    googleProductId: r.product.name.split("/").pop()!,
    score: r.score,
  }));
}

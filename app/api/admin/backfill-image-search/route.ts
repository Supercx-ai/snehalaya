import crypto from "node:crypto";
import { getProductsPage } from "@/lib/shopify";
import { indexProduct, visionSearchConfigured } from "@/lib/visionSearch";

// One paginated batch at a time — indexing all 40k products in one request would blow
// past any serverless timeout (each product needs several network round trips: mirror
// image to GCS, create Product, create reference image, add to set).
//
// Usage: POST { secret, after?, limit? } — repeat with the returned nextCursor until
// hasMore is false. At 40k products and limit=25, that's ~1600 calls; script it rather
// than clicking through manually.
export async function POST(req: Request) {
  const { secret, after, limit = 25 } = (await req.json()) as { secret?: string; after?: string; limit?: number };
  const expected = process.env.CACHE_CLEAR_SECRET;

  const a = Buffer.from(secret ?? "");
  const b = Buffer.from(expected ?? "");
  if (!expected || a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
    return new Response("unauthorized", { status: 401 });
  }

  if (!visionSearchConfigured) {
    return Response.json({ error: "Image search isn't configured yet — see .env.example" }, { status: 501 });
  }

  const page = await getProductsPage(limit, after);
  const results: { handle: string; ok: boolean; error?: string }[] = [];

  // Sequential, not Promise.all — avoids hammering the Vision API with a burst of
  // concurrent requests; fine to speed up later if backfill time becomes a problem.
  for (const product of page.nodes) {
    if (!product.featuredImage) { results.push({ handle: product.handle, ok: false, error: "no image" }); continue; }
    try {
      await indexProduct({ id: product.id, title: product.title, imageUrl: product.featuredImage.url });
      results.push({ handle: product.handle, ok: true });
    } catch (e) {
      results.push({ handle: product.handle, ok: false, error: e instanceof Error ? e.message : String(e) });
    }
  }

  return Response.json({ results, nextCursor: page.pageInfo.endCursor, hasMore: page.pageInfo.hasNextPage });
}

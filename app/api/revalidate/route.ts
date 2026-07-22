import crypto from "node:crypto";
import { revalidateTag, revalidatePath } from "next/cache";
import { indexProduct, removeProduct, visionSearchConfigured } from "@/lib/visionSearch";

// Shopify webhooks → verify HMAC → bust exactly the cached data that changed.
// Register these topics in Admin → Settings → Notifications → Webhooks, all pointing
// to https://<your-domain>/api/revalidate: products/create, products/update,
// products/delete, collections/update, articles/update, inventory_levels/update.
export async function POST(req: Request) {
  const body = await req.text(); // raw body required for HMAC
  const sent = req.headers.get("x-shopify-hmac-sha256") ?? "";
  const digest = crypto
    .createHmac("sha256", process.env.SHOPIFY_WEBHOOK_SECRET!)
    .update(body, "utf8")
    .digest("base64");

  const a = Buffer.from(sent);
  const b = Buffer.from(digest);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
    return new Response("invalid signature", { status: 401 });
  }

  const topic = req.headers.get("x-shopify-topic") ?? "";
  const payload = JSON.parse(body) as { id?: number; handle?: string; title?: string; images?: { src: string }[] };
  const handle = payload.handle;

  if (topic.startsWith("products/")) {
    revalidateTag("products");
    if (handle) { revalidateTag(`product:${handle}`); revalidatePath(`/products/${handle}`); }

    // Keep the image-search index in sync. Runs inline (blocks the webhook response) —
    // ponytail: fine for now at low volume, but at 40k-product production scale this
    // should move to a queue so slow Vision/GCS calls don't risk Shopify retrying the
    // webhook as "failed" just because indexing took a few extra seconds.
    if (visionSearchConfigured && payload.id) {
      const gid = `gid://shopify/Product/${payload.id}`;
      if (topic === "products/delete") {
        await removeProduct(gid).catch((e) => console.error("Vision removeProduct failed:", e));
      } else if (payload.title && payload.images?.[0]?.src) {
        await indexProduct({ id: gid, title: payload.title, imageUrl: payload.images[0].src }).catch((e) =>
          console.error("Vision indexProduct failed:", e)
        );
      }
    }
  } else if (topic.startsWith("collections/")) {
    revalidateTag("collections");
    if (handle) { revalidateTag(`collection:${handle}`); revalidatePath(`/collections/${handle}`); }
  } else if (topic.startsWith("articles/")) {
    revalidateTag("blog");
    if (handle) revalidateTag(`article:${handle}`);
  } else if (topic.startsWith("metaobjects/")) {
    revalidateTag("metaobjects");
  } else if (topic === "inventory_levels/update") {
    // ponytail: payload only has inventory_item_id, not the product handle — a precise
    // bust needs an Admin API lookup. Blunt-bust all products until that's worth adding.
    revalidateTag("products");
  } else {
    // Unknown/unregistered topic — bust everything rather than silently do nothing.
    revalidateTag("products");
    revalidateTag("collections");
    revalidateTag("blog");
  }

  return Response.json({ revalidated: true, topic });
}

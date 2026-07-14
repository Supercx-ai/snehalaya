import crypto from "node:crypto";
import { revalidateTag, revalidatePath } from "next/cache";

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
  const handle = (JSON.parse(body) as { handle?: string }).handle;

  if (topic.startsWith("products/")) {
    revalidateTag("products");
    if (handle) { revalidateTag(`product:${handle}`); revalidatePath(`/products/${handle}`); }
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

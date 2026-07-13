import crypto from "node:crypto";
import { revalidateTag } from "next/cache";

// Shopify product webhooks (create/update/delete) → verify HMAC → bust cached data.
// Set the webhook URL to https://<your-domain>/api/revalidate in Shopify Admin.
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

  revalidateTag("products");
  revalidateTag("collections");
  revalidateTag("blog");
  const handle = (JSON.parse(body) as { handle?: string }).handle;
  if (handle) { revalidateTag(`product:${handle}`); revalidateTag(`article:${handle}`); }

  return Response.json({ revalidated: true });
}

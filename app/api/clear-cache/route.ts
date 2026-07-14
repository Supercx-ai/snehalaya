import crypto from "node:crypto";
import { revalidateTag } from "next/cache";

// Manual full-cache purge for the /admin button. Gated by a shared secret —
// left open, anyone could force every visitor's next request to hit Shopify live.
export async function POST(req: Request) {
  const { secret } = (await req.json()) as { secret?: string };
  const expected = process.env.CACHE_CLEAR_SECRET;

  const a = Buffer.from(secret ?? "");
  const b = Buffer.from(expected ?? "");
  if (!expected || a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
    return new Response("unauthorized", { status: 401 });
  }

  for (const tag of ["products", "collections", "blog"]) revalidateTag(tag);

  return Response.json({ cleared: true });
}

import { NextResponse } from "next/server";
import { visionSearchConfigured, searchByImage } from "@/lib/visionSearch";
import { getProductByGid } from "@/lib/shopify";

export async function POST(req: Request) {
  if (!visionSearchConfigured) {
    return NextResponse.json({ error: "Image search isn't configured yet." }, { status: 501 });
  }

  const form = await req.formData();
  const file = form.get("image");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No image provided" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const matches = await searchByImage(buffer);

  const products = await Promise.all(
    matches.slice(0, 12).map((m) => getProductByGid(`gid://shopify/Product/${m.googleProductId}`))
  );

  return NextResponse.json({ products: products.filter(Boolean) });
}

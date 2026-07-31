"use client";

import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/shopify";
import WishlistHeart from "./WishlistHeart";
import LocalizedPrice from "./LocalizedPrice";

// Compact card sized for 4-across in the ~380px cart drawer — the full ProductCard's
// sizing/hover-bar assumptions don't fit this width, so this is a deliberately smaller variant.
export default function CartDrawerUpsellCard({ product: p }: { product: Product }) {
  return (
    <Link href={`/products/${p.handle}`} className="block w-full">
      <div className="relative w-full aspect-square rounded-md overflow-hidden bg-border-subtle">
        {p.featuredImage && <Image src={p.featuredImage.url} alt={p.featuredImage.altText ?? p.title} fill className="object-cover" />}
        <div className="absolute top-1.5 right-1.5">
          <WishlistHeart
            item={{
              handle: p.handle,
              title: p.title,
              image: p.featuredImage?.url ?? null,
              amount: p.priceRange.minVariantPrice.amount,
              currencyCode: p.priceRange.minVariantPrice.currencyCode,
            }}
          />
        </div>
      </div>
      <p className="mt-1.5 text-xs text-ink truncate">{p.title}</p>
      <p className="text-xs font-medium text-ink">
        <LocalizedPrice handle={p.handle} amount={p.priceRange.minVariantPrice.amount} currencyCode={p.priceRange.minVariantPrice.currencyCode} format="currency" />
      </p>
    </Link>
  );
}

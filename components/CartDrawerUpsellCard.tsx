"use client";

import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/shopify";
import { useCart } from "./CartProvider";
import LocalizedPrice from "./LocalizedPrice";

// Compact card sized for 4-across in the cart popup — image, title, price, and a "+" quick-add
// button (matches Figma node 2424-1335). Quick-add uses the product's first variant.
export default function CartDrawerUpsellCard({ product: p }: { product: Product }) {
  const { pending, addLine } = useCart();
  const variantId = p.variants?.nodes[0]?.id;

  return (
    <div className="block w-full">
      <Link href={`/products/${p.handle}`} className="block">
        <div className="relative w-full aspect-[3/4] rounded-[8px] overflow-hidden bg-border-subtle">
          {p.featuredImage && <Image src={p.featuredImage.url} alt={p.featuredImage.altText ?? p.title} fill className="object-cover" />}
        </div>
        <p className="mt-1.5 text-[11px] text-ink truncate">{p.title}</p>
      </Link>
      <div className="mt-0.5 flex items-center justify-between gap-1">
        <p className="text-[11px] font-semibold text-ink truncate">
          <LocalizedPrice handle={p.handle} amount={p.priceRange.minVariantPrice.amount} currencyCode={p.priceRange.minVariantPrice.currencyCode} format="currency" />
        </p>
        {variantId && (
          <button
            type="button"
            disabled={pending}
            onClick={() => addLine(variantId)}
            aria-label={`Add ${p.title} to cart`}
            className="flex size-6 shrink-0 items-center justify-center rounded-full border border-burgundy text-burgundy text-[15px] leading-none disabled:opacity-50"
          >
            +
          </button>
        )}
      </div>
    </div>
  );
}

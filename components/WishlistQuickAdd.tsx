"use client";

import Image from "next/image";
import Link from "next/link";
import { useWishlist } from "@/hooks/useWishlist";
import LocalizedPrice from "./LocalizedPrice";

// ponytail: wishlist items only store handle/title/image/price (no variant id), so this
// links through to the product page to complete the add rather than faking a one-click
// add that would need an extra product lookup for every item.
export default function WishlistQuickAdd() {
  const { wishlistItems } = useWishlist();
  if (wishlistItems.length === 0) return null;

  return (
    <details className="group border-t border-border-subtle py-4">
      <summary className="flex items-center justify-between cursor-pointer list-none text-sm text-ink">
        <span className="flex items-center gap-2">
          <svg viewBox="0 0 24 24" aria-hidden className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M19.6 4.3a5.4 5.4 0 0 0-7.6 0L12 4.4l-.5-.1a5.4 5.4 0 0 0-7.6 7.7l.5.5L12 20l7.6-7.6.5-.5a5.4 5.4 0 0 0 0-7.6Z" />
          </svg>
          Add more items from your Wishlist ({wishlistItems.length})
        </span>
        <span className="text-ink-faint transition-transform group-open:rotate-90">›</span>
      </summary>

      <div className="mt-4 flex gap-4 overflow-x-auto [scrollbar-width:none]">
        {wishlistItems.map((item) => (
          <Link key={item.handle} href={`/products/${item.handle}`} className="block w-28 shrink-0">
            <div className="relative w-28 h-36 rounded-md overflow-hidden bg-border-subtle">
              {item.image && <Image src={item.image} alt={item.title} fill className="object-cover" />}
            </div>
            <p className="mt-1.5 text-xs text-ink truncate">{item.title}</p>
            <p className="text-xs font-medium text-ink">
              <LocalizedPrice handle={item.handle} amount={item.amount} currencyCode={item.currencyCode} format="currency" />
            </p>
          </Link>
        ))}
      </div>
    </details>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { useWishlist } from "@/hooks/useWishlist";
import LocalizedPrice from "./LocalizedPrice";

function BookmarkIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="size-[18px]" aria-hidden>
      <path d="M6.5 3.5h11a1 1 0 0 1 1 1V21l-6.5-4.2L5.5 21V4.5a1 1 0 0 1 1-1Z" />
    </svg>
  );
}

// ponytail: wishlist items only store handle/title/image/price (no variant id), so this
// links through to the product page to complete the add rather than faking a one-click
// add that would need an extra product lookup for every item.
export default function WishlistQuickAdd() {
  const { wishlistItems } = useWishlist();
  if (wishlistItems.length === 0) return null;

  return (
    <details className="group mt-4 rounded-[10px] border border-[#e8e0d5] bg-white">
      <summary className="flex items-center gap-3 cursor-pointer list-none px-4 md:px-5 py-4 text-ink">
        <BookmarkIcon />
        <span className="flex-1 text-[14px]">Add more items from your Wishlist</span>
        <span className="text-[18px] leading-none text-[#666] transition-transform group-open:rotate-90">›</span>
      </summary>

      <div className="px-4 md:px-5 pb-5 flex gap-4 overflow-x-auto [scrollbar-width:none]">
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

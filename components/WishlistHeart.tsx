"use client";

import { useWishlist, type WishlistItem } from "@/hooks/useWishlist";

// Icon-only variant for product cards — sits inside a <Link>, so clicks must not navigate.
export default function WishlistHeart({ item }: { item: WishlistItem }) {
  const { isWishlisted, toggleWishlist } = useWishlist();
  const active = isWishlisted(item.handle);

  return (
    <button
      type="button"
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleWishlist(item); }}
      aria-pressed={active}
      aria-label={active ? "Remove from wishlist" : "Add to wishlist"}
      style={{
        position: "absolute", top: 8, right: 8, width: 32, height: 32, borderRadius: "50%",
        border: "none", background: "rgba(255,255,255,0.9)", cursor: "pointer", fontSize: "1rem",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}
    >
      {active ? "♥" : "♡"}
    </button>
  );
}

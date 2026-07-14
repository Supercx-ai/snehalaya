"use client";

import { useWishlist, type WishlistItem } from "@/hooks/useWishlist";

// Local-only wishlist (localStorage) — works today, no app/account needed.
// Swap for Wishlist Plus (Swym) later if you want it synced across devices/logged-in users.
export default function WishlistButton({ item }: { item: WishlistItem }) {
  const { isWishlisted, toggleWishlist } = useWishlist();
  const active = isWishlisted(item.handle);

  return (
    <button
      type="button"
      onClick={() => toggleWishlist(item)}
      aria-pressed={active}
      style={{ padding: "0.5rem 1rem", borderRadius: 8, border: "1px solid #ccc", background: active ? "#fee" : "#fff", cursor: "pointer" }}
    >
      {active ? "♥" : "♡"} Wishlist
    </button>
  );
}

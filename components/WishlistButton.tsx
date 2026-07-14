"use client";

import { useWishlist } from "@/hooks/useWishlist";

// Local-only wishlist (localStorage) — works today, no app/account needed.
// Swap for Wishlist Plus (Swym) later if you want it synced across devices/logged-in users.
export default function WishlistButton({ handle }: { handle: string }) {
  const { isWishlisted, toggleWishlist } = useWishlist();
  const active = isWishlisted(handle);

  return (
    <button
      type="button"
      onClick={() => toggleWishlist(handle)}
      aria-pressed={active}
      style={{ padding: "0.5rem 1rem", borderRadius: 8, border: "1px solid #ccc", background: active ? "#fee" : "#fff", cursor: "pointer" }}
    >
      {active ? "♥" : "♡"} Wishlist
    </button>
  );
}

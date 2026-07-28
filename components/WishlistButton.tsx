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
      aria-label={active ? "Remove from wishlist" : "Add to wishlist"}
      className={`w-11 h-11 rounded-lg border bg-[#fdeed9] flex items-center justify-center shrink-0 ${
        active ? "border-primary text-primary" : "border-[#f4dcbf] text-ink"
      }`}
    >
      {/* Real exported heart path (icon-wishlist.svg) — inlined so the fill can toggle with wishlist state. */}
      <svg width="18" height="18" viewBox="0 0 22.6047 22.6047" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M19.6275 4.34209C19.1464 3.8608 18.5753 3.47901 17.9466 3.21852C17.318 2.95804 16.6441 2.82397 15.9637 2.82397C15.2832 2.82397 14.6094 2.95804 13.9807 3.21852C13.3521 3.47901 12.7809 3.8608 12.2998 4.34209L11.3015 5.34046L10.3031 4.34209C9.33137 3.37038 8.01345 2.82447 6.63925 2.82447C5.26504 2.82447 3.94712 3.37038 2.97541 4.34209C2.0037 5.3138 1.4578 6.63172 1.4578 8.00592C1.4578 9.38013 2.0037 10.698 2.97541 11.6698L3.97378 12.6681L11.3015 19.9958L18.6291 12.6681L19.6275 11.6698C20.1088 11.1887 20.4906 10.6175 20.7511 9.98887C21.0115 9.36022 21.1456 8.6864 21.1456 8.00592C21.1456 7.32544 21.0115 6.65162 20.7511 6.02297C20.4906 5.39432 20.1088 4.82315 19.6275 4.34209Z"
          stroke="currentColor"
          strokeWidth="1.41281"
          strokeLinecap="round"
          fill={active ? "currentColor" : "none"}
        />
      </svg>
    </button>
  );
}

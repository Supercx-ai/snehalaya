"use client";

import { useWishlist, type WishlistItem } from "@/hooks/useWishlist";

// Icon-only variant for product cards — sits inside a <Link>, so clicks must not navigate.
// Parents position it (absolute wrapper); this is just the white chip itself, per the
// mega-menu/product-card chip in Figma (white rounded square, burgundy outline heart).
export default function WishlistHeart({ item, plp }: { item: WishlistItem; plp?: boolean }) {
  const { isWishlisted, toggleWishlist } = useWishlist();
  const active = isWishlisted(item.handle);

  return (
    <button
      type="button"
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleWishlist(item); }}
      aria-pressed={active}
      aria-label={active ? "Remove from wishlist" : "Add to wishlist"}
      className={
        plp
          ? "flex size-[34px] items-center justify-center rounded-full bg-[rgba(250,247,242,0.94)] shadow-[0_1px_3px_rgba(74,7,78,0.12)]"
          : "flex h-7 w-7 items-center justify-center rounded-lg bg-white/95 shadow-sm"
      }
    >
      {plp ? (
        <svg width="18" height="18" viewBox="0 0 17.9605 17.9605" fill="none" aria-hidden>
          <path
            d="M8.98078 15.3413L3.36813 9.72869C2.7727 9.13326 2.4382 8.32569 2.4382 7.48363C2.4382 6.64157 2.7727 5.834 3.36813 5.23857C3.96356 4.64315 4.77113 4.30864 5.61319 4.30864C6.45525 4.30864 7.26282 4.64315 7.85825 5.23857L8.98078 6.3611L10.1033 5.23857C10.6987 4.64315 11.5063 4.30864 12.3484 4.30864C13.1904 4.30864 13.998 4.64315 14.5934 5.23857C15.1889 5.834 15.5234 6.64157 15.5234 7.48363C15.5234 8.32569 15.1889 9.13326 14.5934 9.72869L8.98078 15.3413Z"
            stroke="#7B1E28"
            strokeWidth="1.12"
            strokeLinecap="square"
            strokeLinejoin="round"
            fill={active ? "#7B1E28" : "none"}
          />
        </svg>
      ) : (
        <svg width="14" height="14" viewBox="0 0 22.6047 22.6047" fill="none">
          <path
            d="M19.6275 4.34209C19.1464 3.8608 18.5753 3.47901 17.9466 3.21852C17.318 2.95804 16.6441 2.82397 15.9637 2.82397C15.2832 2.82397 14.6094 2.95804 13.9807 3.21852C13.3521 3.47901 12.7809 3.8608 12.2998 4.34209L11.3015 5.34046L10.3031 4.34209C9.33137 3.37038 8.01345 2.82447 6.63925 2.82447C5.26504 2.82447 3.94712 3.37038 2.97541 4.34209C2.0037 5.3138 1.4578 6.63172 1.4578 8.00592C1.4578 9.38013 2.0037 10.698 2.97541 11.6698L3.97378 12.6681L11.3015 19.9958L18.6291 12.6681L19.6275 11.6698C20.1088 11.1887 20.4906 10.6175 20.7511 9.98887C21.0115 9.36022 21.1456 8.6864 21.1456 8.00592C21.1456 7.32544 21.0115 6.65162 20.7511 6.02297C20.4906 5.39432 20.1088 4.82315 19.6275 4.34209Z"
            stroke="#67111a"
            strokeWidth="2"
            strokeLinecap="round"
            fill={active ? "#67111a" : "none"}
          />
        </svg>
      )}
    </button>
  );
}

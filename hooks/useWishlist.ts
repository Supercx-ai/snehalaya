"use client";

import { useEffect, useState } from "react";

const KEY = "wishlist";
const CHANGE_EVENT = "wishlist:change";

export type WishlistItem = { handle: string; title: string; image: string | null; amount: string; currencyCode: string };

function read(): WishlistItem[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(KEY) ?? "[]"); } catch { return []; }
}

export function useWishlist() {
  const [items, setItems] = useState<WishlistItem[]>([]);

  useEffect(() => {
    const sync = () => setItems(read());
    sync();
    // Every hook instance (page, header, each product-card heart) listens, so a toggle
    // anywhere updates all of them; "storage" covers other tabs.
    window.addEventListener(CHANGE_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(CHANGE_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  function toggleWishlist(item: WishlistItem) {
    // Re-read instead of trusting this instance's state — two hearts toggled in a row
    // would otherwise each start from their own stale copy and clobber the other's write.
    const current = read();
    const next = current.some((i) => i.handle === item.handle)
      ? current.filter((i) => i.handle !== item.handle)
      : [...current, item];
    localStorage.setItem(KEY, JSON.stringify(next));
    setItems(next);
    window.dispatchEvent(new Event(CHANGE_EVENT));
  }

  return { wishlistItems: items, isWishlisted: (handle: string) => items.some((i) => i.handle === handle), toggleWishlist };
}

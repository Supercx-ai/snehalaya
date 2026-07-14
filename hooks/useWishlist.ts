"use client";

import { useEffect, useState } from "react";

const KEY = "wishlist";

export type WishlistItem = { handle: string; title: string; image: string | null; amount: string; currencyCode: string };

function read(): WishlistItem[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(KEY) ?? "[]"); } catch { return []; }
}

export function useWishlist() {
  const [items, setItems] = useState<WishlistItem[]>([]);

  useEffect(() => { setItems(read()); }, []);

  function toggleWishlist(item: WishlistItem) {
    const next = items.some((i) => i.handle === item.handle)
      ? items.filter((i) => i.handle !== item.handle)
      : [...items, item];
    setItems(next);
    localStorage.setItem(KEY, JSON.stringify(next));
  }

  return { wishlistItems: items, isWishlisted: (handle: string) => items.some((i) => i.handle === handle), toggleWishlist };
}

"use client";

import { useEffect, useState } from "react";

const KEY = "wishlist";

function read(): string[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(KEY) ?? "[]"); } catch { return []; }
}

export function useWishlist() {
  const [handles, setHandles] = useState<string[]>([]);

  useEffect(() => { setHandles(read()); }, []);

  function toggleWishlist(handle: string) {
    const next = handles.includes(handle) ? handles.filter((h) => h !== handle) : [...handles, handle];
    setHandles(next);
    localStorage.setItem(KEY, JSON.stringify(next));
  }

  return { wishlistItems: handles, isWishlisted: (handle: string) => handles.includes(handle), toggleWishlist };
}

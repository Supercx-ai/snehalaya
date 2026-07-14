"use client";

import { useEffect, useState } from "react";

const KEY = "recently_viewed";
const MAX = 8;

export type ViewedProduct = { handle: string; title: string; image: string | null; amount: string; currencyCode: string };

function read(): ViewedProduct[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(KEY) ?? "[]"); } catch { return []; }
}

// Call with `current` on a PDP to record the view; omit to just read the list (e.g. on homepage).
export function useRecentlyViewed(current?: ViewedProduct) {
  const [items, setItems] = useState<ViewedProduct[]>([]);

  useEffect(() => {
    let list = read();
    if (current) {
      list = [current, ...list.filter((p) => p.handle !== current.handle)].slice(0, MAX);
      localStorage.setItem(KEY, JSON.stringify(list));
    }
    setItems(current ? list.filter((p) => p.handle !== current.handle) : list);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current?.handle]);

  return items;
}

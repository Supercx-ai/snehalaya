"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import ProductGrid from "./ProductGrid";
import type { Product, ProductFilter } from "@/lib/shopify";

type Page = { nodes: Product[]; filters: ProductFilter[]; pageInfo: { hasNextPage: boolean; endCursor: string | null } };

// Auto-fetches the next page when the sentinel scrolls into view.
// `resetKey` (the filter/sort/query string) forces a remount on change,
// so switching filters starts a fresh accumulated list instead of appending.
// `loadMore` is a server action pre-bound to everything except the cursor —
// lets collection and search pages share this component.
export default function InfiniteProducts({
  resetKey,
  initial,
  cursor,
  hasNext,
  loadMore,
}: {
  resetKey: string;
  initial: Product[];
  cursor: string | null;
  hasNext: boolean;
  loadMore: (cursor: string) => Promise<Page>;
}) {
  const [items, setItems] = useState(initial);
  const [nextCursor, setNextCursor] = useState(cursor);
  const [more, setMore] = useState(hasNext);
  const [pending, start] = useTransition();
  const sentinel = useRef<HTMLDivElement>(null);

  // Filters/sort changed → this component remounted with a new resetKey; sync fresh server data.
  useEffect(() => {
    setItems(initial);
    setNextCursor(cursor);
    setMore(hasNext);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetKey]);

  useEffect(() => {
    if (!more || !nextCursor) return;
    const el = sentinel.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !pending) {
          start(async () => {
            const page = await loadMore(nextCursor);
            setItems((prev) => [...prev, ...page.nodes]);
            setNextCursor(page.pageInfo.endCursor);
            setMore(page.pageInfo.hasNextPage);
          });
        }
      },
      { rootMargin: "400px" } // start fetching before the sentinel is actually visible
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [more, nextCursor, pending, loadMore]);

  return (
    <>
      <ProductGrid products={items} />
      {more && <div ref={sentinel} style={{ textAlign: "center", padding: "2rem", color: "#999" }}>{pending ? "Loading…" : ""}</div>}
    </>
  );
}

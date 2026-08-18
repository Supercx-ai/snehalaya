"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import ProductGrid from "./ProductGrid";
import type { Product, ProductFilter } from "@/lib/shopify";

type Page = { nodes: Product[]; filters?: ProductFilter[]; pageInfo: { hasNextPage: boolean; endCursor: string | null } };

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
  plp,
  saleOnly,
  keywordGroups,
  minDiscount,
}: {
  resetKey: string;
  initial: Product[];
  cursor: string | null;
  hasNext: boolean;
  loadMore: (cursor: string) => Promise<Page>;
  plp?: boolean;
  saleOnly?: boolean;
  /** Client-side keyword filter: OR within each group, AND across groups. */
  keywordGroups?: string[][];
  /** Client-side minimum discount %, computed from compareAt prices. */
  minDiscount?: number;
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
    if (plp) return;
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
        // PLP uses an explicit Load More button (Figma node 2239:383).
      },
      { rootMargin: "400px" } // start fetching before the sentinel is actually visible
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [plp, more, nextCursor, pending, loadMore]);

  // Client-side filters (On Sale chip, Occasion/Pattern/Work/Size keywords, Discount %):
  // Shopify's Storefront API can't express these, so hide non-matching items from the
  // accumulated list; infinite scroll keeps fetching to fill the gap.
  const hasClientFilter = saleOnly || (keywordGroups?.length ?? 0) > 0 || minDiscount != null;
  const visible = hasClientFilter
    ? items.filter((p) => {
        const compare = p.compareAtPriceRange?.minVariantPrice;
        const price = Number(p.priceRange.minVariantPrice.amount);
        const compareAmt = compare ? Number(compare.amount) : 0;
        const discounted = compareAmt > price;
        if (saleOnly && !discounted) return false;
        if (minDiscount != null) {
          if (!discounted) return false;
          if (((compareAmt - price) / compareAmt) * 100 < minDiscount) return false;
        }
        if (keywordGroups?.length) {
          const haystack = `${p.title} ${p.weaveType?.value ?? ""} ${(p.tags ?? []).join(" ")}`.toLowerCase();
          for (const group of keywordGroups) {
            if (!group.some((kw) => haystack.includes(kw.toLowerCase()))) return false;
          }
        }
        return true;
      })
    : items;

  function fetchNext() {
    if (!more || !nextCursor || pending) return;
    start(async () => {
      const page = await loadMore(nextCursor);
      setItems((prev) => [...prev, ...page.nodes]);
      setNextCursor(page.pageInfo.endCursor);
      setMore(page.pageInfo.hasNextPage);
    });
  }

  return (
    <>
      <ProductGrid products={visible} plp={plp} />
      {hasClientFilter && visible.length === 0 && !more && (
        <p className="py-16 text-center text-sm text-ink-subtle">No products match these filters right now.</p>
      )}
      {more && plp && (
        <div className="flex justify-center pt-10 pb-4">
          <button
            type="button"
            onClick={fetchNext}
            disabled={pending}
            className="h-[52px] w-[159px] rounded-[5px] border border-accent text-lg tracking-wide2 text-ink disabled:opacity-60"
          >
            {pending ? "Loading…" : "Load More"}
          </button>
        </div>
      )}
      {more && !plp && <div ref={sentinel} style={{ textAlign: "center", padding: "2rem", color: "#999" }}>{pending ? "Loading…" : ""}</div>}
    </>
  );
}

"use client";

import { useState, useTransition } from "react";
import ProductGrid from "./ProductGrid";
import { loadMoreProducts } from "@/lib/products";
import type { Product } from "@/lib/shopify";

// Renders the grid + a "Load more" button that lazy-fetches the next page.
export default function Products({
  initial,
  cursor: initialCursor,
  hasNext: initialHasNext,
}: {
  initial: Product[];
  cursor: string | null;
  hasNext: boolean;
}) {
  const [items, setItems] = useState(initial);
  const [cursor, setCursor] = useState(initialCursor);
  const [hasNext, setHasNext] = useState(initialHasNext);
  const [pending, start] = useTransition();

  return (
    <>
      <ProductGrid products={items} />
      {hasNext && cursor && (
        <div style={{ textAlign: "center", marginTop: "2rem" }}>
          <button
            disabled={pending}
            style={{ padding: "0.75rem 2rem", borderRadius: 8, border: "1px solid #ccc", background: "#fff", cursor: "pointer" }}
            onClick={() =>
              start(async () => {
                const page = await loadMoreProducts(cursor);
                setItems((prev) => [...prev, ...page.nodes]);
                setCursor(page.pageInfo.endCursor);
                setHasNext(page.pageInfo.hasNextPage);
              })
            }
          >
            {pending ? "Loading…" : "Load more"}
          </button>
        </div>
      )}
    </>
  );
}

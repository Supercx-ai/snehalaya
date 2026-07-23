"use client";

import { useState } from "react";
import type { Product } from "@/lib/shopify";
import ProductScroller, { useCardScroll } from "./ProductScroller";

export default function TrendingPicks({ trending, snehasPicks }: { trending: Product[]; snehasPicks: Product[] }) {
  const [tab, setTab] = useState<"trending" | "picks">("trending");
  const { scrollerRef } = useCardScroll();
  const products = tab === "trending" ? trending : snehasPicks;

  if (trending.length === 0 && snehasPicks.length === 0) return null;

  return (
    <section className="max-w-[1280px] mx-auto px-4 md:px-9 py-16">
      <h2 className="text-center font-display font-light text-heading-sm md:text-heading-xl text-ink">Trending &amp; Sneha&apos;s Picks</h2>

      <div className="mt-6 flex justify-center">
        <div className="inline-flex bg-border-subtle rounded-full p-1">
          <button
            onClick={() => setTab("trending")}
            className={`h-[39px] px-6 rounded-full text-xs tracking-wide2 ${tab === "trending" ? "bg-primary text-white" : "text-primary"}`}
          >
            Trending Now
          </button>
          <button
            onClick={() => setTab("picks")}
            className={`h-[39px] px-6 rounded-full text-xs tracking-wide2 ${tab === "picks" ? "bg-primary text-white" : "text-primary"}`}
          >
            Sneha&apos;s Picks
          </button>
        </div>
      </div>

      <div className="mt-10">
        <ProductScroller products={products} scrollerRef={scrollerRef} />
      </div>
    </section>
  );
}

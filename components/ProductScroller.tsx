"use client";

import { useRef } from "react";
import type { Product } from "@/lib/shopify";
import ProductCard from "./ProductCard";

export function useCardScroll() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  function scrollByCard(dir: 1 | -1) {
    scrollerRef.current?.scrollBy({ left: dir * 284, behavior: "smooth" });
  }
  return { scrollerRef, scrollByCard };
}

export function ScrollButtons({ onPrev, onNext }: { onPrev: () => void; onNext: () => void }) {
  return (
    <div className="flex gap-2">
      <button onClick={onPrev} aria-label="Previous" className="w-[42px] h-[42px] rounded-full border border-border-subtle flex items-center justify-center">‹</button>
      <button onClick={onNext} aria-label="Next" className="w-[42px] h-[42px] rounded-full bg-primary text-white flex items-center justify-center">›</button>
    </div>
  );
}

export default function ProductScroller({
  products, showNewBadge, scrollerRef,
}: { products: Product[]; showNewBadge?: boolean; scrollerRef: React.RefObject<HTMLDivElement | null> }) {
  return (
    <div ref={scrollerRef} className="flex gap-6 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none]">
      {products.map((p) => <ProductCard key={p.id} product={p} showNewBadge={showNewBadge} />)}
    </div>
  );
}

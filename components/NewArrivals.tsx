"use client";

import Link from "next/link";
import type { Product } from "@/lib/shopify";
import ProductScroller, { ScrollButtons, useCardScroll } from "./ProductScroller";

export default function NewArrivals({ products }: { products: Product[] }) {
  const { scrollerRef, scrollByCard } = useCardScroll();

  if (products.length === 0) return null;

  return (
    <section className="max-w-[1280px] mx-auto px-9 py-16">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h2 className="font-display font-light text-heading-lg text-ink">New Arrivals</h2>
          <p className="mt-1 text-base text-ink-subtle">Freshly added sarees, selected for you.</p>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/collections/new-arrivals" className="text-2xs tracking-wide2 uppercase text-primary">View All</Link>
          <ScrollButtons onPrev={() => scrollByCard(-1)} onNext={() => scrollByCard(1)} />
        </div>
      </div>

      <ProductScroller products={products} showNewBadge scrollerRef={scrollerRef} />
    </section>
  );
}

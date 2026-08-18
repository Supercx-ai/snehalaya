"use client";

import Link from "next/link";
import type { Product } from "@/lib/shopify";
import ProductCard from "./ProductCard";
import ProductScroller, { ScrollButtons, useCardScroll } from "./ProductScroller";

export default function NewArrivals({ products }: { products: Product[] }) {
  const { scrollerRef, scrollByCard } = useCardScroll();

  if (products.length === 0) return null;

  return (
    <section className="max-w-[1280px] mx-auto px-4 md:px-9 py-16">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <h2 className="font-display font-light text-heading-sm md:text-heading-lg text-ink">New Arrivals</h2>
          <p className="mt-1 text-base text-ink-subtle">Freshly added sarees, selected for you.</p>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/collections/new-arrival" className="text-2xs tracking-wide2 uppercase text-primary">View All</Link>
          <div className="hidden md:block">
            <ScrollButtons onPrev={() => scrollByCard(-1)} onNext={() => scrollByCard(1)} />
          </div>
        </div>
      </div>

      {/* Mobile shows a fixed 2x2 grid with an "Explore Collection" CTA in place of more
          cards, instead of the horizontal-scroll strip used from md: up. */}
      <div className="grid grid-cols-2 gap-3 md:hidden">
        {products.slice(0, 4).map((p) => <ProductCard key={p.id} product={p} showNewBadge fluid />)}
      </div>
      {products.length > 4 && (
        <div className="text-center mt-8 md:hidden">
          <Link href="/collections/new-arrival" className="inline-flex items-center justify-center h-[41px] px-8 rounded-sm bg-primary text-cream text-2xs font-semibold tracking-wide2 uppercase">
            Explore Collection
          </Link>
        </div>
      )}

      <div className="hidden md:block">
        <ProductScroller products={products} showNewBadge scrollerRef={scrollerRef} />
      </div>
    </section>
  );
}

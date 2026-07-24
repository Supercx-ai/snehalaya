"use client";

import Image from "next/image";
import Link from "next/link";
import { useRecentlyViewed, type ViewedProduct } from "@/hooks/useRecentlyViewed";
import LocalizedPrice from "./LocalizedPrice";

export default function RecentlyViewed({ current }: { current?: ViewedProduct }) {
  const items = useRecentlyViewed(current);
  if (items.length === 0) return null;

  return (
    <section className="max-w-[1280px] mx-auto px-4 md:px-9 py-12">
      <h2 className="font-display font-light text-heading-sm md:text-heading-lg text-ink">Recently Viewed</h2>
      <div className="mt-6 flex gap-6 overflow-x-auto [scrollbar-width:none]">
        {items.map((p) => (
          <Link key={p.handle} href={`/products/${p.handle}`} className="block w-[160px] shrink-0">
            <div className="relative rounded-card overflow-hidden bg-border-subtle aspect-[264/352]">
              {p.image && <Image src={p.image} alt={p.title} fill className="object-cover" />}
            </div>
            <p className="mt-2 font-display text-card-title text-ink truncate">{p.title}</p>
            <p className="mt-0.5 text-sm font-medium text-ink">
              <LocalizedPrice handle={p.handle} amount={p.amount} currencyCode={p.currencyCode} format="currency" />
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}

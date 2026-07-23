"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Product } from "@/lib/shopify";
import WishlistHeart from "./WishlistHeart";
import LocalizedPrice from "./LocalizedPrice";

export default function ProductCard({ product: p, showNewBadge, fluid }: { product: Product; showNewBadge?: boolean; fluid?: boolean }) {
  const router = useRouter();
  const compareAt = p.compareAtPriceRange?.minVariantPrice;
  const onSale = compareAt && Number(compareAt.amount) > Number(p.priceRange.minVariantPrice.amount);
  const similarQuery = p.weaveType?.value ?? p.title;

  return (
    <Link href={`/products/${p.handle}`} className={`group ${fluid ? "block w-full md:w-[264px] md:shrink-0" : "block w-[264px] shrink-0"}`}>
      <div className="relative rounded-card overflow-hidden bg-border-subtle aspect-[264/352]">
        {p.featuredImage && (
          <Image src={p.featuredImage.url} alt={p.featuredImage.altText ?? p.title} fill className="object-cover" />
        )}
        <div className="absolute top-3 right-3">
          <WishlistHeart
            item={{
              handle: p.handle,
              title: p.title,
              image: p.featuredImage?.url ?? null,
              amount: p.priceRange.minVariantPrice.amount,
              currencyCode: p.priceRange.minVariantPrice.currencyCode,
            }}
          />
        </div>
        {showNewBadge && (
          <span className="absolute bottom-3 left-3 bg-primary text-cream text-tiny tracking-wide2 uppercase px-2 py-0.5 rounded-sm">
            New
          </span>
        )}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            router.push(`/search?q=${encodeURIComponent(similarQuery)}`);
          }}
          className="absolute inset-x-0 bottom-0 h-12 bg-cream flex items-center justify-between pl-4 pr-1.5"
        >
          <span className="flex items-center gap-1.5 text-xs text-ink">
            <span className="text-accent text-lg leading-none">•</span>
            Find Similar
          </span>
          <span className="w-9 h-9 rounded-full bg-primary flex items-center justify-center shrink-0">
            <Image src="/figma/icon-image-search.svg" alt="" width={16} height={16} />
          </span>
        </button>
      </div>
      <div className="mt-3">
        {p.weaveType?.value && <p className="text-label tracking-wide2 text-accent uppercase">{p.weaveType.value}</p>}
        <p className="mt-1 font-display text-card-title text-ink">{p.title}</p>
        <p className="mt-1 text-sm font-medium text-ink flex items-baseline gap-2">
          <LocalizedPrice handle={p.handle} amount={p.priceRange.minVariantPrice.amount} currencyCode={p.priceRange.minVariantPrice.currencyCode} format="currency" />
          {onSale && compareAt && (
            <span className="text-2xs font-normal text-ink-faint line-through">
              <LocalizedPrice handle={p.handle} amount={compareAt.amount} currencyCode={compareAt.currencyCode} format="currency" />
            </span>
          )}
        </p>
      </div>
    </Link>
  );
}

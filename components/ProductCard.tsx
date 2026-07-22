import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/shopify";
import WishlistHeart from "./WishlistHeart";
import LocalizedPrice from "./LocalizedPrice";

export default function ProductCard({ product: p, showNewBadge }: { product: Product; showNewBadge?: boolean }) {
  const compareAt = p.compareAtPriceRange?.minVariantPrice;
  const onSale = compareAt && Number(compareAt.amount) > Number(p.priceRange.minVariantPrice.amount);

  return (
    <Link href={`/products/${p.handle}`} className="block w-[264px] shrink-0">
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

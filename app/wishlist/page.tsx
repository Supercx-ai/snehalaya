"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useWishlist, type WishlistItem } from "@/hooks/useWishlist";
import { getWishlistProducts, type WishlistProduct } from "@/lib/wishlist";
import { useCart } from "@/components/CartProvider";
import LocalizedPrice from "@/components/LocalizedPrice";

// "Saved Heirlooms" — Figma node 2505:1158. localStorage holds handle/title/image/price;
// live stock, compare-at, weave label and the variant id come from a server action.
export default function WishlistPage() {
  const { wishlistItems, toggleWishlist } = useWishlist();
  const { addLine } = useCart();
  const [products, setProducts] = useState<Record<string, WishlistProduct | null>>({});
  const [hydrated, setHydrated] = useState(false);
  const fetched = useRef<Set<string>>(new Set());

  useEffect(() => setHydrated(true), []);

  const handles = wishlistItems.map((i) => i.handle).join(",");
  useEffect(() => {
    const missing = handles.split(",").filter((h) => h && !fetched.current.has(h));
    if (!missing.length) return;
    missing.forEach((h) => fetched.current.add(h));
    let cancelled = false;
    getWishlistProducts(missing).then((res) => { if (!cancelled) setProducts((prev) => ({ ...prev, ...res })); });
    return () => { cancelled = true; };
  }, [handles]);

  // localStorage isn't readable during SSR — hold the frame until mount so the
  // empty state doesn't flash for visitors who do have saved pieces.
  if (!hydrated) return <main className="bg-cream min-h-[480px]" />;

  if (wishlistItems.length === 0) {
    return (
      <main className="bg-cream">
        <div className="mx-auto max-w-[1280px] px-4 md:px-8 xl:px-20 pt-12 pb-24">
          <p className="text-xs font-bold uppercase tracking-[1.5px] text-accent">Your Personal Vault</p>
          <h1 className="mt-2 font-display font-light text-heading-sm md:text-heading-md text-burgundy">Your wishlist is empty</h1>
          <p className="mt-4 max-w-md text-base text-ink-subtle">
            Explore our collections and tap the heart on any saree to keep it safe here.
          </p>
          <Link
            href="/collections"
            className="mt-8 inline-flex h-[42px] items-center justify-center rounded-md border-[1.5px] border-burgundy px-8 text-sm font-bold uppercase text-burgundy"
          >
            Continue Shopping
          </Link>
        </div>
      </main>
    );
  }

  const moveToBag = (item: WishlistItem) => {
    const variant = products[item.handle]?.variants.nodes[0];
    if (!variant) return;
    addLine(variant.id);
    toggleWishlist(item); // "move", not "copy" — it leaves the vault once it's in the bag
  };

  return (
    <main className="bg-cream">
      <div className="mx-auto max-w-[1280px] px-4 md:px-8 xl:px-20">
        <section className="pt-12 pb-8">
          <p className="text-xs font-bold uppercase tracking-[1.5px] text-accent">Your Personal Vault</p>
          <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <h1 className="font-display font-light text-heading-sm md:text-heading-md text-burgundy">Saved Heirlooms</h1>
            <p className="text-base text-ink-subtle sm:pb-1.5">
              {wishlistItems.length} exquisite {wishlistItems.length === 1 ? "piece" : "pieces"} curated in your collection
            </p>
          </div>
        </section>

        <div className="flex flex-col gap-8 pb-20 lg:flex-row">
          <div className="grid flex-1 content-start grid-cols-1 gap-6 sm:grid-cols-2">
            {wishlistItems.map((item) => (
              <SavedCard
                key={item.handle}
                item={item}
                product={products[item.handle]}
                loaded={item.handle in products}
                onRemove={() => toggleWishlist(item)}
                onMoveToBag={() => moveToBag(item)}
              />
            ))}
          </div>
          <TrustSidePanel />
        </div>
      </div>
    </main>
  );
}

function SavedCard({
  item, product, loaded, onRemove, onMoveToBag,
}: {
  item: WishlistItem;
  product: WishlistProduct | null | undefined;
  loaded: boolean;
  onRemove: () => void;
  onMoveToBag: () => void;
}) {
  const price = product?.priceRange.minVariantPrice ?? { amount: item.amount, currencyCode: item.currencyCode };
  const compareAt = product?.compareAtPriceRange?.minVariantPrice;
  const onSale = compareAt && Number(compareAt.amount) > Number(price.amount);
  const variant = product?.variants.nodes[0];
  const available = variant?.availableForSale ?? true;
  const lowStock = available && product?.totalInventory === 1;
  const image = product?.featuredImage?.url ?? item.image;
  const title = product?.title ?? item.title;

  return (
    <article className="flex flex-col overflow-hidden rounded-lg border border-border bg-white">
      <div className="relative h-[320px] bg-border-subtle">
        <Link href={`/products/${item.handle}`} className="absolute inset-0">
          {image && <Image src={image} alt={title} fill className="object-cover" />}
        </Link>
        <button
          type="button"
          onClick={onRemove}
          aria-label="Remove from wishlist"
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-cream shadow-md"
        >
          {/* Same exported heart path as WishlistButton, sized down to the 16px vault variant. */}
          <svg width="16" height="16" viewBox="0 0 22.6047 22.6047" fill="none">
            <path
              d="M19.6275 4.34209C19.1464 3.8608 18.5753 3.47901 17.9466 3.21852C17.318 2.95804 16.6441 2.82397 15.9637 2.82397C15.2832 2.82397 14.6094 2.95804 13.9807 3.21852C13.3521 3.47901 12.7809 3.8608 12.2998 4.34209L11.3015 5.34046L10.3031 4.34209C9.33137 3.37038 8.01345 2.82447 6.63925 2.82447C5.26504 2.82447 3.94712 3.37038 2.97541 4.34209C2.0037 5.3138 1.4578 6.63172 1.4578 8.00592C1.4578 9.38013 2.0037 10.698 2.97541 11.6698L3.97378 12.6681L11.3015 19.9958L18.6291 12.6681L19.6275 11.6698C20.1088 11.1887 20.4906 10.6175 20.7511 9.98887C21.0115 9.36022 21.1456 8.6864 21.1456 8.00592C21.1456 7.32544 21.0115 6.65162 20.7511 6.02297C20.4906 5.39432 20.1088 4.82315 19.6275 4.34209Z"
              stroke="#67111a"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>

      <div className="flex grow flex-col gap-4 p-5">
        <div className="flex grow flex-col gap-1.5">
          {product?.weaveType?.value && (
            <p className="text-[10px] font-bold uppercase tracking-wide2 text-accent">{product.weaveType.value}</p>
          )}
          <Link href={`/products/${item.handle}`}>
            <h2 className="font-display text-2xl leading-tight text-ink">{title}</h2>
          </Link>
          <p className="flex items-center gap-3">
            <span className="text-md font-bold text-burgundy">
              <LocalizedPrice handle={item.handle} amount={price.amount} currencyCode={price.currencyCode} format="currency" />
            </span>
            {onSale && compareAt && (
              <span className="text-xs text-[#999999] line-through">
                <LocalizedPrice handle={item.handle} amount={compareAt.amount} currencyCode={compareAt.currencyCode} format="currency" />
              </span>
            )}
            {loaded && product && (
              <>
                <span className="h-[3px] w-[3px] rounded-full bg-border" aria-hidden />
                {/* Colors straight from Figma: green for In/Out of Stock, burgundy for Only 1 Left. */}
                <span className={`text-[11px] font-semibold ${lowStock ? "text-burgundy" : "text-[#2e7d32]"}`}>
                  {!available ? "Out of Stock" : lowStock ? "Only 1 Left" : "In Stock"}
                </span>
              </>
            )}
          </p>
        </div>

        {available ? (
          <button
            type="button"
            disabled={!variant}
            onClick={onMoveToBag}
            className="h-[42px] w-full rounded-md bg-burgundy text-sm font-bold uppercase text-cream"
          >
            Move to Bag
          </button>
        ) : (
          <button type="button" disabled className="h-[42px] w-full rounded-md bg-[#f1ebe3] text-sm font-bold uppercase text-[#999999]">
            Out of Stock
          </button>
        )}
      </div>
    </article>
  );
}

function TrustSidePanel() {
  return (
    <aside className="flex w-full shrink-0 flex-col gap-6 lg:w-[340px]">
      <section className="flex flex-col gap-5 rounded-lg border border-border bg-white p-7">
        <div className="flex items-center gap-2.5">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#b89552" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <circle cx="6" cy="6" r="3" />
            <path d="M8.12 8.12 12 12" />
            <path d="M20 4 8.12 15.88" />
            <circle cx="6" cy="18" r="3" />
            <path d="M14.8 14.8 20 20" />
          </svg>
          <h2 className="font-display text-[22px] leading-tight text-burgundy">Bespoke Stitching</h2>
        </div>
        <p className="text-sm leading-5 text-ink-subtle">
          All handloom sarees saved in your vault qualify for our complimentary custom fall, edging, and unstitched
          matching blouse service.
        </p>
        <hr className="border-border" />
        <Link href="/faq" className="flex items-center gap-1.5 text-xs font-bold text-burgundy">
          View Custom Options
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
        </Link>
      </section>

      <section className="flex flex-col gap-5 rounded-lg bg-[#fff4df] p-7">
        <div className="flex items-center gap-2.5">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#67111a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5" />
            <rect x="2" y="6" width="14" height="12" rx="2" />
          </svg>
          <h2 className="font-display text-[22px] leading-tight text-burgundy">Live video shopping</h2>
        </div>
        <p className="text-sm leading-5 text-ink-subtle">
          Want to inspect the drapes or colors of your saved sarees in real sunlight? Book an exclusive, private video
          session with our master stylists.
        </p>
        <Link
          href="/store-locator"
          className="flex h-10 w-full items-center justify-center rounded-md bg-burgundy text-xs font-bold uppercase text-cream"
        >
          Book Sitting Session
        </Link>
      </section>

      <section className="flex flex-col items-center gap-3 rounded-lg border border-border bg-white p-7">
        <p className="text-base text-ink-subtle">Ready to find more pieces?</p>
        <Link
          href="/collections"
          className="flex h-[42px] w-full items-center justify-center rounded-md border-[1.5px] border-burgundy text-sm font-bold uppercase text-burgundy"
        >
          Continue Shopping
        </Link>
      </section>
    </aside>
  );
}

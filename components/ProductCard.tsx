"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Product } from "@/lib/shopify";
import WishlistHeart from "./WishlistHeart";
import LocalizedPrice from "./LocalizedPrice";
import { useCart } from "./CartProvider";

// The PLP comp shows a gold weave/category label above every product name
// (Kanjivaram, Chanderi, Paithani…). Most products on this store have no
// weave_type metafield, but their titles name the weave — so derive it:
// metafield → weave keyword from the title → Shopify productType.
const CATEGORY_KEYWORDS = [
  "Kanjivaram", "Kanchipuram", "Kanchi", "Banarasi", "Banaras", "Chanderi",
  "Paithani", "Tussar", "Tussara", "Kota", "Chettinad", "Gadwal", "Organza",
  "Chiffon", "Georgette", "Linen", "Mangalgiri", "Narayanpet", "Venkatagiri",
  "Cotton", "Silk",
];

function deriveCategory(p: Product): string | null {
  if (p.weaveType?.value) return p.weaveType.value;
  const title = p.title.toLowerCase();
  const hit = CATEGORY_KEYWORDS.find((k) => title.includes(k.toLowerCase()));
  return hit ?? (p.productType || null);
}

export default function ProductCard({
  product: p, showNewBadge, fluid, fullWidth, quickAdd, plp,
}: { product: Product; showNewBadge?: boolean; fluid?: boolean; fullWidth?: boolean; quickAdd?: boolean; plp?: boolean }) {
  const router = useRouter();
  const { addLine } = useCart();
  const firstVariant = p.variants.nodes[0];
  const compareAt = p.compareAtPriceRange?.minVariantPrice;
  const onSale = compareAt && Number(compareAt.amount) > Number(p.priceRange.minVariantPrice.amount);
  const similarQuery = p.weaveType?.value ?? p.title;
  // fullWidth: sized entirely by the parent grid cell (e.g. a PLP grid) — never reverts to
  // the fixed carousel width the way `fluid` does for the mobile-grid/desktop-scroller cases.
  const widthClass = fullWidth ? "w-full" : fluid ? "w-full md:w-[264px] md:shrink-0" : "w-[264px] shrink-0";

  return (
    <Link href={`/products/${p.handle}`} className={`group block ${widthClass}`}>
      <div className={`relative overflow-hidden bg-border-subtle ${plp ? "rounded-[10px] aspect-[289/386]" : "rounded-card aspect-[264/352]"}`}>
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
          plp ? (
            // PLP comp (MacBook Air - 5): larger burgundy pill, sentence case
            <span className="absolute bottom-3 left-3 bg-burgundy text-white text-sm px-3 py-1 rounded-[6px]">
              New
            </span>
          ) : (
            <span className="absolute bottom-3 left-3 bg-primary text-cream text-tiny tracking-wide2 uppercase px-2 py-0.5 rounded-sm">
              New
            </span>
          )
        )}
        {/* White "On Sale" pill, top-left — image-search results grid, node 2467:2 */}
        {onSale && (
          <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-xs text-ink shadow-sm">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#67111a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z" />
              <circle cx="7.5" cy="7.5" r="0.5" fill="#67111a" />
            </svg>
            On Sale
          </span>
        )}
        {quickAdd && firstVariant?.availableForSale && (
          <button
            type="button"
            aria-label="Quick add to cart"
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); addLine(firstVariant.id); }}
            className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-primary text-white text-lg leading-none flex items-center justify-center"
          >
            +
          </button>
        )}
        {!plp && (
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
        )}
      </div>
      {plp ? (
        /* PLP comp meta: category Manrope 14/1.5px gold, title Cormorant 19, price Manrope Medium 14 —
           fixed at the comp's sizes (per feedback: no proportional scale-up on this page). */
        <div className="mt-3.5">
          {deriveCategory(p) && (
            <p className="text-base tracking-[1.5px] text-accent">{deriveCategory(p)}</p>
          )}
          <p className="mt-1.5 font-display text-[19px] leading-[1.3] text-ink">{p.title}</p>
          <p className="mt-2 text-base font-medium text-ink flex items-baseline gap-2.5">
            <LocalizedPrice handle={p.handle} amount={p.priceRange.minVariantPrice.amount} currencyCode={p.priceRange.minVariantPrice.currencyCode} format="currency" />
            {onSale && compareAt && (
              <span className="font-normal text-[#999999] line-through">
                <LocalizedPrice handle={p.handle} amount={compareAt.amount} currencyCode={compareAt.currencyCode} format="currency" />
              </span>
            )}
          </p>
        </div>
      ) : (
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
      )}
    </Link>
  );
}

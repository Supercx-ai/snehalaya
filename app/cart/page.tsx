"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/components/CartProvider";
import { getUpsell } from "@/lib/cart";
import type { Product } from "@/lib/shopify";
import CartProgressSteps from "@/components/CartProgressSteps";
import FreeShippingProgress from "@/components/FreeShippingProgress";
import CartLineItem, { CART_TABLE_GRID } from "@/components/CartLineItem";
import WishlistQuickAdd from "@/components/WishlistQuickAdd";
import WishlistHeart from "@/components/WishlistHeart";
import OrderSummary from "@/components/OrderSummary";
import LocalizedPrice from "@/components/LocalizedPrice";

function ArrowButton({ direction, onClick }: { direction: "left" | "right"; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={direction === "left" ? "Scroll left" : "Scroll right"}
      className={`absolute top-[38%] z-10 hidden md:flex size-9 items-center justify-center rounded-full bg-white border border-[#e5ddd0] shadow-[0_1px_4px_rgba(0,0,0,0.08)] text-ink ${
        direction === "left" ? "-left-3" : "-right-3"
      }`}
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="size-4" aria-hidden>
        {direction === "left" ? <path d="M14.5 6 8.5 12l6 6" /> : <path d="m9.5 6 6 6-6 6" />}
      </svg>
    </button>
  );
}

export default function CartPage() {
  const { cart } = useCart();
  const [similar, setSimilar] = useState<Product[]>([]);
  const railRef = useRef<HTMLDivElement>(null);

  const cartProductIds = cart?.lines.nodes.map((l) => l.merchandise.product.id).join(",") ?? "";
  useEffect(() => {
    const ids = cartProductIds.split(",").filter(Boolean);
    if (ids.length === 0) return;
    getUpsell(ids[0], ids)
      .then(setSimilar)
      .catch((e) => { console.error("[cart] upsell failed:", e); setSimilar([]); });
  }, [cartProductIds]);

  const scrollRail = (dir: 1 | -1) => railRef.current?.scrollBy({ left: dir * 220, behavior: "smooth" });

  if (!cart || cart.lines.nodes.length === 0) {
    return (
      <main className="bg-cream min-h-[50vh]">
        <div className="px-4 md:px-[30px] py-16 text-center">
          <h1 className="font-display font-light text-[32px] text-ink">Your Cart</h1>
          <p className="mt-2 text-sm text-ink-subtle">
            It&apos;s empty. <Link href="/" className="text-burgundy font-medium">Browse products →</Link>
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-cream">
      <div className="px-4 md:px-[30px] py-8 md:py-10">
        <div className="relative lg:min-h-[84px]">
          <div>
            <h1 className="font-display text-[28px] md:text-[32px] leading-none text-ink">
              Your Cart{" "}
              <span className="font-sans text-[15px] font-normal text-[#888]">
                ({cart.totalQuantity} {cart.totalQuantity === 1 ? "Item" : "Items"})
              </span>
            </h1>
            <p className="mt-2 text-[13px] text-[#777]">Review your items and proceed to checkout</p>
          </div>
          <div className="mt-8 lg:mt-0 lg:absolute lg:top-0 lg:left-1/2 lg:-translate-x-1/2">
            <CartProgressSteps current="cart" />
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_380px] xl:grid-cols-[minmax(0,1fr)_400px] gap-8 xl:gap-9 items-start">
          <div>
            <FreeShippingProgress subtotal={Number(cart.cost.subtotalAmount.amount)} currencyCode={cart.cost.subtotalAmount.currencyCode} />

            <div className="mt-5 rounded-[10px] border border-[#e8e0d5] bg-white overflow-hidden">
              <div className={`hidden md:grid ${CART_TABLE_GRID} gap-x-4 bg-[#f7f4ee] px-5 py-3 text-[11px] font-semibold tracking-[1.4px] text-[#555] uppercase`}>
                <span>Product</span>
                <span className="text-center">Price</span>
                <span className="text-center">Quantity</span>
                <span className="text-center">Total</span>
                <span />
              </div>
              <div className="divide-y divide-[#f0e9de]">
                {cart.lines.nodes.map((line) => <CartLineItem key={line.id} line={line} />)}
              </div>
            </div>

            <WishlistQuickAdd />

            {similar.length > 0 && (
              <div className="mt-10">
                <h2 className="text-[16px] font-semibold text-ink">You May Also Like</h2>
                <div className="relative mt-4">
                  <div ref={railRef} className="flex gap-4 overflow-x-auto pb-1 [scrollbar-width:none]">
                    {similar.map((p) => (
                      <Link
                        key={p.id}
                        href={`/products/${p.handle}`}
                        className="block w-[190px] shrink-0 rounded-[10px] border border-[#eee7db] bg-white overflow-hidden shadow-[0_1px_4px_rgba(0,0,0,0.04)]"
                      >
                        <div className="relative w-full aspect-[10/11] bg-border-subtle">
                          {p.featuredImage && (
                            <Image src={p.featuredImage.url} alt={p.featuredImage.altText ?? p.title} fill className="object-cover" />
                          )}
                          <span className="absolute top-2 right-2">
                            <WishlistHeart
                              plp
                              item={{
                                handle: p.handle,
                                title: p.title,
                                image: p.featuredImage?.url ?? null,
                                amount: p.priceRange.minVariantPrice.amount,
                                currencyCode: p.priceRange.minVariantPrice.currencyCode,
                              }}
                            />
                          </span>
                          <span className="absolute bottom-2 right-2 flex size-7 items-center justify-center rounded-full bg-white border border-[#eadfd0] shadow-sm text-burgundy text-[17px] leading-none" aria-hidden>
                            +
                          </span>
                        </div>
                        <div className="px-3 py-2.5">
                          <p className="text-[13px] text-ink truncate">{p.title}</p>
                          <p className="mt-1 text-[14px] font-bold text-ink">
                            <LocalizedPrice
                              handle={p.handle}
                              amount={p.priceRange.minVariantPrice.amount}
                              currencyCode={p.priceRange.minVariantPrice.currencyCode}
                              format="currency"
                            />
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                  <ArrowButton direction="left" onClick={() => scrollRail(-1)} />
                  <ArrowButton direction="right" onClick={() => scrollRail(1)} />
                </div>
              </div>
            )}
          </div>

          <div className="lg:sticky lg:top-24">
            <OrderSummary cart={cart} actionHref="/cart/shipping" actionLabel="Proceed to Shipping" />
          </div>
        </div>
      </div>
    </main>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useCart } from "@/components/CartProvider";
import { getUpsell } from "@/lib/cart";
import type { Product } from "@/lib/shopify";
import CartProgressSteps from "@/components/CartProgressSteps";
import FreeShippingProgress from "@/components/FreeShippingProgress";
import CartLineItem from "@/components/CartLineItem";
import WishlistQuickAdd from "@/components/WishlistQuickAdd";
import OrderSummary from "@/components/OrderSummary";
import ProductGrid from "@/components/ProductGrid";

// Reads the same live cart context CartDrawer and the header cart badge already use —
// no separate server fetch needed, so quantity/coupon changes reflect instantly.
export default function CartPage() {
  const { cart } = useCart();
  const [similar, setSimilar] = useState<Product[]>([]);

  const firstProductId = cart?.lines.nodes[0]?.merchandise.product.id;
  useEffect(() => {
    if (firstProductId) getUpsell(firstProductId).then(setSimilar).catch(() => setSimilar([]));
  }, [firstProductId]);

  if (!cart || cart.lines.nodes.length === 0) {
    return (
      <main className="max-w-[1280px] mx-auto px-4 md:px-9 py-16 text-center">
        <h1 className="font-display font-light text-heading-md text-ink">Your Cart</h1>
        <p className="mt-2 text-sm text-ink-subtle">
          It&apos;s empty. <Link href="/" className="text-primary font-medium">Browse products →</Link>
        </p>
      </main>
    );
  }

  return (
    <main className="max-w-[1280px] mx-auto px-4 md:px-9 py-8">
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div>
          <h1 className="font-display font-light text-heading-sm md:text-heading-md text-ink">
            Your Cart <span className="text-lg font-sans font-normal text-ink-faint">({cart.totalQuantity} Items)</span>
          </h1>
          <p className="mt-1 text-sm text-ink-subtle">Review your items and proceed to checkout</p>
        </div>
        <CartProgressSteps />
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8 items-start">
        <div>
          <FreeShippingProgress subtotal={Number(cart.cost.subtotalAmount.amount)} currencyCode={cart.cost.subtotalAmount.currencyCode} />

          <div className="mt-6 rounded-lg border border-border-strong">
            <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_1fr] gap-4 px-5 py-3 text-xs tracking-wide2 text-ink-faint uppercase border-b border-border-strong">
              <span>Product</span>
              <span>Price</span>
              <span>Quantity</span>
              <span>Total</span>
            </div>
            <div className="px-5">
              {cart.lines.nodes.map((line) => <CartLineItem key={line.id} line={line} />)}
            </div>
            <div className="px-5">
              <WishlistQuickAdd />
            </div>
          </div>

          {similar.length > 0 && (
            <div className="mt-10">
              <h2 className="text-sm font-medium text-ink mb-4">You May Also Like</h2>
              <ProductGrid products={similar} quickAdd />
            </div>
          )}
        </div>

        <OrderSummary cart={cart} />
      </div>
    </main>
  );
}

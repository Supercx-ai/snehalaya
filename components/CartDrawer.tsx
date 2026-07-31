"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useCart } from "./CartProvider";
import { getUpsell } from "@/lib/cart";
import { gaEvent } from "@/lib/gtag";
import type { Product } from "@/lib/shopify";
import FreeShippingProgress from "./FreeShippingProgress";
import CartDrawerLineItem from "./CartDrawerLineItem";
import CartDrawerUpsellCard from "./CartDrawerUpsellCard";

// Cart-level totals have no single product handle to localize against (unlike a line
// item's own price), so this is a plain formatter rather than <LocalizedPrice>.
function formatMoney(amount: string, currencyCode: string) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: currencyCode, maximumFractionDigits: 0 }).format(Number(amount));
}

export default function CartDrawer() {
  const { cart, open, setOpen } = useCart();
  const [upsell, setUpsell] = useState<Product[]>([]);

  const firstProductId = cart?.lines.nodes[0]?.merchandise.product.id;
  useEffect(() => {
    if (open && firstProductId) getUpsell(firstProductId).then(setUpsell).catch(() => setUpsell([]));
  }, [open, firstProductId]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100]">
      <div onClick={() => setOpen(false)} className="absolute inset-0 bg-black/40" />
      <aside className="absolute right-0 top-0 bottom-0 w-full max-w-[420px] bg-white flex flex-col shadow-xl">
        <header className="flex items-center justify-between px-5 py-4 border-b border-border-subtle">
          <h2 className="text-base font-medium text-ink">My Cart{cart ? ` (${cart.totalQuantity})` : ""}</h2>
          <button type="button" onClick={() => setOpen(false)} aria-label="Close cart" className="text-ink-faint text-2xl leading-none">×</button>
        </header>

        <div className="flex-1 overflow-y-auto px-5">
          {!cart || cart.lines.nodes.length === 0 ? (
            <p className="py-8 text-sm text-ink-subtle text-center">Your cart is empty.</p>
          ) : (
            <>
              <div className="pt-4">
                <FreeShippingProgress subtotal={Number(cart.cost.subtotalAmount.amount)} currencyCode={cart.cost.subtotalAmount.currencyCode} />
              </div>

              <div className="mt-4">
                <p className="text-xs tracking-wide2 text-ink-faint uppercase">Cart Items</p>
                {cart.lines.nodes.map((line) => <CartDrawerLineItem key={line.id} line={line} />)}
              </div>

              {upsell.length > 0 && (
                <div className="mt-6 pb-4">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs tracking-wide2 text-ink-faint uppercase">You May Also Like</p>
                    <Link href="/collections" onClick={() => setOpen(false)} className="text-xs text-primary font-medium">View All</Link>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {upsell.slice(0, 4).map((p) => <CartDrawerUpsellCard key={p.id} product={p} />)}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {cart && cart.lines.nodes.length > 0 && (
          <footer className="px-5 py-4 border-t border-border-subtle">
            <div className="flex items-center justify-between mb-3 text-sm">
              <span className="text-ink-secondary">Subtotal ({cart.totalQuantity} Items)</span>
              <span className="font-medium text-ink">
                {formatMoney(cart.cost.subtotalAmount.amount, cart.cost.subtotalAmount.currencyCode)}
              </span>
            </div>
            <a
              href={cart.checkoutUrl}
              onClick={() =>
                gaEvent("begin_checkout", {
                  currency: cart.cost.totalAmount.currencyCode,
                  value: Number(cart.cost.totalAmount.amount),
                  items: cart.lines.nodes.map((l) => ({
                    item_id: l.merchandise.id,
                    item_name: l.merchandise.product.title,
                    price: Number(l.merchandise.price.amount),
                    quantity: l.quantity,
                  })),
                })
              }
              className="flex items-center justify-center h-12 rounded-sm bg-primary text-cream text-sm font-medium tracking-wide2 uppercase"
            >
              Checkout · {formatMoney(cart.cost.totalAmount.amount, cart.cost.totalAmount.currencyCode)}
            </a>
            <div className="mt-3 flex items-center justify-center gap-3 text-xs">
              <Link href="/cart" onClick={() => setOpen(false)} className="text-ink underline">View Cart</Link>
              <span className="text-border-strong">|</span>
              <button type="button" onClick={() => setOpen(false)} className="text-ink underline">Continue Shopping</button>
            </div>
          </footer>
        )}
      </aside>
    </div>
  );
}

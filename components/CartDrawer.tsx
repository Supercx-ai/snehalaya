"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "./CartProvider";
import { getUpsell } from "@/lib/cart";
import { gaEvent } from "@/lib/gtag";
import type { Product } from "@/lib/shopify";
import CartDrawerLineItem from "./CartDrawerLineItem";
import CartDrawerUpsellCard from "./CartDrawerUpsellCard";

const THRESHOLD = Number(process.env.NEXT_PUBLIC_FREE_SHIPPING_THRESHOLD);
const FALLBACK = 15000;

function formatMoney(amount: string, currencyCode: string) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: currencyCode, maximumFractionDigits: 0 }).format(Number(amount));
}

function GiftIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="size-4 shrink-0" aria-hidden>
      <rect x="3.5" y="8.5" width="17" height="12" rx="1.5" />
      <path d="M3.5 12.5h17M12 8.5v12" />
      <path d="M12 8.5S10.5 4 8 4.5 8.5 8.5 12 8.5Zm0 0s1.5-4.5 4-4-.5 4-4 4Z" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="size-4 shrink-0" aria-hidden>
      <rect x="5.5" y="10.5" width="13" height="9.5" rx="1.5" />
      <path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5" />
    </svg>
  );
}

function TagIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="size-4 shrink-0 text-burgundy" aria-hidden>
      <path d="M3.5 3.5h8l9 9-8 8-9-9v-8Z" />
      <circle cx="8" cy="8" r="1.3" />
    </svg>
  );
}

function TruckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="size-4 shrink-0 text-[#2e7d32]" aria-hidden>
      <path d="M1.5 5.5h12.5v11H1.5z" />
      <path d="M14 9h4.2l2.8 3.4v4.1H14" />
      <circle cx="6" cy="17.5" r="1.7" />
      <circle cx="17.5" cy="17.5" r="1.7" />
    </svg>
  );
}

function RewardProgress({ subtotal, currencyCode }: { subtotal: number; currencyCode: string }) {
  const threshold = Number.isFinite(THRESHOLD) && THRESHOLD > 0 ? THRESHOLD : FALLBACK;
  const remaining = Math.max(0, threshold - subtotal);
  const pct = Math.min(100, Math.round((subtotal / threshold) * 100));
  const fmt = (n: number) => formatMoney(String(n), currencyCode);

  return (
    <div className="flex items-center gap-3 rounded-[10px] border border-[#ecdfd0] bg-[#f7efe6] px-4 py-3">
      <span className="flex size-8 items-center justify-center rounded-full bg-white text-burgundy shrink-0">
        <GiftIcon />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[12.5px] text-ink">
          {remaining === 0 ? (
            <>You&apos;ve unlocked <span className="font-bold text-burgundy">FREE SHIPPING</span>!</>
          ) : (
            <>You are <span className="font-bold text-burgundy">{fmt(remaining)}</span> away from <span className="font-bold text-burgundy">FREE SHIPPING</span></>
          )}
        </p>
        <div className="mt-1.5 h-1.5 rounded-full bg-white overflow-hidden">
          <div className="h-full rounded-full bg-burgundy" style={{ width: `${pct}%` }} />
        </div>
      </div>
      <span className="text-[11px] text-[#888] shrink-0">{fmt(subtotal)} / {fmt(threshold)}</span>
    </div>
  );
}

// Centered cart popup (Figma node 2424-1335) — shown on every page EXCEPT the cart/checkout
// routes, which already display the full cart in place. Opened from the header cart button
// and after add-to-cart (CartProvider.addLine sets open=true).
export default function CartDrawer() {
  const { cart, open, setOpen } = useCart();
  const [upsell, setUpsell] = useState<Product[]>([]);
  const [top, setTop] = useState(96);
  const [right, setRight] = useState(20);
  const [render, setRender] = useState(false);
  const [shown, setShown] = useState(false);
  const pathname = usePathname();
  const onCartRoute = pathname.startsWith("/cart");
  const active = open && !onCartRoute;

  // Anchor the panel to the header cart button so it drops down from it like a mini-cart.
  const reposition = useCallback(() => {
    const btn = document.querySelector('[aria-label="Cart"]')?.getBoundingClientRect();
    const headerBottom = document.querySelector("header")?.getBoundingClientRect().bottom;
    setTop(Math.max(12, (btn ? btn.bottom : (headerBottom ?? 84)) + 10));
    if (btn) setRight(Math.max(8, window.innerWidth - btn.right - 4));
  }, []);

  const firstProductId = cart?.lines.nodes[0]?.merchandise.product.id;
  useEffect(() => {
    if (active && firstProductId) getUpsell(firstProductId).then(setUpsell).catch(() => setUpsell([]));
  }, [active, firstProductId]);

  // Mount → next frame → animate in; on close, animate out then unmount after the transition.
  useEffect(() => {
    if (active) {
      setRender(true);
      reposition();
      const id = requestAnimationFrame(() => setShown(true));
      return () => cancelAnimationFrame(id);
    }
    setShown(false);
    const id = setTimeout(() => setRender(false), 220);
    return () => clearTimeout(id);
  }, [active, reposition]);

  useEffect(() => {
    if (!render) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", onKey);
    window.addEventListener("scroll", reposition, true);
    window.addEventListener("resize", reposition);
    return () => {
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", reposition, true);
      window.removeEventListener("resize", reposition);
    };
  }, [render, setOpen, reposition]);

  if (!render) return null;

  const empty = !cart || cart.lines.nodes.length === 0;

  return (
    <div className="fixed inset-0 z-[100]">
      <div
        onClick={() => setOpen(false)}
        className={`absolute inset-0 bg-black/25 transition-opacity duration-200 ${shown ? "opacity-100" : "opacity-0"}`}
      />
      <div
        style={{ top, right, maxHeight: `calc(100vh - ${top}px - 16px)` }}
        className={`absolute w-[calc(100vw-24px)] max-w-[490px] bg-white rounded-[14px] border-[1.5px] border-burgundy shadow-[0_24px_64px_rgba(23,23,23,0.28)] flex flex-col overflow-hidden origin-top-right transition-all duration-200 ease-out ${shown ? "opacity-100 translate-y-0 scale-100" : "opacity-0 -translate-y-3 scale-95"}`}
      >
        <header className="flex items-center justify-between px-5 py-4 border-b border-border-subtle">
          <h2 className="font-display text-[22px] leading-none tracking-[0.5px] uppercase text-burgundy">
            My Cart{cart ? ` (${cart.totalQuantity})` : ""}
          </h2>
          <button type="button" onClick={() => setOpen(false)} aria-label="Close cart" className="text-ink-faint text-2xl leading-none hover:text-ink">×</button>
        </header>

        <div className="flex-1 overflow-y-auto px-5">
          {empty ? (
            <div className="py-16 text-center">
              <p className="text-sm text-ink-subtle">Your cart is empty.</p>
              <Link href="/collections" onClick={() => setOpen(false)} className="mt-3 inline-block text-sm font-medium text-burgundy">
                Browse products →
              </Link>
            </div>
          ) : (
            <>
              <div className="pt-4">
                <RewardProgress subtotal={Number(cart.cost.subtotalAmount.amount)} currencyCode={cart.cost.subtotalAmount.currencyCode} />
              </div>

              <div className="mt-4">
                <p className="text-[11px] font-semibold tracking-[1.2px] text-burgundy uppercase">Cart Items</p>
                {cart.lines.nodes.map((line) => <CartDrawerLineItem key={line.id} line={line} />)}
              </div>

              {upsell.length > 0 && (
                <div className="mt-6 pb-4">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-[11px] font-semibold tracking-[1.2px] text-burgundy uppercase">You May Also Like</p>
                    <Link href="/collections" onClick={() => setOpen(false)} className="flex items-center gap-1 text-xs text-burgundy font-medium">
                      View All
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="size-3.5" aria-hidden>
                        <path d="M4 12h15M13 6l6 6-6 6" />
                      </svg>
                    </Link>
                  </div>
                  <div className="grid grid-cols-4 gap-2.5">
                    {upsell.slice(0, 4).map((p) => <CartDrawerUpsellCard key={p.id} product={p} />)}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {!empty && cart && (
          <footer className="px-5 py-4 border-t border-border-subtle">
            <div className="flex items-center justify-between mb-3">
              <span className="flex items-center gap-2 text-sm text-ink-secondary">
                <TagIcon /> Subtotal ({cart.totalQuantity} {cart.totalQuantity === 1 ? "Item" : "Items"})
              </span>
              <span className="text-[15px] font-bold text-ink">
                {formatMoney(cart.cost.subtotalAmount.amount, cart.cost.subtotalAmount.currencyCode)}
              </span>
            </div>
            <Link
              href="/cart/shipping"
              onClick={() => {
                setOpen(false);
                gaEvent("begin_checkout", {
                  currency: cart.cost.totalAmount.currencyCode,
                  value: Number(cart.cost.totalAmount.amount),
                  items: cart.lines.nodes.map((l) => ({
                    item_id: l.merchandise.id,
                    item_name: l.merchandise.product.title,
                    price: Number(l.merchandise.price.amount),
                    quantity: l.quantity,
                  })),
                });
              }}
              className="flex items-center justify-center gap-2.5 h-12 rounded-[6px] bg-burgundy text-cream text-[13px] font-semibold tracking-[1.4px] uppercase"
            >
              <LockIcon /> Checkout · {formatMoney(cart.cost.totalAmount.amount, cart.cost.totalAmount.currencyCode)}
            </Link>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <Link
                href="/cart"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center gap-2 h-11 rounded-[6px] border border-burgundy text-[12px] font-semibold tracking-[0.6px] uppercase text-burgundy"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="size-4" aria-hidden>
                  <path d="M5.5 7.5h13l-1 11.5a1.5 1.5 0 0 1-1.5 1.4H8a1.5 1.5 0 0 1-1.5-1.4L5.5 7.5Z" />
                  <path d="M9 7.5V6a3 3 0 0 1 6 0v1.5" />
                </svg>
                View Cart
              </Link>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center gap-2 h-11 rounded-[6px] border border-burgundy text-[12px] font-semibold tracking-[0.6px] uppercase text-burgundy"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="size-4" aria-hidden>
                  <path d="M14.5 6 8.5 12l6 6" />
                </svg>
                Continue Shopping
              </button>
            </div>
            <p className="mt-3 flex items-center justify-center gap-1.5 text-[12px] text-[#666]">
              <TruckIcon />
              <span className="font-semibold text-[#2e7d32]">Free Shipping</span> on Domestic Orders above ₹1,999
            </p>
          </footer>
        )}
      </div>
    </div>
  );
}

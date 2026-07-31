"use client";

import type { Cart } from "@/lib/shopify";
import CouponForm from "./CouponForm";

const SUPPORT_PHONE = process.env.NEXT_PUBLIC_SUPPORT_PHONE;
const SUPPORT_EMAIL = process.env.NEXT_PUBLIC_SUPPORT_EMAIL;
// Same "no real threshold to check against" limitation as FreeShippingProgress.
const FREE_SHIPPING_THRESHOLD = Number(process.env.NEXT_PUBLIC_FREE_SHIPPING_THRESHOLD);

function Check() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="w-4 h-4 mt-0.5 shrink-0 text-primary" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 13l4 4L19 7" />
    </svg>
  );
}

function Row({ label, value, hint }: { label: string; value: React.ReactNode; hint?: boolean }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="flex items-center gap-1.5 text-ink-secondary">
        {label}
        {hint && (
          <span className="flex items-center justify-center w-3.5 h-3.5 rounded-full border border-ink-faint text-ink-faint text-[9px] leading-none">i</span>
        )}
      </span>
      <span className="text-ink">{value}</span>
    </div>
  );
}

export default function OrderSummary({ cart }: { cart: Cart }) {
  const fmt = (amount: string, currencyCode: string) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: currencyCode, maximumFractionDigits: 0 }).format(Number(amount));

  const subtotal = Number(cart.cost.subtotalAmount.amount);
  const savings = cart.lines.nodes.reduce((sum, line) => {
    const compareAt = line.merchandise.compareAtPrice ? Number(line.merchandise.compareAtPrice.amount) : 0;
    const price = Number(line.merchandise.price.amount);
    return sum + Math.max(0, compareAt - price) * line.quantity;
  }, 0);

  const freeShippingMet = Number.isFinite(FREE_SHIPPING_THRESHOLD) && FREE_SHIPPING_THRESHOLD > 0 && subtotal >= FREE_SHIPPING_THRESHOLD;

  return (
    <div className="rounded-lg border border-border-strong p-5">
      <h2 className="font-display text-xl text-primary">Order Summary</h2>

      <div className="mt-4 space-y-2.5">
        <Row label={`Bag Total (${cart.totalQuantity} items)`} value={fmt(cart.cost.subtotalAmount.amount, cart.cost.subtotalAmount.currencyCode)} />
        <Row label="Shipping & Handling" hint value={freeShippingMet ? <span className="text-green-700">FREE</span> : "Calculated at checkout"} />
        {cart.cost.totalTaxAmount && (
          <Row label="Estimated Tax (GST)" hint value={fmt(cart.cost.totalTaxAmount.amount, cart.cost.totalTaxAmount.currencyCode)} />
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-border-strong flex items-center justify-between">
        <span className="text-base font-medium text-ink">Order Total</span>
        <span className="text-base font-medium text-ink">{fmt(cart.cost.totalAmount.amount, cart.cost.totalAmount.currencyCode)}</span>
      </div>
      {savings > 0 && (
        <p className="mt-1 text-right text-sm text-green-700">You Save {fmt(String(savings), cart.cost.totalAmount.currencyCode)}</p>
      )}

      <a
        href={cart.checkoutUrl}
        className="mt-5 flex items-center justify-center gap-2 h-12 rounded-sm bg-primary text-cream text-sm font-medium tracking-wide2 uppercase"
      >
        Proceed to Shipping
      </a>

      <details className="mt-5 border-t border-border-subtle pt-4">
        <summary className="flex items-center justify-between cursor-pointer list-none text-sm text-ink">
          Apply Coupon
          <span className="text-ink-faint">⌄</span>
        </summary>
        <div className="mt-3">
          <CouponForm />
        </div>
      </details>

      <div className="mt-5 border-t border-border-subtle pt-4 space-y-3">
        <div className="flex gap-2.5 text-sm text-ink-secondary"><Check /><span>100% Authentic Products</span></div>
        <div className="flex gap-2.5 text-sm text-ink-secondary"><Check /><span>Secure Payments</span></div>
        <div className="flex gap-2.5 text-sm text-ink-secondary"><Check /><span>Easy Returns &amp; Exchange</span></div>
        {(SUPPORT_PHONE || SUPPORT_EMAIL) && (
          <div className="flex gap-2.5 text-sm text-ink-secondary">
            <Check />
            <span>
              Dedicated Support
              {SUPPORT_PHONE && <> · <a href={`tel:${SUPPORT_PHONE}`} className="underline">{SUPPORT_PHONE}</a></>}
              {SUPPORT_EMAIL && <> · <a href={`mailto:${SUPPORT_EMAIL}`} className="underline">{SUPPORT_EMAIL}</a></>}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

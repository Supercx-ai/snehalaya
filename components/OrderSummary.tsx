"use client";

import type { Cart } from "@/lib/shopify";
import CouponForm from "./CouponForm";
import GoldRule from "./GoldRule";

const FREE_SHIPPING_THRESHOLD = Number(process.env.NEXT_PUBLIC_FREE_SHIPPING_THRESHOLD);

function InfoIcon({ label }: { label: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="size-[14px] text-[#999]" aria-hidden>
      <title>{label}</title>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5.5" />
      <path d="M12 7.5v.5" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="size-4" aria-hidden>
      <rect x="5.5" y="10.5" width="13" height="9.5" rx="1.5" />
      <path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5" />
    </svg>
  );
}

function TagIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="size-[18px]" aria-hidden>
      <path d="M3.5 3.5h8l9 9-8 8-9-9v-8Z" />
      <circle cx="8" cy="8" r="1.4" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="size-[18px]" aria-hidden>
      <path d="M12 3 5 5.5v6c0 4.4 3 8 7 9.5 4-1.5 7-5.1 7-9.5v-6L12 3Z" />
      <path d="m9 12 2.2 2.2L15.5 10" />
    </svg>
  );
}

function PadlockIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="size-[18px]" aria-hidden>
      <rect x="5.5" y="10.5" width="13" height="9.5" rx="1.5" />
      <path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5" />
      <path d="M12 14.5v2" />
    </svg>
  );
}

function RefreshIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="size-[18px]" aria-hidden>
      <path d="M20 12a8 8 0 1 1-2.3-5.6" />
      <path d="M20 3.5V7h-3.5" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="size-[18px]" aria-hidden>
      <path d="M12 20.5 4.7 13a4.8 4.8 0 0 1 0-6.7 4.6 4.6 0 0 1 6.6 0l.7.7.7-.7a4.6 4.6 0 0 1 6.6 0 4.8 4.8 0 0 1 0 6.7L12 20.5Z" />
    </svg>
  );
}

const TRUST_ITEMS = [
  { icon: <ShieldIcon />, title: "100% Authentic Products", caption: "Sourced directly from trusted weavers" },
  { icon: <PadlockIcon />, title: "Secure Payments", caption: "100% safe & secure transactions" },
  { icon: <RefreshIcon />, title: "Easy Returns & Exchange", caption: "Hassle-free 7-day return policy" },
  { icon: <HeartIcon />, title: "Dedicated Support", caption: "+91 44 1234 5678  |  support@snehalayaa.com" },
];

function Row({ label, info, value }: { label: string; info?: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between text-[13px] leading-6">
      <span className="flex items-center gap-1.5 text-[#555]">
        {label}
        {info && <InfoIcon label={info} />}
      </span>
      <span className="text-ink font-semibold">{value}</span>
    </div>
  );
}

export default function OrderSummary({
  cart,
  actionHref,
  actionLabel = "Proceed to Shipping",
  title = "Order Summary",
  showCoupon = true,
  showTrust = true,
  hideAction = false,
  actionAsSubmit = false,
  actionDisabled = false,
  checkout = false,
}: {
  cart: Cart;
  actionHref?: string;
  actionLabel?: string;
  title?: string;
  showCoupon?: boolean;
  showTrust?: boolean;
  hideAction?: boolean;
  actionAsSubmit?: boolean;
  actionDisabled?: boolean;
  /** Shipping/payment-step styling: "PRICE DETAILS" card with free-shipping strip and TOTAL PAYABLE rows. */
  checkout?: boolean;
}) {
  const fmt = (amount: string, currencyCode: string) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: currencyCode, maximumFractionDigits: 0 }).format(Number(amount));

  const subtotal = Number(cart.cost.subtotalAmount.amount);
  const savings = cart.lines.nodes.reduce((sum, line) => {
    const compareAt = line.merchandise.compareAtPrice ? Number(line.merchandise.compareAtPrice.amount) : 0;
    const price = Number(line.merchandise.price.amount);
    return sum + Math.max(0, compareAt - price) * line.quantity;
  }, 0);

  const freeShippingMet =
    (Number.isFinite(FREE_SHIPPING_THRESHOLD) && FREE_SHIPPING_THRESHOLD > 0 && subtotal >= FREE_SHIPPING_THRESHOLD) ||
    !Number.isFinite(FREE_SHIPPING_THRESHOLD) ||
    FREE_SHIPPING_THRESHOLD <= 0;
  const href = actionHref ?? "/cart/shipping";

  const ctaClass =
    "mt-5 flex w-full items-center justify-center gap-2.5 h-12 rounded-[6px] bg-burgundy text-cream text-[13px] font-semibold tracking-[1.6px] uppercase disabled:opacity-60";
  const ctaContent = checkout ? (
    <>
      {actionLabel}
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-4" aria-hidden>
        <path d="m9 5 7 7-7 7" />
      </svg>
    </>
  ) : (
    <>
      <LockIcon />
      {actionLabel}
    </>
  );

  return (
    <div className="space-y-4">
      <div className="rounded-[10px] border border-[#e8e0d5] bg-white px-5 py-6">
        {checkout ? (
          <h2 className="text-[14px] font-bold tracking-[1.4px] uppercase text-burgundy">{title}</h2>
        ) : (
          <h2 className="font-display text-[22px] leading-none text-burgundy">{title}</h2>
        )}
        <GoldRule className="mt-3.5" />

        {checkout ? (
          <div className="mt-5 space-y-3">
            <Row label="Bag Total" value={fmt(cart.cost.subtotalAmount.amount, cart.cost.subtotalAmount.currencyCode)} />
            {freeShippingMet ? (
              <p className="flex items-center justify-center gap-2 rounded-[6px] bg-[#eaf5e6] py-2 text-[13px] font-semibold text-[#2e7d32]">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="size-[18px]" aria-hidden>
                  <path d="M1.5 5.5h12.5v11H1.5z" />
                  <path d="M14 9h4.2l2.8 3.4v4.1H14" />
                  <circle cx="6" cy="17.5" r="1.9" />
                  <circle cx="17.5" cy="17.5" r="1.9" />
                </svg>
                Free Shipping!!!
              </p>
            ) : (
              <Row label="Shipping & Handling" value="Calculated at checkout" />
            )}
            {cart.cost.totalTaxAmount && Number(cart.cost.totalTaxAmount.amount) > 0 && (
              <Row label="Estimated Tax (GST)" value={fmt(cart.cost.totalTaxAmount.amount, cart.cost.totalTaxAmount.currencyCode)} />
            )}
            <p className="text-[11px] text-[#999]">(Apply Coupon Codes on payments page)</p>
          </div>
        ) : (
          <div className="mt-5 space-y-2.5">
            <Row label={`Bag Total (${cart.totalQuantity} ${cart.totalQuantity === 1 ? "Item" : "Items"})`} value={fmt(cart.cost.subtotalAmount.amount, cart.cost.subtotalAmount.currencyCode)} />
            <Row
              label="Shipping & Handling"
              info="Free shipping on qualifying orders"
              value={freeShippingMet ? <span className="text-[#2e7d32]">FREE</span> : "Calculated at checkout"}
            />
            {cart.cost.totalTaxAmount && Number(cart.cost.totalTaxAmount.amount) > 0 && (
              <Row
                label="Estimated Tax (GST)"
                info="GST included as applicable"
                value={fmt(cart.cost.totalTaxAmount.amount, cart.cost.totalTaxAmount.currencyCode)}
              />
            )}
          </div>
        )}

        {checkout ? (
          <>
            <div className="mt-4 pt-4 border-t border-[#eee6da] flex items-center justify-between">
              <span className="text-[13px] font-bold tracking-[0.6px] uppercase text-ink">Total Payable</span>
              <span className="text-[15px] font-bold text-ink">{fmt(cart.cost.totalAmount.amount, cart.cost.totalAmount.currencyCode)}</span>
            </div>
            <div className="mt-2 flex items-center justify-between text-[12px] font-semibold tracking-[0.6px] uppercase text-[#2e7d32]">
              <span>Your Total Savings</span>
              <span>{fmt(String(savings), cart.cost.totalAmount.currencyCode)}</span>
            </div>
          </>
        ) : (
          <>
            <div className="mt-4 pt-4 border-t border-[#eee6da] flex items-center justify-between">
              <span className="text-[16px] font-bold text-ink">Order Total</span>
              <span className="text-[16px] font-bold text-ink">{fmt(cart.cost.totalAmount.amount, cart.cost.totalAmount.currencyCode)}</span>
            </div>
            {savings > 0 && (
              <div className="mt-2 flex items-center justify-between text-[13px] font-semibold text-[#2e7d32]">
                <span>You Save</span>
                <span>{fmt(String(savings), cart.cost.totalAmount.currencyCode)}</span>
              </div>
            )}
          </>
        )}

        {!hideAction && (
          actionAsSubmit ? (
            <button type="submit" disabled={actionDisabled} className={ctaClass}>
              {ctaContent}
            </button>
          ) : (
            <a href={href} className={ctaClass}>
              {ctaContent}
            </a>
          )
        )}
      </div>

      {showCoupon && (
        <details className="group rounded-[10px] border border-[#e8e0d5] bg-white px-5 py-4">
          <summary className="flex items-center gap-3 cursor-pointer list-none">
            <span className="flex size-9 items-center justify-center rounded-full bg-[#f9efec] text-burgundy shrink-0">
              <TagIcon />
            </span>
            <span className="flex-1 text-[14px] font-semibold text-ink">Apply Coupon</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="size-4 text-[#666] transition-transform group-open:rotate-180" aria-hidden>
              <path d="m6 9 6 6 6-6" />
            </svg>
          </summary>
          <div className="mt-4">
            <CouponForm />
          </div>
        </details>
      )}

      {showTrust && (
        <div className="rounded-[10px] border border-[#e8e0d5] bg-white px-5 py-5 space-y-4">
          {TRUST_ITEMS.map((item) => (
            <div key={item.title} className="flex items-center gap-3.5">
              <span className="flex size-9 items-center justify-center rounded-full bg-[#f9efec] text-burgundy shrink-0">
                {item.icon}
              </span>
              <div className="min-w-0">
                <p className="text-[13px] font-semibold text-ink leading-snug">{item.title}</p>
                <p className="mt-0.5 text-[12px] text-[#888] leading-snug">{item.caption}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

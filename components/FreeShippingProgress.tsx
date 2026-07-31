// Hidden until a real threshold is configured — Shopify's Storefront API has no field for
// this (it's a Shipping Profile setting in Admin, not queryable), so rather than guess a
// number, the store owner sets it here. Same graceful-hide pattern as WhatsAppCTA.
const THRESHOLD = Number(process.env.NEXT_PUBLIC_FREE_SHIPPING_THRESHOLD);

export default function FreeShippingProgress({ subtotal, currencyCode }: { subtotal: number; currencyCode: string }) {
  if (!Number.isFinite(THRESHOLD) || THRESHOLD <= 0) return null;

  const remaining = Math.max(0, THRESHOLD - subtotal);
  const pct = Math.min(100, Math.round((subtotal / THRESHOLD) * 100));
  const format = (n: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: currencyCode, maximumFractionDigits: 0 }).format(n);

  return (
    <div className="rounded-lg bg-[#f1f8ee] px-4 py-3">
      <p className="text-sm font-medium text-[#2e7d32]">
        {remaining === 0 ? "You're eligible for FREE SHIPPING!" : `Add ${format(remaining)} more to get free shipping!`}
      </p>
      <div className="mt-2 h-1.5 rounded-full bg-border-subtle overflow-hidden">
        <div className="h-full bg-primary rounded-full" style={{ width: `${pct}%` }} />
      </div>
      <p className="mt-1 text-xs text-ink-faint">{format(subtotal)} / {format(THRESHOLD)}</p>
    </div>
  );
}

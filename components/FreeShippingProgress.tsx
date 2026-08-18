const THRESHOLD = Number(process.env.NEXT_PUBLIC_FREE_SHIPPING_THRESHOLD);
const FALLBACK = 15000;

function TruckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="size-6 shrink-0" aria-hidden>
      <path d="M1.5 5.5h12.5v11H1.5z" />
      <path d="M14 9h4.2l2.8 3.4v4.1H14" />
      <circle cx="6" cy="17.5" r="1.9" />
      <circle cx="17.5" cy="17.5" r="1.9" />
    </svg>
  );
}

export default function FreeShippingProgress({ subtotal, currencyCode }: { subtotal: number; currencyCode: string }) {
  const threshold = Number.isFinite(THRESHOLD) && THRESHOLD > 0 ? THRESHOLD : FALLBACK;
  const remaining = Math.max(0, threshold - subtotal);
  const pct = Math.min(100, Math.round((subtotal / threshold) * 100));
  const format = (n: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: currencyCode, maximumFractionDigits: 0 }).format(n);

  return (
    <div className="flex items-center gap-4 rounded-[8px] border border-[#dcead4] bg-[#f4f9f0] px-4 py-3 text-[#2e7d32]">
      <TruckIcon />
      <div className="min-w-0 shrink-0">
        <p className="text-[13px] font-bold leading-snug">
          {remaining === 0 ? "You're eligible for FREE SHIPPING!" : "You're close to FREE SHIPPING!"}
        </p>
        <p className="mt-0.5 text-[12px] text-[#666] leading-snug">
          {remaining === 0 ? "Your order qualifies for free delivery." : `Add ${format(remaining)} more to get free shipping.`}
        </p>
      </div>
      <div className="hidden sm:block flex-1 h-[5px] rounded-full bg-[#e6e3dc] overflow-hidden">
        <div className={`h-full rounded-full ${remaining === 0 ? "bg-[#2e7d32]" : "bg-burgundy"}`} style={{ width: `${pct}%` }} />
      </div>
      <p className="hidden sm:block shrink-0 text-[13px] font-medium text-ink">
        {format(subtotal)} / {format(threshold)}
      </p>
    </div>
  );
}

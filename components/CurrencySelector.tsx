"use client";

import Image from "next/image";
import { useCart } from "./CartProvider";
import type { CountryCode } from "@/lib/shopify";

// Only re-prices the cart (already no-store/per-visitor, and cartBuyerIdentityUpdate
// actually changes an existing cart's currency). Product/collection listing pages are
// ISR-cached and would need Shopify Markets locale routing to show localized prices —
// a bigger routing decision, not wired up here.
const OPTIONS: { code: CountryCode; label: string }[] = [
  { code: "IN", label: "INR (₹)" },
  { code: "US", label: "USD ($)" },
  { code: "GB", label: "GBP (£)" },
  { code: "AE", label: "AED" },
  { code: "SG", label: "SGD ($)" },
  { code: "MY", label: "MYR (RM)" },
];

export default function CurrencySelector({ initialCountry }: { initialCountry: CountryCode }) {
  const { switchCurrency } = useCart();

  return (
    <div className="relative shrink-0">
      <select
        defaultValue={initialCountry}
        onChange={(e) => switchCurrency(e.target.value as CountryCode)}
        className="appearance-none border border-accent rounded-sm pl-3 pr-7 py-1.5 text-base font-medium text-ink bg-white cursor-pointer"
      >
        {OPTIONS.map((o) => <option key={o.code} value={o.code}>{o.label}</option>)}
      </select>
      <Image src="/figma/icon-chevron.svg" alt="" width={10} height={10} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2" />
    </div>
  );
}

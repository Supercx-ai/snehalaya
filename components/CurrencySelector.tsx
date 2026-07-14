"use client";

import { useCart } from "./CartProvider";
import type { CountryCode } from "@/lib/shopify";

// Only re-prices the cart (already no-store/per-visitor, and cartBuyerIdentityUpdate
// actually changes an existing cart's currency). Product/collection listing pages are
// ISR-cached and would need Shopify Markets locale routing to show localized prices —
// a bigger routing decision, not wired up here.
const OPTIONS: { code: CountryCode; label: string }[] = [
  { code: "IN", label: "₹ INR" },
  { code: "US", label: "$ USD" },
  { code: "GB", label: "£ GBP" },
  { code: "AE", label: "AED" },
  { code: "SG", label: "$ SGD" },
  { code: "MY", label: "RM MYR" },
];

export default function CurrencySelector({ initialCountry }: { initialCountry: CountryCode }) {
  const { switchCurrency } = useCart();

  return (
    <select
      defaultValue={initialCountry}
      onChange={(e) => switchCurrency(e.target.value as CountryCode)}
      style={{ border: "1px solid #ccc", borderRadius: 6, padding: "0.3rem 0.5rem", background: "#fff" }}
    >
      {OPTIONS.map((o) => <option key={o.code} value={o.code}>{o.label}</option>)}
    </select>
  );
}

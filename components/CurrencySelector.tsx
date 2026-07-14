"use client";

import { setCurrency } from "@/lib/currency";
import { useCart } from "./CartProvider";
import type { CountryCode } from "@/lib/shopify";

// Only re-prices the cart (already no-store/per-visitor). Product/collection listing
// pages are ISR-cached and would need Shopify Markets locale routing to show localized
// prices — a bigger routing decision, not wired up here.
const OPTIONS: { code: CountryCode; label: string }[] = [
  { code: "IN", label: "₹ INR" },
  { code: "US", label: "$ USD" },
  { code: "GB", label: "£ GBP" },
  { code: "AE", label: "AED" },
  { code: "SG", label: "$ SGD" },
  { code: "MY", label: "RM MYR" },
];

export default function CurrencySelector() {
  const { refreshCart } = useCart();

  return (
    <select
      defaultValue="IN"
      onChange={async (e) => { await setCurrency(e.target.value as CountryCode); refreshCart(); }}
      style={{ border: "1px solid #ccc", borderRadius: 6, padding: "0.3rem 0.5rem", background: "#fff" }}
    >
      {OPTIONS.map((o) => <option key={o.code} value={o.code}>{o.label}</option>)}
    </select>
  );
}

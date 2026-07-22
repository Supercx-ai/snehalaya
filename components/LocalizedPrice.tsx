"use client";

import { useEffect, useState } from "react";
import { useCart } from "./CartProvider";
import { getLocalizedPrice } from "@/lib/currency";

const DEFAULT_COUNTRY = "IN";

// Product/collection pages are ISR-cached, so the server-rendered price is always the
// default currency. Swaps in the selected currency's price after mount — the cached
// HTML itself doesn't change, only what this one component displays.
export default function LocalizedPrice({
  handle, amount, currencyCode, format = "raw",
}: { handle: string; amount: string; currencyCode: string; format?: "raw" | "currency" }) {
  const { country } = useCart();
  const [price, setPrice] = useState({ amount, currencyCode });

  useEffect(() => {
    if (country === DEFAULT_COUNTRY) { setPrice({ amount, currencyCode }); return; }
    let cancelled = false;
    getLocalizedPrice(handle, country).then((p) => { if (p && !cancelled) setPrice(p); });
    return () => { cancelled = true; };
  }, [country, handle, amount, currencyCode]);

  if (format === "currency") {
    return <>{new Intl.NumberFormat("en-IN", { style: "currency", currency: price.currencyCode, maximumFractionDigits: 0 }).format(Number(price.amount))}</>;
  }
  return <>{price.amount} {price.currencyCode}</>;
}

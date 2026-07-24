"use client";

import { useState } from "react";
import { buyNow } from "@/lib/cart";
import { gaEvent } from "@/lib/gtag";

type Item = { id: string; title: string; amount: string; currencyCode: string };

// Fresh single-item cart straight to Shopify checkout — ignores whatever's already
// in the visitor's cart drawer, unlike Add to Cart.
export default function BuyNowButton({
  merchandiseId, soldOut, item, quantity = 1,
}: { merchandiseId?: string; soldOut?: boolean; item?: Item; quantity?: number }) {
  const [pending, setPending] = useState(false);
  if (!merchandiseId || soldOut) return null;

  return (
    <button
      disabled={pending}
      onClick={async () => {
        setPending(true);
        if (item) {
          const line = { item_id: item.id, item_name: item.title, price: Number(item.amount), quantity };
          gaEvent("add_to_cart", { currency: item.currencyCode, value: Number(item.amount) * quantity, items: [line] });
          gaEvent("begin_checkout", { currency: item.currencyCode, value: Number(item.amount) * quantity, items: [line] });
        }
        const checkoutUrl = await buyNow(merchandiseId, quantity);
        if (checkoutUrl) window.location.href = checkoutUrl;
        else setPending(false);
      }}
      className="h-12 px-8 rounded-sm border border-primary text-primary text-sm font-medium tracking-wide2 uppercase disabled:opacity-60"
    >
      {pending ? "Redirecting…" : "Buy It Now"}
    </button>
  );
}

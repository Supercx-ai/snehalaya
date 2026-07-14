"use client";

import { useState } from "react";
import { buyNow } from "@/lib/cart";
import { gaEvent } from "@/lib/gtag";

type Item = { id: string; title: string; amount: string; currencyCode: string };

// Fresh single-item cart straight to Shopify checkout — ignores whatever's already
// in the visitor's cart drawer, unlike Add to Cart.
export default function BuyNowButton({ merchandiseId, soldOut, item }: { merchandiseId?: string; soldOut?: boolean; item?: Item }) {
  const [pending, setPending] = useState(false);
  if (!merchandiseId || soldOut) return null;

  return (
    <button
      disabled={pending}
      onClick={async () => {
        setPending(true);
        if (item) {
          const line = { item_id: item.id, item_name: item.title, price: Number(item.amount), quantity: 1 };
          gaEvent("add_to_cart", { currency: item.currencyCode, value: Number(item.amount), items: [line] });
          gaEvent("begin_checkout", { currency: item.currencyCode, value: Number(item.amount), items: [line] });
        }
        const checkoutUrl = await buyNow(merchandiseId);
        if (checkoutUrl) window.location.href = checkoutUrl;
        else setPending(false);
      }}
      style={{ padding: "0.75rem 1.5rem", fontSize: "1rem", border: "1px solid #111", borderRadius: 8, background: "#fff", color: "#111", cursor: "pointer" }}
    >
      {pending ? "Redirecting…" : "Buy Now"}
    </button>
  );
}

"use client";

import { useState } from "react";
import { buyNow } from "@/lib/cart";

// Fresh single-item cart straight to Shopify checkout — ignores whatever's already
// in the visitor's cart drawer, unlike Add to Cart.
export default function BuyNowButton({ merchandiseId, soldOut }: { merchandiseId?: string; soldOut?: boolean }) {
  const [pending, setPending] = useState(false);
  if (!merchandiseId || soldOut) return null;

  return (
    <button
      disabled={pending}
      onClick={async () => {
        setPending(true);
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

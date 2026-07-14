"use client";

import { useCart } from "./CartProvider";
import { gaEvent } from "@/lib/gtag";

type Item = { id: string; title: string; amount: string; currencyCode: string };

export default function AddToCart({ merchandiseId, soldOut, item }: { merchandiseId?: string; soldOut?: boolean; item?: Item }) {
  const { addLine, pending } = useCart();

  if (!merchandiseId || soldOut) {
    return <button disabled style={btn}>Sold out</button>;
  }

  return (
    <button
      disabled={pending}
      style={btn}
      onClick={() => {
        addLine(merchandiseId);
        if (item) {
          gaEvent("add_to_cart", {
            currency: item.currencyCode,
            value: Number(item.amount),
            items: [{ item_id: item.id, item_name: item.title, price: Number(item.amount), quantity: 1 }],
          });
        }
      }}
    >
      {pending ? "Adding…" : "Add to cart"}
    </button>
  );
}

const btn: React.CSSProperties = {
  padding: "0.75rem 1.5rem",
  fontSize: "1rem",
  border: "none",
  borderRadius: 8,
  background: "#111",
  color: "#fff",
  cursor: "pointer",
};

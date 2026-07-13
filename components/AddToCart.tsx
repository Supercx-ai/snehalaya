"use client";

import { useCart } from "./CartProvider";

export default function AddToCart({ merchandiseId, soldOut }: { merchandiseId?: string; soldOut?: boolean }) {
  const { addLine, pending } = useCart();

  if (!merchandiseId || soldOut) {
    return <button disabled style={btn}>Sold out</button>;
  }
  return (
    <button disabled={pending} style={btn} onClick={() => addLine(merchandiseId)}>
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

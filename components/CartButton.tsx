"use client";

import { useCart } from "./CartProvider";

export default function CartButton() {
  const { cart, setOpen } = useCart();
  return (
    <button
      onClick={() => setOpen(true)}
      style={{ border: "none", background: "none", cursor: "pointer", font: "inherit", color: "inherit" }}
    >
      Cart{cart && cart.totalQuantity > 0 ? ` (${cart.totalQuantity})` : ""}
    </button>
  );
}

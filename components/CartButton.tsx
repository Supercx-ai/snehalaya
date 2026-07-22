"use client";

import Image from "next/image";
import { useCart } from "./CartProvider";

export default function CartButton() {
  const { cart, setOpen } = useCart();
  const count = cart?.totalQuantity ?? 0;

  return (
    <button onClick={() => setOpen(true)} aria-label="Cart" className="relative">
      <Image src="/figma/icon-cart.svg" alt="" width={20} height={20} />
      {count > 0 && (
        <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 px-1 rounded-full bg-primary text-white text-[10px] leading-4 text-center">
          {count}
        </span>
      )}
    </button>
  );
}

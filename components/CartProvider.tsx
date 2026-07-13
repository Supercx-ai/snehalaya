"use client";

import { createContext, useContext, useState, useTransition, type ReactNode } from "react";
import { addToCart, updateCartLine, removeCartLine, applyDiscountCode } from "@/lib/cart";
import type { Cart } from "@/lib/shopify";

type CartContextValue = {
  cart: Cart | null;
  open: boolean;
  setOpen: (open: boolean) => void;
  pending: boolean;
  addLine: (merchandiseId: string) => void;
  updateLine: (lineId: string, quantity: number) => void;
  removeLine: (lineId: string) => void;
  applyCode: (code: string) => Promise<boolean>;
};

const CartContext = createContext<CartContextValue | null>(null);

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}

export default function CartProvider({ initialCart, children }: { initialCart: Cart | null; children: ReactNode }) {
  const [cart, setCart] = useState(initialCart);
  const [open, setOpen] = useState(false);
  const [pending, start] = useTransition();

  const addLine = (merchandiseId: string) =>
    start(async () => { setCart(await addToCart(merchandiseId)); setOpen(true); });

  const updateLine = (lineId: string, quantity: number) =>
    start(async () => { setCart(await updateCartLine(lineId, quantity)); });

  const removeLine = (lineId: string) =>
    start(async () => { setCart(await removeCartLine(lineId)); });

  const applyCode = (code: string) =>
    new Promise<boolean>((resolve) => {
      start(async () => {
        const next = await applyDiscountCode(code);
        setCart(next);
        resolve(next?.discountCodes.some((d) => d.code.toLowerCase() === code.toLowerCase() && d.applicable) ?? false);
      });
    });

  return (
    <CartContext.Provider value={{ cart, open, setOpen, pending, addLine, updateLine, removeLine, applyCode }}>
      {children}
    </CartContext.Provider>
  );
}

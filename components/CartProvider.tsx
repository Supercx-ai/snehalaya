"use client";

import { createContext, useContext, useState, useTransition, type ReactNode } from "react";
import { addToCart, updateCartLine, removeCartLine, applyDiscountCode, switchCurrency as switchCurrencyAction } from "@/lib/cart";
import type { Cart, CountryCode } from "@/lib/shopify";

type CartContextValue = {
  cart: Cart | null;
  country: CountryCode;
  open: boolean;
  setOpen: (open: boolean) => void;
  pending: boolean;
  addLine: (merchandiseId: string, quantity?: number) => void;
  updateLine: (lineId: string, quantity: number) => void;
  removeLine: (lineId: string) => void;
  applyCode: (code: string) => Promise<boolean>;
  switchCurrency: (country: CountryCode) => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}

export default function CartProvider({
  initialCart,
  initialCountry,
  children,
}: {
  initialCart: Cart | null;
  initialCountry: CountryCode;
  children: ReactNode;
}) {
  const [cart, setCart] = useState(initialCart);
  const [country, setCountry] = useState(initialCountry);
  const [open, setOpen] = useState(false);
  const [pending, start] = useTransition();

  const addLine = (merchandiseId: string, quantity = 1) =>
    start(async () => { setCart(await addToCart(merchandiseId, quantity)); setOpen(true); });

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

  // Actually re-prices the existing cart (cartBuyerIdentityUpdate) — a plain re-fetch
  // with a different @inContext does not change an already-created cart's currency.
  const switchCurrency = (next: CountryCode) =>
    start(async () => { setCountry(next); setCart(await switchCurrencyAction(next)); });

  return (
    <CartContext.Provider value={{ cart, country, open, setOpen, pending, addLine, updateLine, removeLine, applyCode, switchCurrency }}>
      {children}
    </CartContext.Provider>
  );
}

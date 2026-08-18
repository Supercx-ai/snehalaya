"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import type { CartLine } from "@/lib/shopify";
import { deriveLineAttrs } from "@/lib/product-attrs";
import { useCart } from "./CartProvider";
import LocalizedPrice from "./LocalizedPrice";

export const CART_TABLE_GRID = "md:grid-cols-[minmax(0,2.4fr)_0.9fr_1.1fr_0.9fr_36px]";

function CheckCircleIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="size-3.5" aria-hidden>
      <circle cx="12" cy="12" r="9" />
      <path d="m8.5 12.2 2.4 2.4 4.6-5" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="size-[18px]" aria-hidden>
      <path d="M4 7h16" />
      <path d="M9.5 7V4.5h5V7" />
      <path d="M6 7l1 13.5h10L18 7" />
      <path d="M10 11v6M14 11v6" />
    </svg>
  );
}

export default function CartLineItem({ line }: { line: CartLine }) {
  const { pending, updateLine, removeLine } = useCart();
  const { merchandise: m } = line;
  const [qty, setQty] = useState(line.quantity);
  useEffect(() => setQty(line.quantity), [line.quantity]);

  const total = (Number(m.price.amount) * qty).toFixed(2);

  const derived = deriveLineAttrs(m.product.title, m.selectedOptions);
  const attrs =
    derived.options.length > 0
      ? derived.options.map((o) => o.value)
      : ([derived.colour, derived.fabric, derived.size].filter(Boolean) as string[]);

  const qtyControl = (
    <div className="flex flex-col items-center">
      <div className="flex h-9 w-[100px] items-stretch overflow-hidden rounded-[8px] border border-[#e0dbd1] bg-white">
        <button
          type="button"
          disabled={pending}
          onClick={() => setQty((q) => Math.max(1, q - 1))}
          className="w-8 flex items-center justify-center text-[15px] text-ink border-r border-[#eee9e0] disabled:text-ink-faint"
          aria-label="Decrease quantity"
        >
          −
        </button>
        <span className="flex-1 flex items-center justify-center text-[13px] text-ink">{qty}</span>
        <button
          type="button"
          disabled={pending}
          onClick={() => setQty((q) => q + 1)}
          className="w-8 flex items-center justify-center text-[15px] text-ink border-l border-[#eee9e0] disabled:text-ink-faint"
          aria-label="Increase quantity"
        >
          +
        </button>
      </div>
      <button
        type="button"
        disabled={pending || qty === line.quantity}
        onClick={() => updateLine(line.id, qty)}
        className="mt-1.5 text-[12px] text-burgundy disabled:opacity-50"
      >
        Update
      </button>
    </div>
  );

  const removeButton = (
    <button
      type="button"
      disabled={pending}
      onClick={() => removeLine(line.id)}
      className="text-[#555] hover:text-red-600 disabled:opacity-50"
      aria-label={`Remove ${m.product.title} from cart`}
    >
      <TrashIcon />
    </button>
  );

  const productCell = (
    <div className="flex gap-4 min-w-0">
      {m.product.featuredImage && (
        <Image
          src={m.product.featuredImage.url}
          alt={m.product.featuredImage.altText ?? m.product.title}
          width={88}
          height={108}
          className="w-[88px] h-[108px] object-cover rounded-[8px] shrink-0"
        />
      )}
      <div className="min-w-0">
        <p className="text-[15px] font-semibold leading-snug text-ink">{m.product.title}</p>
        {attrs.length > 0 && <p className="mt-1.5 text-[13px] text-[#888]">{attrs.join("  ·  ")}</p>}
        <p className="mt-2 text-[15px] font-bold text-ink">
          <LocalizedPrice handle={m.product.handle} amount={m.price.amount} currencyCode={m.price.currencyCode} format="currency" />
        </p>
        <p className={`mt-2 text-[12px] flex items-center gap-1.5 ${m.availableForSale ? "text-[#2e7d32]" : "text-red-600"}`}>
          <CheckCircleIcon />
          {m.availableForSale ? "In Stock" : "Out of Stock"}
        </p>
      </div>
    </div>
  );

  return (
    <div className={`grid grid-cols-1 ${CART_TABLE_GRID} gap-x-4 gap-y-4 px-4 md:px-5 py-5 items-center`}>
      {productCell}

      <p className="hidden md:block text-center text-[14px] font-semibold text-ink">
        <LocalizedPrice handle={m.product.handle} amount={m.price.amount} currencyCode={m.price.currencyCode} format="currency" />
      </p>
      <div className="hidden md:flex justify-center">{qtyControl}</div>
      <p className="hidden md:block text-center text-[14px] font-bold text-ink">
        <LocalizedPrice handle={m.product.handle} amount={total} currencyCode={m.price.currencyCode} format="currency" />
      </p>
      <div className="hidden md:flex justify-center">{removeButton}</div>

      <div className="flex items-center justify-between md:hidden">
        {qtyControl}
        <p className="text-[14px] font-bold text-ink">
          <LocalizedPrice handle={m.product.handle} amount={total} currencyCode={m.price.currencyCode} format="currency" />
        </p>
        {removeButton}
      </div>
    </div>
  );
}

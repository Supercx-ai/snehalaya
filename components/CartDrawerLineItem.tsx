"use client";

import Image from "next/image";
import type { CartLine } from "@/lib/shopify";
import { deriveLineAttrs } from "@/lib/product-attrs";
import { useCart } from "./CartProvider";
import LocalizedPrice from "./LocalizedPrice";

function TrashIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 7h16M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2m2 0-1 13a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2L7 7" />
    </svg>
  );
}

export default function CartDrawerLineItem({ line }: { line: CartLine }) {
  const { pending, updateLine, removeLine } = useCart();
  const { merchandise: m } = line;
  const isNew = m.product.tags.some((t) => t.toLowerCase() === "new");
  const derived = deriveLineAttrs(m.product.title, m.selectedOptions);
  const attrs =
    derived.options.length > 0
      ? derived.options.map((o) => o.value)
      : ([derived.colour, derived.fabric, derived.size].filter(Boolean) as string[]);

  return (
    <div className="flex gap-3.5 py-4 border-b border-border-subtle">
      <div className="relative w-[68px] h-[86px] shrink-0">
        {m.product.featuredImage && (
          <Image src={m.product.featuredImage.url} alt={m.product.featuredImage.altText ?? m.product.title} fill className="object-cover rounded-[8px]" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-semibold text-ink leading-snug">{m.product.title}</p>
          {isNew && (
            <span className="shrink-0 rounded-full border border-burgundy/40 px-2 py-0.5 text-[10px] font-semibold tracking-[0.4px] text-burgundy">
              NEW
            </span>
          )}
        </div>
        {attrs.length > 0 && <p className="mt-1 text-xs text-ink-faint">{attrs.join("  ·  ")}</p>}
        <p className="mt-1.5 text-sm font-bold text-ink">
          <LocalizedPrice handle={m.product.handle} amount={m.price.amount} currencyCode={m.price.currencyCode} format="currency" />
        </p>

        <div className="mt-2.5 flex items-center justify-between">
          <div className="flex items-center h-8 rounded-[6px] border border-border-strong">
            <button
              type="button"
              disabled={pending}
              onClick={() => updateLine(line.id, Math.max(1, line.quantity - 1))}
              className="w-7 h-full text-sm text-ink disabled:text-ink-faint"
              aria-label="Decrease quantity"
            >
              −
            </button>
            <span className="w-7 text-center text-xs text-ink">{line.quantity}</span>
            <button
              type="button"
              disabled={pending}
              onClick={() => updateLine(line.id, line.quantity + 1)}
              className="w-7 h-full text-sm text-ink disabled:text-ink-faint"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
          <button type="button" disabled={pending} onClick={() => removeLine(line.id)} aria-label="Remove item" className="text-ink-faint hover:text-red-600 shrink-0">
            <TrashIcon />
          </button>
        </div>
      </div>
    </div>
  );
}

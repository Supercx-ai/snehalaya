"use client";

import Image from "next/image";
import type { CartLine } from "@/lib/shopify";
import { useCart } from "./CartProvider";
import LocalizedPrice from "./LocalizedPrice";

function TrashIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 7h16M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2m2 0-1 13a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2L7 7" />
    </svg>
  );
}

export default function CartDrawerLineItem({ line }: { line: CartLine }) {
  const { pending, updateLine, removeLine } = useCart();
  const { merchandise: m } = line;
  const isNew = m.product.tags.some((t) => t.toLowerCase() === "new");
  const attrs = m.selectedOptions.filter((o) => o.value.toLowerCase() !== "default title").map((o) => o.value);

  return (
    <div className="flex gap-3 py-4 border-b border-border-subtle">
      <div className="relative w-16 h-20 shrink-0">
        {m.product.featuredImage && (
          <Image src={m.product.featuredImage.url} alt={m.product.featuredImage.altText ?? m.product.title} fill className="object-cover rounded-md" />
        )}
        {isNew && (
          <span className="absolute -top-1.5 -right-1.5 bg-primary text-cream text-[9px] tracking-wide2 uppercase px-1.5 py-0.5 rounded-sm">
            New
          </span>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-medium text-ink">{m.product.title}</p>
          <button type="button" disabled={pending} onClick={() => removeLine(line.id)} aria-label="Remove item" className="text-ink-faint hover:text-red-600 shrink-0">
            <TrashIcon />
          </button>
        </div>
        {attrs.length > 0 && <p className="mt-0.5 text-xs text-ink-faint">{attrs.join(" · ")}</p>}

        <div className="mt-2 flex items-center justify-between">
          <p className="text-sm font-medium text-ink">
            <LocalizedPrice handle={m.product.handle} amount={m.price.amount} currencyCode={m.price.currencyCode} format="currency" />
          </p>
          <div className="flex items-center h-7 rounded-sm border border-border-strong">
            <button
              type="button"
              disabled={pending}
              onClick={() => updateLine(line.id, Math.max(1, line.quantity - 1))}
              className="w-6 h-full text-xs text-ink disabled:text-ink-faint"
              aria-label="Decrease quantity"
            >
              −
            </button>
            <span className="w-6 text-center text-xs text-ink">{line.quantity}</span>
            <button
              type="button"
              disabled={pending}
              onClick={() => updateLine(line.id, line.quantity + 1)}
              className="w-6 h-full text-xs text-ink disabled:text-ink-faint"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

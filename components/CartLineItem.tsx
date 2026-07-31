"use client";

import Image from "next/image";
import type { CartLine } from "@/lib/shopify";
import { useCart } from "./CartProvider";
import LocalizedPrice from "./LocalizedPrice";

function TrashIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 7h16M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2m2 0-1 13a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2L7 7" />
    </svg>
  );
}

export default function CartLineItem({ line }: { line: CartLine }) {
  const { pending, updateLine, removeLine } = useCart();
  const { merchandise: m } = line;
  const total = (Number(m.price.amount) * line.quantity).toFixed(2);

  // "Default Title"/"Title" is Shopify's placeholder for a single-variant product with no
  // real options — not worth showing as a subtitle.
  const attrs = m.selectedOptions.filter((o) => o.value.toLowerCase() !== "default title").map((o) => o.value);

  return (
    <div className="flex gap-4 py-5 border-b border-border-subtle">
      {m.product.featuredImage && (
        <Image
          src={m.product.featuredImage.url}
          alt={m.product.featuredImage.altText ?? m.product.title}
          width={80}
          height={104}
          className="w-20 h-[104px] object-cover rounded-md shrink-0"
        />
      )}

      <div className="flex-1 min-w-0">
        <p className="font-display text-card-title text-ink">{m.product.title}</p>
        {attrs.length > 0 && <p className="mt-0.5 text-xs text-ink-faint">{attrs.join(" · ")}</p>}
        <p className={`mt-1 text-xs flex items-center gap-1.5 ${m.availableForSale ? "text-green-700" : "text-red-600"}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${m.availableForSale ? "bg-green-700" : "bg-red-600"}`} />
          {m.availableForSale ? "In Stock" : "Out of Stock"}
        </p>

        <div className="mt-3 flex items-center gap-6">
          <p className="text-sm font-medium text-ink">
            <LocalizedPrice handle={m.product.handle} amount={m.price.amount} currencyCode={m.price.currencyCode} format="currency" />
          </p>

          <div className="flex items-center h-8 rounded-sm border border-border-strong">
            <button
              type="button"
              disabled={pending}
              onClick={() => updateLine(line.id, Math.max(1, line.quantity - 1))}
              className="w-7 h-full text-ink disabled:text-ink-faint"
              aria-label="Decrease quantity"
            >
              −
            </button>
            <span className="w-7 text-center text-sm text-ink">{line.quantity}</span>
            <button
              type="button"
              disabled={pending}
              onClick={() => updateLine(line.id, line.quantity + 1)}
              className="w-7 h-full text-ink disabled:text-ink-faint"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>

          <p className="text-sm font-medium text-ink">
            <LocalizedPrice handle={m.product.handle} amount={total} currencyCode={m.price.currencyCode} format="currency" />
          </p>
        </div>
      </div>

      <button type="button" disabled={pending} onClick={() => removeLine(line.id)} aria-label="Remove item" className="text-ink-faint hover:text-red-600 shrink-0">
        <TrashIcon />
      </button>
    </div>
  );
}

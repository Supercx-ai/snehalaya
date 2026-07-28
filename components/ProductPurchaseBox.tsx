"use client";

import { useMemo, useState } from "react";
import { colourSwatch } from "@/lib/colours";
import type { ProductOption, ProductVariant, Money } from "@/lib/shopify";
import LocalizedPrice from "./LocalizedPrice";
import AddToCart from "./AddToCart";
import BuyNowButton from "./BuyNowButton";
import LiveMirror from "./LiveMirror";

// Tone-on-tone lotus overlay for the colour swatches (matches the Figma mandala texture).
function LotusMark() {
  return (
    <svg viewBox="0 0 100 100" aria-hidden className="pointer-events-none absolute inset-0 h-full w-full text-white opacity-[0.18]">
      <g fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="50" cy="50" r="7" />
        <ellipse cx="50" cy="28" rx="6.5" ry="15" />
        <ellipse cx="50" cy="72" rx="6.5" ry="15" />
        <ellipse cx="28" cy="50" rx="15" ry="6.5" />
        <ellipse cx="72" cy="50" rx="15" ry="6.5" />
        <ellipse cx="35" cy="35" rx="5.5" ry="13" transform="rotate(45 35 35)" />
        <ellipse cx="65" cy="35" rx="5.5" ry="13" transform="rotate(-45 65 35)" />
        <ellipse cx="35" cy="65" rx="5.5" ry="13" transform="rotate(-45 35 65)" />
        <ellipse cx="65" cy="65" rx="5.5" ry="13" transform="rotate(45 65 65)" />
      </g>
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="13" r="8" />
      <path d="M12 9v4l2.5 2.5M9 2h6M12 5V2" />
    </svg>
  );
}

function RulerIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="8" width="18" height="8" rx="1" />
      <path d="M7 8v3M11 8v4M15 8v3M19 8v4" />
    </svg>
  );
}

export default function ProductPurchaseBox({
  productId, handle, title, compareAtPrice, options, variants,
}: {
  productId: string;
  handle: string;
  title: string;
  compareAtPrice: Money | null;
  options: ProductOption[];
  variants: ProductVariant[];
}) {
  const firstAvailable = variants.find((v) => v.availableForSale) ?? variants[0];
  const [selected, setSelected] = useState<Record<string, string>>(
    Object.fromEntries((firstAvailable?.selectedOptions ?? []).map((o) => [o.name, o.value]))
  );
  const [quantity, setQuantity] = useState(1);

  const variant = useMemo(
    () => variants.find((v) => v.selectedOptions.every((o) => selected[o.name] === o.value)) ?? firstAvailable,
    [variants, selected, firstAvailable]
  );

  const compareAtAmount = Number(compareAtPrice?.amount ?? 0);
  const currentAmount = Number(variant?.price.amount ?? 0);
  const onSale = compareAtPrice && compareAtAmount > currentAmount;
  const discountPct = onSale ? Math.round((1 - currentAmount / compareAtAmount) * 100) : 0;

  // A single-value Size option just states a fact ("Free Size") rather than offering a
  // real choice — surface it as a badge instead of a one-option selector.
  const sizeOption = options.find((o) => o.name.toLowerCase() === "size");
  const fixedSize = sizeOption && sizeOption.optionValues.length === 1 ? sizeOption.optionValues[0].name : null;
  const selectableOptions = options.filter((o) => o !== sizeOption || !fixedSize);

  const item = variant
    ? { id: productId, title, amount: variant.price.amount, currencyCode: variant.price.currencyCode }
    : undefined;

  return (
    <div>
      <p className="flex items-baseline gap-3 text-2xl font-medium text-ink">
        <LocalizedPrice handle={handle} amount={variant?.price.amount ?? "0"} currencyCode={variant?.price.currencyCode ?? "INR"} format="currency" />
        {onSale && compareAtPrice && (
          <>
            <span className="text-base font-normal text-ink-faint line-through">
              <LocalizedPrice handle={handle} amount={compareAtPrice.amount} currencyCode={compareAtPrice.currencyCode} format="currency" />
            </span>
            <span className="text-sm font-medium text-accent">{discountPct}% OFF</span>
            <span className="flex items-center justify-center w-4 h-4 rounded-full border border-ink-faint text-ink-faint text-[10px] leading-none" title="Discount applied at checkout">
              i
            </span>
          </>
        )}
      </p>
      <p className="mt-1 text-xs text-ink">(inclusive of all taxes)</p>

      <LiveMirror />

      {selectableOptions.map((opt) => {
        const isColor = ["color", "colour"].includes(opt.name.toLowerCase());
        return (
          <div key={opt.name} className="mt-6">
            <div className="text-xs tracking-wide2 text-ink uppercase">{opt.name}</div>
            <div className="mt-3 flex flex-wrap gap-3">
              {opt.optionValues.map((v) => {
                const active = selected[opt.name] === v.name;
                const select = () => setSelected((s) => ({ ...s, [opt.name]: v.name }));
                return isColor ? (
                  <button key={v.name} type="button" onClick={select} className="flex flex-col items-center gap-2">
                    <span
                      className={`relative block w-20 h-20 rounded-xl overflow-hidden ${active ? "ring-2 ring-accent ring-offset-2" : "ring-1 ring-border-strong"}`}
                      style={{ background: colourSwatch(v.name) }}
                    >
                      <LotusMark />
                    </span>
                    <span className={`text-xs ${active ? "text-primary font-semibold" : "text-ink-secondary"}`}>{v.name}</span>
                  </button>
                ) : (
                  <button
                    key={v.name}
                    type="button"
                    onClick={select}
                    className={`h-9 px-4 rounded-full text-xs ${
                      active ? "bg-primary text-white" : "bg-white text-ink border border-border-strong"
                    }`}
                  >
                    {v.name}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}

      <div className="mt-6 flex flex-wrap items-center gap-3">
        {/* ponytail: mockup stock badge — wire to variant.quantityAvailable when inventory is fetched */}
        <span className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-full bg-[#fdecec] text-[#c0392b] border border-[#f2bcbc] text-xs font-medium">
          <ClockIcon /> Only few left
        </span>
        {fixedSize && (
          <span className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-full bg-[#fdf3e3] text-ink border border-accent/50 text-xs font-medium">
            <RulerIcon /> {fixedSize}
          </span>
        )}
      </div>

      <div className="mt-6 sm:flex sm:items-center sm:gap-3">
        <div className="flex items-center gap-3 sm:contents">
          <div className="flex items-center gap-2">
            <span className="text-xs tracking-wide2 text-ink uppercase">Qty</span>
            <div className="relative">
              <select
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="appearance-none h-12 pl-4 pr-9 rounded-sm border border-border-strong bg-white text-sm text-ink cursor-pointer"
              >
                {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink-faint text-xs">⌄</span>
            </div>
          </div>
          <div className="flex-1 [&>button]:w-full">
            <AddToCart merchandiseId={variant?.id} soldOut={!variant?.availableForSale} item={item} quantity={quantity} />
          </div>
        </div>
        <div className="mt-3 sm:mt-0 sm:flex-1 [&>button]:w-full">
          <BuyNowButton merchandiseId={variant?.id} soldOut={!variant?.availableForSale} item={item} quantity={quantity} />
        </div>
      </div>
    </div>
  );
}

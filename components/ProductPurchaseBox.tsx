"use client";

import { useMemo, useState } from "react";
import { colourSwatch } from "@/lib/colours";
import type { ProductOption, ProductVariant, Money } from "@/lib/shopify";
import LocalizedPrice from "./LocalizedPrice";
import AddToCart from "./AddToCart";
import BuyNowButton from "./BuyNowButton";
import CouponForm from "./CouponForm";

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
      <p className="mt-1 text-xs text-ink-faint">Inclusive of all taxes</p>

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
                  <button key={v.name} type="button" onClick={select} className="flex flex-col items-center gap-1.5">
                    <span
                      className={`block w-11 h-11 rounded-swatch ${active ? "ring-2 ring-accent ring-offset-2" : "ring-1 ring-border-strong"}`}
                      style={{ background: colourSwatch(v.name) }}
                    />
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

      {fixedSize && (
        <span className="mt-6 inline-flex items-center h-8 px-3 rounded-full bg-accent/10 text-accent text-xs font-medium">
          {fixedSize}
        </span>
      )}

      <div className="mt-6 flex items-center gap-4">
        <span className="text-xs tracking-wide2 text-ink uppercase">Qty</span>
        <div className="relative">
          <select
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="appearance-none h-11 pl-4 pr-9 rounded-sm border border-border-strong bg-white text-sm text-ink cursor-pointer"
          >
            {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink-faint text-xs">⌄</span>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <AddToCart merchandiseId={variant?.id} soldOut={!variant?.availableForSale} item={item} quantity={quantity} />
        <BuyNowButton merchandiseId={variant?.id} soldOut={!variant?.availableForSale} item={item} quantity={quantity} />
      </div>

      <div className="mt-6">
        <CouponForm />
      </div>
    </div>
  );
}

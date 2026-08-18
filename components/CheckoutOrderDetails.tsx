"use client";

import Image from "next/image";
import type { Cart } from "@/lib/shopify";
import { deriveLineAttrs } from "@/lib/product-attrs";
import { useCart } from "./CartProvider";
import { useWishlist } from "@/hooks/useWishlist";
import LocalizedPrice from "./LocalizedPrice";

function ordinal(n: number) {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return `${n}${s[(v - 20) % 10] ?? s[v] ?? s[0]}`;
}

function TruckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="size-4 shrink-0" aria-hidden>
      <path d="M1.5 5.5h12.5v11H1.5z" />
      <path d="M14 9h4.2l2.8 3.4v4.1H14" />
      <circle cx="6" cy="17.5" r="1.9" />
      <circle cx="17.5" cy="17.5" r="1.9" />
    </svg>
  );
}

function SlashIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="size-3.5 shrink-0 text-[#c0453c]" aria-hidden>
      <circle cx="12" cy="12" r="9" />
      <path d="M5.8 5.8l12.4 12.4" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="size-4" aria-hidden>
      <path d="M4 7h16" />
      <path d="M9.5 7V4.5h5V7" />
      <path d="M6 7l1 13.5h10L18 7" />
      <path d="M10 11v6M14 11v6" />
    </svg>
  );
}

export default function CheckoutOrderDetails({ cart }: { cart: Cart }) {
  const { pending, removeLine } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();

  const eta = new Date();
  eta.setDate(eta.getDate() + 7);
  const deliveryLine = `${ordinal(eta.getDate())} ${eta.toLocaleString("en-US", { month: "long" })} ${eta.getFullYear()}`;

  return (
    <details open className="mt-4 rounded-[10px] border border-[#e8e0d5] bg-white group">
      <summary className="flex items-center cursor-pointer list-none px-4 py-4 border-b border-[#f0e9de]">
        <span className="text-[13px] font-bold tracking-[1.2px] uppercase text-burgundy">Order Details</span>
        <span className="ml-1.5 flex-1 text-[12px] text-[#888]">- {cart.totalQuantity} item(s)</span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="size-4 text-[#444] transition-transform group-open:rotate-180" aria-hidden>
          <path d="m6 9 6 6 6-6" />
        </svg>
      </summary>

      <div className="divide-y divide-[#f0e9de]">
        {cart.lines.nodes.map((line) => {
          const m = line.merchandise;
          const attrs = deriveLineAttrs(m.product.title, m.selectedOptions);
          const wishItem = {
            handle: m.product.handle,
            title: m.product.title,
            image: m.product.featuredImage?.url ?? null,
            amount: m.price.amount,
            currencyCode: m.price.currencyCode,
          };
          return (
            <div key={line.id} className="px-4 py-4">
              <div className="flex gap-4">
                {m.product.featuredImage && (
                  <Image
                    src={m.product.featuredImage.url}
                    alt={m.product.featuredImage.altText ?? m.product.title}
                    width={120}
                    height={164}
                    className="w-[120px] h-[164px] object-cover rounded-[6px] shrink-0"
                  />
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex items-start gap-2.5">
                    <p className="flex-1 text-[13.5px] font-bold tracking-[0.4px] uppercase leading-snug text-burgundy">
                      {m.product.title}
                    </p>
                    <button
                      type="button"
                      onClick={() => toggleWishlist(wishItem)}
                      aria-pressed={isWishlisted(m.product.handle)}
                      aria-label={isWishlisted(m.product.handle) ? "Remove from wishlist" : "Add to wishlist"}
                      className="mt-0.5 text-[#444] hover:text-burgundy"
                    >
                      <svg viewBox="0 0 24 24" fill={isWishlisted(m.product.handle) ? "#67111a" : "none"} stroke="currentColor" strokeWidth="1.6" className="size-4" aria-hidden>
                        <path d="M12 20.5 4.7 13a4.8 4.8 0 0 1 0-6.7 4.6 4.6 0 0 1 6.6 0l.7.7.7-.7a4.6 4.6 0 0 1 6.6 0 4.8 4.8 0 0 1 0 6.7L12 20.5Z" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      disabled={pending}
                      onClick={() => removeLine(line.id)}
                      aria-label={`Remove ${m.product.title} from cart`}
                      className="mt-0.5 text-[#444] hover:text-red-600 disabled:opacity-50"
                    >
                      <TrashIcon />
                    </button>
                  </div>

                  <p className="mt-2 text-[12.5px] text-[#555]">Pure {attrs.style}</p>

                  <p className="mt-2 text-[12.5px] text-[#555]">
                    {attrs.colour && (
                      <>
                        Color: <span className="font-semibold text-ink">{attrs.colour}</span>
                        <span className="inline-block w-5" />
                      </>
                    )}
                    Size: <span className="font-semibold text-ink">{attrs.size}</span>
                  </p>
                  <p className="mt-2 text-[12.5px] text-[#555]">
                    Price:{" "}
                    <span className="font-semibold text-ink">
                      <LocalizedPrice
                        handle={m.product.handle}
                        amount={(Number(m.price.amount) * line.quantity).toFixed(2)}
                        currencyCode={m.price.currencyCode}
                        format="currency"
                      />
                    </span>
                    {line.quantity > 1 && <span className="text-[#999]"> (Qty {line.quantity})</span>}
                  </p>
                  <p className="mt-3 text-[12.5px] text-ink">Standard Delivery by {deliveryLine}.</p>
                  <p className="mt-2 flex items-center gap-1.5 text-[12.5px] text-[#444]">
                    <TruckIcon />
                    2 days return/exchange available
                  </p>
                </div>
              </div>

              <div className="mt-3.5 flex flex-wrap gap-2">
                <span className="flex items-center gap-1.5 rounded-full bg-[#f4f2ee] px-3 py-1.5 text-[11px] text-[#555]">
                  <SlashIcon />
                  This item is excluded from all promotional offers
                </span>
                <span className="flex items-center gap-1.5 rounded-full bg-[#f4f2ee] px-3 py-1.5 text-[11px] text-[#555]">
                  <SlashIcon />
                  COD not available.
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </details>
  );
}

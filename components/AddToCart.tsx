"use client";

import Image from "next/image";
import { useCart } from "./CartProvider";
import { gaEvent } from "@/lib/gtag";

type Item = { id: string; title: string; amount: string; currencyCode: string };

export default function AddToCart({
  merchandiseId, soldOut, item, quantity = 1,
}: { merchandiseId?: string; soldOut?: boolean; item?: Item; quantity?: number }) {
  const { addLine, pending } = useCart();

  if (!merchandiseId || soldOut) {
    return (
      <button disabled className="h-12 px-8 rounded-sm bg-border-subtle text-ink-faint text-sm font-medium cursor-not-allowed">
        Sold out
      </button>
    );
  }

  return (
    <button
      disabled={pending}
      onClick={() => {
        addLine(merchandiseId, quantity);
        if (item) {
          gaEvent("add_to_cart", {
            currency: item.currencyCode,
            value: Number(item.amount) * quantity,
            items: [{ item_id: item.id, item_name: item.title, price: Number(item.amount), quantity }],
          });
        }
      }}
      className="h-12 px-8 rounded-sm bg-primary text-cream text-sm font-medium tracking-wide2 uppercase disabled:opacity-60 flex items-center justify-center gap-2"
    >
      <Image src="/figma/icon-cart-white.svg" alt="" width={16} height={16} />
      {pending ? "Adding…" : "Add To Cart"}
    </button>
  );
}

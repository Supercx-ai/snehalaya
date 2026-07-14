"use client";

import { useEffect } from "react";
import { gaEvent } from "@/lib/gtag";

export default function ViewItemTracker({ id, title, amount, currencyCode }: { id: string; title: string; amount: string; currencyCode: string }) {
  useEffect(() => {
    gaEvent("view_item", {
      currency: currencyCode,
      value: Number(amount),
      items: [{ item_id: id, item_name: title, price: Number(amount) }],
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return null;
}

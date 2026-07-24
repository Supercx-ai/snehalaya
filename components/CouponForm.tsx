"use client";

import { useState } from "react";
import { useCart } from "./CartProvider";

// Validates against a real Shopify discount code (via the existing applyCode cart action) —
// no advertised "best coupon" since the Storefront API has no way to list active codes.
export default function CouponForm() {
  const { cart, applyCode, pending } = useCart();
  const [code, setCode] = useState("");
  const [result, setResult] = useState<"idle" | "valid" | "invalid">("idle");

  if (!cart) {
    return <p className="text-xs text-ink-faint">Add this to your cart to apply a coupon code.</p>;
  }

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        const ok = await applyCode(code);
        setResult(ok ? "valid" : "invalid");
      }}
      className="flex items-center gap-2"
    >
      <input
        value={code}
        onChange={(e) => { setCode(e.target.value); setResult("idle"); }}
        placeholder="Have a coupon code?"
        className="h-11 flex-1 min-w-0 px-4 rounded-sm border border-border-strong text-sm text-ink placeholder:text-ink-faint"
      />
      <button
        type="submit"
        disabled={pending || !code}
        className="h-11 px-5 rounded-sm border border-primary text-primary text-sm font-medium disabled:opacity-50 shrink-0"
      >
        {pending ? "Applying…" : "Apply"}
      </button>
      {result === "valid" && <span className="text-xs text-green-700 shrink-0">Applied!</span>}
      {result === "invalid" && <span className="text-xs text-red-600 shrink-0">Invalid code</span>}
    </form>
  );
}

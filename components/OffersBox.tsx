"use client";

import { useState } from "react";

// ponytail: mockup offers to match the design. The Storefront API can't list active discount
// codes, so these are hardcoded. For a real, validating coupon field see CouponForm.tsx.
const COUPONS = ["CREDIT12", "FESTIVE10", "SILK500", "NEWYOU15", "WELCOME5", "BANK750"];
const BEST = COUPONS[0];

export default function OffersBox() {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState("");

  const copy = (code: string) => {
    navigator.clipboard?.writeText(code);
    setCopied(code);
  };

  return (
    <div className="mt-8">
      <h3 className="text-xl text-ink mb-3">Offers</h3>
      <div className="border-t border-border pt-4">
        {/* Cream coupon banner — PDP node 2245:865 (same #FFF4DF family as the Live Mirror card) */}
        <div className="flex items-center justify-between rounded-lg bg-[#fff4df] px-4 py-3.5 text-ink">
          <button type="button" onClick={() => copy(BEST)} className="flex items-center gap-2 text-base">
            Best Coupon: {BEST}
            <span aria-hidden>⧉</span>
            {copied === BEST && <span className="text-xs text-ink-subtle">Copied</span>}
          </button>
          <button type="button" onClick={() => setOpen((o) => !o)} className="flex items-center gap-2 text-base shrink-0 border-l border-[#e5d3ac] pl-4">
            + {COUPONS.length - 1} More <span aria-hidden>›</span>
          </button>
        </div>
        <p className="mt-2 text-center text-sm text-ink-secondary">Save extra upto ₹4,820</p>

        {open && (
          <ul className="mt-3 space-y-2">
            {COUPONS.slice(1).map((code) => (
              <li key={code} className="flex items-center justify-between border border-dashed border-border-strong rounded-lg px-4 py-2 text-sm">
                <span className="font-medium text-ink">{code}</span>
                <button type="button" onClick={() => copy(code)} className="text-primary text-xs font-medium">
                  {copied === code ? "Copied" : "Copy"}
                </button>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-4 flex items-center gap-2 rounded-lg bg-[#fff4df] px-4 py-3.5">
          <span className="text-base text-ink">Earn 643 Cash</span>
          <span
            className="flex items-center justify-center w-4 h-4 rounded-full border border-ink-faint text-ink-faint text-[10px] leading-none"
            title="Cashback credited after delivery"
          >
            i
          </span>
        </div>
      </div>
    </div>
  );
}

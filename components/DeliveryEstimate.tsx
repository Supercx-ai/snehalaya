"use client";

import { useState } from "react";
import Image from "next/image";

const WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;

function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="w-4 h-4 shrink-0 text-ink" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 21s7-6.3 7-11a7 7 0 1 0-14 0c0 4.7 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

function ordinal(n: number) {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return `${n}${s[(v - 20) % 10] ?? s[v] ?? s[0]}`;
}

// Delivery date is a real estimate: today + the ship_days metafield.
// ponytail: the pincode is a mockup (default 600118, editable inline) — no
// serviceability API is wired up; "Change" just updates the displayed value.
export default function DeliveryEstimate({ shipDays }: { shipDays?: string }) {
  const [pin, setPin] = useState("600118");
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(pin);

  const savePin = () => {
    const v = draft.trim();
    if (v) setPin(v);
    setEditing(false);
  };

  const days = Number(shipDays);
  let deliveryLine: string | null = null;
  if (shipDays) {
    if (Number.isFinite(days) && days > 0) {
      const eta = new Date();
      eta.setDate(eta.getDate() + days);
      deliveryLine = `${ordinal(eta.getDate())} ${eta.toLocaleString("en-US", { month: "long" })}`;
    } else {
      deliveryLine = shipDays; // e.g. "5-7 days"
    }
  }

  return (
    <div className="mt-6 space-y-3">
      <div className="flex items-center justify-between gap-2 rounded-lg bg-[#fdf0d5] px-4 py-3 text-sm">
        <span className="flex items-center gap-2 text-ink">
          <PinIcon />
          {editing ? (
            <input
              autoFocus
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") savePin(); if (e.key === "Escape") setEditing(false); }}
              inputMode="numeric"
              maxLength={6}
              placeholder="Pincode"
              className="w-24 bg-transparent border-b border-ink/40 outline-none text-ink placeholder:text-ink-faint"
            />
          ) : (
            pin
          )}
        </span>
        <button
          type="button"
          onClick={() => { if (editing) savePin(); else { setDraft(pin); setEditing(true); } }}
          className="font-medium text-primary"
        >
          {editing ? "Save" : "Change"}
        </button>
      </div>

      {deliveryLine && (
        <p className="border border-border-strong rounded-lg px-4 py-3 text-sm text-ink">
          Standard Delivery by <strong className="font-medium text-primary">{deliveryLine}</strong>
        </p>
      )}

      {WHATSAPP && (
        <p className="flex items-center gap-2 text-sm text-ink-subtle">
          <Image src="/figma/newsletter/icon-whatsapp.png" alt="" width={18} height={18} className="shrink-0" />
          Need it by a specific date?{" "}
          <a
            href={`https://wa.me/${WHATSAPP}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline"
          >
            Chat with us
          </a>
        </p>
      )}
    </div>
  );
}

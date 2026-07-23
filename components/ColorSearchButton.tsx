"use client";

import { useState } from "react";
import Link from "next/link";
import { slugifyColour, colourSwatch } from "@/lib/colours";
import type { ColorFilterValue } from "@/lib/shopify";

export default function ColorSearchButton({ colours, bare }: { colours: ColorFilterValue[]; bare?: boolean }) {
  const [open, setOpen] = useState(false);
  if (colours.length === 0) return null;

  return (
    <div className="relative shrink-0">
      <button
        onClick={() => setOpen((o) => !o)}
        className={`flex items-center h-[48px] pl-4 pr-4 gap-3 ${bare ? "border-l border-border" : "bg-white border border-border-strong rounded-md"}`}
      >
        <span className="flex">
          {colours.slice(0, 4).map((c, i) => (
            <span
              key={c.label}
              className="w-[11px] h-[11px] rounded-full border border-white"
              style={{ background: colourSwatch(c.label), marginLeft: i === 0 ? 0 : -4 }}
            />
          ))}
        </span>
        <span className="text-base text-ink-secondary whitespace-nowrap">Color Search</span>
      </button>

      {open && (
        <>
          <div onClick={() => setOpen(false)} className="fixed inset-0 z-40" />
          <div className="absolute top-[110%] right-0 bg-white border border-border rounded-lg p-3 shadow-lg z-50 grid grid-cols-4 gap-2">
            {colours.map((c) => (
              <Link key={c.label} href={`/colours/${slugifyColour(c.label)}`} onClick={() => setOpen(false)} className="text-center text-ink">
                <span className="block w-8 h-8 rounded-full border border-border mx-auto mb-1" style={{ background: colourSwatch(c.label) }} />
                <span className="text-xs">{c.label}</span>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

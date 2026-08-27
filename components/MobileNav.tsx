"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import CurrencySelector from "./CurrencySelector";
import type { CountryCode } from "@/lib/shopify";

type NavItem = { label: string; href: string };

// Mobile Figma tucks the nav row behind a hamburger menu instead of the horizontal-scroll
// row desktop uses — this is that drawer.
export default function MobileNav({ nav, initialCountry }: { nav: NavItem[]; initialCountry: CountryCode }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button onClick={() => setOpen(true)} aria-label="Open menu" className="md:hidden flex flex-col justify-center gap-[5px] w-5 h-4 shrink-0 justify-self-start">
        <span className="block h-[2px] w-5 bg-[#360a10] rounded-full" />
        <span className="block h-[2px] w-3.5 bg-[#360a10] rounded-full" />
        <span className="block h-[2px] w-5 bg-[#360a10] rounded-full" />
      </button>

      {open && (
        <div className="md:hidden fixed inset-0 z-50">
          <div onClick={() => setOpen(false)} className="absolute inset-0 bg-black/40" />
          <div className="absolute left-0 top-0 bottom-0 w-[80%] max-w-[320px] bg-cream shadow-lg p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <Image src="/figma/logo.png" alt="Snehalayaa Silks" width={156} height={32} className="h-[30px] w-auto" />
              <button onClick={() => setOpen(false)} aria-label="Close menu" className="text-2xl text-ink leading-none">&times;</button>
            </div>

            <nav className="flex flex-col gap-4 text-base text-ink">
              {nav.map((item) => (
                <Link key={item.label} href={item.href} onClick={() => setOpen(false)}>
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="mt-6 pt-6 border-t border-border">
              <Link href="/store-locator" onClick={() => setOpen(false)} className="flex items-center gap-1.5 text-base font-medium text-primary whitespace-nowrap mb-4">
                <Image src="/figma/icon-store.svg" alt="" width={16} height={16} />
                Find a store
              </Link>
              <CurrencySelector initialCountry={initialCountry} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

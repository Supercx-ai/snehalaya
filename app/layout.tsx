import type { Metadata } from "next";
import { Suspense } from "react";
import { Manrope, Cormorant_Garamond } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { getCart } from "@/lib/cart";
import { getColorFilterValues } from "@/lib/shopify";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import { getSelectedCountry } from "@/lib/currency";
import CartProvider from "@/components/CartProvider";
import CartButton from "@/components/CartButton";
import CartDrawer from "@/components/CartDrawer";
import SearchBox from "@/components/SearchBox";
import ColorSearchButton from "@/components/ColorSearchButton";
import AnnouncementBar from "@/components/AnnouncementBar";
import CurrencySelector from "@/components/CurrencySelector";
import MobileNav from "@/components/MobileNav";
import KanjivaramMegaMenu from "@/components/KanjivaramMegaMenu";
import Footer from "@/components/Footer";
import "./globals.css";

// Weights confirmed from the Figma header pull: Regular(400)/Medium(500)/SemiBold(600).
const manrope = Manrope({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-manrope" });
// Serif display face, confirmed from the hero heading — Cormorant Garamond Light.
// 600 is used by the legal pages' section headings (T&C node 2505:2364).
const cormorant = Cormorant_Garamond({ subsets: ["latin"], weight: ["300", "400", "500", "600"], variable: "--font-cormorant" });

export const metadata: Metadata = {
  title: "Snehalayaa Silks",
  description: "Headless Shopify storefront",
};

// Handles verified against the live store's Storefront API (collections query) —
// every nav item now lands on a real collection instead of a guessed handle/search.
const NAV = [
  { label: "New Arrivals", href: "/collections/new-arrival" }, // "Just Arrived"
  { label: "Kanjivaram", href: "/collections/kanjivaram-silk" },
  { label: "Banarasi", href: "/collections/banarasi-silk" },
  { label: "Chanderi", href: "/collections/chanderi-cotton" },
  { label: "Paithani", href: "/collections/paithani" },
  { label: "Tussar", href: "/collections/tussar-saree" },
  { label: "Wedding", href: "/collections/maharani-bridal-collection" },
  { label: "The Edit", href: "/collections/designer" },
  { label: "Collections", href: "/collections" },
  { label: "About", href: "/about" },
];

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [cart, country, colours] = await Promise.all([getCart(), getSelectedCountry(), getColorFilterValues()]);

  return (
    <html lang="en" className={`${manrope.variable} ${cormorant.variable}`}>
      {/* Page fill is #faf7f2 in the comp (every page frame carries it), not white — the
          sections after Brand Ambassador have no background of their own and were showing
          through to white. */}
      <body className="font-sans text-ink bg-cream">
        <Suspense fallback={null}>
          <GoogleAnalytics />
        </Suspense>
        <CartProvider initialCart={cart} initialCountry={country}>
          <AnnouncementBar />

          <header className="bg-cream border-b border-border">
            {/* Mobile: hamburger / logo / icons — the classic 1fr-auto-1fr grid keeps the
                logo genuinely centered even though the hamburger (20px) and icon cluster
                (84px) are different widths; desktop reverts to a plain flex row. */}
            <div className="grid grid-cols-[1fr_auto_1fr] md:flex items-center gap-3 md:gap-6 px-4 md:px-[30px] py-[10px]">
              <MobileNav nav={NAV} initialCountry={country} />

              <Link href="/" className="shrink-0 justify-self-center md:justify-self-auto">
                <Image src="/figma/logo.png" alt="Snehalayaa Silks" width={205} height={42} priority className="h-[34px] md:h-[38px] w-auto" />
              </Link>

              <div className="hidden md:block">
                <CurrencySelector initialCountry={country} />
              </div>

              <div className="hidden md:block flex-1 min-w-0">
                <SearchBox />
              </div>

              <div className="hidden md:block">
                <ColorSearchButton colours={colours} />
              </div>

              <Link href="/store-locator" className="hidden md:flex items-center gap-1.5 text-base font-medium text-primary whitespace-nowrap">
                <Image src="/figma/icon-store.svg" alt="" width={16} height={16} />
                Find a store
              </Link>

              <div className="flex items-center gap-3 md:gap-4 justify-self-end md:justify-self-auto md:ml-auto shrink-0">
                <Link href="/account" aria-label="Account">
                  <Image src="/figma/icon-account.svg" alt="" width={20} height={20} />
                </Link>
                <Link href="/wishlist" aria-label="Wishlist">
                  <Image src="/figma/icon-wishlist.svg" alt="" width={20} height={20} />
                </Link>
                <CartButton />
              </div>
            </div>

            {/* Mobile Figma shows search / image search / colour search as ONE continuous
                bar (not separate boxes) in its own row beneath the logo/icons row. */}
            <div className="md:hidden px-4 pb-3">
              <div className="flex items-center h-[48px] bg-white border border-border-strong rounded-md">
                <SearchBox bare />
                <ColorSearchButton colours={colours} bare />
              </div>
            </div>

            <nav className="hidden md:block border-t border-border-subtle">
              <div className="relative px-4 md:px-[30px]">
                <div className="flex gap-6 md:gap-8 text-base whitespace-nowrap overflow-x-auto">
                  {NAV.map((item, i) =>
                    item.label === "Kanjivaram" ? (
                      <div key={item.label} className="group/kanjivaram shrink-0 py-3">
                        <Link href={item.href} className="text-ink hover:text-primary">{item.label}</Link>
                        <div className="hidden group-hover/kanjivaram:block absolute left-0 right-0 top-full z-40">
                          <KanjivaramMegaMenu />
                        </div>
                      </div>
                    ) : (
                      <Link
                        key={item.label}
                        href={item.href}
                        className={
                          i === 0
                            ? "py-3 shrink-0 font-semibold text-accent pr-8 border-r border-border"
                            : "py-3 shrink-0 text-ink hover:text-primary"
                        }
                      >
                        {item.label}
                      </Link>
                    )
                  )}
                </div>
              </div>
            </nav>
          </header>

          {children}
          <Footer />
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}

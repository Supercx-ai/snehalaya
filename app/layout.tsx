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
import Footer from "@/components/Footer";
import "./globals.css";

// Weights confirmed from the Figma header pull: Regular(400)/Medium(500)/SemiBold(600).
const manrope = Manrope({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-manrope" });
// Serif display face, confirmed from the hero heading — Cormorant Garamond Light.
const cormorant = Cormorant_Garamond({ subsets: ["latin"], weight: ["300", "400", "500"], variable: "--font-cormorant" });

export const metadata: Metadata = {
  title: "Snehalayaa Silks",
  description: "Headless Shopify storefront",
};

// ponytail: nav maps to real collections where they exist. Banarasi/Chanderi/Paithani/
// Tussar are weave/regional-style names — not a Fabric taxonomy value (Fabric means
// material: Silk/Cotton/Denim) and no dedicated collection exists yet, so they route
// through the free-text /search instead. Swap to real collections when they exist.
const NAV = [
  { label: "New Arrivals", href: "/collections/new-arrivals" },
  { label: "Kanjivaram", href: "/collections/kanjivaram-silk-sarees" },
  { label: "Banarasi", href: "/search?q=banarasi" },
  { label: "Chanderi", href: "/search?q=chanderi" },
  { label: "Paithani", href: "/search?q=paithani" },
  { label: "Tussar", href: "/search?q=tussar" },
  { label: "Wedding", href: "/collections/bridal-muhurtham" },
  { label: "The Edit", href: "/collections/maharani-exclusive" },
  { label: "Collections", href: "/collections" },
  { label: "About", href: "/about" },
];

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [cart, country, colours] = await Promise.all([getCart(), getSelectedCountry(), getColorFilterValues()]);

  return (
    <html lang="en" className={`${manrope.variable} ${cormorant.variable}`}>
      <body className="font-sans text-ink bg-white">
        <Suspense fallback={null}>
          <GoogleAnalytics />
        </Suspense>
        <CartProvider initialCart={cart} initialCountry={country}>
          <AnnouncementBar />

          <header className="bg-cream border-b border-border">
            {/* Mobile: hamburger / logo / icons — the classic 1fr-auto-1fr grid keeps the
                logo genuinely centered even though the hamburger (20px) and icon cluster
                (84px) are different widths; desktop reverts to a plain flex row. */}
            <div className="mx-auto max-w-[1280px] grid grid-cols-[1fr_auto_1fr] md:flex items-center gap-3 md:gap-6 px-4 md:px-8 py-[10px]">
              <MobileNav nav={NAV} initialCountry={country} />

              <Link href="/" className="shrink-0 justify-self-center md:justify-self-auto">
                <Image src="/figma/logo.png" alt="Snehalayaa Silks" width={126} height={42} priority className="h-[48px] md:h-[42px] w-auto" />
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

            <nav className="hidden md:block border-t border-border-subtle overflow-x-auto">
              <div className="mx-auto max-w-[1280px] flex gap-6 md:gap-8 px-4 md:px-8 py-3 text-base whitespace-nowrap">
                {NAV.map((item, i) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={
                      i === 0
                        ? "font-semibold text-accent pr-8 border-r border-border"
                        : "text-ink hover:text-primary"
                    }
                  >
                    {item.label}
                  </Link>
                ))}
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

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
            <div className="mx-auto max-w-[1280px] flex items-center gap-6 px-8 py-[10px]">
              <Link href="/" className="shrink-0">
                <Image src="/figma/logo.png" alt="Snehalayaa Silks" width={126} height={42} priority className="h-[42px] w-auto" />
              </Link>

              <CurrencySelector initialCountry={country} />

              <SearchBox />

              <ColorSearchButton colours={colours} />

              <Link href="/store-locator" className="flex items-center gap-1.5 text-base font-medium text-primary whitespace-nowrap">
                <Image src="/figma/icon-store.svg" alt="" width={16} height={16} />
                Find a store
              </Link>

              <div className="flex items-center gap-4 ml-auto">
                <Link href="/account" aria-label="Account">
                  <Image src="/figma/icon-account.svg" alt="" width={20} height={20} />
                </Link>
                <Link href="/wishlist" aria-label="Wishlist">
                  <Image src="/figma/icon-wishlist.svg" alt="" width={20} height={20} />
                </Link>
                <CartButton />
              </div>
            </div>

            <nav className="border-t border-border-subtle overflow-x-auto">
              <div className="mx-auto max-w-[1280px] flex gap-8 px-8 py-3 text-base whitespace-nowrap">
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
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}

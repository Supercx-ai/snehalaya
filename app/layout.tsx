import type { Metadata } from "next";
import { Suspense } from "react";
import { getCart } from "@/lib/cart";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import { getSelectedCountry } from "@/lib/currency";
import CartProvider from "@/components/CartProvider";
import CartButton from "@/components/CartButton";
import CartDrawer from "@/components/CartDrawer";
import SearchBox from "@/components/SearchBox";
import AnnouncementBar from "@/components/AnnouncementBar";
import CurrencySelector from "@/components/CurrencySelector";

export const metadata: Metadata = {
  title: "Xtracut",
  description: "Headless Shopify storefront",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [cart, country] = await Promise.all([getCart(), getSelectedCountry()]);

  return (
    <html lang="en">
      <body style={{ fontFamily: "system-ui, sans-serif", margin: 0, padding: "2rem", maxWidth: 1100, marginInline: "auto" }}>
        <Suspense fallback={null}>
          <GoogleAnalytics />
        </Suspense>
        <CartProvider initialCart={cart} initialCountry={country}>
          <AnnouncementBar />
          <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
            <a href="/" style={{ fontSize: "1.4rem", fontWeight: 700, textDecoration: "none", color: "inherit" }}>
              Xtracut
            </a>
            <SearchBox />
            <a href="/blog" style={{ textDecoration: "none", color: "inherit" }}>Blog</a>
            <a href="/wishlist" style={{ textDecoration: "none", color: "inherit" }}>Wishlist</a>
            <a href="/account" style={{ textDecoration: "none", color: "inherit" }}>Account</a>
            <CurrencySelector initialCountry={country} />
            <CartButton />
          </header>
          {children}
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}

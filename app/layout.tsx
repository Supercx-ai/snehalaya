import type { Metadata } from "next";
import { getCart } from "@/lib/cart";
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
  const cart = await getCart();

  return (
    <html lang="en">
      <body style={{ fontFamily: "system-ui, sans-serif", margin: 0, padding: "2rem", maxWidth: 1100, marginInline: "auto" }}>
        <CartProvider initialCart={cart}>
          <AnnouncementBar />
          <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
            <a href="/" style={{ fontSize: "1.4rem", fontWeight: 700, textDecoration: "none", color: "inherit" }}>
              Xtracut
            </a>
            <SearchBox />
            <a href="/blog" style={{ textDecoration: "none", color: "inherit" }}>Blog</a>
            <CurrencySelector />
            <CartButton />
          </header>
          {children}
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}

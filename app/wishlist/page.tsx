"use client";

import Image from "next/image";
import Link from "next/link";
import { useWishlist } from "@/hooks/useWishlist";

// localStorage-backed — client component, no server data to fetch.
export default function WishlistPage() {
  const { wishlistItems, toggleWishlist } = useWishlist();

  if (wishlistItems.length === 0) {
    return (
      <main>
        <h1>Your wishlist</h1>
        <p>Nothing saved yet. <Link href="/">Browse products →</Link></p>
      </main>
    );
  }

  return (
    <main>
      <h1>Your wishlist</h1>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "1.5rem" }}>
        {wishlistItems.map((item) => (
          <div key={item.handle}>
            <Link href={`/products/${item.handle}`} style={{ textDecoration: "none", color: "inherit" }}>
              {item.image && (
                <Image src={item.image} alt={item.title} width={220} height={220} style={{ width: "100%", height: "auto", borderRadius: 8 }} />
              )}
              <h3 style={{ margin: "0.5rem 0 0.25rem" }}>{item.title}</h3>
              <p style={{ margin: 0, color: "#555" }}>{item.amount} {item.currencyCode}</p>
            </Link>
            <button
              onClick={() => toggleWishlist(item)}
              style={{ marginTop: "0.5rem", padding: "0.4rem 0.8rem", border: "1px solid #ccc", borderRadius: 6, background: "#fff", cursor: "pointer" }}
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}

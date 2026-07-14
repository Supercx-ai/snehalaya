"use client";

import Image from "next/image";
import Link from "next/link";
import { useRecentlyViewed, type ViewedProduct } from "@/hooks/useRecentlyViewed";

export default function RecentlyViewed({ current }: { current?: ViewedProduct }) {
  const items = useRecentlyViewed(current);
  if (items.length === 0) return null;

  return (
    <section style={{ marginTop: "2rem" }}>
      <h2 style={{ fontSize: "1.1rem" }}>Recently viewed</h2>
      <div style={{ display: "flex", gap: "1rem", overflowX: "auto" }}>
        {items.map((p) => (
          <Link key={p.handle} href={`/products/${p.handle}`} style={{ minWidth: 120, textDecoration: "none", color: "inherit" }}>
            {p.image && <Image src={p.image} alt={p.title} width={120} height={120} style={{ width: 120, height: 120, objectFit: "cover", borderRadius: 8 }} />}
            <div style={{ fontSize: "0.85rem", marginTop: "0.25rem" }}>{p.title}</div>
            <div style={{ fontSize: "0.8rem", color: "#666" }}>{p.amount} {p.currencyCode}</div>
          </Link>
        ))}
      </div>
    </section>
  );
}

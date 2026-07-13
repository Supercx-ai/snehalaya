import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/shopify";

export default function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "1.5rem" }}>
      {products.map((p) => (
        <Link key={p.id} href={`/products/${p.handle}`} style={{ textDecoration: "none", color: "inherit" }}>
          {p.featuredImage && (
            <Image
              src={p.featuredImage.url}
              alt={p.featuredImage.altText ?? p.title}
              width={p.featuredImage.width}
              height={p.featuredImage.height}
              style={{ width: "100%", height: "auto", borderRadius: 8 }}
            />
          )}
          <h3 style={{ margin: "0.5rem 0 0.25rem" }}>{p.title}</h3>
          <p style={{ margin: 0, color: "#555" }}>
            {p.priceRange.minVariantPrice.amount} {p.priceRange.minVariantPrice.currencyCode}
          </p>
        </Link>
      ))}
    </div>
  );
}

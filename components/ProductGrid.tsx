import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/shopify";
import WishlistHeart from "./WishlistHeart";
import LocalizedPrice from "./LocalizedPrice";

export default function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "1.5rem" }}>
      {products.map((p) => (
        <Link key={p.id} href={`/products/${p.handle}`} style={{ textDecoration: "none", color: "inherit" }}>
          <div style={{ position: "relative" }}>
            {p.featuredImage && (
              <Image
                src={p.featuredImage.url}
                alt={p.featuredImage.altText ?? p.title}
                width={p.featuredImage.width}
                height={p.featuredImage.height}
                style={{ width: "100%", height: "auto", borderRadius: 8 }}
              />
            )}
            <WishlistHeart
              item={{
                handle: p.handle,
                title: p.title,
                image: p.featuredImage?.url ?? null,
                amount: p.priceRange.minVariantPrice.amount,
                currencyCode: p.priceRange.minVariantPrice.currencyCode,
              }}
            />
          </div>
          <h3 style={{ margin: "0.5rem 0 0.25rem" }}>{p.title}</h3>
          <p style={{ margin: 0, color: "#555" }}>
            <LocalizedPrice handle={p.handle} amount={p.priceRange.minVariantPrice.amount} currencyCode={p.priceRange.minVariantPrice.currencyCode} />
          </p>
        </Link>
      ))}
    </div>
  );
}

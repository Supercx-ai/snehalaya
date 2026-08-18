import ProductCard from "./ProductCard";
import type { Product } from "@/lib/shopify";

export default function ProductGrid({ products, quickAdd, plp }: { products: Product[]; quickAdd?: boolean; plp?: boolean }) {
  return (
    <div
      className={
        plp
          ? // PLP comp (MacBook Air - 5): ~289px cards — column count grows with the
            // fluid page width instead of stretching the cards (per feedback).
            "grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-x-4 md:gap-x-6 gap-y-8 md:gap-y-10"
          : "grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10"
      }
    >
      {products.map((p) => (
        <ProductCard key={p.id} product={p} fullWidth plp={plp} quickAdd={quickAdd} showNewBadge={p.tags?.some((t) => t.toLowerCase() === "new")} />
      ))}
    </div>
  );
}

import ProductCard from "./ProductCard";
import type { Product } from "@/lib/shopify";

export default function ProductGrid({ products, quickAdd }: { products: Product[]; quickAdd?: boolean }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} fullWidth quickAdd={quickAdd} showNewBadge={p.tags?.some((t) => t.toLowerCase() === "new")} />
      ))}
    </div>
  );
}

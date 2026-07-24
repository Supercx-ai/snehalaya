import ProductCard from "./ProductCard";
import type { Product } from "@/lib/shopify";

export default function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} fullWidth showNewBadge={p.tags?.some((t) => t.toLowerCase() === "new")} />
      ))}
    </div>
  );
}

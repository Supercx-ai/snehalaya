import ProductCard from "./ProductCard";
import type { Product } from "@/lib/shopify";

export default function ProductGrid({ products, quickAdd, plp }: { products: Product[]; quickAdd?: boolean; plp?: boolean }) {
  return (
    <div
      className={
        plp
          ? // PLP: 22px column / 37px row gap; 5-up on desktop per client request.
            "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-4 lg:gap-x-[18px] gap-y-8 lg:gap-y-[37px]"
          : "grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10"
      }
    >
      {products.map((p) => (
        <ProductCard key={p.id} product={p} fullWidth plp={plp} quickAdd={quickAdd} showNewBadge={p.tags?.some((t) => t.toLowerCase() === "new")} />
      ))}
    </div>
  );
}

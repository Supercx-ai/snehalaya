import { findSarees } from "@/lib/sareeFinder";
import ProductGrid from "@/components/ProductGrid";

export default async function FindPage({
  searchParams,
}: {
  searchParams: Promise<{ fabric?: string; colour?: string; minPrice?: string; maxPrice?: string }>;
}) {
  const sp = await searchParams;
  const price = {
    min: sp.minPrice ? Number(sp.minPrice) : undefined,
    max: sp.maxPrice ? Number(sp.maxPrice) : undefined,
  };
  const result = await findSarees(sp.fabric ?? null, sp.colour ?? null, price);

  return (
    <main>
      <h1 style={{ marginTop: 0 }}>Your matches</h1>
      <p style={{ color: "#666" }}>
        {result.count} saree{result.count === 1 ? "" : "s"} match{result.capped ? " (showing first 250)" : ""}
      </p>
      {result.products.length === 0 ? <p>No sarees found — try a different combination.</p> : <ProductGrid products={result.products} />}
    </main>
  );
}

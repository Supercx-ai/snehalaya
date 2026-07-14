import { notFound } from "next/navigation";
import { getProductsByQuery } from "@/lib/shopify";
import { loadMoreColourProducts } from "@/lib/colourSearch";
import { COLOUR_FAMILIES } from "@/lib/colours";
import InfiniteProducts from "@/components/InfiniteProducts";

export const revalidate = 1800; // ISR

export async function generateStaticParams() {
  return COLOUR_FAMILIES.map((c) => ({ family: c.slug }));
}

export default async function ColourPage({ params }: { params: Promise<{ family: string }> }) {
  const { family } = await params;
  const colour = COLOUR_FAMILIES.find((c) => c.slug === family);
  if (!colour) notFound();

  const page = await getProductsByQuery(`tag:${family}`, { first: 12 });

  return (
    <main>
      <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
        <span style={{ width: 56, height: 56, borderRadius: "50%", background: colour.hex, border: "1px solid #ddd" }} />
        <h1 style={{ margin: 0 }}>{colour.name} sarees</h1>
      </div>

      {page.nodes.length === 0 ? (
        <p style={{ color: "#666" }}>No products tagged "{family}" yet.</p>
      ) : (
        <InfiniteProducts
          key={family}
          resetKey={family}
          initial={page.nodes}
          cursor={page.pageInfo.endCursor}
          hasNext={page.pageInfo.hasNextPage}
          loadMore={loadMoreColourProducts.bind(null, family)}
        />
      )}
    </main>
  );
}

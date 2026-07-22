import { notFound } from "next/navigation";
import { getColorFilterValues, searchProducts } from "@/lib/shopify";
import { loadMoreColourProducts } from "@/lib/colourSearch";
import { slugifyColour, colourSwatch } from "@/lib/colours";
import InfiniteProducts from "@/components/InfiniteProducts";

export const revalidate = 1800; // ISR

// Only colours actually in use get a page — this list comes straight from Shopify,
// not a hardcoded set, so it grows/shrinks as the catalogue does.
export async function generateStaticParams() {
  const colours = await getColorFilterValues();
  return colours.map((c) => ({ family: slugifyColour(c.label) }));
}

export default async function ColourPage({ params }: { params: Promise<{ family: string }> }) {
  const { family } = await params;
  const liveValues = await getColorFilterValues();
  const colour = liveValues.find((c) => slugifyColour(c.label) === family);
  if (!colour) notFound();

  const filterInput = JSON.parse(colour.input);
  const page = await searchProducts("", { first: 12, filters: [filterInput] });

  return (
    <main>
      <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
        <span style={{ width: 56, height: 56, borderRadius: "50%", background: colourSwatch(colour.label), border: "1px solid #ddd" }} />
        <h1 style={{ margin: 0 }}>{colour.label} sarees</h1>
      </div>

      {page.nodes.length === 0 ? (
        <p style={{ color: "#666" }}>No {colour.label.toLowerCase()} sarees right now.</p>
      ) : (
        <InfiniteProducts
          key={family}
          resetKey={family}
          initial={page.nodes}
          cursor={page.pageInfo.endCursor}
          hasNext={page.pageInfo.hasNextPage}
          loadMore={loadMoreColourProducts.bind(null, filterInput)}
        />
      )}
    </main>
  );
}

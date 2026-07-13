import { notFound } from "next/navigation";
import { getCollection, getCollections } from "@/lib/shopify";
import { loadMoreCollectionProducts } from "@/lib/collection";
import InfiniteProducts from "@/components/InfiniteProducts";

export const revalidate = 3600; // ISR: rebuild at most hourly; product-update webhook busts it sooner

export async function generateStaticParams() {
  const collections = await getCollections(100);
  return collections.map((c) => ({ handle: c.handle }));
}

const SORTS: Record<string, { sortKey?: string; reverse?: boolean; label: string }> = {
  "best-selling": { sortKey: "BEST_SELLING", label: "Best selling" },
  "price-asc": { sortKey: "PRICE", reverse: false, label: "Price: low to high" },
  "price-desc": { sortKey: "PRICE", reverse: true, label: "Price: high to low" },
  newest: { sortKey: "CREATED", reverse: true, label: "Newest" },
};

export default async function CollectionPage({
  params,
  searchParams,
}: {
  params: Promise<{ handle: string }>;
  searchParams: Promise<{ f?: string | string[]; minPrice?: string; maxPrice?: string; sort?: string }>;
}) {
  const { handle } = await params;
  const sp = await searchParams;

  const selectedInputs = sp.f ? (Array.isArray(sp.f) ? sp.f : [sp.f]) : [];
  const filters = selectedInputs.map((f) => JSON.parse(f));
  if (sp.minPrice || sp.maxPrice) {
    filters.push({ price: { min: sp.minPrice ? Number(sp.minPrice) : undefined, max: sp.maxPrice ? Number(sp.maxPrice) : undefined } });
  }
  const sort = (sp.sort && SORTS[sp.sort]) || undefined;

  const collection = await getCollection(handle, { first: 12, filters, sortKey: sort?.sortKey, reverse: sort?.reverse });
  if (!collection) notFound();

  const { nodes, filters: availableFilters, pageInfo } = collection.products;

  return (
    <main>
      <h1 style={{ marginTop: 0 }}>{collection.title}</h1>
      {collection.description && <p style={{ color: "#555" }}>{collection.description}</p>}

      <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: "2rem", alignItems: "start" }}>
        <form method="get" style={{ display: "grid", gap: "1.5rem" }}>
          <div>
            <label style={{ display: "block", fontWeight: 600, marginBottom: "0.5rem" }}>Sort by</label>
            <select name="sort" defaultValue={sp.sort ?? ""} style={{ width: "100%", padding: "0.4rem" }}>
              <option value="">Featured</option>
              {Object.entries(SORTS).map(([key, s]) => (
                <option key={key} value={key}>{s.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: "block", fontWeight: 600, marginBottom: "0.5rem" }}>Price</label>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <input name="minPrice" type="number" placeholder="Min" defaultValue={sp.minPrice} style={{ width: "50%", padding: "0.3rem" }} />
              <input name="maxPrice" type="number" placeholder="Max" defaultValue={sp.maxPrice} style={{ width: "50%", padding: "0.3rem" }} />
            </div>
          </div>

          {availableFilters
            .filter((f) => f.type === "LIST")
            .map((f) => (
              <div key={f.id}>
                <label style={{ display: "block", fontWeight: 600, marginBottom: "0.5rem" }}>{f.label}</label>
                {f.values.map((v) => (
                  <label key={v.id} style={{ display: "flex", gap: "0.4rem", fontSize: "0.9rem", marginBottom: "0.25rem" }}>
                    <input type="checkbox" name="f" value={v.input} defaultChecked={selectedInputs.includes(v.input)} />
                    {v.label} ({v.count})
                  </label>
                ))}
              </div>
            ))}

          <button type="submit" style={{ padding: "0.6rem", borderRadius: 8, border: "1px solid #111", background: "#111", color: "#fff", cursor: "pointer" }}>
            Apply filters
          </button>
        </form>

        <InfiniteProducts
          key={handle + JSON.stringify(sp)}
          resetKey={handle + JSON.stringify(sp)}
          initial={nodes}
          cursor={pageInfo.endCursor}
          hasNext={pageInfo.hasNextPage}
          loadMore={loadMoreCollectionProducts.bind(null, handle, filters, sort?.sortKey, sort?.reverse)}
        />
      </div>
    </main>
  );
}

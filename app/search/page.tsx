import { searchProducts } from "@/lib/shopify";
import { loadMoreSearchResults } from "@/lib/search";
import InfiniteProducts from "@/components/InfiniteProducts";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; f?: string | string[]; minPrice?: string; maxPrice?: string }>;
}) {
  const sp = await searchParams;
  const q = sp.q?.trim() ?? "";

  const selectedInputs = sp.f ? (Array.isArray(sp.f) ? sp.f : [sp.f]) : [];
  const filters = selectedInputs.map((f) => JSON.parse(f));
  if (sp.minPrice || sp.maxPrice) {
    filters.push({ price: { min: sp.minPrice ? Number(sp.minPrice) : undefined, max: sp.maxPrice ? Number(sp.maxPrice) : undefined } });
  }

  const results = q ? await searchProducts(q, { first: 24, filters }) : { nodes: [], filters: [], pageInfo: { hasNextPage: false, endCursor: null } };

  return (
    <main>
      <h1 style={{ marginTop: 0 }}>{q ? `Results for "${q}"` : "Search"}</h1>
      {q && <p style={{ color: "#555" }}>{results.nodes.length > 0 ? `${results.nodes.length}+ products` : "No products found."}</p>}

      {q && results.nodes.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: "2rem", alignItems: "start" }}>
          <form method="get" style={{ display: "grid", gap: "1.5rem" }}>
            <input type="hidden" name="q" value={q} />
            <div>
              <label style={{ display: "block", fontWeight: 600, marginBottom: "0.5rem" }}>Price</label>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <input name="minPrice" type="number" placeholder="Min" defaultValue={sp.minPrice} style={{ width: "50%", padding: "0.3rem" }} />
                <input name="maxPrice" type="number" placeholder="Max" defaultValue={sp.maxPrice} style={{ width: "50%", padding: "0.3rem" }} />
              </div>
            </div>

            {results.filters
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
            key={JSON.stringify(sp)}
            resetKey={JSON.stringify(sp)}
            initial={results.nodes}
            cursor={results.pageInfo.endCursor}
            hasNext={results.pageInfo.hasNextPage}
            loadMore={loadMoreSearchResults.bind(null, q, filters)}
          />
        </div>
      )}
    </main>
  );
}

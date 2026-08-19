import type { Metadata } from "next";
import Link from "next/link";
import { getCollections, getProductsPage } from "@/lib/shopify";
import { loadMoreAllProducts } from "@/lib/products";
import InfiniteProducts from "@/components/InfiniteProducts";
import CollectionSidebar, { KEYWORD_GROUPS } from "@/components/CollectionSidebar";
import MobileFilterToggle from "@/components/MobileFilterToggle";
import SortSelect from "@/components/SortSelect";
import FilterForm from "@/components/FilterForm";
import PlpChips from "@/components/PlpChips";
import ShopByWeave from "@/components/ShopByWeave";

export const revalidate = 3600; // ISR

export const metadata: Metadata = {
  title: "All Sarees | Snehalayaa Silks",
  description: "Browse every Snehalayaa saree — Kanjivaram, Banarasi, Chanderi, Paithani, Tussar and more.",
};

// The bare `products` query sorts differently from collection.products (CREATED_AT vs CREATED).
const SORTS: Record<string, { sortKey?: string; reverse?: boolean }> = {
  "best-selling": { sortKey: "BEST_SELLING" },
  "price-asc": { sortKey: "PRICE", reverse: false },
  "price-desc": { sortKey: "PRICE", reverse: true },
  newest: { sortKey: "CREATED_AT", reverse: true },
};

type SP = Record<string, string | string[] | undefined>;
const asList = (v: string | string[] | undefined) => (v ? (Array.isArray(v) ? v : [v]) : []);
const asOne = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

function buildQuery(sp: SP, omit: string[] = []) {
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(sp)) {
    if (v === undefined || omit.includes(k)) continue;
    asList(v).forEach((x) => params.append(k, x));
  }
  return params;
}

export default async function CollectionsIndex({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;
  const sortParam = asOne(sp.sort) ?? "";
  const sort = SORTS[sortParam];
  const disc = asOne(sp.disc);

  const keywordSelections = Object.fromEntries(KEYWORD_GROUPS.map((g) => [g.param, asList(sp[g.param])]));
  const keywordGroups = Object.values(keywordSelections).filter((g) => g.length > 0);

  const [collections, products] = await Promise.all([
    getCollections(50),
    getProductsPage(12, undefined, sort?.sortKey, sort?.reverse),
  ]);

  return (
    // Same PLP comp as /collections/[handle] — this is the "all products" view.
    <main className="bg-cream">
      <div className="px-4 md:px-[30px] py-4 md:pt-5 md:pb-10">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <nav className="flex items-center gap-1.5 text-[11px] text-[#999]">
            <Link href="/" className="hover:text-ink">Home</Link>
            <span>/</span>
            <span className="text-[#666]">Collections</span>
          </nav>
          <h1 className="text-[15px] font-medium text-[#333]">Sarees for Women</h1>
        </div>

        <div className="mt-8">
          <ShopByWeave bare />
        </div>

        <FilterForm basePath="/collections" className="mt-10 flex flex-col lg:grid lg:grid-cols-[272px_minmax(0,1fr)] gap-x-6 gap-y-6 items-start">
          <input type="hidden" name="sort" value={sortParam} />
          {sp.sale && <input type="hidden" name="sale" value={asOne(sp.sale)} />}
          <MobileFilterToggle>
            {/* Facet/price filters need a collection context in the Storefront API — the
                all-products rail gets Sub Category links + the keyword/discount groups. */}
            <CollectionSidebar
              filters={[]}
              selectedInputs={[]}
              collections={collections.map((c) => ({ handle: c.handle, title: c.title }))}
              keywordSelections={keywordSelections}
              discount={disc}
              showApply={false}
            />
          </MobileFilterToggle>

          <div className="flex-1 min-w-0 w-full">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <PlpChips
                basePath="/collections"
                query={buildQuery(sp).toString()}
                currentSort={sortParam}
                saleActive={Boolean(sp.sale)}
              />
              <SortSelect basePath="/collections" currentSort={sortParam} baseQuery={buildQuery(sp, ["sort"]).toString()} />
            </div>

            <InfiniteProducts
              key={JSON.stringify(sp)}
              resetKey={JSON.stringify(sp)}
              initial={products.nodes}
              cursor={products.pageInfo.endCursor}
              hasNext={products.pageInfo.hasNextPage}
              loadMore={loadMoreAllProducts.bind(null, sort?.sortKey, sort?.reverse)}
              plp
              saleOnly={Boolean(sp.sale)}
              keywordGroups={keywordGroups}
              minDiscount={disc ? Number(disc) : undefined}
            />
          </div>
        </FilterForm>
      </div>
    </main>
  );
}

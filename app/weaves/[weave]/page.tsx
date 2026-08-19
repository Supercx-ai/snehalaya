import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { searchProducts, getCollections } from "@/lib/shopify";
import { loadMoreWeaveResults } from "@/lib/search";
import { WEAVES, getWeave } from "@/lib/weaves";
import InfiniteProducts from "@/components/InfiniteProducts";
import CollectionSidebar, { KEYWORD_GROUPS } from "@/components/CollectionSidebar";
import MobileFilterToggle from "@/components/MobileFilterToggle";
import SortSelect from "@/components/SortSelect";
import FilterForm from "@/components/FilterForm";
import PlpChips from "@/components/PlpChips";
import ShopByWeave from "@/components/ShopByWeave";

export const revalidate = 3600; // ISR: rebuild at most hourly; product webhook busts it sooner

export function generateStaticParams() {
  return WEAVES.map((w) => ({ weave: w.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ weave: string }> }): Promise<Metadata> {
  const { weave } = await params;
  const w = getWeave(weave);
  if (!w) return {};
  return { title: `${w.label} Sarees`, description: `Shop ${w.label} sarees at Snehalayaa Silks.` };
}

// Search only sorts by RELEVANCE or PRICE, so best-selling/newest fall back to relevance
// (the SortSelect still lists them for parity with the collection PLP).
const SORTS: Record<string, { sortKey?: string; reverse?: boolean }> = {
  "price-asc": { sortKey: "PRICE", reverse: false },
  "price-desc": { sortKey: "PRICE", reverse: true },
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

export default async function WeavePage({
  params,
  searchParams,
}: {
  params: Promise<{ weave: string }>;
  searchParams: Promise<SP>;
}) {
  const { weave } = await params;
  const w = getWeave(weave);
  if (!w) notFound();
  const sp = await searchParams;

  const selectedInputs = asList(sp.f);
  const filters = selectedInputs.map((f) => JSON.parse(f));
  const minPrice = asOne(sp.minPrice);
  const maxPrice = asOne(sp.maxPrice);
  if (minPrice || maxPrice) {
    filters.push({ price: { min: minPrice ? Number(minPrice) : undefined, max: maxPrice ? Number(maxPrice) : undefined } });
  }
  const sortParam = asOne(sp.sort) ?? "";
  const sort = SORTS[sortParam];
  const disc = asOne(sp.disc);

  const keywordSelections = Object.fromEntries(KEYWORD_GROUPS.map((g) => [g.param, asList(sp[g.param])]));
  const keywordGroups = Object.values(keywordSelections).filter((g) => g.length > 0);

  const [results, collections] = await Promise.all([
    searchProducts(w.query, { first: 12, filters, sortKey: sort?.sortKey, reverse: sort?.reverse }),
    getCollections(50),
  ]);

  const { nodes, filters: availableFilters, pageInfo } = results;
  const basePath = `/weaves/${w.slug}`;

  return (
    <main className="bg-cream">
      <div className="px-4 md:px-[30px] py-4 md:pt-5 md:pb-10">
        <nav className="flex items-center gap-1.5 text-[11px] text-[#999]">
          <Link href="/" className="hover:text-ink">Home</Link>
          <span>/</span>
          <Link href="/collections" className="hover:text-ink">Collections</Link>
          <span>/</span>
          <span className="text-[#666]">{w.label}</span>
        </nav>
        <h1 className="sr-only">{w.label} Sarees</h1>

        <div className="mt-6">
          <ShopByWeave bare />
        </div>

        <FilterForm
          basePath={basePath}
          className="mt-10 flex flex-col lg:grid lg:grid-cols-[272px_minmax(0,1fr)] gap-x-6 gap-y-6 items-start"
        >
          <input type="hidden" name="sort" value={sortParam} />
          {sp.sale && <input type="hidden" name="sale" value={asOne(sp.sale)} />}
          <MobileFilterToggle>
            <CollectionSidebar
              filters={availableFilters}
              selectedInputs={selectedInputs}
              minPrice={minPrice}
              maxPrice={maxPrice}
              collections={collections.map((c) => ({ handle: c.handle, title: c.title }))}
              keywordSelections={keywordSelections}
              discount={disc}
              showApply={false}
            />
          </MobileFilterToggle>

          <div className="flex-1 min-w-0 w-full">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <PlpChips
                basePath={basePath}
                query={buildQuery(sp).toString()}
                currentSort={sortParam}
                saleActive={Boolean(sp.sale)}
              />
              <SortSelect basePath={basePath} currentSort={sortParam} baseQuery={buildQuery(sp, ["sort"]).toString()} />
            </div>

            <InfiniteProducts
              key={weave + JSON.stringify(sp)}
              resetKey={weave + JSON.stringify(sp)}
              initial={nodes}
              cursor={pageInfo.endCursor}
              hasNext={pageInfo.hasNextPage}
              loadMore={loadMoreWeaveResults.bind(null, w.query, filters, sort?.sortKey, sort?.reverse)}
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
